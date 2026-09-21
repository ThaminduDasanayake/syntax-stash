import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
  description: `Learn how ${siteConfig.name} handles user data, authentication, cookies, and privacy with transparency.`,
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 21, 2026";

  return (
    <div className="lib-page">
      {/* Header */}
      <header className="lib-header">
        <div className="section-inner">
          <h1 className="lib-headline">
            PRIVACY
            <br />
            <em>policy.</em>
          </h1>
          <p className="lib-sub">
            Transparency is fundamental. Learn what data {siteConfig.name} collects, how it is
            used, and why we prioritize your privacy.
          </p>
          <div className="mt-6 flex items-center gap-2 font-mono text-xs font-bold text-muted-foreground uppercase">
            <span>Last Updated:</span>
            <span className="text-foreground">{lastUpdated}</span>
          </div>
        </div>
      </header>

      {/* Content Body */}
      <section className="border-border bg-background border-b-2 px-6 py-16 sm:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl space-y-16">
          {/* Section 01 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded font-mono text-xs font-bold">
                01
              </span>
              <h2 className="font-mono text-lg font-bold uppercase tracking-tight text-foreground">
                Overview & Core Principles
              </h2>
            </div>
            <div className="space-y-3 pl-10 font-mono text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">{siteConfig.name}</strong> is an open-source,
                community-driven directory of developer tools, resources, and client-side utilities.
                We believe in zero surveillance, no hidden trackers, and minimal data collection.
              </p>
              <p>
                We do not sell, rent, monetize, or trade your personal information to data brokers,
                advertisers, or third-party marketing networks.
              </p>
            </div>
          </div>

          {/* Section 02 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded font-mono text-xs font-bold">
                02
              </span>
              <h2 className="font-mono text-lg font-bold uppercase tracking-tight text-foreground">
                Information We Collect
              </h2>
            </div>
            <div className="space-y-4 pl-10 font-mono text-sm leading-relaxed text-muted-foreground">
              <div>
                <h3 className="font-bold text-foreground">A. Account & Authentication Data</h3>
                <p className="mt-1">
                  When you sign in to Syntax Stash using Google OAuth, GitHub OAuth, or
                  Email/Password, we receive basic identity information from the authentication
                  provider:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Your name or username</li>
                  <li>Your email address</li>
                  <li>Your public avatar / profile picture URL</li>
                  <li>A unique OAuth provider identifier</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground">B. User-Generated Contributions</h3>
                <p className="mt-1">
                  When you interact with the platform, we store data you intentionally create:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Saved bookmarks in your personal stash</li>
                  <li>Tool and resource submissions (titles, descriptions, URLs, tags, author details)</li>
                  <li>Review logs and submission status for contributor submissions</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground">C. In-Browser Tool Utilities</h3>
                <p className="mt-1">
                  Many utilities on Syntax Stash (such as JWT Decoder, Hash Generator, Regex Studio,
                  CSS Converter) execute <strong>entirely inside your browser (client-side)</strong>.
                  The inputs you enter into these tools are processed locally in your browser memory
                  and are never transmitted to or logged on our servers.
                </p>
              </div>
            </div>
          </div>

          {/* Section 03 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded font-mono text-xs font-bold">
                03
              </span>
              <h2 className="font-mono text-lg font-bold uppercase tracking-tight text-foreground">
                How We Use Your Data
              </h2>
            </div>
            <div className="space-y-3 pl-10 font-mono text-sm leading-relaxed text-muted-foreground">
              <p>We use the data collected strictly for the following purposes:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>To authenticate your identity and maintain your active session</li>
                <li>To synchronize your bookmarked resources across devices</li>
                <li>To attribute and process submitted developer resources</li>
                <li>To prevent abuse, spam submissions, and security vulnerabilities</li>
              </ul>
            </div>
          </div>

          {/* Section 04 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded font-mono text-xs font-bold">
                04
              </span>
              <h2 className="font-mono text-lg font-bold uppercase tracking-tight text-foreground">
                Third-Party Infrastructure & Processors
              </h2>
            </div>
            <div className="space-y-3 pl-10 font-mono text-sm leading-relaxed text-muted-foreground">
              <p>
                To provide high-availability hosting and reliable cloud storage, we work with
                trusted technical infrastructure providers:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  <strong className="text-foreground">Vercel:</strong> Edge hosting, serverless
                  compute, and content delivery network (CDN).
                </li>
                <li>
                  <strong className="text-foreground">Neon:</strong> Serverless PostgreSQL database
                  for storing structured resource and account records.
                </li>
                <li>
                  <strong className="text-foreground">Cloudinary:</strong> Media asset hosting and
                  optimization for community screenshot uploads.
                </li>
                <li>
                  <strong className="text-foreground">GitHub / Google OAuth:</strong> Identity
                  verification and single sign-on authentication.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 05 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded font-mono text-xs font-bold">
                05
              </span>
              <h2 className="font-mono text-lg font-bold uppercase tracking-tight text-foreground">
                Cookies & Local Storage
              </h2>
            </div>
            <div className="space-y-3 pl-10 font-mono text-sm leading-relaxed text-muted-foreground">
              <p>
                We use strictly essential cookies and browser local storage necessary for the
                application to function:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong className="text-foreground">Session Cookies:</strong> Secure HTTP-only
                  cookies managed by Better-Auth to keep you signed in.
                </li>
                <li>
                  <strong className="text-foreground">Local Storage:</strong> Storing user UI
                  preferences, local draft inputs, and cached client bookmarks.
                </li>
              </ul>
              <p className="mt-2">
                We do not use third-party advertising cookies or cross-site tracking beacons.
              </p>
            </div>
          </div>

          {/* Section 06 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded font-mono text-xs font-bold">
                06
              </span>
              <h2 className="font-mono text-lg font-bold uppercase tracking-tight text-foreground">
                Your Rights & Data Deletion
              </h2>
            </div>
            <div className="space-y-3 pl-10 font-mono text-sm leading-relaxed text-muted-foreground">
              <p>
                Under global privacy laws (including GDPR and CCPA), you have full control over your
                personal data:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>You can access, view, or export your saved bookmarks and submitted resources at any time.</li>
                <li>You can request complete deletion of your user account and associated personal data.</li>
                <li>
                  To request account deletion or data removal, please contact us at{" "}
                  <a
                    href={`mailto:${siteConfig.author.email}`}
                    className="text-primary underline hover:text-foreground"
                  >
                    {siteConfig.author.email}
                  </a>{" "}
                  or open an issue on{" "}
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-foreground"
                  >
                    GitHub
                  </a>.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 07 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded font-mono text-xs font-bold">
                07
              </span>
              <h2 className="font-mono text-lg font-bold uppercase tracking-tight text-foreground">
                Contact Information
              </h2>
            </div>
            <div className="space-y-3 pl-10 font-mono text-sm leading-relaxed text-muted-foreground">
              <p>
                If you have questions, concerns, or feedback regarding this Privacy Policy, please
                reach out:
              </p>
              <div className="border-border bg-card inline-flex flex-col gap-1 border-2 p-4 font-mono text-xs">
                <span className="font-bold text-foreground">{siteConfig.name}</span>
                <span>Maintainer: {siteConfig.author.name}</span>
                <span>
                  Email:{" "}
                  <a
                    href={`mailto:${siteConfig.author.email}`}
                    className="text-primary underline hover:text-foreground"
                  >
                    {siteConfig.author.email}
                  </a>
                </span>
                <span>
                  Repository:{" "}
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-foreground"
                  >
                    {siteConfig.links.github}
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="border-border bg-card/40 border-b-2 px-6 py-8 sm:px-12 lg:px-24">
        <div className="mx-auto flex max-w-4xl items-center justify-between font-mono text-xs font-bold uppercase">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to Home
          </Link>
          <Link
            href="/terms"
            className="text-primary underline-offset-4 hover:underline"
          >
            Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
