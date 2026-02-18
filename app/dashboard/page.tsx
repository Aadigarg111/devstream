"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Flame,
  FolderGit2,
  GitCommitHorizontal,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const profile = (session as any)?.githubProfile;
  const accessToken = (session as any)?.accessToken;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (accessToken && profile) {
      fetchGitHubData();
    }
  }, [accessToken, profile]);

  async function fetchGitHubData() {
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      };

      const [reposRes, eventsRes] = await Promise.all([
        fetch("https://api.github.com/user/repos?sort=updated&per_page=8&type=owner", { headers }),
        fetch(`https://api.github.com/users/${profile.login}/events?per_page=20`, { headers }),
      ]);

      if (reposRes.ok) setRepos(await reposRes.json());
      if (eventsRes.ok) setEvents(await eventsRes.json());
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  }

  const metrics = useMemo(() => {
    const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const forks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const pushes = events.filter((event) => event.type === "PushEvent").length;

    return [
      { label: "Repositories", value: profile?.public_repos ?? 0, icon: FolderGit2, accent: "text-sky-200" },
      { label: "Followers", value: profile?.followers ?? 0, icon: Users, accent: "text-violet-200" },
      { label: "Stars", value: stars, icon: Star, accent: "text-amber-200" },
      { label: "Push Activity", value: pushes, icon: GitCommitHorizontal, accent: "text-emerald-200" },
      { label: "Forks", value: forks, icon: Activity, accent: "text-indigo-200" },
      { label: "Streak Mode", value: "ON", icon: Flame, accent: "text-orange-200" },
    ];
  }, [profile, repos, events]);

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507] pt-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
          className="h-12 w-12 rounded-full border-2 border-white/20 border-t-white"
        />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-apple-noise opacity-40" />
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-violet-400/20 blur-[130px] animate-float-slow" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-400/15 blur-[130px] animate-pulse-glow" />

      <div className="relative mx-auto max-w-7xl space-y-8">
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="glass-panel rounded-[2rem] border border-white/10 p-6 md:p-8"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <img src={profile.avatar_url} alt={profile.login} className="h-20 w-20 rounded-full border border-white/20" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Command center</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em] md:text-4xl">{profile.name || profile.login}</h1>
                <p className="text-white/60">@{profile.login}</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
              <Sparkles className="h-4 w-4" />
              All systems synchronized
            </div>
          </div>
        </motion.section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric, index) => (
            <motion.article
              key={metric.label}
              variants={fadeInUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.5, delay: 0.08 * index }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-panel rounded-3xl border border-white/10 p-5"
            >
              <metric.icon className={`h-5 w-5 ${metric.accent}`} />
              <p className="mt-4 text-3xl font-semibold tracking-tight">{metric.value}</p>
              <p className="mt-1 text-sm text-white/55">{metric.label}</p>
            </motion.article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.65, delay: 0.2 }}
            className="glass-panel rounded-[1.8rem] border border-white/10 p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-medium tracking-tight">Recent repositories</h2>
              <a href="https://github.com" target="_blank" className="apple-btn-secondary !px-3 !py-1.5 !text-xs" rel="noreferrer">
                Open GitHub <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="space-y-3">
              {repos.slice(0, 6).map((repo) => (
                <motion.a
                  key={repo.id}
                  whileHover={{ x: 4 }}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.08]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-base font-medium text-white">{repo.full_name}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-white/60">{repo.description || "No description available"}</p>
                    </div>
                    <div className="text-right text-xs text-white/45">
                      <p>★ {repo.stargazers_count}</p>
                      <p>⑂ {repo.forks_count}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.65, delay: 0.3 }}
            className="glass-panel rounded-[1.8rem] border border-white/10 p-6"
          >
            <h2 className="text-2xl font-medium tracking-tight">Live activity</h2>
            <p className="mt-1 text-sm text-white/55">Latest events from your GitHub feed.</p>
            <div className="mt-5 space-y-3">
              {events.slice(0, 8).map((event) => (
                <div key={event.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-sm text-white/80">{event.type.replace("Event", "")}</p>
                  <p className="text-xs text-white/55">{event.repo.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-white/35">
                    {new Date(event.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
