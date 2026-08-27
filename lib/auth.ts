import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      account: schema.account,
      session: schema.session,
      user: schema.user,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "syntax-stash-default-development-secret-key-32chars",
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "github-placeholder-client-id",
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET || "github-placeholder-client-secret",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "google-placeholder-client-id",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "google-placeholder-client-secret",
    },
  },
});
