"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchResult {
  id: number; name: string; full_name: string; description: string | null;
  html_url: string; stargazers_count: number; forks_count: number;
  language: string | null; owner: { login: string; avatar_url: string };
}

export default function SearchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const accessToken = (session as any)?.accessToken;

  if (status === "unauthenticated") { router.push("/login"); return null; }

  async function search() {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=20`, {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" },
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.items || []);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  const langColors: Record<string, string> = {
    TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
    Java: "#b07219", Go: "#00ADD8", Rust: "#dea584", HTML: "#e34c26",
    CSS: "#563d7c", Shell: "#89e051", "C++": "#f34b7d",
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🔍 Search</h1>

        <div className="flex gap-3">
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
            placeholder="Search GitHub repositories..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-500" />
          <button onClick={search} disabled={loading}
            className="px-6 py-3 bg-white text-black rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors disabled:opacity-50">
            {loading ? "..." : "Search"}
          </button>
        </div>

        <div className="space-y-3">
          {results.map(repo => (
            <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer"
              className="block p-5 rounded-xl border border-gray-800 hover:border-gray-600 bg-gray-900/20 transition-all hover:bg-gray-900/40">
              <div className="flex items-center gap-3">
                <img src={repo.owner.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-blue-400 truncate">{repo.full_name}</h3>
                  {repo.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{repo.description}</p>}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColors[repo.language] || "#6b7280" }} />
                        {repo.language}
                      </span>
                    )}
                    <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
                    <span>🍴 {repo.forks_count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
          {searched && results.length === 0 && !loading && (
            <p className="text-gray-600 text-center py-8">No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}
