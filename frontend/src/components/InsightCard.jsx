export const InsightCard = ({ title, items, tone = 'default' }) => {
  const toneStyles = {
    default: 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
    blue: 'border-brand-200 bg-brand-50/70 dark:border-brand-900/60 dark:bg-brand-950/30',
    green: 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/60 dark:bg-emerald-950/30',
  };

  return (
    <section className={`rounded-3xl border p-5 ${toneStyles[tone]}`}>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
        {items.length ? (
          items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
              <span>{item}</span>
            </li>
          ))
        ) : (
          <li className="text-slate-400">No insights available yet.</li>
        )}
      </ul>
    </section>
  );
};