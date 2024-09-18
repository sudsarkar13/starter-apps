import ShineBorder from "@/components/magicui/shine-border";

export default function ShineBorderDemo() {
  return (
    <ShineBorder
      className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white md:shadow-xl dark:border-neutral-800 dark:bg-neutral-950"
      color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
    >
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Shine Border
      </span>
    </ShineBorder>
  );
}
