"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
}

export const TextReveal = ({ children, className }: TextRevealProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, 20]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <motion.div
      ref={targetRef}
      style={{ opacity, filter: `blur(${blur}px)`, scale }}
      className={cn("transition-all duration-300", className)}
    >
      {children}
    </motion.div>
  );
};
