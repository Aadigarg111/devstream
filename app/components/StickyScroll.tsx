"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

const content = [
  {
    title: "Real-time Collaboration",
    description:
      "Work together with your team in real-time. Changes are synced instantly across all devices.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Collaboration Demo
      </div>
    ),
  },
  {
    title: "Version Control",
    description:
      "Experience seamless version control without the complexity. Branch, merge, and revert with ease.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        Version Control UI
      </div>
    ),
  },
  {
    title: "Running out of content",
    description:
      "We're running out of content here. Just kidding, there's always more to explore.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Version Control UI
      </div>
    ),
  },
];


export const StickyScroll = ({
    content,
    contentClassName,
  }: {
    content: {
      title: string;
      description: string;
      content?: React.ReactNode | any;
    }[];
    contentClassName?: string;
  }) => {
    const [activeCard, setActiveCard] = React.useState(0);
    const ref = useRef<any>(null);
    const { scrollYProgress } = useScroll({
      // target: ref,
      container: ref,
      offset: ["start start", "end start"],
    });
    const cardLength = content.length;
  
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
      const cardsBreakpoints = content.map((_, index) => index / cardLength);
      const closestBreakpointIndex = cardsBreakpoints.reduce(
        (acc, breakpoint, index) => {
          const distance = Math.abs(latest - breakpoint);
          if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
            return index;
          }
          return acc;
        },
        0
      );
      setActiveCard(closestBreakpointIndex);
    });
  
    const backgroundColors = [
      "#0f172a",
      "#000000",
      "#171717",
    ];
    const linearGradients = [
      "linear-gradient(to bottom right, #06b6d4, #10b981)",
      "linear-gradient(to bottom right, #ec4899, #6366f1)",
      "linear-gradient(to bottom right, #f97316, #eab308)",
    ];
  
    return (
      <motion.div
        animate={{
          backgroundColor: backgroundColors[activeCard % backgroundColors.length],
        }}
        className="h-[30rem] overflow-y-auto flex justify-center relative space-x-10 rounded-md p-10 no-scrollbar"
        ref={ref}
      >
        <div className="div relative flex items-start px-4">
          <div className="max-w-2xl">
            {content.map((item, index) => (
              <div key={item.title + index} className="my-20">
                <motion.h2
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                  }}
                  className="text-2xl font-bold text-slate-100"
                >
                  {item.title}
                </motion.h2>
                <motion.p
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                  }}
                  className="text-kg text-slate-300 max-w-sm mt-10"
                >
                  {item.description}
                </motion.p>
              </div>
            ))}
            <div className="h-40" />
          </div>
        </div>
        <motion.div
          animate={{
            background: linearGradients[activeCard % linearGradients.length],
          }}
          className={cn(
            "hidden lg:block h-60 w-80 rounded-md bg-white sticky top-10 overflow-hidden",
            contentClassName
          )}
        >
          {content[activeCard].content ?? null}
        </motion.div>
      </motion.div>
    );
  };
