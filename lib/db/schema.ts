import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

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
    resourceId: text("resource_id")
      .notNull()
      .references(() => resource.id, { onDelete: "cascade" }),
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

export const category = pgTable(
  "category",
  {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    description: text("description"),
    name: text("name").notNull().unique(),
    order: integer("order").notNull().default(0),
    slug: text("slug").notNull().unique(),
    themeColor: text("theme_color"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("category_order_idx").on(table.order),
    uniqueIndex("category_name_idx").on(table.name),
    uniqueIndex("category_slug_idx").on(table.slug),
  ],
);

export const tag = pgTable(
  "tag",
  {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    isFeatured: boolean("is_featured").notNull().default(false),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("tag_name_idx").on(table.name), uniqueIndex("tag_slug_idx").on(table.slug)],
);

export const resource = pgTable(
  "resource",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    authorId: text("author_id").references(() => author.id, { onDelete: "set null" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => category.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    description: text("description").notNull(),
    favicon: text("favicon"),
    github: text("github"),
    ogImage: text("og_image"),
    subtitle: text("subtitle"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    url: text("url").notNull().unique(),
  },
  (table) => [
    index("resource_author_id_idx").on(table.authorId),
    index("resource_category_id_idx").on(table.categoryId),
    index("resource_created_at_idx").on(table.createdAt),
    uniqueIndex("resource_url_idx").on(table.url),
  ],
);

export const resourceTag = pgTable(
  "resource_tag",
  {
    createdAt: timestamp("created_at").notNull().defaultNow(),
    resourceId: text("resource_id")
      .notNull()
      .references(() => resource.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("resource_tag_resource_id_idx").on(table.resourceId),
    index("resource_tag_tag_id_idx").on(table.tagId),
    primaryKey({ columns: [table.resourceId, table.tagId] }),
  ],
);

export const collection = pgTable(
  "collection",
  {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    description: text("description"),
    isPublic: boolean("is_public").notNull().default(false),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("collection_user_id_idx").on(table.userId),
    uniqueIndex("collection_user_slug_idx").on(table.userId, table.slug),
  ],
);

export const collectionItem = pgTable(
  "collection_item",
  {
    id: text("id").primaryKey(),
    addedAt: timestamp("added_at").notNull().defaultNow(),
    collectionId: text("collection_id")
      .notNull()
      .references(() => collection.id, { onDelete: "cascade" }),
    note: text("note"),
    order: integer("order").notNull().default(0),
    resourceId: text("resource_id")
      .notNull()
      .references(() => resource.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("collection_item_collection_id_idx").on(table.collectionId),
    uniqueIndex("collection_resource_unique_idx").on(table.collectionId, table.resourceId),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  bookmarks: many(bookmark),
  collections: many(collection),
}));

export const authorRelations = relations(author, ({ many }) => ({
  resources: many(resource),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  resources: many(resource),
}));

export const tagRelations = relations(tag, ({ many }) => ({
  resourceTags: many(resourceTag),
}));

export const resourceRelations = relations(resource, ({ many, one }) => ({
  author: one(author, {
    fields: [resource.authorId],
    references: [author.id],
  }),
  category: one(category, {
    fields: [resource.categoryId],
    references: [category.id],
  }),
  collectionItems: many(collectionItem),
  resourceTags: many(resourceTag),
}));

export const resourceTagRelations = relations(resourceTag, ({ one }) => ({
  resource: one(resource, {
    fields: [resourceTag.resourceId],
    references: [resource.id],
  }),
  tag: one(tag, {
    fields: [resourceTag.tagId],
    references: [tag.id],
  }),
}));

export const collectionRelations = relations(collection, ({ many, one }) => ({
  items: many(collectionItem),
  user: one(user, {
    fields: [collection.userId],
    references: [user.id],
  }),
}));

export const collectionItemRelations = relations(collectionItem, ({ one }) => ({
  collection: one(collection, {
    fields: [collectionItem.collectionId],
    references: [collection.id],
  }),
  resource: one(resource, {
    fields: [collectionItem.resourceId],
    references: [resource.id],
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
    categoryId: text("category_id").references(() => category.id, { onDelete: "set null" }),

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
    index("submission_category_id_idx").on(table.categoryId),
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
export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;
export type Tag = typeof tag.$inferSelect;
export type NewTag = typeof tag.$inferInsert;
export type ResourceTag = typeof resourceTag.$inferSelect;
export type NewResourceTag = typeof resourceTag.$inferInsert;
export type Collection = typeof collection.$inferSelect;
export type NewCollection = typeof collection.$inferInsert;
export type CollectionItem = typeof collectionItem.$inferSelect;
export type NewCollectionItem = typeof collectionItem.$inferInsert;
export type DbResource = typeof resource.$inferSelect;
export type NewDbResource = typeof resource.$inferInsert;
export type Submission = typeof submission.$inferSelect;
export type NewSubmission = typeof submission.$inferInsert;
