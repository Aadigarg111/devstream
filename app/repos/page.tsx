"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Repo {
  id: number; name: string; full_name: string; description: string | null;
  html_url: string; stargazers_count: number; forks_count: number;
  language: string | null; updated_at: string; visibility: string;
  open_issues_count: number; size: number; created_at: string;
}

type SortKey = "updated" | "stars" | "forks" | "name";

export default function ReposPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [commitData, setCommitData] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>("updated");
  const [filterLang, setFilterLang] = useState<string>("all");
  const [animated, setAnimated] = useState(false);

  const profile = (session as any)?.githubProfile;
  const accessToken = (session as any)?.accessToken;

  const langColors: Record<string, string> = {
    TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
    Java: "#b07219", Go: "#00ADD8", Rust: "#dea584", HTML: "#e34c26",
    CSS: "#563d7c", Shell: "#89e051", "C++": "#f34b7d", C: "#555",
  };

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status, router]);
  useEffect(() => { if (accessToken && profile) fetchData(); }, [accessToken, profile]);
  useEffect(() => { if (!loading) setTimeout(() => setAnimated(true), 100); }, [loading]);

  async function fetchData() {
    try {
      const headers = { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" };
      const [reposRes, eventsRes] = await Promise.all([
        fetch(`https://api.github.com/user/repos?per_page=100&type=owner&sort=updated`, { headers }),
        fetch(`https://api.github.com/users/${profile.login}/events?per_page=100`, { headers }),
      ]);
      if (reposRes.ok) setRepos(await reposRes.json());
      if (eventsRes.ok) {
        const events = await eventsRes.json();
        const map: Record<string, number> = {};
        events.filter((e: any) => e.type === "PushEvent").forEach((e: any) => {
          const d = e.created_at.split("T")[0];
          map[d] = (map[d] || 0) + (e.payload.commits?.length || 0);
        });
        const sorted = Object.entries(map).sort((a, b) => a[0].localeCompare(b[0])).map(([date, count]) => ({ date, count }));
        setCommitData(sorted);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const languages = Array.from(new Set(repos.map(r => r.language).filter(Boolean))) as string[];
  const filtered = repos
    .filter(r => filterLang === "all" || r.language === filterLang)
    .sort((a, b) => {
      if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
      if (sortBy === "forks") return b.forks_count - a.forks_count;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

  const maxCommits = Math.max(...commitData.map(c => c.count), 1);
  const totalSize = repos.reduce((s, r) => s + r.size, 0);

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center pt-16"><div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">📂 Repository Analytics</h1>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Repos", value: repos.length, icon: "📂" },
            { label: "Total Stars", value: repos.reduce((s, r) => s + r.stargazers_count, 0), icon: "⭐" },
            { label: "Total Forks", value: repos.reduce((s, r) => s + r.forks_count, 0), icon: "🍴" },
            { label: "Total Size", value: `${(totalSize / 1024).toFixed(1)} MB`, icon: "💾" },
          ].map((s, i) => (
            <div key={i} className="p-5 rounded-xl border border-gray-800 bg-gray-900/20 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Commit Frequency */}
        {commitData.length > 0 && (
          <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/30">
            <h2 className="text-xl font-semibold mb-4">📈 Commit Frequency</h2>
            <div className="flex items-end gap-1 h-32">
              {commitData.map((c, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  <div
                    className="w-full bg-blue-500 rounded-t-sm transition-all duration-500 ease-out"
                    style={{
                      height: animated ? `${(c.count / maxCommits) * 100}%` : "0%",
                      minHeight: c.count > 0 ? "4px" : "0",
                      transitionDelay: `${i * 30}ms`,
                    }}
                  />
                  <div className="absolute -top-8 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                    {c.date}: {c.count} commits
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>{commitData[0]?.date}</span>
              <span>{commitData[commitData.length - 1]?.date}</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm">
            <option value="updated">Sort: Recently Updated</option>
            <option value="stars">Sort: Most Stars</option>
            <option value="forks">Sort: Most Forks</option>
            <option value="name">Sort: Name</option>
          </select>
          <select value={filterLang} onChange={e => setFilterLang(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm">
            <option value="all">All Languages</option>
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <span className="text-sm text-gray-500 flex items-center">{filtered.length} repositories</span>
        </div>

        {/* Repo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(repo => (
            <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer"
              className="block p-5 rounded-xl border border-gray-800 hover:border-gray-600 bg-gray-900/20 transition-all hover:bg-gray-900/40 group">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-blue-400 group-hover:text-blue-300 truncate">{repo.name}</h3>
                <span className="text-xs text-gray-600 px-2 py-0.5 rounded-full border border-gray-800">{repo.visibility}</span>
              </div>
              {repo.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{repo.description}</p>}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColors[repo.language] || "#6b7280" }} />
                    {repo.language}
                  </span>
                )}
                <span>⭐ {repo.stargazers_count}</span>
                <span>🍴 {repo.forks_count}</span>
                <span>🐛 {repo.open_issues_count}</span>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Updated {new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
