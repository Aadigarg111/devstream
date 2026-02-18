"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Event {
  id: string; type: string; repo: { name: string }; created_at: string; payload: any;
}

interface Issue { id: number; title: string; html_url: string; state: string; repository_url: string; created_at: string; pull_request?: any; labels: { name: string; color: string }[]; }

interface Notification { id: string; reason: string; subject: { title: string; type: string; url: string }; repository: { full_name: string }; updated_at: string; unread: boolean; }

const EVENT_TYPES = ["All", "PushEvent", "CreateEvent", "PullRequestEvent", "IssuesEvent", "WatchEvent", "ForkEvent", "DeleteEvent"];

export default function ActivityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("All");
  const [tab, setTab] = useState<"activity" | "issues" | "notifications">("activity");
  const [loading, setLoading] = useState(true);

  const profile = (session as any)?.githubProfile;
  const accessToken = (session as any)?.accessToken;

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status, router]);
  useEffect(() => { if (accessToken && profile) fetchData(); }, [accessToken, profile]);

  async function fetchData() {
    try {
      const headers = { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" };
      const [evRes, issRes, notifRes] = await Promise.all([
        fetch(`https://api.github.com/users/${profile.login}/events?per_page=50`, { headers }),
        fetch(`https://api.github.com/user/issues?filter=all&state=open&per_page=20&sort=updated`, { headers }),
        fetch(`https://api.github.com/notifications?per_page=20`, { headers }),
      ]);
      if (evRes.ok) setEvents(await evRes.json());
      if (issRes.ok) setIssues(await issRes.json());
      if (notifRes.ok) setNotifications(await notifRes.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  function getEventDesc(e: Event): string {
    const repo = e.repo.name.split("/").pop() || e.repo.name;
    switch (e.type) {
      case "PushEvent": { const c = e.payload.commits?.length || 0; return c > 0 ? `Pushed ${c} commit${c > 1 ? "s" : ""} to ${repo}` : `Pushed to ${repo}`; }
      case "CreateEvent": return `Created ${e.payload.ref_type} in ${repo}`;
      case "PullRequestEvent": return `${e.payload.action} PR #${e.payload.number} in ${repo}`;
      case "IssuesEvent": return `${e.payload.action} issue #${e.payload.issue?.number} in ${repo}`;
      case "WatchEvent": return `Starred ${repo}`;
      case "ForkEvent": return `Forked ${repo}`;
      case "DeleteEvent": return `Deleted ${e.payload.ref_type} in ${repo}`;
      default: return `${e.type.replace("Event", "")} on ${repo}`;
    }
  }

  function getIcon(type: string): string {
    const m: Record<string, string> = { PushEvent: "🔨", CreateEvent: "✨", WatchEvent: "⭐", ForkEvent: "🍴", IssuesEvent: "🐛", PullRequestEvent: "🔀", DeleteEvent: "🗑️" };
    return m[type] || "📌";
  }

  const filtered = filter === "All" ? events : events.filter(e => e.type === filter);
  const prs = issues.filter(i => i.pull_request);
  const realIssues = issues.filter(i => !i.pull_request);

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center pt-16"><div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">⚡ Activity</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 rounded-lg p-1 w-fit">
          {(["activity", "issues", "notifications"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-md text-sm capitalize transition-colors ${tab === t ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"}`}>
              {t} {t === "notifications" && notifications.filter(n => n.unread).length > 0 &&
                <span className="ml-1 px-1.5 py-0.5 bg-red-500 rounded-full text-xs">{notifications.filter(n => n.unread).length}</span>}
            </button>
          ))}
        </div>

        {tab === "activity" && (
          <>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map(t => (
                <button key={t} onClick={() => setFilter(t)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors ${filter === t ? "bg-white text-black" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                  {t === "All" ? "All" : t.replace("Event", "")}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {filtered.map(event => (
                <div key={event.id} className="flex items-start gap-3 p-4 rounded-xl border border-gray-800 bg-gray-900/20 hover:bg-gray-900/40 transition-colors">
                  <span className="text-xl mt-0.5">{getIcon(event.type)}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-200">{getEventDesc(event)}</p>
                    <p className="text-xs text-gray-600 mt-1">{new Date(event.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <span className="text-xs text-gray-700 px-2 py-1 rounded bg-gray-800">{event.type.replace("Event", "")}</span>
                </div>
              ))}
              {filtered.length === 0 && <p className="text-gray-600 text-center py-8">No activity found</p>}
            </div>
          </>
        )}

        {tab === "issues" && (
          <div className="space-y-6">
            {prs.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">🔀 Open Pull Requests ({prs.length})</h2>
                <div className="space-y-2">
                  {prs.map(pr => (
                    <a key={pr.id} href={pr.html_url} target="_blank" rel="noopener noreferrer"
                      className="block p-4 rounded-xl border border-gray-800 bg-gray-900/20 hover:bg-gray-900/40 transition-colors">
                      <p className="text-sm text-gray-200">{pr.title}</p>
                      <div className="flex gap-2 mt-2">
                        {pr.labels.map(l => (
                          <span key={l.name} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `#${l.color}20`, color: `#${l.color}` }}>{l.name}</span>
                        ))}
                        <span className="text-xs text-gray-600">{new Date(pr.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {realIssues.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">🐛 Open Issues ({realIssues.length})</h2>
                <div className="space-y-2">
                  {realIssues.map(issue => (
                    <a key={issue.id} href={issue.html_url} target="_blank" rel="noopener noreferrer"
                      className="block p-4 rounded-xl border border-gray-800 bg-gray-900/20 hover:bg-gray-900/40 transition-colors">
                      <p className="text-sm text-gray-200">{issue.title}</p>
                      <div className="flex gap-2 mt-2">
                        {issue.labels.map(l => (
                          <span key={l.name} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `#${l.color}20`, color: `#${l.color}` }}>{l.name}</span>
                        ))}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {prs.length === 0 && realIssues.length === 0 && <p className="text-gray-600 text-center py-8">No open PRs or issues</p>}
          </div>
        )}

        {tab === "notifications" && (
          <div className="space-y-2">
            {notifications.map(n => (
              <div key={n.id} className={`flex items-start gap-3 p-4 rounded-xl border bg-gray-900/20 transition-colors ${n.unread ? "border-blue-800/50" : "border-gray-800"}`}>
                <span className="text-lg">{n.subject.type === "PullRequest" ? "🔀" : n.subject.type === "Issue" ? "🐛" : "💬"}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-200">{n.subject.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{n.repository.full_name} · {n.reason} · {new Date(n.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                </div>
                {n.unread && <span className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
              </div>
            ))}
            {notifications.length === 0 && <p className="text-gray-600 text-center py-8">No notifications</p>}
          </div>
        )}
      </div>
    </div>
  );
}
