"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function ScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.3], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section ref={containerRef} className="py-24 px-4 relative perspective-1000">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 tracking-tight mb-4"
        >
          Your Command Center
        </motion.h2>
        <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-neutral-400"
        >
            Everything you need, right at your fingertips.
        </motion.p>
      </div>

      <motion.div
        style={{ rotateX, scale, opacity }}
        className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-neutral-900/50 p-4 shadow-2xl backdrop-blur-md"
      >
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-neutral-950 relative border border-white/5">
             {/* Mock UI */}
             <div className="absolute top-0 left-0 right-0 h-12 bg-neutral-900 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
             </div>
             <div className="mt-12 p-8 grid grid-cols-3 gap-8">
                <div className="col-span-2 h-64 bg-neutral-900/50 rounded-lg animate-pulse" />
                <div className="col-span-1 h-64 bg-neutral-900/50 rounded-lg animate-pulse delay-75" />
                <div className="col-span-1 h-40 bg-neutral-900/50 rounded-lg animate-pulse delay-100" />
                <div className="col-span-2 h-40 bg-neutral-900/50 rounded-lg animate-pulse delay-150" />
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </section>
  );
}
