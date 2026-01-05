import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
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

        <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-slate-600 dark:text-white/70">
            Last updated: January 2026
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using PrepBuddy, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            PrepBuddy is a free interview preparation dashboard that helps you track LeetCode problems, monitor your progress, and benchmark against peers. We provide curated problem sets organized by company and timeframe.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To use certain features, you must sign in with your Google account. You are responsible for:
          </p>
          <ul>
            <li>Maintaining the confidentiality of your account</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us of any unauthorized access</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the service for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the service</li>
            <li>Scrape or collect data without permission</li>
            <li>Use automated systems to access the service</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <p>
            The PrepBuddy service, including its design, features, and content, is protected by intellectual property laws. Problem data is sourced from publicly available information and is used for educational purposes.
          </p>

          <h2>6. Third-Party Content</h2>
          <p>
            PrepBuddy contains links to LeetCode and other third-party websites. We are not responsible for the content or practices of these external sites. Links to problems are provided for convenience and educational purposes.
          </p>

          <h2>7. Disclaimer of Warranties</h2>
          <p>
            PrepBuddy is provided "as is" without warranties of any kind. We do not guarantee:
          </p>
          <ul>
            <li>The accuracy or completeness of problem data</li>
            <li>Uninterrupted or error-free service</li>
            <li>That using PrepBuddy will result in interview success</li>
          </ul>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, PrepBuddy shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
          </p>

          <h2>9. Advertisements</h2>
          <p>
            PrepBuddy displays advertisements through Google AdSense to support the free service. By using PrepBuddy, you acknowledge that ads may be displayed and that ad content is provided by third parties.
          </p>

          <h2>10. Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
          </p>

          <h2>11. Termination</h2>
          <p>
            We may terminate or suspend your access to the service at any time, without notice, for conduct that we believe violates these terms or is harmful to other users or the service.
          </p>

          <h2>12. Contact</h2>
          <p>
            For questions about these Terms of Service, please{' '}
            <a href="https://github.com/kiranpuli/prep-buddy/issues" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              open an issue on GitHub
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
