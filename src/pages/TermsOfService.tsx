import { ArrowLeft, FileText, UserCheck, ShieldCheck, Globe, AlertTriangle, Scale, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/20">
        <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div className="space-y-3 text-slate-600 dark:text-white/70">{children}</div>
  </div>
);

const TermsOfService = () => {
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
          <h1 className="mb-2 text-3xl font-bold">Terms of Service</h1>
          <p className="text-sm text-slate-500 dark:text-white/50">Last updated: January 2026</p>
        </div>

        <div className="space-y-6">
          <Section icon={FileText} title="Service Description">
            <p>
              PrepBuddy is a free interview preparation dashboard that helps you track LeetCode problems, monitor progress, and benchmark against peers with curated problem sets.
            </p>
          </Section>

          <Section icon={UserCheck} title="User Accounts">
            <p>Sign in with Google to use PrepBuddy. You are responsible for:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Keeping your account secure</li>
              <li>All activity under your account</li>
              <li>Reporting unauthorized access</li>
            </ul>
          </Section>

          <Section icon={ShieldCheck} title="Acceptable Use">
            <p>You agree not to:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Use the service for unlawful purposes</li>
              <li>Attempt unauthorized system access</li>
              <li>Scrape data or use automated systems</li>
              <li>Interfere with or disrupt the service</li>
            </ul>
          </Section>

          <Section icon={Globe} title="Third-Party Content">
            <p>
              PrepBuddy links to LeetCode and other external sites for educational purposes. We're not responsible for their content or practices.
            </p>
          </Section>

          <Section icon={AlertTriangle} title="Disclaimers">
            <p>PrepBuddy is provided "as is" without warranties. We do not guarantee:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Accuracy of problem data</li>
              <li>Uninterrupted service</li>
              <li>Interview success from using PrepBuddy</li>
            </ul>
          </Section>

          <Section icon={Scale} title="Liability & Termination">
            <p>
              We're not liable for indirect or consequential damages. We may terminate access for violations without notice.
            </p>
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

export default TermsOfService;
