import { relations } from "drizzle-orm";
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

export const author = pgTable(
  "author",
  {
    id: text("id").primaryKey(),
    blog: text("blog"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    github: text("github"),
    linkedin: text("linkedin"),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    twitter: text("twitter"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    website: text("website"),
    youtube: text("youtube"),
  },
  (table) => [
    index("author_name_idx").on(table.name),
    uniqueIndex("author_slug_idx").on(table.slug),
  ],
);

export const resource = pgTable(
  "resource",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    authorId: text("author_id").references(() => author.id, { onDelete: "set null" }),
    category: text("category").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    description: text("description").notNull(),
    favicon: text("favicon"),
    github: text("github"),
    ogImage: text("og_image"),
    subtitle: text("subtitle"),
    tags: text("tags"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    url: text("url").notNull().unique(),
  },
  (table) => [
    index("resource_author_id_idx").on(table.authorId),
    index("resource_category_idx").on(table.category),
    index("resource_created_at_idx").on(table.createdAt),
    uniqueIndex("resource_url_idx").on(table.url),
  ],
);

export const authorRelations = relations(author, ({ many }) => ({
  resources: many(resource),
}));

export const resourceRelations = relations(resource, ({ one }) => ({
  author: one(author, {
    fields: [resource.authorId],
    references: [author.id],
  }),
}));

export const submission = pgTable(
  "submission",
  {
    id: text("id").primaryKey(),
    // Tool metadata
    title: text("title").notNull(),
    adminNotes: text("admin_notes"),
    author: text("author"),
    authorGitHub: text("author_github"),
    authorLinkedIn: text("author_linkedin"),
    authorTwitter: text("author_twitter"),
    authorWebsite: text("author_website"),
    authorYouTube: text("author_youtube"),
    category: text("category").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    description: text("description").notNull(),
    favicon: text("favicon"),
    github: text("github"),
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
export type Author = typeof author.$inferSelect;
export type NewAuthor = typeof author.$inferInsert;
export type DbResource = typeof resource.$inferSelect;
export type NewDbResource = typeof resource.$inferInsert;
export type Submission = typeof submission.$inferSelect;
export type NewSubmission = typeof submission.$inferInsert;
