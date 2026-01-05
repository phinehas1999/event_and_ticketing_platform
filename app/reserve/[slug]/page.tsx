import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { events } from "@/db/schema/events";
import { ticketTypes } from "@/db/schema/tickets";
import { bankAccounts } from "@/db/schema/bankAccounts";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import Navbar from "@/components/navbar";

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

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="pt-24 px-6 max-w-3xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Reserve your spot</h1>
          <p className="text-gray-400">Complete the payment to get your ticket for <span className="text-white font-medium">{event.title}</span></p>
        </header>

        <div className="grid gap-8">
          <section className="glass-card p-6 rounded-2xl border border-white/10 bg-white/5">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-xs">1</span>
              Transfer Payment
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Please transfer the total amount to the following bank account. 
              Keep a screenshot of the transaction.
            </p>
            
            <div className="space-y-3 bg-black/30 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Bank</span>
                <span className="text-white font-medium">{bank?.bankName || "CBE"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Account Name</span>
                <span className="text-white font-medium">{bank?.accountHolder}</span>
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
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-xs">2</span>
              Upload Proof
            </h2>
          
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Select Ticket Type</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                  {tickets.map((t) => (
                    <option key={t.id} value={t.id} className="bg-neutral-900">
                      {t.name} — {(t.price / 100).toLocaleString()} ETB
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Transaction Screenshot</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-indigo-500/50 transition-colors cursor-pointer">
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-600 mt-1">PNG, JPG up to 5MB</p>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
              >
                Submit Reservation
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}