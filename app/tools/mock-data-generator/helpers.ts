import { useMemo, useState } from "react";

import {
  CITIES,
  DOMAINS,
  FIRST_NAMES,
  LAST_NAMES,
  POST_TITLES,
  POST_TOPICS,
  PRODUCT_ADJECTIVES,
  PRODUCT_CATEGORIES,
  PRODUCT_NOUNS,
  TAGS,
} from "@/app/tools/mock-data-generator/data";
import { SchemaId } from "@/app/tools/mock-data-generator/types";

const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number, decimals = 2) =>
  Number((Math.random() * (max - min) + min).toFixed(decimals));
const randomPastDate = (maxDaysAgo: number) => {
  const ms = Date.now() - randInt(1, maxDaysAgo) * 86400000;
  return new Date(ms).toISOString();
};
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Schema generators
function makeUser(id: number) {
  const firstName = rand(FIRST_NAMES);
  const lastName = rand(LAST_NAMES);
  return {
    id,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${rand(DOMAINS)}`,
    age: randInt(18, 72),
    city: rand(CITIES),
    joinedAt: randomPastDate(730),
  };
}

function makeProduct(id: number) {
  const name = `${rand(PRODUCT_ADJECTIVES)} ${rand(PRODUCT_NOUNS)}`;
  return {
    id,
    name,
    category: rand(PRODUCT_CATEGORIES),
    price: randFloat(4.99, 499.99),
    inStock: Math.random() > 0.2,
    rating: randFloat(1, 5, 1),
    sku: `SKU-${randInt(10000, 99999)}`,
  };
}

function makePost(id: number) {
  const topic = rand(POST_TOPICS);
  const title = rand(POST_TITLES).replace("{topic}", topic);
  const firstName = rand(FIRST_NAMES);
  const lastName = rand(LAST_NAMES);
  const tagCount = randInt(1, 3);
  const tags: string[] = [];
  while (tags.length < tagCount) {
    const t = rand(TAGS);
    if (!tags.includes(t)) tags.push(t);
  }
  return {
    id,
    title,
    slug: slugify(title),
    author: `${firstName} ${lastName}`,
    excerpt: `A short look at ${topic} and what it means for builders.`,
    likes: randInt(0, 5000),
    tags,
    publishedAt: randomPastDate(365),
  };
}

export function generate(schema: SchemaId, count: number): unknown[] {
  const maker = schema === "users" ? makeUser : schema === "products" ? makeProduct : makePost;
  return Array.from({ length: count }, (_, i) => maker(i + 1));
}
