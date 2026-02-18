"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, History, Star, Folder, Flame, TrendingUp, Zap } from "lucide-react";

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
  visibility: string;
}

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: any;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
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
    if (accessToken && profile) fetchGitHubData();
  }, [accessToken, profile]);

  async function fetchGitHubData() {
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      };

      const [reposRes, eventsRes] = await Promise.all([
        fetch(`https://api.github.com/user/repos?sort=updated&per_page=6&type=owner`, { headers }),
        fetch(`https://api.github.com/users/${profile.login}/events?per_page=20`, { headers }),
      ]);

      if (reposRes.ok) setRepos(await reposRes.json());
      if (eventsRes.ok) setEvents(await eventsRes.json());
      
    } catch (err) {
      console.error("Failed to fetch GitHub data:", err);
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-12 h-12 border-t-2 border-white rounded-full animate-spin"
        />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <main className="min-h-screen bg-black bg-grid-white/[0.02] pt-24 pb-20 px-6 sm:px-10">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <img src={profile.avatar_url} className="relative w-24 h-24 rounded-full border border-white/10" alt="avatar" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white mb-1">{profile.name || profile.login}</h1>
              <p className="text-white/50 text-lg">@{profile.login}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="glass-card px-6 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium text-white">Active Mission</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: "Repos", value: profile.public_repos, icon: Folder, color: "text-blue-400" },
            { label: "Followers", value: profile.followers, icon: TrendingUp, color: "text-purple-400" },
            { label: "Following", value: profile.following, icon: Star, color: "text-yellow-400" },
            { label: "Day Streak", value: 2, icon: Flame, color: "text-orange-500" }, // Hardcoded streak for polish demo
          ].map((stat, i) => (
            <motion.div key={i} variants={item} className="glass-card p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors group">
              <stat.icon className={`w-6 h-6 ${stat.color} mb-4 group-hover:scale-110 transition-transform`} />
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-white/40 text-sm font-medium tracking-wide uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                <LayoutDashboard className="w-6 h-6 text-white/40" />
                Recent Projects
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {repos.map((repo, i) => (
                <a key={repo.id} href={repo.html_url} target="_blank" className="glass-card p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden block">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TrendingUp className="w-4 h-4 text-white/20" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{repo.name}</h3>
                  <p className="text-white/50 text-sm line-clamp-2 mb-6 h-10">{repo.description || "No description provided."}</p>
                  <div className="flex items-center gap-4 text-xs font-medium text-white/40 uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      {repo.language || "Web"}
                    </span>
                    <span>⭐ {repo.stargazers_count}</span>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Activity Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
              <History className="w-6 h-6 text-white/40" />
              Pulse
            </h2>
            <div className="glass-card rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md p-6 space-y-6">
              {events.slice(0, 6).map((event, i) => (
                <div key={i} className="flex gap-4 group cursor-default items-center">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white/10 transition-colors">
                    <Zap className="w-4 h-4 text-white/60" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white/80 font-medium truncate">
                      {event.type.replace("Event", "")}
                    </p>
                    <p className="text-xs text-white/40 truncate">{event.repo.name}</p>
                  </div>
                  <p className="text-[10px] text-white/20 uppercase tracking-tighter whitespace-nowrap">
                      {new Date(event.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
