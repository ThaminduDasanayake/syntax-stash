const MIME_MAP: Record<string, string> = {
  ".avif": "image/avif",
  ".csv": "text/csv",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".heif": "image/heif",
  ".htm": "text/html",
  ".html": "text/html",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".markdown": "text/markdown",
  ".md": "text/markdown",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".webp": "image/webp",
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
