"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

interface RepoResult {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  owner: { avatar_url: string };
}

export default function SearchPage() {
  const { status } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("nextjs dashboard");
  const [results, setResults] = useState<RepoResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  async function runSearch() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=12`);
      const data = await res.json();
      setResults(data.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runSearch();
  }, []);

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center pt-16"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" /></div>;
  }

  return (
    <main className="relative min-h-screen bg-[#050507] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-apple-noise opacity-35" />
      <div className="relative mx-auto max-w-7xl space-y-6">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[2rem] border border-white/10 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">Discovery engine</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Search and benchmark repos</h1>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
                className="w-full rounded-full border border-white/10 bg-[#09090e] py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-white/35 focus:border-white/25"
                placeholder="Search repositories"
              />
            </div>
            <button onClick={runSearch} className="apple-btn-primary justify-center sm:justify-start">
              <Sparkles className="h-4 w-4" />
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </motion.section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((repo, idx) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(0.03 * idx, 0.4) }}
              whileHover={{ y: -4 }}
              className="glass-panel rounded-3xl border border-white/10 p-5"
            >
              <div className="flex items-center gap-3">
                <img src={repo.owner.avatar_url} alt="owner" className="h-8 w-8 rounded-full border border-white/15" />
                <p className="truncate font-medium text-sky-200">{repo.full_name}</p>
              </div>
              <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm text-white/60">{repo.description || "No description"}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/55">
                {repo.language ? <span className="rounded-full border border-white/10 px-2 py-1">{repo.language}</span> : null}
                <span>★ {repo.stargazers_count.toLocaleString()}</span>
                <span>⑂ {repo.forks_count.toLocaleString()}</span>
              </div>
            </motion.a>
          ))}
        </section>
      </div>
    </main>
  );
}
