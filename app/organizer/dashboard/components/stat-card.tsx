import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: string;
  alert?: boolean;
  cta?: ReactNode;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  alert,
  cta,
}: StatCardProps) {
  return (
    <div
      className={`glass-card min-h-40 p-6 rounded-2xl relative overflow-hidden group ${alert ? "border-amber-500/30" : ""}`}
    >
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-100">{value}</h3>
          {trend && (
            <p className="text-emerald-400 text-xs mt-2 font-medium">{trend}</p>
          )}
        </div>
        <div className="p-3 bg-slate-800/50 rounded-xl glass border border-slate-700/50">
          {icon}
        </div>
      </div>

      {/* CTA container - optional */}
      {cta && <div className="absolute bottom-4 right-4 z-20">{cta}</div>}

      {/* Decorative gradient blob */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
    </div>
  );
}
