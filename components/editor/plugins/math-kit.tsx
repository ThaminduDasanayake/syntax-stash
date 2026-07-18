"use client";

import { MathRules } from "@platejs/math";
import { EquationPlugin, InlineEquationPlugin } from "@platejs/math/react";

import { EquationElement, InlineEquationElement } from "@/components/plate-ui/equation-node";

export const MathKit = [
  EquationPlugin.configure({
    inputRules: [MathRules.markdown({ on: "break", variant: "$$" })],
    node: {
      component: EquationElement,
    },
  }),
  InlineEquationPlugin.configure({
    inputRules: [MathRules.markdown({ variant: "$" })],
    node: {
      component: InlineEquationElement,
    },
  }),
];
