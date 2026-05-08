import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const dsn = new URL("https://67acd46883704ecabe947a5f254db3d8@app.glitchtip.com/23162");
  const projectId = dsn.pathname.replace("/", "");
  const url = `${dsn.protocol}//${dsn.host}/api/${projectId}/envelope/`;

  const body = await req.text();

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: body,
  });

  return NextResponse.json({ status: "ok" }, { status: 200 });
}
