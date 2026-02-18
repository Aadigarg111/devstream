"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart3, Flame, Gauge, Radar, Sparkles, TrendingUp } from "lucide-react";

const blocks = [
  { label: "Velocity", value: "+24%", icon: TrendingUp, detail: "Week-over-week output increase" },
  { label: "Stability", value: "97", icon: Gauge, detail: "Release confidence score" },
  { label: "Focus", value: "8.6h", icon: Flame, detail: "Deep work average per day" },
  { label: "Coverage", value: "89%", icon: Radar, detail: "Core flows monitored" },
];

export default function StatsPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507] pt-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#050507] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-apple-noise opacity-35" />
      <div className="relative mx-auto max-w-7xl space-y-8">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[2rem] border border-white/10 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">Analytics</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Performance telemetry</h1>
          <p className="mt-3 max-w-2xl text-white/65">High-fidelity metrics crafted for decision making, not vanity dashboards.</p>
        </motion.section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {blocks.map((block, idx) => (
            <motion.article
              key={block.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass-panel rounded-3xl border border-white/10 p-5"
            >
              <block.icon className="h-5 w-5 text-sky-200" />
              <p className="mt-4 text-3xl font-semibold">{block.value}</p>
              <p className="mt-1 text-sm text-white/70">{block.label}</p>
              <p className="mt-4 text-xs text-white/45">{block.detail}</p>
            </motion.article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel rounded-[1.8rem] border border-white/10 p-6">
            <div className="mb-5 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-violet-200" />
              <h2 className="text-2xl font-medium">Weekly momentum</h2>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[52, 76, 61, 89, 94, 73, 97].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.45 }}
                  className="origin-bottom rounded-xl bg-gradient-to-t from-sky-500/60 to-indigo-200/80"
                  style={{ height: `${height * 1.6}px` }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel rounded-[1.8rem] border border-white/10 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">Signal digest</p>
            <div className="mt-5 space-y-3">
              {[
                "PR turnaround dropped from 14h to 8h",
                "Most active language: TypeScript",
                "AI suggestions acceptance rate: 71%",
              ].map((line) => (
                <div key={line} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/75">
                  <Sparkles className="mr-2 inline h-3.5 w-3.5" />
                  {line}
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
