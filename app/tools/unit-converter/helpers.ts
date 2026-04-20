import { useCallback, useState } from "react";

import { DISPLAY_PRECISION } from "@/app/tools/unit-converter/constants";
import { UnitDef } from "@/app/tools/unit-converter/types";

export function linear(factor: number): Pick<UnitDef, "toBase" | "fromBase"> {
  return { toBase: (v) => v * factor, fromBase: (v) => v / factor };
}

export function formatValue(v: number): string {
  if (!isFinite(v)) return "";
  // Use exponential for very large or very small, otherwise fixed
  if (Math.abs(v) !== 0 && (Math.abs(v) >= 1e12 || Math.abs(v) < 1e-6)) {
    return v.toExponential(6);
  }
  // Strip trailing zeros up to DISPLAY_PRECISION sig figs
  const s = parseFloat(v.toPrecision(DISPLAY_PRECISION)).toString();
  return s;
}

export function useConverter(units: UnitDef[]) {
  const empty = () => Object.fromEntries(units.map((u) => [u.id, ""]));
  const [values, setValues] = useState<Record<string, string>>(empty);

  const handleChange = useCallback(
    (changedId: string, raw: string) => {
      if (raw === "" || raw === "-") {
        setValues(empty());
        if (raw === "-") setValues((v) => ({ ...v, [changedId]: "-" }));
        return;
      }

      const num = parseFloat(raw);
      if (isNaN(num)) return;

      const source = units.find((u) => u.id === changedId)!;
      const baseValue = source.toBase(num);

      const next: Record<string, string> = {};
      for (const unit of units) {
        if (unit.id === changedId) {
          next[unit.id] = raw;
        } else {
          const computed = unit.fromBase(baseValue);
          next[unit.id] = formatValue(computed);
        }
      }
      setValues(next);
    },
    [units], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const reset = useCallback(() => setValues(empty()), [units]); // eslint-disable-line react-hooks/exhaustive-deps

  return { values, handleChange, reset };
}
