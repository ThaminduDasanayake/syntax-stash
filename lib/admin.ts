import { siteConfig } from "@/lib/site-config";

export function getAdminEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
  const list = envEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (siteConfig.author.email) {
    list.push(siteConfig.author.email.toLowerCase());
  }

  return Array.from(new Set(list));
}

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.trim().toLowerCase());
}
