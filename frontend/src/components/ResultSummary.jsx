const formatPercent = (value) => `${value || 0}%`;

export const ResultSummary = ({ report }) => {
  if (!report) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Run an analysis to see ATS score, match percentage, missing keywords, and AI suggestions here.
      </div>
    );
  }

  const { atsScore, matchPercentage, missingKeywords, strengths, weaknesses, skillGaps, suggestions } = report;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">ATS Score</p>
            <p className="mt-2 text-5xl font-semibold text-slate-900 dark:text-white">{atsScore}<span className="text-2xl text-slate-400">/100</span></p>
          </div>
          <div className="rounded-3xl bg-brand-50 px-5 py-4 text-center dark:bg-brand-950/40">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-600 dark:text-brand-300">Match</p>
            <p className="mt-2 text-3xl font-semibold text-brand-700 dark:text-brand-200">{formatPercent(matchPercentage)}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Strengths</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {strengths.map((item) => (
                <li key={item} className="flex gap-2"><span className="text-emerald-500">●</span>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Weaknesses</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {weaknesses.map((item) => (
                <li key={item} className="flex gap-2"><span className="text-rose-500">●</span>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Missing Keywords</h4>
          <div className="mt-4 flex flex-wrap gap-2">
            {missingKeywords.length ? missingKeywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300">
                {keyword}
              </span>
            )) : <p className="text-sm text-slate-500 dark:text-slate-400">No major keyword gaps detected.</p>}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Skill Gaps</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {skillGaps.length ? skillGaps.map((skill) => (
              <li key={skill} className="flex gap-2"><span className="text-brand-500">→</span>{skill}</li>
            )) : <li>No major skill gaps detected.</li>}
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">AI Suggestions</h4>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            {suggestions?.roleMatchSummary || suggestions?.professionalSummary || 'AI suggestions will appear here after analysis.'}
          </p>
        </div>
      </div>
    </div>
  );
};