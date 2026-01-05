import { ArrowLeft, Shield, Database, Eye, Lock, Users, RefreshCw, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/20">
        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div className="space-y-3 text-slate-600 dark:text-white/70">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gradient-to-br dark:from-midnight dark:via-slate-950 dark:to-black dark:text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-white/50 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-10">
          <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-slate-500 dark:text-white/50">Last updated: January 2026</p>
        </div>

        <div className="space-y-6">
          <Section icon={Shield} title="Introduction">
            <p>
              PrepBuddy is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
            </p>
          </Section>

          <Section icon={Database} title="Information We Collect">
            <p className="font-medium text-slate-900 dark:text-white">Account Information</p>
            <p>When you sign in with Google, we receive your name, email, and profile picture.</p>
            <p className="mt-3 font-medium text-slate-900 dark:text-white">Automatic Data</p>
            <p>Browser type, device info, IP address, and cookies to maintain your session.</p>
          </Section>

          <Section icon={Eye} title="How We Use Your Data">
            <ul className="list-inside list-disc space-y-1">
              <li>Sync your progress across devices</li>
              <li>Display leaderboard rankings</li>
              <li>Improve user experience</li>
              <li>Display relevant advertisements</li>
            </ul>
          </Section>

          <Section icon={Users} title="Third-Party Services">
            <p>
              <span className="font-medium text-slate-900 dark:text-white">Google Analytics</span> — Usage analytics
            </p>
            <p>
              <span className="font-medium text-slate-900 dark:text-white">Google AdSense</span> — Ads display.{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Opt out here
              </a>
            </p>
            <p>
              <span className="font-medium text-slate-900 dark:text-white">Firebase</span> — Authentication & storage.{' '}
              <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Privacy policy
              </a>
            </p>
          </Section>

          <Section icon={Lock} title="Data Security & Your Rights">
            <p>We implement security measures to protect your data, though no system is 100% secure.</p>
            <p className="mt-2">You can request access, correction, or deletion of your data at any time.</p>
          </Section>

          <Section icon={RefreshCw} title="Policy Updates">
            <p>We may update this policy periodically. Changes will be posted here with an updated date.</p>
          </Section>

          <Section icon={Mail} title="Contact">
            <p>
              Questions?{' '}
              <a href="https://github.com/kiranpuli/prep-buddy/issues" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Open an issue on GitHub
              </a>
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
