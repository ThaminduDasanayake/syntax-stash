import { ArrowLeftIcon, ArticleIcon, GlobeIcon, XLogoIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FilterSection } from "@/components/filter-section";
import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { Button } from "@/components/ui/button";
import { getAllAuthors, getAuthorBySlug } from "@/lib/authors";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllAuthors().map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const authorData = getAuthorBySlug(slug);
  if (!authorData) return {};

  return {
    title: `${authorData.name} — Author`,
    alternates: { canonical: `/authors/${slug}` },
    description: `Explore ${authorData.count} curated developer resources and tools created by ${authorData.name} on Syntax Stash.`,
    openGraph: {
      title: `${authorData.name} — Syntax Stash`,
      description: `Explore ${authorData.count} curated developer resources and tools created by ${authorData.name} on Syntax Stash.`,
      url: `/authors/${slug}`,
    },
  };
}

export default async function AuthorPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const authorData = getAuthorBySlug(slug);

  if (!authorData) notFound();

  const { categories, count, links, name, resources } = authorData;

  const SOCIAL_LINKS = [
    { href: links?.blog, icon: <ArticleIcon className="size-3.5" />, key: "blog", label: "Blog" },
    {
      href: links?.github,
      icon: (
        <Image
          src="/github.svg"
          alt="GitHub"
          width={14}
          height={14}
          className="size-3.5 dark:invert"
        />
      ),
      key: "github",
      label: "GitHub",
    },
    {
      href: links?.linkedin,
      icon: (
        <Image src="/linkedin.svg" alt="LinkedIn" width={14} height={14} className="size-3.5" />
      ),
      key: "linkedin",
      label: "LinkedIn",
    },
    {
      href: links?.twitter,
      icon: <XLogoIcon weight="bold" className="size-3.5" />,
      key: "twitter",
      label: "X / Twitter",
    },
    {
      href: links?.website,
      icon: <GlobeIcon className="size-3.5" />,
      key: "website",
      label: "Website",
    },
    {
      href: links?.youtube,
      icon: <Image src="/youtube.svg" alt="YouTube" width={14} height={14} className="size-3.5" />,
      key: "youtube",
      label: "YouTube",
    },
  ];

  return (
    <div className="lib-page">
      {/* Header */}
      <header className="lib-header">
        <div className="section-inner">
          <div className="mb-4">
            <Link
              href="/authors"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase opacity-70 transition-opacity hover:opacity-100"
            >
              <ArrowLeftIcon className="size-3.5" /> All Authors
            </Link>
          </div>

          <div className="hero-eyebrow">
            <HeroEyebrowDots />
          </div>

          <div className="flex w-full flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="lib-headline">{name}</h1>
              <p className="lib-sub mb-3">
                {count} curated resource{count === 1 ? "" : "s"} created or maintained by {name}.
              </p>
            </div>

            {/* External Links */}
            {links && Object.values(links).some(Boolean) && (
              <div className="mb-6 flex flex-wrap items-center gap-1.5">
                {SOCIAL_LINKS.filter((item) => Boolean(item.href)).map(
                  ({ href, icon, key, label }) => (
                    <Button
                      key={key}
                      size="icon"
                      variant="ghost"
                      asChild
                      className="border-border/50 bg-secondary/30 text-muted-foreground hover:border-border hover:bg-secondary hover:text-foreground size-8 rounded-lg border transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                        {icon}
                      </a>
                    </Button>
                  ),
                )}
              </div>
            )}

            {/*{links && Object.values(links).some(Boolean) && (*/}
            {/*  <div className="mb-6 flex flex-wrap items-center gap-2">*/}
            {/*    {links.website && (*/}
            {/*      <Button size="icon">*/}
            {/*        <a*/}
            {/*          href={links.website}*/}
            {/*          target="_blank"*/}
            {/*          rel="noopener noreferrer"*/}
            {/*          // className="border-ink/30 bg-background hover:bg-ink hover:text-paper inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors"*/}
            {/*        >*/}
            {/*          <GlobeIcon className="size-3.5" />*/}
            {/*        </a>*/}
            {/*      </Button>*/}
            {/*    )}*/}
            {/*    {links.github && (*/}
            {/*      <Button size="icon" className="group">*/}
            {/*        <a*/}
            {/*          href={links.github}*/}
            {/*          target="_blank"*/}
            {/*          rel="noopener noreferrer"*/}
            {/*          // className="border-ink/30 bg-background hover:bg-ink hover:text-paper inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors"*/}
            {/*        >*/}
            {/*          <Image*/}
            {/*            src="/github.svg"*/}
            {/*            alt="GitHub"*/}
            {/*            width={14}*/}
            {/*            height={14}*/}
            {/*            className="size-3.5 invert group-hover:invert-0"*/}
            {/*          />*/}
            {/*          /!*<GithubLogoIcon weight="fill" className="size-3.5" />*!/*/}
            {/*        </a>*/}
            {/*      </Button>*/}
            {/*    )}*/}
            {/*    {links.twitter && (*/}
            {/*      <Button size="icon">*/}
            {/*        <a*/}
            {/*          href={links.twitter}*/}
            {/*          target="_blank"*/}
            {/*          rel="noopener noreferrer"*/}
            {/*          // className="border-ink/30 bg-background hover:bg-ink hover:text-paper inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors"*/}
            {/*        >*/}
            {/*          <XLogoIcon weight="bold" className="size-3.5" />*/}
            {/*        </a>*/}
            {/*      </Button>*/}
            {/*    )}*/}
            {/*    {links.blog && (*/}
            {/*      <Button size="icon">*/}
            {/*        <a*/}
            {/*          href={links.blog}*/}
            {/*          target="_blank"*/}
            {/*          rel="noopener noreferrer"*/}
            {/*          className="border-ink/30 bg-background hover:bg-ink hover:text-paper inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors"*/}
            {/*        >*/}
            {/*          <ArticleIcon className="size-3.5" />*/}
            {/*        </a>*/}
            {/*      </Button>*/}
            {/*    )}*/}
            {/*    {links.linkedin && (*/}
            {/*      <Button size="icon">*/}
            {/*        <a*/}
            {/*          href={links.linkedin}*/}
            {/*          target="_blank"*/}
            {/*          rel="noopener noreferrer"*/}
            {/*          // className="border-ink/30 bg-background hover:bg-ink hover:text-paper inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors"*/}
            {/*        >*/}
            {/*          <Image*/}
            {/*            src="/linkedin.svg"*/}
            {/*            alt="LinkedIn"*/}
            {/*            width={14}*/}
            {/*            height={14}*/}
            {/*            className="size-3.5"*/}
            {/*          />*/}
            {/*          /!*<LinkedinLogoIcon weight="fill" className="size-3.5" />*!/*/}
            {/*        </a>*/}
            {/*      </Button>*/}
            {/*    )}*/}
            {/*    {links.youtube && (*/}
            {/*      <Button size="icon">*/}
            {/*        <a*/}
            {/*          href={links.youtube}*/}
            {/*          target="_blank"*/}
            {/*          rel="noopener noreferrer"*/}
            {/*          // className="border-ink/30 bg-background hover:bg-ink hover:text-paper inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors"*/}
            {/*        >*/}
            {/*          <Image*/}
            {/*            src="/youtube.svg"*/}
            {/*            alt="YouTube"*/}
            {/*            width={14}*/}
            {/*            height={14}*/}
            {/*            className="size-3.5"*/}
            {/*          />*/}
            {/*          /!*<YoutubeLogoIcon weight="fill" className="size-3.5" />*!/*/}
            {/*        </a>*/}
            {/*      </Button>*/}
            {/*    )}*/}
            {/*  </div>*/}
            {/*)}*/}
          </div>
        </div>
      </header>

      {/* Grid Filter Section */}
      <FilterSection
        categories={categories}
        items={resources}
        itemLabel={`Resources`}
        searchPlaceholder={`Search resources ...`}
      />
    </div>
  );
}
