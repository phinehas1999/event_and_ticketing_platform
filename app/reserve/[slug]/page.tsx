import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { events } from "@/db/schema/events";
import { ticketTypes } from "@/db/schema/tickets";
import { bankAccounts } from "@/db/schema/bankAccounts";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import Navbar from "@/components/navbar";
import ReserveForm from "@/components/reserve-form";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReservePage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?callbackUrl=/reserve/${slug}`);
  }

  const eventData = await db
    .select({
      event: events,
      bank: bankAccounts,
    })
    .from(events)
    .leftJoin(bankAccounts, eq(events.bankAccountId, bankAccounts.id))
    .where(eq(events.slug, slug))
    .then((res) => res[0]);

  if (!eventData) notFound();

  const { event, bank } = eventData;

  const tickets = await db
    .select()
    .from(ticketTypes)
    .where(eq(ticketTypes.eventId, event.id));

  // serialize minimal ticket info for client component
  const ticketProps = tickets.map((t) => ({
    id: t.id,
    name: t.name,
    price: t.price,
  }));

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="pt-24 px-6 max-w-3xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Reserve your spot</h1>
          <p className="text-gray-400">
            Complete the payment to get your ticket for{" "}
            <span className="text-white font-medium">{event.title}</span>
          </p>
        </header>

        <div className="grid gap-8">
          <section className="glass-card p-6 rounded-2xl border border-white/10 bg-white/5">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-xs">
                1
              </span>
              Transfer Payment
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Please transfer the total amount to the following bank account.
              Keep a screenshot of the transaction.
            </p>

            <div className="space-y-3 bg-black/30 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Bank</span>
                <span className="text-white font-medium">
                  {bank?.bankName || "CBE"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Account Name</span>
                <span className="text-white font-medium">
                  {bank?.accountHolder}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Account Number</span>
                <span className="text-indigo-400 font-mono font-bold tracking-wider">
                  {bank?.accountNumber}
                </span>
              </div>
            </div>
          </section>

          <section className="glass-card p-6 rounded-2xl border border-white/10 bg-white/5">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-xs">
                2
              </span>
              Upload Proof
            </h2>

            <ReserveForm slug={event.slug} tickets={ticketProps} />
          </section>
        </div>
      </main>
    </div>
  );
}
