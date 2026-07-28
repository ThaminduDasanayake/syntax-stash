export const siteConfig = {
  title: "syntax-stash — Curated Developer Tools & Resources",
  author: {
    email: "thamindudasanayake@gmail.com",
    github: "https://github.com/ThaminduDasanayake",
    name: "Thamindu Dasanayake",
  },
  backgroundColor: "#f5f1e5",
  description:
    "A curated, open-source stash of developer tools, utilities, generators, and resources for modern web development.",
  keywords: [
    "code snippets",
    "converters",
    "developer tools",
    "diff viewer",
    "formatters",
    "frontend utilities",
    "regex studio",
    "syntax stash",
    "web development",
  ],
  links: {
    authorGithub: "https://github.com/ThaminduDasanayake",
    email: "mailto:thamindudasanayake@gmail.com",
    github: "https://github.com/ThaminduDasanayake/syntax-stash",
  },
  name: "syntax-stash",
  ogImage: "https://syntax-stash.vercel.app/og.png",
  shortName: "SyntaxStash",
  themeColor: "#14110b",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://syntax-stash.vercel.app",
} as const;

export type SiteConfig = typeof siteConfig;
