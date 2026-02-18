"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedLogo from "@/components/AnimatedLogo";
import {
  ArrowRight,
  BrainCircuit,
  Gauge,
  Layers,
  Shield,
  Sparkles,
  Workflow,
  Rocket,
  Smartphone,
  WandSparkles,
  DatabaseZap,
} from "lucide-react";

const sectionIn = {
  hidden: { opacity: 0, y: 38 },
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

const frontPageExtensions = [
  {
    title: "iOS-grade Components",
    body: "Elastic cards, liquid highlights, and tactile motion tuned to feel native on modern Apple hardware.",
    icon: WandSparkles,
  },
  {
    title: "Mobile Command Deck",
    body: "Thumb-first navigation, tighter content rhythm, and safe-area-friendly spacing for smaller screens.",
    icon: Smartphone,
  },
  {
    title: "Real-time Data Fabric",
    body: "Build status, AI summaries, and release metrics streamed into a single calm dashboard.",
    icon: DatabaseZap,
  },
];

const mobileSignals = [
  ["Frame rate", "120Hz-ready"],
  ["Tap targets", "44px minimum"],
  ["Layout shift", "Near-zero"],
  ["Hydration", "Fast path"],
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_16%_14%,rgba(120,165,255,0.22),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(171,114,255,0.2),transparent_30%),#050507] text-white">
      <div className="pointer-events-none absolute inset-0 bg-apple-noise opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-white/[0.05] to-transparent" />

      <section className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-20 pt-28 sm:px-6 md:gap-12 md:pt-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="mb-6">
            <AnimatedLogo compact markClassName="h-14 w-14" />
          </div>
          <p className="apple-eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Apple-grade command center for builders
          </p>
          <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-8xl">
            Build like a studio.
            <br />
            <span className="apple-gradient-text">Operate like an iOS-native OS.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/70 sm:text-lg md:text-xl">
            DevStream blends premium product design, cinematic motion, and engineering intelligence into one calm workspace—optimized for desktop focus and mobile speed.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
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
          className="glass-panel relative overflow-hidden rounded-[1.75rem] border border-white/15 p-4 sm:p-5 md:rounded-[2rem] md:p-8"
        >
          <div className="animate-pulse-glow absolute -right-24 -top-24 h-60 w-60 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="animate-float-slow absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-purple-400/20 blur-3xl" />

          <div className="relative grid gap-4 md:gap-5 lg:grid-cols-[2fr_1fr]">
            <div className="apple-card rounded-3xl border border-white/10 p-5 sm:p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="apple-eyebrow">Mission Control</p>
                  <p className="mt-1 text-xl font-medium tracking-tight sm:text-2xl">Developer Pulse</p>
                </div>
                <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
                  System stable
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                {[
                  ["Streak", "100 days", "+4.2%"],
                  ["Throughput", "42 PRs", "+13%"],
                  ["Quality", "98 score", "Top 2%"],
                ].map(([label, value, delta]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:bg-white/[0.06]">
                    <p className="text-xs text-white/45">{label}</p>
                    <p className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">{value}</p>
                    <p className="mt-3 text-xs text-emerald-200">{delta}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="apple-card rounded-3xl border border-white/10 p-5">
              <p className="apple-eyebrow">Realtime intelligence</p>
              <div className="mt-5 space-y-3">
                {[
                  "AI review cleared in 42s",
                  "Release confidence at 97%",
                  "3 automation opportunities found",
                ].map((line) => (
                  <div key={line} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm text-white/75 transition duration-300 hover:bg-white/[0.06]">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-4 px-4 pb-20 sm:grid-cols-2 sm:gap-5 sm:px-6 lg:grid-cols-4 lg:px-8">
        {highlights.map((item, index) => (
          <motion.article
            key={item.title}
            variants={sectionIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, delay: index * 0.06 }}
            className="glass-panel rounded-3xl border border-white/10 p-5 sm:p-6"
          >
            <item.icon className="h-6 w-6 text-white/80" />
            <h3 className="mt-5 text-xl font-medium tracking-tight">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{item.description}</p>
          </motion.article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="apple-eyebrow">Workflow architecture</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl md:text-5xl">
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
              className="glass-panel rounded-3xl border border-white/10 p-5 sm:p-6 md:p-8"
            >
              <div className="grid gap-4 md:grid-cols-[180px_1fr] md:items-start">
                <p className="apple-eyebrow">{item.overline}</p>
                <div>
                  <h3 className="text-xl font-medium tracking-tight sm:text-2xl">{item.title}</h3>
                  <p className="mt-2 max-w-3xl text-white/65">{item.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="apple-eyebrow">Front page extension</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl md:text-5xl">
              More surface area, still Apple-clean.
            </h2>
          </div>
          <div className="apple-card inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80">
            <Rocket className="h-4 w-4" />
            Shipping premium v3
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {frontPageExtensions.map((item, index) => (
              <motion.article
                key={item.title}
                variants={sectionIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="glass-panel rounded-3xl border border-white/10 p-5 sm:p-6"
              >
                <item.icon className="h-6 w-6 text-sky-100" />
                <h3 className="mt-4 text-xl font-medium tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{item.body}</p>
              </motion.article>
            ))}
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="glass-panel rounded-3xl border border-white/10 p-5 sm:p-6"
          >
            <p className="apple-eyebrow">Mobile readiness</p>
            <h3 className="mt-2 text-2xl font-medium tracking-tight">Optimized for iPhone first.</h3>
            <div className="mt-5 space-y-2.5">
              {mobileSignals.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm">
                  <span className="text-white/60">{k}</span>
                  <span className="font-medium text-white">{v}</span>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/15 p-6 sm:p-8 md:rounded-[2.2rem] md:p-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(123,149,255,0.22),transparent_35%)]" />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="apple-eyebrow">Ready to build at senior level</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl md:text-5xl">
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
