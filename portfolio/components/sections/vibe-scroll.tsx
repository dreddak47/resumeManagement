"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { vibeBeats } from "@/content/about";

function Beat({
  progress,
  index,
  total,
  text,
  proof,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  text: string;
  proof?: string;
}) {
  const start = index / total;
  const mid = (index + 0.45) / total;
  const end = (index + 1) / total;
  const isLast = index === total - 1;

  const opacity = isLast
    ? useTransform(progress, [start, mid], [0, 1])
    : useTransform(progress, [start, mid, end], [0, 1, 0]);
  const y = isLast
    ? useTransform(progress, [start, mid], [28, 0])
    : useTransform(progress, [start, mid, end], [28, 0, -28]);
  const scale = isLast
    ? useTransform(progress, [start, mid], [0.96, 1])
    : useTransform(progress, [start, mid, end], [0.96, 1, 1.02]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
    >
      <p className="font-display max-w-3xl text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl">
        {text}
      </p>
      {proof && (
        <p className="mt-5 inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent-soft">
          {proof}
        </p>
      )}
    </motion.div>
  );
}

export function VibeScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const total = vibeBeats.length;
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${total * 62}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-border/40">
          <motion.div
            style={{ width: progressBarWidth }}
            className="h-full bg-accent"
          />
        </div>

        <p className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-[0.25em] text-muted">
          Scroll
        </p>

        <div className="relative h-[40vh] sm:h-[36vh]">
          {vibeBeats.map((beat, i) => (
            <Beat
              key={beat.text}
              progress={scrollYProgress}
              index={i}
              total={total}
              text={beat.text}
              proof={beat.proof}
            />
          ))}
        </div>

        <a
          href="#about"
          className="pointer-events-auto absolute bottom-10 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent-soft"
        >
          keep scrolling ↓
        </a>
      </div>
    </section>
  );
}
