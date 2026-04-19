"use client";

import { Scale } from "lucide-react";
import { useCallback, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import CopyButton from "@/components/ui/copy-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ---------------------------------------------------------------------------
// Unit definition types
// ---------------------------------------------------------------------------

interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

function linear(factor: number): Pick<UnitDef, "toBase" | "fromBase"> {
  return { toBase: (v) => v * factor, fromBase: (v) => v / factor };
}

// ---------------------------------------------------------------------------
// Conversion dictionaries
// ---------------------------------------------------------------------------

const LENGTH_UNITS: UnitDef[] = [
  { id: "m",   name: "Metre",          symbol: "m",   ...linear(1) },
  { id: "km",  name: "Kilometre",      symbol: "km",  ...linear(1_000) },
  { id: "cm",  name: "Centimetre",     symbol: "cm",  ...linear(0.01) },
  { id: "mm",  name: "Millimetre",     symbol: "mm",  ...linear(0.001) },
  { id: "mi",  name: "Mile",           symbol: "mi",  ...linear(1_609.344) },
  { id: "yd",  name: "Yard",           symbol: "yd",  ...linear(0.9144) },
  { id: "ft",  name: "Foot",           symbol: "ft",  ...linear(0.3048) },
  { id: "in",  name: "Inch",           symbol: "in",  ...linear(0.0254) },
  { id: "nmi", name: "Nautical Mile",  symbol: "nmi", ...linear(1_852) },
  { id: "µm",  name: "Micrometre",     symbol: "µm",  ...linear(0.000_001) },
];

const WEIGHT_UNITS: UnitDef[] = [
  { id: "g",   name: "Gram",           symbol: "g",   ...linear(1) },
  { id: "kg",  name: "Kilogram",       symbol: "kg",  ...linear(1_000) },
  { id: "mg",  name: "Milligram",      symbol: "mg",  ...linear(0.001) },
  { id: "t",   name: "Metric Tonne",   symbol: "t",   ...linear(1_000_000) },
  { id: "lb",  name: "Pound",          symbol: "lb",  ...linear(453.592_37) },
  { id: "oz",  name: "Ounce",          symbol: "oz",  ...linear(28.349_523) },
  { id: "st",  name: "Stone",          symbol: "st",  ...linear(6_350.293) },
  { id: "ton", name: "US Short Ton",   symbol: "ton", ...linear(907_184.74) },
  { id: "µg",  name: "Microgram",      symbol: "µg",  ...linear(0.000_001) },
];

// Data: base = bit
const DATA_UNITS: UnitDef[] = [
  { id: "bit",  name: "Bit",       symbol: "bit",  ...linear(1) },
  { id: "B",    name: "Byte",      symbol: "B",    ...linear(8) },
  { id: "KB",   name: "Kilobyte",  symbol: "KB",   ...linear(8_000) },
  { id: "MB",   name: "Megabyte",  symbol: "MB",   ...linear(8_000_000) },
  { id: "GB",   name: "Gigabyte",  symbol: "GB",   ...linear(8_000_000_000) },
  { id: "TB",   name: "Terabyte",  symbol: "TB",   ...linear(8_000_000_000_000) },
  { id: "PB",   name: "Petabyte",  symbol: "PB",   ...linear(8e15) },
  { id: "KiB",  name: "Kibibyte",  symbol: "KiB",  ...linear(8_192) },
  { id: "MiB",  name: "Mebibyte",  symbol: "MiB",  ...linear(8_388_608) },
  { id: "GiB",  name: "Gibibyte",  symbol: "GiB",  ...linear(8_589_934_592) },
  { id: "TiB",  name: "Tebibyte",  symbol: "TiB",  ...linear(8_796_093_022_208) },
];

// Temperature: base = Celsius
const TEMP_UNITS: UnitDef[] = [
  {
    id: "C", name: "Celsius",    symbol: "°C",
    toBase:   (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "F", name: "Fahrenheit", symbol: "°F",
    toBase:   (v) => (v - 32) * (5 / 9),
    fromBase: (v) => v * (9 / 5) + 32,
  },
  {
    id: "K", name: "Kelvin",     symbol: "K",
    toBase:   (v) => v - 273.15,
    fromBase: (v) => v + 273.15,
  },
  {
    id: "R", name: "Rankine",    symbol: "°R",
    toBase:   (v) => (v - 491.67) * (5 / 9),
    fromBase: (v) => (v + 273.15) * (9 / 5),
  },
];

// Speed: base = m/s
const SPEED_UNITS: UnitDef[] = [
  { id: "mps",  name: "Metres / sec",   symbol: "m/s",   ...linear(1) },
  { id: "kph",  name: "Kilometres / hr",symbol: "km/h",  ...linear(1 / 3.6) },
  { id: "mph",  name: "Miles / hr",     symbol: "mph",   ...linear(0.44704) },
  { id: "knot", name: "Knot",           symbol: "kn",    ...linear(0.514_444) },
  { id: "fps",  name: "Feet / sec",     symbol: "ft/s",  ...linear(0.3048) },
  { id: "mach", name: "Mach",           symbol: "Ma",    ...linear(340.29) },
];

// Area: base = m²
const AREA_UNITS: UnitDef[] = [
  { id: "m2",   name: "Square Metre",    symbol: "m²",    ...linear(1) },
  { id: "km2",  name: "Square Kilometre",symbol: "km²",   ...linear(1_000_000) },
  { id: "cm2",  name: "Square Centim.",  symbol: "cm²",   ...linear(0.0001) },
  { id: "ft2",  name: "Square Foot",     symbol: "ft²",   ...linear(0.092_903) },
  { id: "in2",  name: "Square Inch",     symbol: "in²",   ...linear(0.000_645_16) },
  { id: "mi2",  name: "Square Mile",     symbol: "mi²",   ...linear(2_589_988.11) },
  { id: "ha",   name: "Hectare",         symbol: "ha",    ...linear(10_000) },
  { id: "ac",   name: "Acre",            symbol: "ac",    ...linear(4_046.856) },
  { id: "yd2",  name: "Square Yard",     symbol: "yd²",   ...linear(0.836_127) },
];

// Volume: base = litre
const VOLUME_UNITS: UnitDef[] = [
  { id: "L",    name: "Litre",          symbol: "L",     ...linear(1) },
  { id: "mL",   name: "Millilitre",     symbol: "mL",    ...linear(0.001) },
  { id: "m3",   name: "Cubic Metre",    symbol: "m³",    ...linear(1_000) },
  { id: "cm3",  name: "Cubic Centim.",  symbol: "cm³",   ...linear(0.001) },
  { id: "ft3",  name: "Cubic Foot",     symbol: "ft³",   ...linear(28.316_847) },
  { id: "in3",  name: "Cubic Inch",     symbol: "in³",   ...linear(0.016_387) },
  { id: "gal",  name: "US Gallon",      symbol: "gal",   ...linear(3.785_412) },
  { id: "qt",   name: "US Quart",       symbol: "qt",    ...linear(0.946_353) },
  { id: "pt",   name: "US Pint",        symbol: "pt",    ...linear(0.473_176) },
  { id: "floz", name: "US Fl. Ounce",   symbol: "fl oz", ...linear(0.029_574) },
  { id: "gal_uk", name: "UK Gallon",    symbol: "gal(UK)",...linear(4.546_09) },
];

// ---------------------------------------------------------------------------
// Formatting helper
// ---------------------------------------------------------------------------

const DISPLAY_PRECISION = 10;

function formatValue(v: number): string {
  if (!isFinite(v)) return "";
  // Use exponential for very large or very small, otherwise fixed
  if (Math.abs(v) !== 0 && (Math.abs(v) >= 1e12 || Math.abs(v) < 1e-6)) {
    return v.toExponential(6);
  }
  // Strip trailing zeros up to DISPLAY_PRECISION sig figs
  const s = parseFloat(v.toPrecision(DISPLAY_PRECISION)).toString();
  return s;
}

// ---------------------------------------------------------------------------
// Multi-way binding hook
// ---------------------------------------------------------------------------

function useConverter(units: UnitDef[]) {
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

// ---------------------------------------------------------------------------
// ConversionGrid — shared grid for any category
// ---------------------------------------------------------------------------

function ConversionGrid({ units }: { units: UnitDef[] }) {
  const { values, handleChange } = useConverter(units);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {units.map((unit) => (
        <Card key={unit.id} className="transition-colors focus-within:border-primary/50">
          <CardContent className="p-4">
            <div className="mb-2 flex items-baseline justify-between">
              <Label className="text-sm font-medium">{unit.name}</Label>
              <span className="font-mono text-xs text-muted-foreground">({unit.symbol})</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={values[unit.id]}
                onChange={(e) => handleChange(unit.id, e.target.value)}
                placeholder="0"
                className="font-mono text-sm"
              />
              <CopyButton
                value={values[unit.id]}
                disabled={!values[unit.id]}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab config
// ---------------------------------------------------------------------------

const TABS = [
  { value: "length",  label: "Length",  units: LENGTH_UNITS },
  { value: "weight",  label: "Weight",  units: WEIGHT_UNITS },
  { value: "data",    label: "Data",    units: DATA_UNITS },
  { value: "temp",    label: "Temp",    units: TEMP_UNITS },
  { value: "speed",   label: "Speed",   units: SPEED_UNITS },
  { value: "area",    label: "Area",    units: AREA_UNITS },
  { value: "volume",  label: "Volume",  units: VOLUME_UNITS },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function UnitConverterPage() {
  return (
    <ToolLayout
      icon={Scale}
      title="Unit"
      highlight="Converter"
      description="Convert between units of length, weight, data, temperature, speed, area, and volume."
    >
      <Tabs defaultValue="length" className="w-full">
        <TabsList className="mb-6 h-auto w-full flex-wrap gap-1 p-1">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 text-xs sm:text-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <ConversionGrid units={tab.units} />
          </TabsContent>
        ))}
      </Tabs>
    </ToolLayout>
  );
}
