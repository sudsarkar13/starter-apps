import FlickeringGrid from "@/components/magicui/flickering-grid"; // Fixed the import path casing

export default function FlickeringGridRoundedDemo() {
  return (
    <div className="relative size-[600px] rounded-lg w-full bg-white overflow-hidden border dark:bg-neutral-950">
      <FlickeringGrid
        className="z-0 absolute inset-0 [mask:radial-gradient(circle_at_center,#fff_300px,transparent_0)]"
        squareSize={4}
        gridGap={6}
        color="#60A5FA"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={800}
        width={800}
      />
    </div>
  );
}
