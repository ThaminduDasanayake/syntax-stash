"use client";

import { LinkRules } from "@platejs/link";
import { LinkPlugin } from "@platejs/link/react";

import { LinkElement } from "@/components/plate-ui/link-node";
import { LinkFloatingToolbar } from "@/components/plate-ui/link-toolbar";

export const LinkKit = [
  LinkPlugin.configure({
    inputRules: [
      LinkRules.autolink({ variant: "break" }),
      LinkRules.autolink({ variant: "paste" }),
      LinkRules.autolink({ variant: "space" }),
      LinkRules.markdown(),
    ],
    render: {
      afterEditable: () => <LinkFloatingToolbar />,
      node: LinkElement,
    },
  }),
];
