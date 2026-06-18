export const ResumeList = ({ resumes, onSelect, activeResumeId }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Uploaded Resumes</h3>
      <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
        {resumes.length} total
      </span>
    </div>
    <div className="mt-4 space-y-3">
      {resumes.length ? (
        resumes.map((resume) => (
          <button
            key={resume._id}
            type="button"
            onClick={() => onSelect(resume._id)}
            className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
              activeResumeId === resume._id
                ? 'border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-950/40'
                : 'border-slate-200 bg-slate-50 hover:border-brand-200 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-brand-700'
            }`}
          >
            <p className="font-medium text-slate-900 dark:text-white">{resume.originalName}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {new Date(resume.createdAt).toLocaleString()} · {resume.fileType}
            </p>
          </button>
        ))
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Upload your first resume to begin analysis.
        </p>
      )}
    </div>
  </div>
);