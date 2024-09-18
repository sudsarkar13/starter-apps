"use client";

import RetroGrid from "@/components/magicui/retro-grid";

export default function RetroGridDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white md:shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
        Retro Grid
      </span>

      <RetroGrid />
    </div>
  );
}
