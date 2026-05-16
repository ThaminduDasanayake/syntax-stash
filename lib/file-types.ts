const MIME_MAP: Record<string, string> = {
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".markdown": "text/markdown",
  ".html": "text/html",
  ".htm": "text/html",
  ".csv": "text/csv",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".heic": "image/heic",
  ".heif": "image/heif",
};

export function buildAcceptMap(extensions: string[]) {
  const accept: Record<string, string[]> = {};

  extensions.forEach((ext) => {
    const mime = MIME_MAP[ext];
    if (mime) {
      if (!accept[mime]) accept[mime] = [];
      accept[mime].push(ext);
    }
  });

  return accept;
}
