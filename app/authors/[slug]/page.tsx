import {
  ArrowLeftIcon,
  ArrowSquareOutIcon,
  ArticleIcon,
  GithubLogoIcon,
  GlobeIcon,
  LinkedinLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FilterSection } from "@/components/filter-section";
import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
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
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {links.website && (
                  <a
                    href={links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-ink/30 bg-background hover:bg-ink hover:text-paper inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors"
                  >
                    <GlobeIcon className="size-3.5" />
                    Website
                    <ArrowSquareOutIcon className="size-3 opacity-60" />
                  </a>
                )}
                {links.github && (
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-ink/30 bg-background hover:bg-ink hover:text-paper inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors"
                  >
                    <GithubLogoIcon weight="fill" className="size-3.5" />
                    GitHub
                    <ArrowSquareOutIcon className="size-3 opacity-60" />
                  </a>
                )}
                {links.twitter && (
                  <a
                    href={links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-ink/30 bg-background hover:bg-ink hover:text-paper inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors"
                  >
                    <XLogoIcon weight="bold" className="size-3.5" />
                    Twitter / X
                    <ArrowSquareOutIcon className="size-3 opacity-60" />
                  </a>
                )}
                {links.blog && (
                  <a
                    href={links.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-ink/30 bg-background hover:bg-ink hover:text-paper inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors"
                  >
                    <ArticleIcon className="size-3.5" />
                    Blog
                    <ArrowSquareOutIcon className="size-3 opacity-60" />
                  </a>
                )}
                {links.linkedin && (
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-ink/30 bg-background hover:bg-ink hover:text-paper inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors"
                  >
                    <LinkedinLogoIcon weight="fill" className="size-3.5" />
                    LinkedIn
                    <ArrowSquareOutIcon className="size-3 opacity-60" />
                  </a>
                )}
              </div>
            )}
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
