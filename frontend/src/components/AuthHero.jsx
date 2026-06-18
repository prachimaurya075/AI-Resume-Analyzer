export const AuthHero = ({ title, subtitle }) => (
  <div className="hidden flex-col justify-between rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.25),_transparent_38%),linear-gradient(135deg,_#0f172a,_#1e3a8a_60%,_#2563eb)] p-8 text-white shadow-glow lg:flex">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-100/80">AI Resume Analyzer</p>
      <h2 className="mt-6 max-w-lg text-4xl font-semibold leading-tight">{title}</h2>
      <p className="mt-4 max-w-xl text-sm text-blue-100/85">{subtitle}</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        ['ATS Score', '100-point scoring'],
        ['Keyword Match', 'Role-based insights'],
        ['AI Suggestions', 'OpenAI-powered feedback'],
      ].map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.24em] text-blue-100/70">{label}</p>
          <p className="mt-2 text-sm font-medium text-white">{value}</p>
        </div>
      ))}
    </div>
  </div>
);