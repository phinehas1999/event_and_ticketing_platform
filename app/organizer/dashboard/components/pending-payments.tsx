import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function PendingPaymentsList({ payments }: { payments: any[] }) {
  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-20" />
        <p>All caught up! <br/>No pending payments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors">
          <div>
            <p className="text-sm font-medium text-slate-200">
              {payment.userName}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {payment.eventName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-emerald-400">
              ETB {(payment.amount / 100).toFixed(2)}
            </p>
            <Link 
              href={`/organizer/payments/${payment.id}`}
              className="text-[10px] uppercase tracking-wider text-indigo-400 hover:text-indigo-300 font-semibold mt-1 block"
            >
              Review
            </Link>
          </div>
        </div>
      ))}
      <Link 
        href="/organizer/payments" 
        className="block text-center text-xs text-slate-500 hover:text-slate-300 mt-4 pt-4 border-t border-slate-800"
      >
        View All Payments
      </Link>
    </div>
  );
}