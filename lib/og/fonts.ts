import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface OgFont {
  data: ArrayBuffer;
  name: string;
  style: "italic" | "normal";
  weight: 400 | 700 | 800 | 900;
}

let cachedFonts: OgFont[] | null = null;

export async function getOgFonts(): Promise<OgFont[]> {
  if (cachedFonts) {
    return cachedFonts;
  }

  const [bricolageData, instrumentSerifData, jetbrainsMonoData] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/BricolageGrotesque-Bold.ttf")),
    readFile(join(process.cwd(), "public/fonts/InstrumentSerif-Italic.ttf")),
    readFile(join(process.cwd(), "public/fonts/JetBrainsMono-Bold.ttf")),
  ]);

  cachedFonts = [
    {
      data: bricolageData.buffer.slice(
        bricolageData.byteOffset,
        bricolageData.byteOffset + bricolageData.byteLength,
      ),
      name: "Bricolage Grotesque",
      style: "normal",
      weight: 800,
    },
    {
      data: instrumentSerifData.buffer.slice(
        instrumentSerifData.byteOffset,
        instrumentSerifData.byteOffset + instrumentSerifData.byteLength,
      ),
      name: "Instrument Serif",
      style: "italic",
      weight: 400,
    },
    {
      data: jetbrainsMonoData.buffer.slice(
        jetbrainsMonoData.byteOffset,
        jetbrainsMonoData.byteOffset + jetbrainsMonoData.byteLength,
      ),
      name: "JetBrains Mono",
      style: "normal",
      weight: 800,
    },
  ];

  return cachedFonts;
}
