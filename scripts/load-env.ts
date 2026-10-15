import fs from "node:fs";
import path from "node:path";

// eslint-disable-next-line perfectionist/sort-arrays
for (const file of [".env.local", ".env"]) {
  const fullPath = path.resolve(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    try {
      process.loadEnvFile?.(fullPath);
    } catch {
      // Ignore if file cannot be parsed or loaded
    }
  }
}
