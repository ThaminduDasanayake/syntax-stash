export type BezierPreset = {
  label: string;
  p1x: number;
  p1y: number;
  p2x: number;
  p2y: number;
};

export const PRESETS: BezierPreset[] = [
  { label: "ease",             p1x: 0.25, p1y: 0.1,  p2x: 0.25, p2y: 1.0  },
  { label: "ease-in",          p1x: 0.42, p1y: 0.0,  p2x: 1.0,  p2y: 1.0  },
  { label: "ease-out",         p1x: 0.0,  p1y: 0.0,  p2x: 0.58, p2y: 1.0  },
  { label: "ease-in-out",      p1x: 0.42, p1y: 0.0,  p2x: 0.58, p2y: 1.0  },
  { label: "linear",           p1x: 0.0,  p1y: 0.0,  p2x: 1.0,  p2y: 1.0  },
  { label: "ease-out-back",    p1x: 0.34, p1y: 1.56, p2x: 0.64, p2y: 1.0  },
  { label: "ease-in-back",     p1x: 0.36, p1y: 0.0,  p2x: 0.66, p2y: -0.56 },
  { label: "ease-in-out-back", p1x: 0.68, p1y: -0.6, p2x: 0.32, p2y: 1.6  },
  { label: "ease-out-expo",    p1x: 0.16, p1y: 1.0,  p2x: 0.3,  p2y: 1.0  },
  { label: "ease-in-expo",     p1x: 0.7,  p1y: 0.0,  p2x: 0.84, p2y: 0.0  },
  { label: "ease-in-out-expo", p1x: 0.87, p1y: 0.0,  p2x: 0.13, p2y: 1.0  },
];

/** Evaluate a cubic Bezier component at parameter t (B0=(0,0), B3=(1,1)). */
function bezier1d(p1: number, p2: number, t: number): number {
  const mt = 1 - t;
  return 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t;
}

/** Sample the full (x, y) position at curve parameter t. */
export function sampleBezier(
  p1x: number, p1y: number,
  p2x: number, p2y: number,
  t: number,
): { x: number; y: number } {
  return {
    x: bezier1d(p1x, p2x, t),
    y: bezier1d(p1y, p2y, t),
  };
}

/**
 * Solve for the curve parameter t given a target x value, then return the
 * corresponding y. Used so the animated dot follows CSS progress time.
 */
export function solveYForX(
  targetX: number,
  p1x: number, p1y: number,
  p2x: number, p2y: number,
): number {
  let lo = 0, hi = 1;
  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2;
    const x = bezier1d(p1x, p2x, mid);
    if (Math.abs(x - targetX) < 1e-6) return bezier1d(p1y, p2y, mid);
    if (x < targetX) lo = mid; else hi = mid;
  }
  return bezier1d(p1y, p2y, (lo + hi) / 2);
}

/** Build an array of {x, y} sample points for drawing the curve path. */
export function buildCurveSamples(
  p1x: number, p1y: number,
  p2x: number, p2y: number,
  steps = 60,
): { x: number; y: number }[] {
  return Array.from({ length: steps + 1 }, (_, i) =>
    sampleBezier(p1x, p1y, p2x, p2y, i / steps),
  );
}
