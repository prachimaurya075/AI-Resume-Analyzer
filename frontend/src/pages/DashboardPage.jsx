import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { LoaderCircle, UploadCloud, Sparkles, FileText, ShieldCheck, BrainCircuit } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { StatCard } from '../components/StatCard';
import { ResumeList } from '../components/ResumeList';
import { ResultSummary } from '../components/ResultSummary';
import { InsightCard } from '../components/InsightCard';
import { roleOptions } from '../constants/roles';
import { dashboardApi } from '../services/dashboard';
import { resumeApi } from '../services/resumes';
import { analysisApi } from '../services/analysis';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  roleName: 'Software Engineer',
  jobDescription: '',
  resumeId: '',
};

export const DashboardPage = () => {
  const { notify } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState(null);
  const [report, setReport] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [selectedFile, setSelectedFile] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await dashboardApi.summary();
      setSummary(data);
      setReport(data.latestReport ? { ...data.latestReport, suggestions: data.latestReport.suggestions } : null);
      if (data.resumes?.[0]) {
        setForm((current) => ({ ...current, resumeId: data.resumes[0]._id }));
      }
    } catch (error) {
      notify(error.response?.data?.message || 'Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const fallback = summary?.stats || {};
    return [
      { label: 'Total Resumes', value: fallback.totalResumes || 0, hint: 'Uploaded files' },
      { label: 'Total Analyses', value: fallback.totalAnalyses || 0, hint: 'Completed reports' },
      { label: 'Average ATS', value: `${fallback.averageScore || 0}/100`, hint: 'Across all reports' },
      { label: 'Latest Match', value: `${fallback.latestMatch || 0}%`, hint: 'Role fit score' },
    ];
  }, [summary]);

  const historyCards = summary?.reports || [];
  const resumes = summary?.resumes || [];

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleFileChange = (event) => setSelectedFile(event.target.files?.[0] || null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.jobDescription.trim()) {
      notify('Add a job description before analyzing.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      let resumeId = form.resumeId;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('resume', selectedFile);
        const uploadResponse = await resumeApi.upload(formData);
        resumeId = uploadResponse.resume._id;
        setSummary((current) => ({
          ...current,
          resumes: [uploadResponse.resume, ...(current?.resumes || [])],
          stats: {
            ...(current?.stats || {}),
            totalResumes: (current?.stats?.totalResumes || 0) + 1,
          },
        }));
        notify('Resume uploaded successfully.', 'success');
      }

      if (!resumeId) {
        notify('Select an uploaded resume or attach a new file.', 'error');
        setSubmitting(false);
        return;
      }

      const result = await analysisApi.analyze({
        resumeId,
        roleName: form.roleName,
        jobDescription: form.jobDescription,
      });

      setReport({ ...result.report, suggestions: result.aiSuggestions });
      setSummary((current) => ({
        ...current,
        latestReport: result.report,
        reports: [result.report, ...(current?.reports || [])],
        stats: {
          ...(current?.stats || {}),
          totalAnalyses: (current?.stats?.totalAnalyses || 0) + 1,
          latestScore: result.report.atsScore,
          latestMatch: result.report.matchPercentage,
        },
      }));
      setForm((current) => ({ ...current, resumeId }));
      setSelectedFile(null);
      event.target.reset();
      notify('Analysis completed successfully.', 'success');
    } catch (error) {
      notify(error.response?.data?.message || 'Analysis failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const selectHistoryReport = async (reportId) => {
    try {
      const data = await analysisApi.report(reportId);
      setReport({ ...data.report, suggestions: data.report.suggestions });
      setForm((current) => ({ ...current, resumeId: data.report.resume?._id || current.resumeId, roleName: data.report.roleName }));
    } catch (error) {
      notify(error.response?.data?.message || 'Could not load report', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <AppHeader title={`Hello, ${user?.name || 'there'}`} subtitle="Loading your resume intelligence dashboard" />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800/70" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,rgba(59,130,246,0.08),transparent_20%),radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_28%)] bg-slate-50 dark:bg-[linear-gradient(180deg,rgba(29,78,216,0.14),transparent_20%),radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_28%)] dark:bg-slate-950">
      <AppHeader title={`Hello, ${user?.name || 'there'}`} subtitle="Analyze resumes, track ATS score, and review AI feedback" />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-glow backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-600 dark:text-brand-300">Portfolio ready dashboard</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">AI Resume Analyzer</h2>
            </div>
            <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800 dark:border-brand-900 dark:bg-brand-950/40 dark:text-brand-100">
              Upload a resume, select a role, and get ATS insights in seconds.
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} {...stat} accent={index % 2 === 0 ? 'from-brand-500 to-cyan-400' : 'from-sky-500 to-blue-700'} />
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upload and Analyze</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">PDF or DOCX resumes supported.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Resume file</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="block w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Existing resume</label>
                  <select
                    name="resumeId"
                    value={form.resumeId}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="">Use uploaded file</option>
                    {resumes.map((resume) => (
                      <option key={resume._id} value={resume._id}>{resume.originalName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Target role</label>
                  <select
                    name="roleName"
                    value={form.roleName}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Job description</label>
                  <textarea
                    name="jobDescription"
                    rows="8"
                    value={form.jobDescription}
                    onChange={handleChange}
                    placeholder="Paste a job description here to compare role fit and missing keywords."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-500 px-5 py-3 font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Run ATS Analysis
                </button>
              </div>
            </form>

            <div className="grid gap-6">
              <ResumeList resumes={resumes} onSelect={(resumeId) => setForm((current) => ({ ...current, resumeId }))} activeResumeId={form.resumeId} />
              <InsightCard
                title="How the score works"
                tone="blue"
                items={[
                  'Keyword coverage from the resume and job description drives the largest part of the score.',
                  'Section presence, resume length, and formatting quality adjust the final ATS result.',
                  'Role-specific skill recommendations help guide what to learn next.',
                ]}
              />
            </div>
          </div>
        </motion.section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <ResultSummary report={report} />
          <div className="grid gap-6">
            <InsightCard
              title="AI improvement suggestions"
              tone="green"
              items={report?.suggestions?.improvementPoints || ['Run an analysis to see improvement points.']}
            />
            <InsightCard
              title="Resume suggestion snapshot"
              items={[
                report?.suggestions?.professionalSummary || 'Add a sharper professional summary that matches the selected role.',
                ...(report?.suggestions?.projectDescriptions || []),
                ...(report?.suggestions?.atsKeywords || []).slice(0, 4),
              ]}
            />
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Analysis history</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Review past reports and reopen any previous result.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {historyCards.length ? historyCards.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => selectHistoryReport(item._id)}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-brand-300 hover:bg-brand-50/50 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-brand-700 dark:hover:bg-brand-950/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.resume?.originalName || 'Resume report'}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.roleName}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm dark:bg-slate-900">
                    <p className="text-xs text-slate-500 dark:text-slate-400">ATS</p>
                    <p className="text-lg font-semibold text-brand-700 dark:text-brand-300">{item.atsScore}/100</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{item.aiSummary || 'Open this report to review match score and suggestions.'}</p>
              </button>
            )) : (
              <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No analysis history yet. Run your first analysis to populate this area.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};