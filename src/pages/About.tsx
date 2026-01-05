import { ArrowLeft, CheckCircle, Rocket, Target, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
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

        <h1 className="mb-4 text-4xl font-bold">About PrepBuddy</h1>
        <p className="mb-12 text-xl text-slate-600 dark:text-white/70">
          Your companion for cracking FAANG interviews with confidence.
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>What is PrepBuddy?</h2>
          <p>
            PrepBuddy is an open-source interview preparation dashboard designed to help software engineers systematically prepare for technical interviews at top tech companies. We aggregate and organize LeetCode problems by company, frequency, and difficulty to help you focus on what matters most.
          </p>

          <h2>Why PrepBuddy?</h2>
          <p>
            Technical interview preparation can be overwhelming. With thousands of problems available, it's hard to know where to start. PrepBuddy solves this by:
          </p>

          <div className="not-prose my-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <Target className="mb-4 h-8 w-8 text-blue-500" />
              <h3 className="mb-2 text-lg font-semibold">Company-Focused Prep</h3>
              <p className="text-sm text-slate-600 dark:text-white/70">
                Problems curated by company with frequency data, so you study what's actually asked at Google, Amazon, Meta, Apple, and more.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <TrendingUp className="mb-4 h-8 w-8 text-emerald-500" />
              <h3 className="mb-2 text-lg font-semibold">Track Your Progress</h3>
              <p className="text-sm text-slate-600 dark:text-white/70">
                Mark problems as complete and watch your progress grow. Your data syncs across devices when signed in.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <Users className="mb-4 h-8 w-8 text-purple-500" />
              <h3 className="mb-2 text-lg font-semibold">Live Leaderboard</h3>
              <p className="text-sm text-slate-600 dark:text-white/70">
                Compete with other PrepBuddy users and stay motivated. See how you rank against the community.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <Rocket className="mb-4 h-8 w-8 text-orange-500" />
              <h3 className="mb-2 text-lg font-semibold">Performance Optimized</h3>
              <p className="text-sm text-slate-600 dark:text-white/70">
                Virtual scrolling and smart filtering for smooth handling of large datasets. No lag, just prep.
              </p>
            </div>
          </div>

          <h2>How to Use PrepBuddy</h2>
          <ol>
            <li><strong>Choose a Company:</strong> Select the company you're targeting from the dropdown.</li>
            <li><strong>Select a Timeframe:</strong> Pick how much time you have (30 days, 3 months, etc.).</li>
            <li><strong>Filter Problems:</strong> Use difficulty and topic filters to focus your study.</li>
            <li><strong>Track Progress:</strong> Click on problems to mark them complete and track your progress.</li>
            <li><strong>Review Analytics:</strong> Use the charts to understand difficulty distribution and topic coverage.</li>
          </ol>

          <h2>Interview Preparation Tips</h2>
          <p>
            Based on successful interview experiences at top tech companies, here are some tips:
          </p>
          <ul>
            <li><strong>Start Early:</strong> Give yourself at least 2-3 months for thorough preparation.</li>
            <li><strong>Focus on Patterns:</strong> Instead of memorizing solutions, understand the underlying patterns (sliding window, two pointers, BFS/DFS, etc.).</li>
            <li><strong>Practice Verbally:</strong> Explain your thought process out loud as you solve problems.</li>
            <li><strong>Review Company-Specific:</strong> Focus on problems frequently asked at your target company.</li>
            <li><strong>Don't Skip Easy Problems:</strong> They build fundamentals and boost confidence.</li>
            <li><strong>Time Yourself:</strong> Practice solving problems within 20-45 minutes.</li>
          </ul>

          <h2>Data Sources</h2>
          <p>
            Problem data is aggregated from publicly available sources and community contributions. We organize problems by:
          </p>
          <ul>
            <li>Company (Google, Amazon, Meta, Apple, Microsoft, etc.)</li>
            <li>Timeframe (problems asked in last 30 days, 3 months, 6 months, etc.)</li>
            <li>Difficulty (Easy, Medium, Hard)</li>
            <li>Topics (Arrays, Trees, Dynamic Programming, etc.)</li>
          </ul>

          <h2>Open Source</h2>
          <p>
            PrepBuddy is open source and available on{' '}
            <a href="https://github.com/kiranpuli/prep-buddy" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              GitHub
            </a>
            . Contributions are welcome, especially for adding new company data and problem sets.
          </p>

          <h2>Built With</h2>
          <div className="not-prose my-6 flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Zustand', 'Vite', 'Recharts'].map((tech) => (
              <span key={tech} className="rounded-full bg-slate-200 px-3 py-1 text-sm dark:bg-white/10">
                {tech}
              </span>
            ))}
          </div>

          <h2>Contact & Support</h2>
          <p>
            Have questions, feedback, or found a bug? Please{' '}
            <a href="https://github.com/kiranpuli/prep-buddy/issues" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              open an issue on GitHub
            </a>
            . We'd love to hear from you!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
