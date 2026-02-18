"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import { MouseEvent } from "react";
import { ArrowRight, Github, BarChart2, Zap, Brain, Code2, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

function Card3D({ children, className }: { children: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn("group relative border border-white/10 bg-gray-900/40 overflow-hidden rounded-3xl", className)}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-8 max-w-5xl px-6 relative z-10"
        style={{ opacity }}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm font-medium text-gray-300">100-Day Challenge Active</span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50 pb-4">
          DevStream.
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Your developer command center. 
          <span className="text-white/80 block mt-2">GitHub stats, AI tools, and analytics in one place.</span>
        </p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <Link href="/login" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all duration-300 hover:bg-white/90 hover:scale-105 hover:ring-2 hover:ring-white/50 hover:ring-offset-2 hover:ring-offset-black">
            <span className="mr-2"><Github className="w-5 h-5" /></span>
            Continue with GitHub
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="#features" className="group inline-flex h-12 items-center justify-center rounded-full px-8 font-medium text-white transition-colors hover:text-white/80">
            Learn more
          </Link>
        </motion.div>
      </motion.div>

      {/* 3D Abstract Elements */}
      <motion.div style={{ y: y1 }} className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <motion.div style={{ y: y2 }} className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}

const features = [
  {
    title: "GitHub Analytics",
    desc: "Deep dive into your coding habits. Commit frequency, language breakdown, and contribution heatmaps.",
    icon: BarChart2,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "AI Assistant",
    desc: "Generate code, explain complex logic, and review PRs with an AI trained for developers.",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    title: "Smart Search",
    desc: "Find any repo, issue, or snippet instantly across your entire GitHub ecosystem.",
    icon: Search,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    title: "Activity Feed",
    desc: "A unified timeline of your developer life. PRs, issues, and commits in one clean view.",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    title: "Repository Insights",
    desc: "Track growth, stars, and forks. Visualize your most popular projects over time.",
    icon: Code2,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    title: "Customizable",
    desc: "Dark mode, themes, and profile settings to make your dashboard truly yours.",
    icon: Settings,
    color: "text-gray-400",
    bg: "bg-gray-500/10",
  },
];

function Features() {
  return (
    <section id="features" className="py-32 px-6 relative z-10 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Powerful tools. <span className="text-gray-500">Zero friction.</span></h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to supercharge your development workflow.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card3D className="h-full p-8 hover:bg-gray-900/60 transition-colors">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", feature.bg)}>
                  <feature.icon className={cn("w-6 h-6", feature.color)} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsPreview() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0.5, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0.5, 0.8], [0.5, 1]);

  return (
    <section className="py-32 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent -z-10" />
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Visualize your impact.</h2>
          <p className="text-xl text-gray-400">See your contributions come to life.</p>
        </motion.div>

        <motion.div
          style={{ scale, opacity }}
          className="relative rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl shadow-blue-900/20 overflow-hidden"
        >
          <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="p-4 md:p-8 grid gap-4">
             {/* Mock UI for preview */}
             <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="h-2 w-32 bg-gray-800 rounded-full" />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               {[1,2,3].map(i => (
                 <div key={i} className="h-32 bg-gray-900/50 rounded-xl border border-white/5 animate-pulse" style={{ animationDelay: `${i*200}ms` }} />
               ))}
             </div>
             
             <div className="h-64 bg-gray-900/50 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-between px-8 pb-8 gap-2">
                   {[...Array(20)].map((_, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ height: 10 }}
                        whileInView={{ height: Math.random() * 100 + 20 }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                        className="w-full bg-blue-500/40 rounded-t-sm"
                      />
                   ))}
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen selection:bg-blue-500/30">
      <Hero />
      <Features />
      <StatsPreview />
      
      <footer className="py-12 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>© 2026 DevStream. Built for builders.</p>
      </footer>
    </main>
  );
}
