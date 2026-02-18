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

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
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
          `https://api.github.com/users/${profile.login}/events?per_page=30`,
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

      // Fetch contribution heatmap via GraphQL
      await fetchContributions();
    } catch (err) {
      console.error("Failed to fetch GitHub data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchContributions() {
    try {
      const query = `
        query {
          user(login: "${profile.login}") {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `;

      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (res.ok) {
        const data = await res.json();
        const calendar =
          data.data?.user?.contributionsCollection?.contributionCalendar;
        if (calendar) {
          setTotalContributions(calendar.totalContributions);
          const days: ContributionDay[] = [];
          for (const week of calendar.weeks) {
            for (const day of week.contributionDays) {
              const levelMap: Record<string, number> = {
                NONE: 0,
                FIRST_QUARTILE: 1,
                SECOND_QUARTILE: 2,
                THIRD_QUARTILE: 3,
                FOURTH_QUARTILE: 4,
              };
              days.push({
                date: day.date,
                count: day.contributionCount,
                level: levelMap[day.contributionLevel] ?? 0,
              });
            }
          }
          setContributions(days);

          // Calculate current streak
          let streak = 0;
          const today = new Date().toISOString().split("T")[0];
          for (let i = days.length - 1; i >= 0; i--) {
            if (days[i].date > today) continue;
            if (days[i].count > 0) {
              streak++;
            } else {
              // Allow today to have 0 (day not over yet)
              if (days[i].date === today) continue;
              break;
            }
          }
          setCurrentStreak(streak);
        }
      }
    } catch (err) {
      console.error("Failed to fetch contributions:", err);
    }
  }

  function getEventDescription(event: GitHubEvent): string {
    const repoName = event.repo.name.split("/").pop() || event.repo.name;
    switch (event.type) {
      case "PushEvent":
        const commits = event.payload.commits?.length || 0;
        if (commits === 0) return `Pushed to ${repoName}`;
        const commitMsg = event.payload.commits?.[0]?.message?.split("\n")[0] || "";
        if (commits === 1) return `${commitMsg} → ${repoName}`;
        return `${commits} commits to ${repoName}`;
      case "CreateEvent":
        if (event.payload.ref_type === "repository") return `Created repo ${repoName}`;
        return `Created ${event.payload.ref_type} ${event.payload.ref || ""} in ${repoName}`;
      case "WatchEvent":
        return `Starred ${repoName}`;
      case "ForkEvent":
        return `Forked ${repoName}`;
      case "IssuesEvent":
        return `${event.payload.action} issue in ${repoName}`;
      case "PullRequestEvent":
        return `${event.payload.action} PR in ${repoName}`;
      case "DeleteEvent":
        return `Deleted ${event.payload.ref_type} in ${repoName}`;
      default:
        return `${event.type.replace("Event", "")} on ${repoName}`;
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
      case "DeleteEvent": return "🗑️";
      default: return "📌";
    }
  }

  function getContributionColor(level: number): string {
    switch (level) {
      case 0: return "bg-gray-800/60";
      case 1: return "bg-green-900";
      case 2: return "bg-green-700";
      case 3: return "bg-green-500";
      case 4: return "bg-green-400";
      default: return "bg-gray-800/60";
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

  // Build heatmap grid (last 52 weeks)
  function renderHeatmap() {
    if (contributions.length === 0) return null;

    // Get last 52 weeks of data
    const recent = contributions.slice(-364);
    const weeks: ContributionDay[][] = [];
    for (let i = 0; i < recent.length; i += 7) {
      weeks.push(recent.slice(i, i + 7));
    }

    const months: { label: string; col: number }[] = [];
    let lastMonth = "";
    weeks.forEach((week, i) => {
      if (week.length > 0) {
        const d = new Date(week[0].date);
        const m = d.toLocaleDateString("en-US", { month: "short" });
        if (m !== lastMonth) {
          months.push({ label: m, col: i });
          lastMonth = m;
        }
      }
    });

    return (
      <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">🟩 Contributions</h2>
          <span className="text-sm text-gray-400">
            {totalContributions} contributions this year
          </span>
        </div>

        {/* Month labels */}
        <div className="flex gap-[3px] mb-1 ml-8 overflow-hidden">
          {months.map((m, i) => (
            <div
              key={i}
              className="text-xs text-gray-500"
              style={{
                position: "relative",
                left: `${m.col * 15}px`,
                marginLeft: i === 0 ? 0 : `-${(months[i - 1]?.col || 0) * 15 + (months[i - 1]?.label.length || 0) * 6}px`,
              }}
            >
              {m.label}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex items-start gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] text-xs text-gray-600 pr-1">
            <div className="h-[12px]"></div>
            <div className="h-[12px] flex items-center">Mon</div>
            <div className="h-[12px]"></div>
            <div className="h-[12px] flex items-center">Wed</div>
            <div className="h-[12px]"></div>
            <div className="h-[12px] flex items-center">Fri</div>
            <div className="h-[12px]"></div>
          </div>

          {/* Grid */}
          <div className="flex gap-[3px] overflow-x-auto">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className={`w-[12px] h-[12px] rounded-sm ${getContributionColor(day.level)} hover:ring-1 hover:ring-gray-500 cursor-pointer`}
                    title={`${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`}
                  />
                ))}
                {/* Pad incomplete weeks */}
                {week.length < 7 &&
                  Array.from({ length: 7 - week.length }).map((_, i) => (
                    <div key={`pad-${i}`} className="w-[12px] h-[12px]" />
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1 mt-3 text-xs text-gray-500">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-[12px] h-[12px] rounded-sm ${getContributionColor(level)}`}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    );
  }

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

  // Filter out "0 commits" push events and dedupe
  const filteredEvents = events.filter((event) => {
    if (event.type === "PushEvent" && (!event.payload.commits || event.payload.commits.length === 0)) {
      return false;
    }
    return true;
  });

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

        {/* Contribution Heatmap */}
        {renderHeatmap()}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/20 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold">{currentStreak}</div>
            <div className="text-xs text-gray-500 mt-1">Day Streak</div>
          </div>
          <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/20 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold">{totalContributions}</div>
            <div className="text-xs text-gray-500 mt-1">Contributions</div>
          </div>
          <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/20 text-center">
            <div className="text-3xl mb-2">📂</div>
            <div className="text-2xl font-bold">{profile.public_repos}</div>
            <div className="text-xs text-gray-500 mt-1">Repositories</div>
          </div>
          <div className="p-5 rounded-xl border border-gray-800 bg-gray-900/20 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold">
              {repos.reduce((sum, r) => sum + r.stargazers_count, 0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Total Stars</div>
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
              {filteredEvents.slice(0, 10).map((event) => (
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
              {filteredEvents.length === 0 && (
                <p className="text-sm text-gray-600 p-3">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
