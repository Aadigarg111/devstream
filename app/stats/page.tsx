"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export default function StatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [languages, setLanguages] = useState<LanguageStat[]>([]);
  const [contributions, setContributions] = useState<{ date: string; count: number }[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [stats, setStats] = useState({ repos: 0, stars: 0, forks: 0, prs: 0, issues: 0 });
  const [loading, setLoading] = useState(true);
  const [animated, setAnimated] = useState(false);

  const profile = (session as any)?.githubProfile;
  const accessToken = (session as any)?.accessToken;

  const langColorMap: Record<string, string> = {
    TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
    Java: "#b07219", "C++": "#f34b7d", C: "#555555", Go: "#00ADD8",
    Rust: "#dea584", Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138",
    Kotlin: "#A97BFF", Dart: "#00B4AB", Shell: "#89e051", HTML: "#e34c26",
    CSS: "#563d7c", SCSS: "#c6538c", Vue: "#41b883", Svelte: "#ff3e00",
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (accessToken && profile) fetchData();
  }, [accessToken, profile]);

  useEffect(() => {
    if (!loading) setTimeout(() => setAnimated(true), 100);
  }, [loading]);

  async function fetchData() {
    try {
      const headers = { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" };

      const [reposRes, contribRes] = await Promise.all([
        fetch(`https://api.github.com/user/repos?per_page=100&type=owner`, { headers }),
        fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `query { user(login: "${profile.login}") {
              contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } }
              pullRequests(states: [OPEN, CLOSED, MERGED]) { totalCount }
              issues { totalCount }
            }}`
          }),
        }),
      ]);

      if (reposRes.ok) {
        const repos = await reposRes.json();
        const langMap: Record<string, number> = {};
        let totalStars = 0, totalForks = 0;
        repos.forEach((r: any) => {
          if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
          totalStars += r.stargazers_count;
          totalForks += r.forks_count;
        });
        const total = Object.values(langMap).reduce((a, b) => a + b, 0);
        const sorted = Object.entries(langMap)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({
            name, count, percentage: Math.round((count / total) * 100),
            color: langColorMap[name] || "#6b7280",
          }));
        setLanguages(sorted);
        setStats(s => ({ ...s, repos: repos.length, stars: totalStars, forks: totalForks }));
      }

      if (contribRes.ok) {
        const data = await contribRes.json();
        const cal = data.data?.user?.contributionsCollection?.contributionCalendar;
        const prs = data.data?.user?.pullRequests?.totalCount || 0;
        const issues = data.data?.user?.issues?.totalCount || 0;
        if (cal) {
          setTotalContributions(cal.totalContributions);
          const days: { date: string; count: number }[] = [];
          cal.weeks.forEach((w: any) => w.contributionDays.forEach((d: any) => days.push({ date: d.date, count: d.contributionCount })));
          setContributions(days.slice(-90));
        }
        setStats(s => ({ ...s, prs, issues }));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const maxContrib = Math.max(...contributions.map(c => c.count), 1);

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">📊 GitHub Stats</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Repositories", value: stats.repos, icon: "📂" },
            { label: "Stars Earned", value: stats.stars, icon: "⭐" },
            { label: "Forks", value: stats.forks, icon: "🍴" },
            { label: "Pull Requests", value: stats.prs, icon: "🔀" },
            { label: "Issues", value: stats.issues, icon: "🐛" },
          ].map((s, i) => (
            <div key={i} className="p-5 rounded-xl border border-gray-800 bg-gray-900/20 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Contribution Graph (last 90 days) */}
        <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">📈 Contributions (Last 90 Days)</h2>
            <span className="text-sm text-gray-400">{totalContributions} total this year</span>
          </div>
          <div className="flex items-end gap-[2px] h-40">
            {contributions.map((c, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                <div
                  className="w-full bg-green-500 rounded-t-sm transition-all duration-700 ease-out"
                  style={{
                    height: animated ? `${(c.count / maxContrib) * 100}%` : "0%",
                    minHeight: c.count > 0 ? "4px" : "0px",
                    opacity: c.count > 0 ? 0.4 + (c.count / maxContrib) * 0.6 : 0.1,
                    transitionDelay: `${i * 8}ms`,
                  }}
                />
                <div className="absolute -top-8 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                  {c.date}: {c.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/30">
          <h2 className="text-xl font-semibold mb-6">🔤 Language Breakdown</h2>
          {/* Color bar */}
          <div className="flex rounded-full overflow-hidden h-4 mb-6">
            {languages.map((lang, i) => (
              <div
                key={i}
                className="transition-all duration-700 ease-out"
                style={{
                  width: animated ? `${lang.percentage}%` : "0%",
                  backgroundColor: lang.color,
                  transitionDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
          {/* List */}
          <div className="space-y-3">
            {languages.map((lang, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: lang.color }} />
                <span className="text-sm flex-1">{lang.name}</span>
                <span className="text-sm text-gray-400">{lang.count} repos</span>
                <div className="w-32 bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: animated ? `${lang.percentage}%` : "0%",
                      backgroundColor: lang.color,
                      transitionDelay: `${i * 100 + 200}ms`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-10 text-right">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
