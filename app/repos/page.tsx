"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, GitFork, Star, TerminalSquare } from "lucide-react";

interface Repo {
  id: number;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export default function ReposPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  const accessToken = (session as any)?.accessToken;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      try {
        const res = await fetch("https://api.github.com/user/repos?sort=updated&per_page=30&type=owner", {
          headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" },
        });
        if (res.ok) setRepos(await res.json());
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken]);

  const totalStats = useMemo(() => {
    return {
      stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      forks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
    };
  }, [repos]);

  if (status === "loading" || loading) {
    return <div className="flex min-h-screen items-center justify-center pt-16"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" /></div>;
  }

  return (
    <main className="relative min-h-screen bg-[#050507] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-apple-noise opacity-35" />
      <div className="relative mx-auto max-w-7xl space-y-7">
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[2rem] border border-white/10 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">Repository intelligence</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Your code portfolio, curated</h1>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/75">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">{repos.length} repositories</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">★ {totalStats.stars} total stars</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">⑂ {totalStats.forks} total forks</span>
          </div>
        </motion.section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {repos.map((repo, idx) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.45) }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="glass-panel group rounded-3xl border border-white/10 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <TerminalSquare className="h-5 w-5 text-sky-200" />
                <ArrowUpRight className="h-4 w-4 text-white/35 transition group-hover:text-white" />
              </div>
              <h3 className="mt-4 truncate text-lg font-medium tracking-tight">{repo.full_name}</h3>
              <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm text-white/60">{repo.description || "No repository description"}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/55">
                {repo.language ? <span className="rounded-full border border-white/10 px-2 py-1">{repo.language}</span> : null}
                <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {repo.stargazers_count}</span>
                <span className="inline-flex items-center gap-1"><GitFork className="h-3.5 w-3.5" /> {repo.forks_count}</span>
              </div>
              <p className="mt-4 text-[11px] uppercase tracking-wide text-white/35">Updated {new Date(repo.updated_at).toLocaleDateString()}</p>
            </motion.a>
          ))}
        </section>
      </div>
    </main>
  );
}
