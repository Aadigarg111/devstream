"use client";

import { HeroSection } from "./components/HeroSection";
import { BentoGrid } from "./components/BentoGrid";
import { ScrollShowcase } from "./components/ScrollShowcase";
import { StickyScroll } from "./components/StickyScroll";
import { TextReveal } from "./components/TextReveal";
import { motion } from "framer-motion";
import { Code, GitBranch, Layers, Zap } from "lucide-react";

const stickyContent = [
  {
    title: "Real-time Collaboration",
    description:
      "Work together with your team in real-time. Changes are synced instantly across all devices. No more merge conflicts on Friday afternoon.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white bg-gradient-to-br from-cyan-500 to-emerald-500">
        <div className="p-8 text-center">
            <Code className="w-16 h-16 mx-auto mb-4 text-white/80" />
            <div className="font-mono text-sm bg-black/20 p-4 rounded-lg backdrop-blur-sm">
                User A is typing...
            </div>
        </div>
      </div>
    ),
  },
  {
    title: "Instant Deployments",
    description:
      "From localhost to global edge network in seconds. Our CI/CD pipeline is optimized for Next.js and modern frameworks.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white bg-gradient-to-br from-pink-500 to-indigo-500">
         <div className="p-8 text-center">
            <Zap className="w-16 h-16 mx-auto mb-4 text-white/80" />
            <div className="font-mono text-sm bg-black/20 p-4 rounded-lg backdrop-blur-sm">
                Deployment: Success (0.4s)
            </div>
        </div>
      </div>
    ),
  },
  {
    title: "Version History",
    description:
      "Every change is tracked. Rollback to any point in time with a single click. Visual diffs make code reviews a breeze.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white bg-gradient-to-br from-orange-500 to-yellow-500">
        <div className="p-8 text-center">
            <GitBranch className="w-16 h-16 mx-auto mb-4 text-white/80" />
            <div className="font-mono text-sm bg-black/20 p-4 rounded-lg backdrop-blur-sm">
                Commit: 8f3a21 (main)
            </div>
        </div>
      </div>
    ),
  },
   {
    title: "Deep Analytics",
    description:
      "Understand your codebase like never before. Line-by-line attribution, impact analysis, and technical debt metrics.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white bg-gradient-to-br from-blue-500 to-purple-500">
        <div className="p-8 text-center">
            <Layers className="w-16 h-16 mx-auto mb-4 text-white/80" />
            <div className="font-mono text-sm bg-black/20 p-4 rounded-lg backdrop-blur-sm">
                Code Health: 98%
            </div>
        </div>
      </div>
    ),
  },
];

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white overflow-x-hidden selection:bg-white/20">
      
      <HeroSection />

      <ScrollShowcase />

      <section className="py-40 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <TextReveal>
            <p className="text-4xl md:text-6xl font-semibold leading-tight text-white">
              We believe in tools that disappear. <br />
              Focus on the code. <br />
              <span className="text-neutral-500">Let DevStream handle the rest.</span>
            </p>
          </TextReveal>
        </div>
      </section>

      <BentoGrid />

      <section className="py-32">
         <div className="max-w-7xl mx-auto px-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Workflow Engine</h2>
            <p className="text-xl text-neutral-400 max-w-2xl">
                The core of DevStream is built for speed and reliability.
            </p>
         </div>
         <StickyScroll content={stickyContent} />
      </section>

      <footer className="py-12 border-t border-white/10 text-center text-neutral-500 text-sm">
        <p>&copy; {new Date().getFullYear()} DevStream. Crafted for builders.</p>
      </footer>
    </main>
  );
}
