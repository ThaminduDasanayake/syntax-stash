export type Grade = "pass" | "warn" | "fail";

export type HeaderRule = {
  key: string;
  label: string;
  description: string;
  severity: "critical" | "recommended" | "optional";
  validate: (value?: string) => Grade;
  recommendation: string;
};

export const SECURITY_HEADERS: HeaderRule[] = [
  {
    key: "content-security-policy",
    label: "Content-Security-Policy",
    description: "Controls which resources the browser is allowed to load.",
    severity: "critical",
    validate: (v) => (v ? "pass" : "fail"),
    recommendation: "default-src 'self'",
  },
  {
    key: "strict-transport-security",
    label: "Strict-Transport-Security",
    description: "Forces HTTPS connections for the specified duration.",
    severity: "critical",
    validate: (v) => {
      if (!v) return "fail";
      const maxAge = v.match(/max-age=(\d+)/i);
      if (!maxAge) return "warn";
      return parseInt(maxAge[1]) >= 31536000 ? "pass" : "warn";
    },
    recommendation: "max-age=31536000; includeSubDomains",
  },
  {
    key: "x-frame-options",
    label: "X-Frame-Options",
    description: "Prevents clickjacking by controlling if the page can be embedded in frames.",
    severity: "recommended",
    validate: (v) => {
      if (!v) return "fail";
      const upper = v.trim().toUpperCase();
      return upper === "DENY" || upper === "SAMEORIGIN" ? "pass" : "warn";
    },
    recommendation: "SAMEORIGIN",
  },
  {
    key: "x-content-type-options",
    label: "X-Content-Type-Options",
    description: "Prevents MIME-type sniffing attacks.",
    severity: "recommended",
    validate: (v) => (v?.trim().toLowerCase() === "nosniff" ? "pass" : "fail"),
    recommendation: "nosniff",
  },
  {
    key: "referrer-policy",
    label: "Referrer-Policy",
    description: "Controls how much referrer information is included with requests.",
    severity: "recommended",
    validate: (v) => {
      if (!v) return "fail";
      const safe = [
        "no-referrer",
        "strict-origin",
        "strict-origin-when-cross-origin",
        "same-origin",
      ];
      return safe.includes(v.trim().toLowerCase()) ? "pass" : "warn";
    },
    recommendation: "strict-origin-when-cross-origin",
  },
  {
    key: "permissions-policy",
    label: "Permissions-Policy",
    description: "Controls which browser features and APIs can be used.",
    severity: "recommended",
    validate: (v) => (v ? "pass" : "warn"),
    recommendation: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "cross-origin-opener-policy",
    label: "Cross-Origin-Opener-Policy",
    description: "Isolates the browsing context to prevent cross-origin attacks.",
    severity: "recommended",
    validate: (v) => {
      if (!v) return "warn";
      return v.trim().toLowerCase() === "same-origin" ? "pass" : "warn";
    },
    recommendation: "same-origin",
  },
  {
    key: "cross-origin-resource-policy",
    label: "Cross-Origin-Resource-Policy",
    description: "Controls which origins can load this resource.",
    severity: "optional",
    validate: (v) => (v ? "pass" : "warn"),
    recommendation: "same-origin",
  },
  {
    key: "x-xss-protection",
    label: "X-XSS-Protection",
    description: "Deprecated — legacy XSS filter. Should be removed in favour of CSP.",
    severity: "optional",
    validate: (v) => (v ? "warn" : "pass"),
    recommendation: "Remove this header — rely on Content-Security-Policy instead.",
  },
];
