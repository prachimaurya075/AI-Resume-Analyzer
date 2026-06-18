import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { AuthHero } from '../components/AuthHero';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const { login, googleLogin } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form);
      notify('Welcome back. Your dashboard is ready.', 'success');
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      notify(error.message || error.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await googleLogin();
      notify('Google sign-in successful.', 'success');
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      notify(error.message || error.response?.data?.message || 'Google sign-in failed', 'error');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
      <AuthHero
        title="Turn a simple resume into a recruiter-ready portfolio story."
        subtitle="Analyze ATS score, identify keyword gaps, and use AI suggestions to strengthen summaries and project bullets."
      />
      <section className="flex items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-10">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-glow dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-600 dark:text-brand-300">Welcome back</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Sign in to your dashboard</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Use your account to review ATS analysis and resume history.</p>
          </div>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-500 px-4 py-3 font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Sign in
            </button>
          </form>
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            {googleLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Continue with Google
          </button>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            New here? <Link to="/register" className="font-semibold text-brand-600 hover:underline dark:text-brand-300">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
};