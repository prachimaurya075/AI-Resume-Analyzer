export const LoadingScreen = ({ label = 'Loading AI Resume Analyzer' }) => (
  <div className="grid min-h-screen place-items-center bg-slate-50 px-6 dark:bg-slate-950">
    <div className="max-w-md rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-glow backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mx-auto mb-4 h-14 w-14 animate-pulse rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-400" />
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{label}</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Fetching dashboard data, resume history, and AI insights.
      </p>
    </div>
  </div>
);