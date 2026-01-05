import { Loader2, LogIn, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

type SignInScreenProps = {
  onSignIn: () => void;
  loading: boolean;
  error?: string;
};

const SignInScreen = ({ onSignIn, loading, error }: SignInScreenProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-midnight via-slate-950 to-black text-white">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-aurora/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-aurora-soft/20 blur-[160px]" />
        <div className="absolute -left-32 bottom-1/3 h-80 w-80 rounded-full bg-emerald-400/10 blur-[140px]" />
      </div>
      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
          <Rocket className="h-5 w-5 text-aurora-soft" /> PrepBuddy Access
        </div>
        <h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">Sign in to PrepBuddy</h1>
        <p className="mt-4 max-w-xl text-sm text-white/60">
          Connect with Google to unlock your personalised PrepBuddy dashboard. We keep your progress synced across devices so you
          can stay aligned with the companies that matter most.
        </p>
        <button
          type="button"
          onClick={onSignIn}
          disabled={loading}
          className="mt-10 inline-flex items-center gap-3 rounded-full border border-aurora-soft/40 bg-aurora-soft/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-aurora-soft/90 transition hover:-translate-y-0.5 hover:border-aurora-soft hover:bg-aurora-soft hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
          <span>{loading ? 'Signing in…' : 'Continue with Google'}</span>
        </button>
        {error && <p className="mt-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-100">{error}</p>}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 py-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 px-6 text-xs text-white/50 sm:flex-row">
          <p>© 2026 PrepBuddy. Built for the interview prep community.</p>
          <nav className="flex gap-4">
            <Link to="/about" className="transition hover:text-white">About</Link>
            <Link to="/privacy" className="transition hover:text-white">Privacy</Link>
            <Link to="/terms" className="transition hover:text-white">Terms</Link>
            <a href="https://github.com/kiranpuli/prep-buddy" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">GitHub</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default SignInScreen;
