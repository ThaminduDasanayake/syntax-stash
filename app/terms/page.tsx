import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/terms" },
  description: `Terms of service, usage guidelines, open-source license, and legal disclaimers for ${siteConfig.name}.`,
};

export default function TermsOfServicePage() {
  const lastUpdated = "September 21, 2026";

  return (
    <div className="lib-page">
      {/* Header */}
      <header className="lib-header">
        <div className="section-inner">
          <h1 className="lib-headline">
            TERMS OF
            <br />
            <em>service.</em>
          </h1>
          <p className="lib-sub">
            Clear guidelines, intellectual property notices, and legal disclaimers governing your
            use of {siteConfig.name}.
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
                Agreement to Terms
              </h2>
            </div>
            <div className="space-y-3 pl-10 font-mono text-sm leading-relaxed text-muted-foreground">
              <p>
                By accessing, browsing, or utilizing <strong className="text-foreground">{siteConfig.name}</strong>,
                or by creating an account, submitting resources, or using our browser utilities, you
                agree to be bound by these Terms of Service.
              </p>
              <p>
                If you do not agree with any part of these terms, please discontinue using the
                platform.
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
                Acceptable Use & Community Guidelines
              </h2>
            </div>
            <div className="space-y-3 pl-10 font-mono text-sm leading-relaxed text-muted-foreground">
              <p>
                Syntax Stash is provided to foster developer productivity and open knowledge
                sharing. You agree not to use the service for:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Submitting fraudulent, deceptive, malicious, phishing, or scam links</li>
                <li>Distributing malware, spyware, viruses, or hazardous software</li>
                <li>Automated scraping, denial-of-service attempts, or overloading platform infrastructure</li>
                <li>Submitting content that infringes upon third-party copyrights or trademarks</li>
              </ul>
              <p className="mt-2">
                We reserve the right to review, reject, or remove any community submission or suspend
                accounts that violate these guidelines without prior notice.
              </p>
            </div>
          </div>

          {/* Section 03 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded font-mono text-xs font-bold">
                03
              </span>
              <h2 className="font-mono text-lg font-bold uppercase tracking-tight text-foreground">
                Third-Party Resources & External Links
              </h2>
            </div>
            <div className="space-y-3 pl-10 font-mono text-sm leading-relaxed text-muted-foreground">
              <p>
                Syntax Stash indexes and links to third-party tools, software libraries, GitHub
                repositories, and external websites:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  We do not own, operate, host, or control the external websites or tools listed in our
                  directory.
                </li>
                <li>
                  We do not make representations or warranties regarding the availability, safety,
                  accuracy, or licensing terms of external tools.
                </li>
                <li>
                  Following any third-party link is done solely at your own risk, subject to that
                  third party&apos;s own terms and privacy policies.
                </li>
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
                Browser Utilities & "As-Is" Disclaimer
              </h2>
            </div>
            <div className="space-y-3 pl-10 font-mono text-sm leading-relaxed text-muted-foreground">
              <p>
                Syntax Stash provides in-browser development tools (including formatters, converters,
                decoders, and schema generators) on an <strong>&ldquo;AS IS&rdquo;</strong> and{" "}
                <strong>&ldquo;AS AVAILABLE&rdquo;</strong> basis without warranties of any kind, either
                express or implied.
              </p>
              <p>
                While we strive for accuracy, we make no guarantees that tool calculations, code
                conversions, or generated schemas are error-free or suitable for production environments
                without independent verification.
              </p>
            </div>
          </div>

          {/* Section 05 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded font-mono text-xs font-bold">
                05
              </span>
              <h2 className="font-mono text-lg font-bold uppercase tracking-tight text-foreground">
                Intellectual Property & Trademarks
              </h2>
            </div>
            <div className="space-y-3 pl-10 font-mono text-sm leading-relaxed text-muted-foreground">
              <p>
                The Syntax Stash source code is open-source under the MIT license available on{" "}
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-foreground"
                >
                  GitHub
                </a>.
              </p>
              <p>
                All third-party product names, logos, brands, and registered trademarks displayed on
                Syntax Stash remain the property of their respective trademark holders. Their
                inclusion does not imply endorsement, affiliation, or sponsorship.
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
                Limitation of Liability
              </h2>
            </div>
            <div className="space-y-3 pl-10 font-mono text-sm leading-relaxed text-muted-foreground">
              <p>
                To the maximum extent permitted by applicable law, the maintainers and contributors
                of Syntax Stash shall not be liable for any direct, indirect, incidental, special,
                consequential, or exemplary damages resulting from:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Your access to, use of, or inability to access or use the service</li>
                <li>Any bugs, errors, or inaccuracies in tool conversions or resource listings</li>
                <li>Conduct, content, or availability of third-party websites linked on the service</li>
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
                Modifications to Terms
              </h2>
            </div>
            <div className="space-y-3 pl-10 font-mono text-sm leading-relaxed text-muted-foreground">
              <p>
                We may revise these Terms of Service periodically. When changes occur, we will
                update the &ldquo;Last Updated&rdquo; timestamp at the top of this page. Continued use
                of the platform constitutes acceptance of any modified terms.
              </p>
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
            href="/privacy"
            className="text-primary underline-offset-4 hover:underline"
          >
            Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
