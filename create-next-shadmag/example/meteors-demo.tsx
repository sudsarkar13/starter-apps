import Meteors from "@/components/magicui/meteors";

export default function MeteorDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white md:shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
      <Meteors number={30} />
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Meteors
      </span>
    </div>
  );
}
