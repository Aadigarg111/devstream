"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const profile = (session as any)?.githubProfile;
  const accessToken = (session as any)?.accessToken;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
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
        fetch(
          `https://api.github.com/user/repos?sort=updated&per_page=6&type=owner`,
          { headers }
        ),
        fetch(
          `https://api.github.com/users/${profile.login}/events?per_page=10`,
          { headers }
        ),
      ]);

      if (reposRes.ok) {
        const reposData = await reposRes.json();
        setRepos(reposData);
      }
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
      }
    } catch (err) {
      console.error("Failed to fetch GitHub data:", err);
    } finally {
      setLoading(false);
    }
  }

  function getEventDescription(event: GitHubEvent): string {
    switch (event.type) {
      case "PushEvent":
        const commits = event.payload.commits?.length || 0;
        return `Pushed ${commits} commit${commits !== 1 ? "s" : ""} to ${event.repo.name}`;
      case "CreateEvent":
        return `Created ${event.payload.ref_type} in ${event.repo.name}`;
      case "WatchEvent":
        return `Starred ${event.repo.name}`;
      case "ForkEvent":
        return `Forked ${event.repo.name}`;
      case "IssuesEvent":
        return `${event.payload.action} issue in ${event.repo.name}`;
      case "PullRequestEvent":
        return `${event.payload.action} PR in ${event.repo.name}`;
      default:
        return `${event.type.replace("Event", "")} on ${event.repo.name}`;
    }
  }

  function getEventIcon(type: string): string {
    switch (type) {
      case "PushEvent": return "🔨";
      case "CreateEvent": return "✨";
      case "WatchEvent": return "⭐";
      case "ForkEvent": return "🍴";
      case "IssuesEvent": return "🐛";
      case "PullRequestEvent": return "🔀";
      default: return "📌";
    }
  }

  const langColors: Record<string, string> = {
    TypeScript: "bg-blue-500",
    JavaScript: "bg-yellow-500",
    Python: "bg-green-500",
    Rust: "bg-orange-500",
    Go: "bg-cyan-500",
    Java: "bg-red-500",
    "C++": "bg-pink-500",
    C: "bg-gray-400",
    HTML: "bg-orange-400",
    CSS: "bg-purple-500",
    Shell: "bg-green-400",
  };

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading your GitHub data...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6 p-6 rounded-2xl border border-gray-800 bg-gray-900/30">
          <img
            src={profile.avatar_url}
            alt={profile.login}
            className="w-20 h-20 rounded-full ring-4 ring-gray-800"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{profile.name || profile.login}</h1>
            <p className="text-gray-400 mt-1">@{profile.login}</p>
            {profile.bio && (
              <p className="text-gray-500 mt-2 text-sm">{profile.bio}</p>
            )}
          </div>
          <div className="flex gap-8 text-center">
            <div>
              <div className="text-2xl font-bold">{profile.public_repos}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Repos</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{profile.followers}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Followers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{profile.following}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Following</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Repos */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              📂 Recent Repositories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-5 rounded-xl border border-gray-800 hover:border-gray-600 bg-gray-900/20 transition-all duration-200 hover:bg-gray-900/40 group"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-blue-400 group-hover:text-blue-300 truncate">
                      {repo.name}
                    </h3>
                    <span className="text-xs text-gray-600 px-2 py-0.5 rounded-full border border-gray-800">
                      {repo.visibility}
                    </span>
                  </div>
                  {repo.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${langColors[repo.language] || "bg-gray-500"}`}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span>⭐ {repo.stargazers_count}</span>
                    <span>🍴 {repo.forks_count}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              ⚡ Recent Activity
            </h2>
            <div className="space-y-1">
              {events.slice(0, 8).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-900/30 transition-colors"
                >
                  <span className="text-lg mt-0.5">
                    {getEventIcon(event.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 leading-snug">
                      {getEventDescription(event)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(event.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-sm text-gray-600 p-3">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/20 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold">Day 2</div>
            <div className="text-xs text-gray-500 mt-1">Current Streak</div>
          </div>
          <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/20 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold">{repos.length}</div>
            <div className="text-xs text-gray-500 mt-1">Active Repos</div>
          </div>
          <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/20 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold">{events.length}</div>
            <div className="text-xs text-gray-500 mt-1">Recent Events</div>
          </div>
          <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/20 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold">98</div>
            <div className="text-xs text-gray-500 mt-1">Days Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
}
