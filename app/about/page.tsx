import { ArrowUpRightIcon, GithubLogo } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="border-border bg-background border-b-2 px-6 py-24 sm:px-12 lg:px-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
          <div className="hero-eyebrow mb-8">
            <HeroEyebrowDots />
            THE STORY BEHIND THE STASH
          </div>
          <h1 className="hero-headline mb-8">
            CURATED FOR
            <br />
            <em>developers</em>.
          </h1>
          <p className="hero-sub mx-auto mb-4 max-w-2xl text-center">
            Syntax Stash is a distraction-free, open-source toolbelt for modern web development. It
            was built to solve the fragmentation of finding good tools and resources in a rapidly
            evolving ecosystem.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="border-border bg-background border-b-2 px-6 py-24 sm:px-12 lg:px-24">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <h2 className="flex flex-col gap-0 text-6xl tracking-tighter sm:text-7xl">
              <span className="font-display font-black uppercase">THE</span>
              <span className="font-serif tracking-normal lowercase italic">philosophy</span>
              <span className="font-display font-black uppercase">BEHIND IT.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-12 font-mono text-sm leading-relaxed opacity-90">
            <div className="flex gap-6">
              <span className="font-bold">01</span>
              <p>
                <strong>Signal over noise.</strong> There are millions of developer tools, but most
                are cluttered with ads, popups, or unnecessary complexity. This stash curates only
                the absolute best, most efficient utilities.
              </p>
            </div>
            <div className="border-border/50 flex gap-6 border-t-2 pt-12">
              <span className="font-bold">02</span>
              <p>
                <strong>Built for speed.</strong> When you need a JWT decoded or a CSS gradient
                generated, you need it now. The inbuilt tools run locally in your browser wherever
                possible, ensuring zero latency and maximum privacy.
              </p>
            </div>
            <div className="border-border/50 flex gap-6 border-t-2 pt-12">
              <span className="font-bold">03</span>
              <p>
                <strong>100% Open Source.</strong> The internet was built on open knowledge. The
                entire source code for Syntax Stash, along with its curated database of resources,
                is completely open for anyone to explore, fork, or contribute to.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Creator & Links Section */}
      <section className="bg-background px-6 py-24 pb-32 sm:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <h2 className="flex flex-col gap-0 text-5xl tracking-tighter sm:text-6xl">
              <span className="font-display font-black uppercase">BUILT BY</span>
              <span className="font-serif text-5xl tracking-normal lowercase italic">
                Thamindu Dasanayake
              </span>
            </h2>
            <p className="max-w-xs font-mono text-sm opacity-80 md:text-right">
              Have a tool or resource that belongs in the stash? Feel free to submit a pull request!
            </p>
          </div>

          <div className="border-border flex flex-col gap-4 border-t-2 pt-8 sm:flex-row">
            <Button asChild size="lg" variant="default">
              <Link
                href="https://github.com/ThaminduDasanayake/syntax-stash"
                target="_blank"
                className="text-display-sm"
              >
                VIEW ON GITHUB <GithubLogo weight="bold" className="ml-2 size-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="mailto:thamindudasanayake@gmail.com" className="text-display-sm">
                CONTACT ME <ArrowUpRightIcon weight="bold" className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
