import { RegexPattern } from "@/app/tools/regex-studio/types";

export const REGEX_PATTERNS: RegexPattern[] = [
  {
    category: "Code",
    description: "Finds console.log calls in JavaScript/TypeScript code.",
    examples: {
      match: ["console.log('hello')", "console.log(myVar, 'debug')"],
      noMatch: ["// console.log('commented')", "console.error('err')"],
    },
    flags: "g",
    name: "Console.log Statement",
    pattern: "console\\.log\\([^)]*\\)",
  },
  {
    category: "Code",
    description: "Matches .env file variable names (uppercase with underscores).",
    examples: {
      match: ["API_KEY=", "DATABASE_URL=", "NODE_ENV="],
      noMatch: ["123INVALID=", "lowercase_var=", "MISSING_EQUALS"],
    },
    flags: "gm",
    name: "Environment Variable",
    pattern: "\\b[A-Z][A-Z0-9_]*=",
  },
  {
    category: "Code",
    description: "Matches CSS class selectors.",
    examples: {
      match: [".container", ".flex-row", ".my-component_wrapper"],
      noMatch: [".123-invalid", "#id-selector", "div"],
    },
    flags: "g",
    name: "CSS Class Selector",
    pattern: "\\.[a-zA-Z_-][a-zA-Z0-9_-]*",
  },
  {
    category: "Code",
    description: "Matches CSS custom property (variable) names.",
    examples: {
      match: ["--font-size-base", "--primary-color", "--spacing-4"],
      noMatch: ["-not-variable", "regular-property", "var(--color)"],
    },
    flags: "g",
    name: "CSS Variable",
    pattern: "--[a-zA-Z][a-zA-Z0-9-]*",
  },
  // Code
  {
    category: "Code",
    description: "Matches ES module import statements.",
    examples: {
      match: ["import React from 'react';", "import { useState, useEffect } from 'react'"],
      noMatch: ["// import foo from 'bar'", "const x = require('x')"],
    },
    flags: "mg",
    name: "JavaScript Import",
    pattern: "^import\\s+(?:[\\w*{}\\s,]+\\s+from\\s+)?['\"][^'\"]+['\"];?$",
  },
  {
    category: "Code",
    description: "Matches opening HTML tags (non-self-closing).",
    examples: {
      match: ['<a href="https://example.com">', "<div>", '<input type="text">'],
      noMatch: ["<123invalid>", "<!-- comment -->", "</div>"],
    },
    flags: "gi",
    name: "HTML Tag",
    pattern: "<([a-zA-Z][a-zA-Z0-9]*)(?:\\s[^>]*)?>",
  },
  {
    category: "Code",
    description: "Matches short (7-char) or full (40-char) Git commit hashes.",
    examples: {
      match: ["550e8400e29b41d4a716446655440000abcd1234", "a3b4c5d"],
      noMatch: ["123", "GGHHIIJJ", "not-a-hash"],
    },
    flags: "gi",
    name: "Git Commit Hash",
    pattern: "\\b[0-9a-f]{7,40}\\b",
  },
  {
    category: "Formats",
    description: "Matches 3, 6, or 8-digit hex color codes.",
    examples: {
      match: ["#AABBCCDD", "#FF5733", "#fff"],
      noMatch: ["#12345", "#GGHHII", "fff"],
    },
    flags: "img",
    name: "Hex Color",
    pattern: "^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$",
  },
  {
    category: "Formats",
    description: "Matches ISO 8601 datetime strings with timezone.",
    examples: {
      match: ["2024-01-15T10:30:00.000+05:30", "2024-01-15T10:30:00Z"],
      noMatch: ["2024-01-15 10:30:00", "2024-01-15T10:30:00"],
    },
    flags: "mg",
    name: "ISO 8601 DateTime",
    pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})$",
  },

  {
    category: "Formats",
    description: "Matches lowercase URL-friendly slugs.",
    examples: {
      match: ["a", "hello-world", "my-blog-post-123"],
      noMatch: ["-starts-with-dash", "has--double-dash", "Hello-World"],
    },
    flags: "mg",
    name: "URL Slug",
    pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
  },
  {
    category: "Formats",
    description: "Matches MAC addresses with colon or hyphen separators.",
    examples: {
      match: ["00-1A-2B-3C-4D-5E", "00:1A:2B:3C:4D:5E"],
      noMatch: ["00:1A:2B:3C:4D", "001A2B3C4D5E", "GG:1A:2B:3C:4D:5E"],
    },
    flags: "img",
    name: "MAC Address",
    pattern: "^([0-9A-Fa-f]{2}[:\\-]){5}([0-9A-Fa-f]{2})$",
  },
  {
    category: "Formats",
    description: "Matches the three-part structure of a JSON Web Token.",
    examples: {
      match: [
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      ],
      noMatch: ["not.a.jwt.token.parts", "onlyonepart", "two.parts"],
    },
    flags: "mg",
    name: "JWT Token",
    pattern: "^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$",
  },
  {
    category: "Formats",
    description: "Matches UUID version 4 strings.",
    examples: {
      match: ["550e8400-e29b-41d4-a716-446655440000", "a3b4c5d6-e7f8-4a9b-8c0d-1e2f3a4b5c6d"],
      noMatch: [
        "550e8400-e29b41d4-a716-446655440000",
        "550e8400-e29b-31d4-a716-446655440000",
        "not-a-uuid",
      ],
    },
    flags: "img",
    name: "UUID (v4)",
    pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
  },
  // Formats
  {
    category: "Formats",
    description: "Matches YYYY-MM-DD date strings.",
    examples: {
      match: ["1999-12-31", "2024-01-15"],
      noMatch: ["15-01-2024", "2024-1-5", "2024/01/15"],
    },
    flags: "mg",
    name: "ISO 8601 Date",
    pattern: "^\\d{4}-\\d{2}-\\d{2}$",
  },
  {
    category: "Formats",
    description: "Validates 24-hour time in HH:MM format.",
    examples: {
      match: ["00:00", "09:30", "23:59"],
      noMatch: ["9:3", "9:30", "24:00", "25:00"],
    },
    flags: "mg",
    name: "Time (HH:MM)",
    pattern: "^([01]\\d|2[0-3]):[0-5]\\d$",
  },
  {
    category: "Formats",
    description: "Validates semver strings like 1.2.3 or 1.0.0-beta.1+build.42.",
    examples: {
      match: ["0.1.0+build.123", "1.0.0", "2.3.4-beta.1"],
      noMatch: ["1.0", "1.0.0.0", "v1.0.0"],
    },
    flags: "mg",
    name: "Semantic Version",
    pattern:
      "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$",
  },
  {
    category: "Numbers",
    description: "Matches binary number strings (only 0s and 1s).",
    examples: {
      match: ["0", "1", "1010", "11001100"],
      noMatch: ["2", "0b1010", "1012"],
    },
    flags: "mg",
    name: "Binary Number",
    pattern: "^[01]+$",
  },
  // Numbers
  {
    category: "Numbers",
    description: "Matches integers (positive, negative, or zero). No leading zeros.",
    examples: {
      match: ["-7", "0", "42", "1000000"],
      noMatch: ["01", "1,000", "3.14", "1e10"],
    },
    flags: "mg",
    name: "Integer",
    pattern: "^-?(0|[1-9]\\d*)$",
  },

  {
    category: "Numbers",
    description: "Matches integers and decimal numbers.",
    examples: {
      match: ["-0.5", "3.14", "42", "1000"],
      noMatch: [".14", "1,000.00", "3.", "1e10"],
    },
    flags: "mg",
    name: "Decimal Number",
    pattern: "^-?\\d+(\\.\\d+)?$",
  },
  {
    category: "Numbers",
    description: "Matches percentage values from 0% to 100%.",
    examples: {
      match: ["0%", "75.5%", "100%"],
      noMatch: ["-5%", "50", "100.1%", "101%"],
    },
    flags: "mg",
    name: "Percentage",
    pattern: "^(100(\\.0+)?|\\d{1,2}(\\.\\d+)?)%$",
  },
  {
    category: "Numbers",
    description: "Matches US currency amounts with optional comma separators.",
    examples: {
      match: ["99.99", "$1,000,000", "$1,234.56"],
      noMatch: ["1.234,56", "$1234.5", "USD 100"],
    },
    flags: "mg",
    name: "Currency (USD)",
    pattern: "^\\$?\\d{1,3}(,\\d{3})*(\\.\\d{2})?$",
  },
  {
    category: "Validation",
    description: "3–20 alphanumeric characters, underscores, and hyphens.",
    examples: {
      match: ["dev99", "john_doe", "user-123"],
      noMatch: ["ab", "this_username_is_way_too_long_for_validation", "user@name"],
    },
    flags: "mg",
    name: "Username",
    pattern: "^[a-zA-Z0-9_\\-]{3,20}$",
  },
  {
    category: "Validation",
    description: "Matches common US phone number formats.",
    examples: {
      match: ["555-867-5309", "+1 555 867 5309", "(555) 867-5309"],
      noMatch: ["555-123-456", "1234567890", "+44 20 7946 0000"],
    },
    flags: "mg",
    name: "US Phone Number",
    pattern: "^(\\+1[\\s.-]?)?\\(?[2-9]\\d{2}\\)?[\\s.-]?[2-9]\\d{2}[\\s.-]?\\d{4}$",
  },
  {
    category: "Validation",
    description: "Matches full (non-compressed) IPv6 addresses.",
    examples: {
      match: ["2001:0db8:85a3:0000:0000:8a2e:0370:7334"],
      noMatch: ["2001:db8::1", "::1", "not-an-ip"],
    },
    flags: "img",
    name: "IPv6 Address",
    pattern: "^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$",
  },
  {
    category: "Validation",
    description: "Matches HTTP and HTTPS URLs.",
    examples: {
      match: ["https://example.com", "https://sub.domain.org/path?q=1"],
      noMatch: ["//missing-scheme.com", "ftp://example.com", "http://example.com", "not-a-url"],
    },
    flags: "img",
    name: "URL (http/https)",
    pattern: "^https?:\\/\\/[^\\s/$.?#].[^\\s]*$",
  },

  {
    category: "Validation",
    description: "Requires 8+ chars with uppercase, lowercase, digit, and special character.",
    examples: {
      match: ["MyS3cur3@Pass", "Passw0rd!"],
      noMatch: ["Pass123", "password", "PASSWORD1"],
    },
    flags: "mg",
    name: "Strong Password",
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$",
  },
  // Validation
  {
    category: "Validation",
    description: "Validates a standard email address format.",
    examples: {
      match: ["john.doe+alias@mail.co.uk", "user@example.com"],
      noMatch: ["@nodomain.com", "missing@dot", "plainaddress"],
    },
    flags: "img",
    name: "Email Address",
    pattern: "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$",
  },
  {
    category: "Validation",
    description: "Validates international phone numbers in E.164 format.",
    examples: {
      match: ["+14155552671", "+447911123456"],
      noMatch: ["+1", "+0123456789", "14155552671"],
    },
    flags: "mg",
    name: "Phone Number (E.164)",
    pattern: "^\\+[1-9]\\d{1,14}$",
  },
  {
    category: "Validation",
    description: "Validates IPv4 addresses (0.0.0.0 – 255.255.255.255).",
    examples: {
      match: ["0.0.0.0", "192.168.1.1", "255.255.255.255"],
      noMatch: ["192.168.1", "192.168.1.1.1", "256.0.0.1"],
    },
    flags: "mg",
    name: "IPv4 Address",
    pattern:
      "^(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$",
  },
  {
    category: "Validation",
    description: "Validates Visa, Mastercard, Amex, and Discover card numbers.",
    examples: {
      match: ["378282246310005", "4111111111111111", "5500005555555559"],
      noMatch: ["4111-1111-1111-1111", "411111111111", "1234567890123456"],
    },
    flags: "mg",
    name: "Credit Card Number",
    pattern:
      "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$",
  },
];
