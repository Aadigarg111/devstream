"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[150vh] flex flex-col items-center justify-start overflow-hidden bg-black text-white">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-4 md:px-8">
        <motion.div style={{ y: titleY, opacity }} className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 100, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tight leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50"
          >
            The Ultimate <br /> Command Center.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            className="mt-8 text-xl md:text-2xl text-white/60 max-w-2xl mx-auto font-light"
          >
            GitHub stats, analytics, and AI tools unified into one pristine interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 flex justify-center"
          >
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full text-lg font-medium tracking-tight hover:scale-105 transition-transform duration-300"
            >
              Enter Command Center
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Abstract Background Gradient */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
            <div className="w-[80vw] h-[80vw] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
            <div className="absolute w-[60vw] h-[60vw] bg-purple-500/10 rounded-full blur-[100px] mix-blend-screen translate-x-20 animate-pulse-slower" />
        </div>
        
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 animate-bounce text-white/30"
        >
            <ChevronDown className="w-8 h-8" />
        </motion.div>
      </div>
    </section>
  );
}
