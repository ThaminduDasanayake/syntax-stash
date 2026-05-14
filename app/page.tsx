import { HomeTabs } from "@/components/home-tabs";

export default function Home() {
  return (
    <div className="hacker-grid mx-auto flex w-full max-w-7xl flex-col p-6">
      <div className="bg-card border-border mb-8 flex w-full shrink-0 flex-col items-center justify-center space-y-4 rounded-xl border p-8 text-center">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight">
          syntax<span className="text-primary">-</span>stash
        </h1>
        <p className="text-muted-foreground text-sm">
          A curated command center for modern web development.
        </p>
        <p className="text-muted-foreground mt-4 font-mono text-xs">
          Built with Next.js · handmade, no tracking.
        </p>
      </div>

      {/* Tabs */}
      <HomeTabs />
    </div>
  );
}
