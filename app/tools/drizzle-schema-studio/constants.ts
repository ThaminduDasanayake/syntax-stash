export const PG_TYPE_MAP: Record<string, string> = {
  BigInt: "bigint",
  Boolean: "boolean",
  Bytes: "bytea",
  DateTime: "timestamp",
  Decimal: "decimal",
  Float: "doublePrecision",
  Int: "integer",
  Json: "jsonb",
  String: "text",
};

export const SQLITE_TYPE_MAP: Record<string, string> = {
  BigInt: "integer",
  Boolean: "integer",
  Bytes: "blob",
  DateTime: "text",
  Decimal: "real",
  Float: "real",
  Int: "integer",
  Json: "text",
  String: "text",
};

export const SQL_SAMPLE = `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

export const PRISMA_SAMPLE = `model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
}`;
