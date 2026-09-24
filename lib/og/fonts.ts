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

  const [bricolageData, instrumentSerifData, interRegularData, jetbrainsMonoRegularData] =
    await Promise.all([
      readFile(join(process.cwd(), "public/fonts/BricolageGrotesque-Bold.ttf")),
      readFile(join(process.cwd(), "public/fonts/InstrumentSerif-Italic.ttf")),
      readFile(join(process.cwd(), "public/fonts/Inter-Regular.ttf")),
      readFile(join(process.cwd(), "public/fonts/JetBrainsMono-Regular.ttf")),
    ]);

  const instrumentSerifBuffer = instrumentSerifData.buffer.slice(
    instrumentSerifData.byteOffset,
    instrumentSerifData.byteOffset + instrumentSerifData.byteLength,
  );

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
      data: instrumentSerifBuffer,
      name: "Instrument Serif",
      style: "italic",
      weight: 400,
    },
    {
      data: instrumentSerifBuffer,
      name: "Instrument Serif",
      style: "italic",
      weight: 900,
    },
    {
      data: interRegularData.buffer.slice(
        interRegularData.byteOffset,
        interRegularData.byteOffset + interRegularData.byteLength,
      ),
      name: "Inter",
      style: "normal",
      weight: 400,
    },
    {
      data: jetbrainsMonoRegularData.buffer.slice(
        jetbrainsMonoRegularData.byteOffset,
        jetbrainsMonoRegularData.byteOffset + jetbrainsMonoRegularData.byteLength,
      ),
      name: "JetBrains Mono",
      style: "normal",
      weight: 400,
    },
  ];

  return cachedFonts;
}
