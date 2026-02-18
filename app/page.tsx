"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Gauge,
  Layers,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react";

const sectionIn = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0 },
};

const highlights = [
  {
    title: "Unified Signal",
    description:
      "Pull GitHub, velocity, streaks, code health, and AI actions into one source of truth.",
    icon: Layers,
  },
  {
    title: "Silent Automation",
    description:
      "Background workflows handle routines while you stay focused on deep work.",
    icon: Workflow,
  },
  {
    title: "Intelligence Layer",
    description:
      "Generate commits, fix blockers, and analyze architecture with contextual AI tools.",
    icon: BrainCircuit,
  },
  {
    title: "Production Calm",
    description:
      "Predictive insights and confidence scoring before every deploy.",
    icon: Shield,
  },
];

const featureTimeline = [
  {
    overline: "Observe",
    title: "Know exactly what moved your velocity.",
    body: "From commit frequency to repository drag, DevStream visualizes what changed, why it changed, and what to do next.",
  },
  {
    overline: "Decide",
    title: "Turn noisy data into deliberate action.",
    body: "High-signal recommendations rank what to fix now, what to automate, and what to delay without hurting momentum.",
  },
  {
    overline: "Execute",
    title: "Ship faster without sacrificing polish.",
    body: "Smooth handoffs between humans and AI keep pull requests clean, scoped, and measurable.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(130,162,255,0.22),transparent_36%),radial-gradient(circle_at_80%_0%,rgba(174,110,255,0.18),transparent_30%),#050507] text-white">
      <div className="pointer-events-none absolute inset-0 bg-apple-noise opacity-40" />

      <section className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-white/75">
            <Sparkles className="h-3.5 w-3.5" />
            Apple-grade command center for builders
          </p>
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-7xl">
            Build like a studio.
            <br />
            <span className="bg-gradient-to-b from-white to-white/45 bg-clip-text text-transparent">
              Operate like an OS.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70 md:text-xl">
            DevStream blends premium product design, cinematic motion, and engineering intelligence into one calm workspace.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/login" className="apple-btn-primary">
              Launch DevStream
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className="apple-btn-secondary">
              Explore Dashboard
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/15 p-5 md:p-8"
        >
          <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-purple-400/20 blur-3xl" />

          <div className="relative grid gap-5 md:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-[#0d0d11]/90 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/45">Mission Control</p>
                  <p className="mt-1 text-2xl font-medium tracking-tight">Developer Pulse</p>
                </div>
                <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
                  System stable
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["Streak", "100 days", "+4.2%"],
                  ["Throughput", "42 PRs", "+13%"],
                  ["Quality", "98 score", "Top 2%"],
                ].map(([label, value, delta]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs text-white/45">{label}</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
                    <p className="mt-3 text-xs text-emerald-200">{delta}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0a0a0f]/95 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-white/45">Realtime intelligence</p>
              <div className="mt-5 space-y-3">
                {["AI review cleared in 42s", "Release confidence at 97%", "3 automation opportunities found"].map((line) => (
                  <div key={line} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm text-white/75">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-5 px-4 pb-24 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {highlights.map((item, index) => (
          <motion.article
            key={item.title}
            variants={sectionIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            className="glass-panel rounded-3xl border border-white/10 p-6"
          >
            <item.icon className="h-6 w-6 text-white/80" />
            <h3 className="mt-5 text-xl font-medium tracking-tight">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{item.description}</p>
          </motion.article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">Workflow architecture</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
            Designed for deep focus and controlled speed.
          </h2>
        </div>

        <div className="space-y-4">
          {featureTimeline.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="glass-panel rounded-3xl border border-white/10 p-6 md:p-8"
            >
              <div className="grid gap-4 md:grid-cols-[180px_1fr] md:items-start">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">{item.overline}</p>
                <div>
                  <h3 className="text-2xl font-medium tracking-tight">{item.title}</h3>
                  <p className="mt-2 max-w-3xl text-white/65">{item.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-panel relative overflow-hidden rounded-[2.2rem] border border-white/15 p-8 md:p-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(123,149,255,0.22),transparent_35%)]" />
          <div className="relative flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.22em] text-white/45">Ready to build at senior level</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
                Premium execution.
                <br />
                No compromise.
              </h2>
              <p className="mt-4 text-white/70">
                Every interaction, transition, and layout is tuned for a product that feels crafted—not assembled.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard" className="apple-btn-primary">
                Open Command Center
                <Gauge className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
