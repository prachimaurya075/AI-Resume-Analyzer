export const StatCard = ({ label, value, hint, accent = 'from-brand-500 to-cyan-400' }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className={`mb-4 h-1.5 w-20 rounded-full bg-gradient-to-r ${accent}`} />
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
    <div className="mt-2 flex items-end justify-between gap-4">
      <p className="text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
    </div>
  </div>
);