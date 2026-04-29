export const runtime = "nodejs";
export const maxDuration = 30;

import { NextResponse } from "next/server";

async function htmlToMarkdown(html: string): Promise<string> {
  const TurndownService = (await import("turndown")).default;
  const { gfm } = await import("turndown-plugin-gfm");
  const td = new TurndownService();
  td.use(gfm);
  return td.turndown(html);
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const name = file.name.toLowerCase();
    const ext = name.slice(name.lastIndexOf(".") + 1);
    const type = file.type;
    let text = "";

    if (type === "application/pdf" || ext === "pdf") {
      // pdf-parse v2 uses a class-based API: new PDFParse({ data }) + .getText()
      // Dynamic import avoids any bundler-time issues with pdfjs-dist worker resolution.
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      text = result.text;
    } else if (type.includes("officedocument.wordprocessingml") || ext === "docx") {
      const mammoth = await import("mammoth");
      const { value: html } = await mammoth.convertToHtml({ buffer });
      text = await htmlToMarkdown(html);
    } else if (type === "text/plain" || type === "text/csv" || ext === "txt" || ext === "csv") {
      // MIME type for .txt/.csv is often empty or application/octet-stream in browsers
      text = buffer.toString("utf-8");
    } else if (type === "text/html" || ext === "html" || ext === "htm") {
      text = await htmlToMarkdown(buffer.toString("utf-8"));
    } else if (type === "text/markdown" || ext === "md" || ext === "markdown") {
      text = buffer.toString("utf-8");
    } else {
      return NextResponse.json({ error: `Unsupported file type: ${type || ext}` }, { status: 400 });
    }

    return NextResponse.json({ text });
  } catch (e) {
    console.error("[extract-text]", e);
    return NextResponse.json({ error: "Failed to extract text." }, { status: 500 });
  }
}
