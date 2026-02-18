export default function DashboardPreview() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold">DevStream</h1>
            <nav className="hidden md:flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Dashboard</a>
              <a href="#" className="hover:text-white transition-colors">Projects</a>
              <a href="#" className="hover:text-white transition-colors">AI Tools</a>
              <a href="#" className="hover:text-white transition-colors">Analytics</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-400 hover:text-white">
              🔔
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Aadi 👋</h2>
          <p className="text-gray-400">Here's your developer activity overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/20 rounded-2xl p-6">
            <div className="text-sm text-gray-400 mb-2">Commits This Week</div>
            <div className="text-4xl font-bold mb-1">127</div>
            <div className="text-sm text-green-400">+23% from last week</div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-2xl p-6">
            <div className="text-sm text-gray-400 mb-2">Coding Hours</div>
            <div className="text-4xl font-bold mb-1">42.5</div>
            <div className="text-sm text-green-400">+8.2h this week</div>
          </div>

          <div className="bg-gradient-to-br from-pink-900/20 to-pink-800/10 border border-pink-500/20 rounded-2xl p-6">
            <div className="text-sm text-gray-400 mb-2">Active Projects</div>
            <div className="text-4xl font-bold mb-1">12</div>
            <div className="text-sm text-yellow-400">3 need attention</div>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-500/20 rounded-2xl p-6">
            <div className="text-sm text-gray-400 mb-2">Streak Days</div>
            <div className="text-4xl font-bold mb-1">156</div>
            <div className="text-sm text-green-400">Personal best! 🔥</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* GitHub Activity */}
            <div className="border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">GitHub Activity</h3>
                <button className="text-sm text-gray-400 hover:text-white">View All</button>
              </div>
              
              {/* Contribution Graph */}
              <div className="space-y-2 mb-6">
                <div className="flex gap-1">
                  {[...Array(52)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      {[...Array(7)].map((_, j) => (
                        <div
                          key={j}
                          className={`w-3 h-3 rounded-sm ${
                            Math.random() > 0.3
                              ? Math.random() > 0.7
                                ? 'bg-green-500'
                                : Math.random() > 0.5
                                ? 'bg-green-600'
                                : 'bg-green-700'
                              : 'bg-gray-800'
                          }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Pushed to devstream/main</span>
                      <span className="text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-gray-400">Added GitHub OAuth authentication</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Opened PR in RES1</span>
                      <span className="text-gray-500">5 hours ago</span>
                    </div>
                    <p className="text-gray-400">UI redesign with minimalist theme</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Created repository</span>
                      <span className="text-gray-500">1 day ago</span>
                    </div>
                    <p className="text-gray-400">train-tracker - Indian Railways visualization</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coding Stats Chart */}
            <div className="border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Weekly Coding Activity</h3>
              <div className="flex items-end gap-2 h-48">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const heights = [40, 65, 80, 55, 90, 45, 30];
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-lg transition-all hover:opacity-80"
                           style={{ height: `${heights[i]}%` }}></div>
                      <span className="text-xs text-gray-500">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <div className="border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">AI Code Assistant</h3>
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-400 mb-2">Ask me anything...</div>
                <input
                  type="text"
                  placeholder="Generate a React component..."
                  className="w-full bg-transparent border-none outline-none text-white"
                />
              </div>
              <button className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Generate Code
              </button>
            </div>

            {/* Quick Actions */}
            <div className="border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-3">
                  <span className="text-2xl">📝</span>
                  <span>New Project</span>
                </button>
                <button className="w-full text-left p-3 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-3">
                  <span className="text-2xl">🧪</span>
                  <span>API Tester</span>
                </button>
                <button className="w-full text-left p-3 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-3">
                  <span className="text-2xl">⏱️</span>
                  <span>Pomodoro Timer</span>
                </button>
                <button className="w-full text-left p-3 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <span>Analytics</span>
                </button>
              </div>
            </div>

            {/* Top Languages */}
            <div className="border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Top Languages</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>TypeScript</span>
                    <span className="text-gray-400">42%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>JavaScript</span>
                    <span className="text-gray-400">28%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Python</span>
                    <span className="text-gray-400">18%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '18%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CSS</span>
                    <span className="text-gray-400">12%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
