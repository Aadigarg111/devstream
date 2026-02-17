export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
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
              Day 1 - Initial Setup
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
              100+ Days of Commits Ahead
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

        <div className="pt-8 text-gray-600 text-sm">
          <p>Coming soon... Building daily starting Feb 18, 2026 at 9 AM</p>
        </div>
      </div>
    </div>
  );
}
