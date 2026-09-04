/* eslint-disable perfectionist/sort-arrays */

export const NAV_LINKS = [
  { exact: true, href: "/", label: "Home" },
  { exact: false, href: "/tools", label: "Tools" },
  { exact: false, href: "/resources", label: "Resources" },
  { exact: false, href: "/submit", label: "Submit" },
] as const;
