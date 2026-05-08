import { Grade, SECURITY_HEADERS } from "@/app/tools/http-security-header-analyzer/rules";

export function parseHeaders(raw: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of raw.split(/\r?\n/)) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim().toLowerCase();
    const value = line.slice(colonIdx + 1).trim();
    if (key) map.set(key, value);
  }
  return map;
}

export function gradeToVariant(grade: Grade): "default" | "secondary" | "destructive" {
  if (grade === "pass") return "default";
  if (grade === "warn") return "secondary";
  return "destructive";
}

export function gradeLabel(grade: Grade) {
  if (grade === "pass") return "Pass";
  if (grade === "warn") return "Warn";
  return "Fail";
}

export function generateNextConfig(): string {
  const entries = SECURITY_HEADERS.filter((r) => r.key !== "x-xss-protection").map((r) => {
    const val = r.recommendation;
    return `      {\n        key: "${r.label}",\n        value: "${val}",\n      },`;
  });

  // language=text
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
${entries.join("\n")}
        ],
      },
    ];
  },
};

export default nextConfig;`;
}
