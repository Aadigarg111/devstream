"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { Code2, GitGraph, Sparkles, Terminal, Activity, Cloud } from "lucide-react";
import React, { useRef } from "react";

interface BentoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
}

const BentoCard = ({ title, description, icon, className, delay = 0 }: BentoCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl p-8",
        "bg-neutral-900/50 backdrop-blur-2xl border border-white/10 shadow-2xl hover:shadow-white/5 transition-all duration-500",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white shadow-inner group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div className="relative z-10 mt-8">
        <h3 className="text-2xl font-medium text-white tracking-tight">{title}</h3>
        <p className="mt-2 text-neutral-400 font-light leading-relaxed">{description}</p>
      </div>
      
      {/* Gloss Effect */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
    </motion.div>
  );
};

export function BentoGrid() {
  return (
    <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 tracking-tight"
        >
            Supercharged Workflow.
        </motion.h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
        <BentoCard
          title="GitHub Intelligence"
          description="Deep dive into your contribution graphs, PR velocity, and code review metrics."
          icon={<GitGraph className="w-6 h-6" />}
          className="md:col-span-2 md:row-span-1 bg-gradient-to-br from-neutral-900 to-neutral-950"
          delay={0.1}
        />
        <BentoCard
          title="AI Assistant"
          description="Context-aware coding help powered by advanced LLMs."
          icon={<Sparkles className="w-6 h-6" />}
          className="md:col-span-1 md:row-span-1 bg-neutral-900"
          delay={0.2}
        />
        <BentoCard
          title="Terminal Sync"
          description="Seamlessly sync your local terminal history and aliases."
          icon={<Terminal className="w-6 h-6" />}
          className="md:col-span-1 md:row-span-1 bg-neutral-900"
          delay={0.3}
        />
        <BentoCard
          title="Performance Monitoring"
          description="Real-time metrics on your application's health and speed."
          icon={<Activity className="w-6 h-6" />}
          className="md:col-span-2 md:row-span-1 bg-gradient-to-bl from-neutral-900 to-neutral-950"
          delay={0.4}
        />
         <BentoCard
          title="Cloud Deployments"
          description="One-click deployments to Vercel, AWS, or custom servers."
          icon={<Cloud className="w-6 h-6" />}
          className="md:col-span-3 md:row-span-1 bg-neutral-900"
          delay={0.5}
        />
      </div>
    </section>
  );
}
