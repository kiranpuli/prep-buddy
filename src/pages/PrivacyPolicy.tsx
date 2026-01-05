import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gradient-to-br dark:from-midnight dark:via-slate-950 dark:to-black dark:text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-slate-600 dark:text-white/70">
            Last updated: January 2026
          </p>

          <h2>Introduction</h2>
          <p>
            PrepBuddy ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
          </p>

          <h2>Information We Collect</h2>
          <h3>Information You Provide</h3>
          <ul>
            <li><strong>Account Information:</strong> When you sign in with Google, we receive your name, email address, and profile picture.</li>
            <li><strong>Usage Data:</strong> We track which problems you mark as completed to sync your progress across devices.</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <ul>
            <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers.</li>
            <li><strong>Log Data:</strong> IP address, access times, and pages viewed.</li>
            <li><strong>Cookies:</strong> We use cookies to maintain your session and preferences.</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Sync your progress across devices</li>
            <li>Display your position on the leaderboard</li>
            <li>Analyze usage patterns to improve user experience</li>
            <li>Display relevant advertisements</li>
          </ul>

          <h2>Third-Party Services</h2>
          <h3>Google Analytics</h3>
          <p>
            We use Google Analytics to understand how users interact with our website. Google Analytics collects information such as how often users visit, what pages they visit, and what other sites they used prior to coming to our site.
          </p>

          <h3>Google AdSense</h3>
          <p>
            We use Google AdSense to display advertisements. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Google Ads Settings
            </a>.
          </p>

          <h3>Firebase</h3>
          <p>
            We use Firebase for authentication and data storage. Firebase's privacy practices can be found at{' '}
            <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Firebase Privacy Policy
            </a>.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt out of personalized advertising</li>
          </ul>

          <h2>Children's Privacy</h2>
          <p>
            Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you are a parent and believe your child has provided us with personal information, please contact us.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please{' '}
            <a href="https://github.com/kiranpuli/prep-buddy/issues" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              open an issue on GitHub
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
