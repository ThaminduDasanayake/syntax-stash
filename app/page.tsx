import { PlusIcon } from "@phosphor-icons/react/ssr";

import { HomeTabs } from "@/components/home-tabs";

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      {/* Brutalist Hero Section */}
      <div className="border-border bg-primary text-primary-foreground relative w-full border-b-2 px-6 py-20 sm:px-12 lg:px-24">
        {/* Corner Accents */}
        <div className="absolute top-6 left-6 font-mono text-xs font-bold tracking-widest">
          {"// HANDMADE"}
          <br />
          {"// NO TRACKING"}
        </div>
        <div className="absolute top-6 right-6 flex items-center font-mono text-xs font-bold tracking-widest">
          V1.0.0
        </div>

        {/* Main Typography */}
        <div className="mx-auto mt-12 max-w-7xl">
          <h1 className="text-6xl font-extrabold tracking-tighter sm:text-7xl lg:text-8xl">
            Syntax<span className="opacity-60">.</span>
            <br />
            Stash<span className="opacity-60">_</span>
          </h1>
          <p className="mt-6 max-w-xl font-mono text-sm leading-relaxed tracking-wider uppercase opacity-80">
            A curated command center for modern web development. <br />
            Tools and resources built to scale.
          </p>
        </div>

        {/* Decorative Bottom Bar */}
        <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between font-mono font-bold">
          <PlusIcon weight="bold" />
          <div className="mx-4 h-3 flex-1 bg-[repeating-linear-gradient(60deg,currentColor,currentColor_1.5px,transparent_1.5px,transparent_8px)]" />
          <PlusIcon weight="bold" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-12">
        <HomeTabs />
      </div>
    </div>
  );
}
