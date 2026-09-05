import type { Metadata } from "next";

import { SubmitForm } from "@/app/submit/submit-form";

export const metadata: Metadata = {
  title: "Submit a Resource — Syntax Stash",
  description:
    "Submit a developer tool, design resource, generator, or UI library to be featured in the curated Syntax Stash directory.",
};

export default function SubmitPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="border-line/60 mb-10 border-b pb-8 font-mono">
        <div className="text-primary flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
          <span className="bg-primary size-2 rounded-full" />
          <span>Community Submissions</span>
        </div>
        <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight uppercase sm:text-4xl">
          Submit a Resource
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-xs leading-relaxed sm:text-sm">
          Have a developer tool, design utility, color generator, or UI library you want to share?
          Submit it below. Every submission is reviewed by a moderator before joining the public
          stash.
        </p>
      </div>

      {/* Main Submission Form & Preview */}
      <SubmitForm />
    </div>
  );
}
