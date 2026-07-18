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
    description: "Controls how much referrer information is included with requests.",
    key: "referrer-policy",
    label: "Referrer-Policy",
    recommendation: "strict-origin-when-cross-origin",
    severity: "recommended",
    validate: (v) => {
      if (!v) return "fail";
      const safe = [
        "no-referrer",
        "same-origin",
        "strict-origin",
        "strict-origin-when-cross-origin",
      ];
      return safe.includes(v.trim().toLowerCase()) ? "pass" : "warn";
    },
  },
  {
    description: "Controls which browser features and APIs can be used.",
    key: "permissions-policy",
    label: "Permissions-Policy",
    recommendation: "camera=(), microphone=(), geolocation=()",
    severity: "recommended",
    validate: (v) => (v ? "pass" : "warn"),
  },
  {
    description: "Controls which origins can load this resource.",
    key: "cross-origin-resource-policy",
    label: "Cross-Origin-Resource-Policy",
    recommendation: "same-origin",
    severity: "optional",
    validate: (v) => (v ? "pass" : "warn"),
  },
  {
    description: "Controls which resources the browser is allowed to load.",
    key: "content-security-policy",
    label: "Content-Security-Policy",
    recommendation: "default-src 'self'",
    severity: "critical",
    validate: (v) => (v ? "pass" : "fail"),
  },
  {
    description: "Deprecated — legacy XSS filter. Should be removed in favour of CSP.",
    key: "x-xss-protection",
    label: "X-XSS-Protection",
    recommendation: "Remove this header — rely on Content-Security-Policy instead.",
    severity: "optional",
    validate: (v) => (v ? "warn" : "pass"),
  },
  {
    description: "Forces HTTPS connections for the specified duration.",
    key: "strict-transport-security",
    label: "Strict-Transport-Security",
    recommendation: "max-age=31536000; includeSubDomains",
    severity: "critical",
    validate: (v) => {
      if (!v) return "fail";
      const maxAge = v.match(/max-age=(\d+)/i);
      if (!maxAge) return "warn";
      return parseInt(maxAge[1]) >= 31536000 ? "pass" : "warn";
    },
  },
  {
    description: "Isolates the browsing context to prevent cross-origin attacks.",
    key: "cross-origin-opener-policy",
    label: "Cross-Origin-Opener-Policy",
    recommendation: "same-origin",
    severity: "recommended",
    validate: (v) => {
      if (!v) return "warn";
      return v.trim().toLowerCase() === "same-origin" ? "pass" : "warn";
    },
  },
  {
    description: "Prevents clickjacking by controlling if the page can be embedded in frames.",
    key: "x-frame-options",
    label: "X-Frame-Options",
    recommendation: "SAMEORIGIN",
    severity: "recommended",
    validate: (v) => {
      if (!v) return "fail";
      const upper = v.trim().toUpperCase();
      return upper === "DENY" || upper === "SAMEORIGIN" ? "pass" : "warn";
    },
  },
  {
    description: "Prevents MIME-type sniffing attacks.",
    key: "x-content-type-options",
    label: "X-Content-Type-Options",
    recommendation: "nosniff",
    severity: "recommended",
    validate: (v) => (v?.trim().toLowerCase() === "nosniff" ? "pass" : "fail"),
  },
];
