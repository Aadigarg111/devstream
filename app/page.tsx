import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center space-y-8 max-w-4xl px-6">
        <div className="space-y-4">
          <h1 className="text-8xl font-bold tracking-tight">
            DevStream
          </h1>
          <p className="text-2xl text-gray-400">
            Your Developer Command Center
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 text-gray-500">
          <p className="text-lg">
            🚀 All-in-one dashboard for developers
          </p>
          <div className="flex gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Day 2 - GitHub OAuth
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
              98 Days of Commits Ahead
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">GitHub Stats</h3>
            <p className="text-sm text-gray-500">Track your coding activity</p>
          </div>
          
          <div className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="font-semibold mb-2">AI Tools</h3>
            <p className="text-sm text-gray-500">Code generation & assistance</p>
          </div>
          
          <div className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Productivity</h3>
            <p className="text-sm text-gray-500">Tools to boost your workflow</p>
          </div>
        </div>

        <div className="pt-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Get Started with GitHub
          </Link>
        </div>

        <div className="pt-4 text-gray-600 text-sm">
          <p>Building daily — 100-day commitment challenge 🔥</p>
        </div>
      </div>
    </div>
  );
}
