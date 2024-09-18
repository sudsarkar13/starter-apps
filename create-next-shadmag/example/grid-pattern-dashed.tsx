"use client";

import { cn } from "@/lib/utils";
import GridPattern from "@/components/magicui/grid-pattern";

const GridPatternDashed = () => {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white p-20 md:shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
      <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
        Grid Pattern
      </p>
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        )}
      />
    </div>
  );
};

export default GridPatternDashed;
