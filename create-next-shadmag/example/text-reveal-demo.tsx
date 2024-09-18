import TextReveal from "@/components/magicui/text-reveal";

export default async function TextRevealDemo() {
  return (
    <div className="z-10 flex min-h-[16rem] items-center justify-center rounded-lg border border-neutral-200 bg-white dark:bg-black dark:border-neutral-800">
      <TextReveal text="Magic UI will change the way you design." />
    </div>
  );
}
