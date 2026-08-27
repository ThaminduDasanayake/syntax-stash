import { boolean, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

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

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Bookmark = typeof bookmark.$inferSelect;
export type NewBookmark = typeof bookmark.$inferInsert;
