import { boolean, index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  name: text("name").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  token: text("token").notNull().unique(),
  updatedAt: timestamp("updated_at").notNull(),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accessToken: text("access_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  accountId: text("account_id").notNull(),
  createdAt: timestamp("created_at").notNull(),
  idToken: text("id_token"),
  issuer: text("issuer"),
  password: text("password"),
  providerId: text("provider_id").notNull(),
  refreshToken: text("refresh_token"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  updatedAt: timestamp("updated_at").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at"),
  expiresAt: timestamp("expires_at").notNull(),
  identifier: text("identifier").notNull(),
  updatedAt: timestamp("updated_at"),
  value: text("value").notNull(),
});

export const bookmark = pgTable(
  "bookmark",
  {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    resourceId: text("resource_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("user_resource_idx").on(table.userId, table.resourceId)],
);

export const submission = pgTable(
  "submission",
  {
    id: text("id").primaryKey(),
    // Tool metadata
    title: text("title").notNull(),
    adminNotes: text("admin_notes"),
    author: text("author"),
    authorLink: text("author_link"),
    category: text("category").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    description: text("description").notNull(),
    favicon: text("favicon"),
    gitHubLink: text("github_link"),
    notes: text("notes"),
    ogImage: text("og_image"),
    pricing: text("pricing").default("Free"),
    reviewedAt: timestamp("reviewed_at"),
    // Status & Moderation
    status: text("status").notNull().default("pending"), // 'pending' | 'approved' | 'rejected'
    submitterEmail: text("submitter_email"),
    submitterName: text("submitter_name"),
    subtitle: text("subtitle"),
    tags: text("tags"),

    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    url: text("url").notNull(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  },
  (table) => [
    index("submission_created_at_idx").on(table.createdAt),
    index("submission_status_idx").on(table.status),
  ],
);

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Bookmark = typeof bookmark.$inferSelect;
export type NewBookmark = typeof bookmark.$inferInsert;
export type Submission = typeof submission.$inferSelect;
export type NewSubmission = typeof submission.$inferInsert;
