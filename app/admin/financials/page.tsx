import { requireAdmin } from "@/lib/guards";
import Navbar from "@/components/navbar";
import { db } from "@/db";
import { payments, users, events, ticketTypes } from "@/db/schema";
import { sql, eq, desc } from "drizzle-orm";

async function getFinancials() {
  const revenueRes = await db
    .select({ rev: sql<number>`coalesce(sum(${payments.amount}), 0)` })
    .from(payments)
    .where(eq(payments.status, 'APPROVED'));
  const revenue = Number((revenueRes as any)[0]?.rev ?? 0);

  // Per-payment calculation: 5% fee, then 15% VAT on that fee, rounding per payment
  const approvedPaymentsRes = await db
    .select({ amount: payments.amount })
    .from(payments)
    .where(eq(payments.status, 'APPROVED'));

  const approvedAmounts: number[] = (approvedPaymentsRes as any).map(
    (r: any) => Number(r.amount ?? 0),
  );

  let serviceFee = 0;
  let vat = 0;
  for (const amt of approvedAmounts) {
    const fee = Math.round(amt * 0.05);
    const feeVat = Math.round(fee * 0.15);
    serviceFee += fee;
    vat += feeVat;
  }
  const adminProfit = serviceFee - vat;

  const recentPayments = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      createdAt: payments.createdAt,
      userName: users.name,
      userEmail: users.email,
      eventTitle: events.title,
      ticketTypeName: ticketTypes.name,
    })
    .from(payments)
    .leftJoin(users, eq(users.id, payments.userId))
    .leftJoin(events, eq(events.id, payments.eventId))
    .leftJoin(ticketTypes, eq(ticketTypes.id, payments.ticketTypeId))
    .where(eq(payments.status, 'APPROVED'))
    .orderBy(desc(payments.createdAt))
    .limit(50);

  return { revenue, serviceFee, vat, adminProfit, recentPayments };
}

export default async function AdminFinancialsPage() {
  await requireAdmin();
  const stats = await getFinancials();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(amount / 100);

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-8 pt-24 text-slate-50">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Financials</h1>
            <p className="text-slate-400 mt-1">
              Platform revenue breakdown and recent payments.
            </p>
          </div>
          <div>
            <a
              href="/admin"
              className="glass-button text-sm text-indigo-300 px-3 py-2 rounded-xl"
            >
              Back
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">Gross Revenue</div>
                <div className="font-semibold">
                  {formatCurrency(stats.revenue)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">Service Fee (5%)</div>
                <div>{formatCurrency(stats.serviceFee)}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">VAT (15% on fee)</div>
                <div>{formatCurrency(stats.vat)}</div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-gray-400">Admin Profit</div>
                <div className="font-bold">
                  {formatCurrency(stats.adminProfit)}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              Recent Approved Payments
            </h3>
            {!stats.recentPayments || stats.recentPayments.length === 0 ? (
              <p className="text-gray-400">No approved payments yet.</p>
            ) : (
              <ul className="space-y-3">
                {stats.recentPayments.map((p: any) => {
                  const amt: number = Number(p.amount ?? 0);
                  const fee = Math.round(amt * 0.05);
                  const feeVat = Math.round(fee * 0.15);
                  const profit = fee - feeVat;
                  return (
                    <li key={p.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{p.eventTitle || "(unknown event)"}</div>
                        <div className="text-xs text-gray-400">{p.userName || p.userEmail || "(unknown purchaser)"} — {p.ticketTypeName || "(ticket)"}</div>
                        <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="w-40 text-right">
                        <div className="text-sm text-gray-300">{formatCurrency(amt)}</div>
                        <div className="text-xs text-gray-400">Fee: {formatCurrency(fee)}</div>
                        <div className="text-xs text-gray-400">VAT: {formatCurrency(feeVat)}</div>
                        <div className="text-sm font-semibold">Profit: {formatCurrency(profit)}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
