"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { ComponentType } from "react";
import { GitBranchPlus, GitPullRequest, MessageSquareText, Sparkles } from "lucide-react";

interface EventItem {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
}

const eventIcon: Record<string, ComponentType<{ className?: string }>> = {
  PushEvent: GitBranchPlus,
  PullRequestEvent: GitPullRequest,
  IssueCommentEvent: MessageSquareText,
};

export default function ActivityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);

  const profile = (session as any)?.githubProfile;
  const accessToken = (session as any)?.accessToken;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!profile || !accessToken) return;
    (async () => {
      const res = await fetch(`https://api.github.com/users/${profile.login}/events?per_page=40`, {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" },
      });
      if (res.ok) setEvents(await res.json());
    })();
  }, [profile, accessToken]);

  const summary = useMemo(() => {
    const today = events.filter((event) => Date.now() - new Date(event.created_at).getTime() < 86400000).length;
    const pushes = events.filter((event) => event.type === "PushEvent").length;
    const prs = events.filter((event) => event.type === "PullRequestEvent").length;
    return { today, pushes, prs };
  }, [events]);

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center pt-16"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" /></div>;
  }

  return (
    <main className="relative min-h-screen bg-[#050507] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-apple-noise opacity-35" />
      <div className="relative mx-auto max-w-6xl space-y-7">
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[2rem] border border-white/10 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">Live feed</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Activity timeline</h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/75">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">Today: {summary.today}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">Pushes: {summary.pushes}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">PRs: {summary.prs}</span>
          </div>
        </motion.section>

        <section className="space-y-3">
          {events.slice(0, 24).map((event, idx) => {
            const Icon = eventIcon[event.type] || Sparkles;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(0.03 * idx, 0.5) }}
                className="glass-panel flex items-start gap-3 rounded-2xl border border-white/10 p-4"
              >
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2">
                  <Icon className="h-4 w-4 text-sky-200" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{event.type.replace("Event", "")}</p>
                  <p className="text-sm text-white/60">{event.repo.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-white/35">{new Date(event.created_at).toLocaleString()}</p>
                </div>
              </motion.div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
