import { RegexPattern } from "@/app/tools/regex-studio/types.ts";

export const REGEX_PATTERNS: RegexPattern[] = [
  // Validation
  {
    name: "Email Address",
    pattern: "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$",
    flags: "img",
    description: "Validates a standard email address format.",
    category: "Validation",
    examples: {
      match: ["user@example.com", "john.doe+alias@mail.co.uk"],
      noMatch: ["plainaddress", "missing@dot", "@nodomain.com"],
    },
  },
  {
    name: "URL (http/https)",
    pattern: "^https?:\\/\\/[^\\s/$.?#].[^\\s]*$",
    flags: "img",
    description: "Matches HTTP and HTTPS URLs.",
    category: "Validation",
    examples: {
      match: ["https://example.com", "http://sub.domain.org/path?q=1"],
      noMatch: ["ftp://example.com", "not-a-url", "//missing-scheme.com"],
    },
  },
  {
    name: "IPv4 Address",
    pattern:
      "^(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$",
    flags: "mg",
    description: "Validates IPv4 addresses (0.0.0.0 – 255.255.255.255).",
    category: "Validation",
    examples: {
      match: ["192.168.1.1", "0.0.0.0", "255.255.255.255"],
      noMatch: ["256.0.0.1", "192.168.1", "192.168.1.1.1"],
    },
  },
  {
    name: "IPv6 Address",
    pattern: "^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$",
    flags: "img",
    description: "Matches full (non-compressed) IPv6 addresses.",
    category: "Validation",
    examples: {
      match: ["2001:0db8:85a3:0000:0000:8a2e:0370:7334"],
      noMatch: ["::1", "2001:db8::1", "not-an-ip"],
    },
  },
  {
    name: "Phone Number (E.164)",
    pattern: "^\\+[1-9]\\d{1,14}$",
    flags: "mg",
    description: "Validates international phone numbers in E.164 format.",
    category: "Validation",
    examples: {
      match: ["+14155552671", "+447911123456"],
      noMatch: ["14155552671", "+1", "+0123456789"],
    },
  },
  {
    name: "US Phone Number",
    pattern: "^(\\+1[\\s.-]?)?\\(?[2-9]\\d{2}\\)?[\\s.-]?[2-9]\\d{2}[\\s.-]?\\d{4}$",
    flags: "mg",
    description: "Matches common US phone number formats.",
    category: "Validation",
    examples: {
      match: ["(555) 867-5309", "555-867-5309", "+1 555 867 5309"],
      noMatch: ["1234567890", "555-123-456", "+44 20 7946 0000"],
    },
  },
  {
    name: "Credit Card Number",
    pattern:
      "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$",
    flags: "mg",
    description: "Validates Visa, Mastercard, Amex, and Discover card numbers.",
    category: "Validation",
    examples: {
      match: ["4111111111111111", "5500005555555559", "378282246310005"],
      noMatch: ["1234567890123456", "411111111111", "4111-1111-1111-1111"],
    },
  },
  {
    name: "Strong Password",
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$",
    flags: "mg",
    description: "Requires 8+ chars with uppercase, lowercase, digit, and special character.",
    category: "Validation",
    examples: {
      match: ["Passw0rd!", "MyS3cur3@Pass"],
      noMatch: ["password", "PASSWORD1", "Pass123"],
    },
  },
  {
    name: "Username",
    pattern: "^[a-zA-Z0-9_\\-]{3,20}$",
    flags: "mg",
    description: "3–20 alphanumeric characters, underscores, and hyphens.",
    category: "Validation",
    examples: {
      match: ["john_doe", "user-123", "dev99"],
      noMatch: ["ab", "this_username_is_way_too_long_for_validation", "user@name"],
    },
  },

  // Formats
  {
    name: "ISO 8601 Date",
    pattern: "^\\d{4}-\\d{2}-\\d{2}$",
    flags: "mg",
    description: "Matches YYYY-MM-DD date strings.",
    category: "Formats",
    examples: {
      match: ["2024-01-15", "1999-12-31"],
      noMatch: ["15-01-2024", "2024/01/15", "2024-1-5"],
    },
  },
  {
    name: "ISO 8601 DateTime",
    pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$",
    flags: "mg",
    description: "Matches ISO 8601 datetime strings with timezone.",
    category: "Formats",
    examples: {
      match: ["2024-01-15T10:30:00Z", "2024-01-15T10:30:00.000+05:30"],
      noMatch: ["2024-01-15 10:30:00", "2024-01-15T10:30:00"],
    },
  },
  {
    name: "Time (HH:MM)",
    pattern: "^([01]\\d|2[0-3]):[0-5]\\d$",
    flags: "mg",
    description: "Validates 24-hour time in HH:MM format.",
    category: "Formats",
    examples: {
      match: ["09:30", "23:59", "00:00"],
      noMatch: ["24:00", "9:30", "9:3", "25:00"],
    },
  },
  {
    name: "Hex Color",
    pattern: "^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$",
    flags: "img",
    description: "Matches 3, 6, or 8-digit hex color codes.",
    category: "Formats",
    examples: {
      match: ["#fff", "#FF5733", "#AABBCCDD"],
      noMatch: ["fff", "#GGHHII", "#12345"],
    },
  },
  {
    name: "UUID (v4)",
    pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
    flags: "img",
    description: "Matches UUID version 4 strings.",
    category: "Formats",
    examples: {
      match: ["550e8400-e29b-41d4-a716-446655440000", "a3b4c5d6-e7f8-4a9b-8c0d-1e2f3a4b5c6d"],
      noMatch: [
        "550e8400-e29b-31d4-a716-446655440000",
        "not-a-uuid",
        "550e8400-e29b41d4-a716-446655440000",
      ],
    },
  },
  {
    name: "Semantic Version",
    pattern:
      "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$",
    flags: "mg",
    description: "Validates semver strings like 1.2.3 or 1.0.0-beta.1+build.42.",
    category: "Formats",
    examples: {
      match: ["1.0.0", "2.3.4-beta.1", "0.1.0+build.123"],
      noMatch: ["1.0", "v1.0.0", "1.0.0.0"],
    },
  },
  {
    name: "URL Slug",
    pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
    flags: "mg",
    description: "Matches lowercase URL-friendly slugs.",
    category: "Formats",
    examples: {
      match: ["hello-world", "my-blog-post-123", "a"],
      noMatch: ["Hello-World", "-starts-with-dash", "has--double-dash"],
    },
  },
  {
    name: "MAC Address",
    pattern: "^([0-9A-Fa-f]{2}[:\\-]){5}([0-9A-Fa-f]{2})$",
    flags: "img",
    description: "Matches MAC addresses with colon or hyphen separators.",
    category: "Formats",
    examples: {
      match: ["00:1A:2B:3C:4D:5E", "00-1A-2B-3C-4D-5E"],
      noMatch: ["001A2B3C4D5E", "00:1A:2B:3C:4D", "GG:1A:2B:3C:4D:5E"],
    },
  },
  {
    name: "JWT Token",
    pattern: "^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$",
    flags: "mg",
    description: "Matches the three-part structure of a JSON Web Token.",
    category: "Formats",
    examples: {
      match: [
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      ],
      noMatch: ["not.a.jwt.token.parts", "onlyonepart", "two.parts"],
    },
  },

  // Code
  {
    name: "JavaScript Import",
    pattern: "^import\\s+(?:[\\w*{}\\s,]+\\s+from\\s+)?['\"][^'\"]+['\"];?$",
    flags: "mg",
    description: "Matches ES module import statements.",
    category: "Code",
    examples: {
      match: ["import React from 'react';", "import { useState, useEffect } from 'react'"],
      noMatch: ["const x = require('x')", "// import foo from 'bar'"],
    },
  },
  {
    name: "HTML Tag",
    pattern: "<([a-zA-Z][a-zA-Z0-9]*)(?:\\s[^>]*)?>",
    flags: "gi",
    description: "Matches opening HTML tags (non-self-closing).",
    category: "Code",
    examples: {
      match: ["<div>", '<a href="https://example.com">', '<input type="text">'],
      noMatch: ["</div>", "<!-- comment -->", "<123invalid>"],
    },
  },
  {
    name: "CSS Class Selector",
    pattern: "\\.[a-zA-Z_-][a-zA-Z0-9_-]*",
    flags: "g",
    description: "Matches CSS class selectors.",
    category: "Code",
    examples: {
      match: [".container", ".flex-row", ".my-component_wrapper"],
      noMatch: ["#id-selector", "div", ".123-invalid"],
    },
  },
  {
    name: "CSS Variable",
    pattern: "--[a-zA-Z][a-zA-Z0-9-]*",
    flags: "g",
    description: "Matches CSS custom property (variable) names.",
    category: "Code",
    examples: {
      match: ["--primary-color", "--font-size-base", "--spacing-4"],
      noMatch: ["-not-variable", "var(--color)", "regular-property"],
    },
  },
  {
    name: "Console.log Statement",
    pattern: "console\\.log\\([^)]*\\)",
    flags: "g",
    description: "Finds console.log calls in JavaScript/TypeScript code.",
    category: "Code",
    examples: {
      match: ["console.log('hello')", "console.log(myVar, 'debug')"],
      noMatch: ["console.error('err')", "// console.log('commented')"],
    },
  },
  {
    name: "Git Commit Hash",
    pattern: "\\b[0-9a-f]{7,40}\\b",
    flags: "gi",
    description: "Matches short (7-char) or full (40-char) Git commit hashes.",
    category: "Code",
    examples: {
      match: ["a3b4c5d", "550e8400e29b41d4a716446655440000abcd1234"],
      noMatch: ["GGHHIIJJ", "123", "not-a-hash"],
    },
  },
  {
    name: "Environment Variable",
    pattern: "\\b[A-Z][A-Z0-9_]*=",
    flags: "gm",
    description: "Matches .env file variable names (uppercase with underscores).",
    category: "Code",
    examples: {
      match: ["DATABASE_URL=", "NODE_ENV=", "API_KEY="],
      noMatch: ["lowercase_var=", "123INVALID=", "MISSING_EQUALS"],
    },
  },

  // Numbers
  {
    name: "Integer",
    pattern: "^-?(0|[1-9]\\d*)$",
    flags: "mg",
    description: "Matches integers (positive, negative, or zero). No leading zeros.",
    category: "Numbers",
    examples: {
      match: ["0", "42", "-7", "1000000"],
      noMatch: ["01", "3.14", "1e10", "1,000"],
    },
  },
  {
    name: "Decimal Number",
    pattern: "^-?\\d+(\\.\\d+)?$",
    flags: "mg",
    description: "Matches integers and decimal numbers.",
    category: "Numbers",
    examples: {
      match: ["3.14", "-0.5", "42", "1000"],
      noMatch: ["3.", ".14", "1e10", "1,000.00"],
    },
  },
  {
    name: "Currency (USD)",
    pattern: "^\\$?\\d{1,3}(,\\d{3})*(\\.\\d{2})?$",
    flags: "mg",
    description: "Matches US currency amounts with optional comma separators.",
    category: "Numbers",
    examples: {
      match: ["$1,234.56", "99.99", "$1,000,000"],
      noMatch: ["1.234,56", "$1234.5", "USD 100"],
    },
  },
  {
    name: "Percentage",
    pattern: "^(100(\\.0+)?|\\d{1,2}(\\.\\d+)?)%$",
    flags: "mg",
    description: "Matches percentage values from 0% to 100%.",
    category: "Numbers",
    examples: {
      match: ["0%", "75.5%", "100%"],
      noMatch: ["101%", "50", "-5%", "100.1%"],
    },
  },
  {
    name: "Binary Number",
    pattern: "^[01]+$",
    flags: "mg",
    description: "Matches binary number strings (only 0s and 1s).",
    category: "Numbers",
    examples: {
      match: ["0", "1", "1010", "11001100"],
      noMatch: ["1012", "0b1010", "2"],
    },
  },
];
