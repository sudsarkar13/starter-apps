import Ripple from "@/components/magicui/ripple";

export default function RippleDemo() {
	return (
		<div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white md:shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
			<p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-white">
				Ripple
			</p>
			<Ripple />
		</div>
	);
}
