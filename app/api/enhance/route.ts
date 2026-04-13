import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "A prompt string is required." }, { status: 400 });
    }

    const { text } = await generateText({
      // Try appending -latest. If this fails, try 'gemini-1.5-pro-latest'
      model: google("gemini-2.5-flash"),
      system:
        "You are an expert AI prompt engineer. The user will provide a draft prompt. Your job is to rewrite and enhance it to yield the absolute best possible results from an LLM. Improve clarity, add expert persona instructions, specify desired output formats, and include step-by-step reasoning directives if necessary. Return ONLY the enhanced prompt text. Do not include introductory conversational text or markdown formatting outside of the prompt itself.",
      prompt,
    });

    return NextResponse.json({ text });
  } catch (error) {
    // This stops the frontend from crashing by returning a proper JSON error
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to enhance prompt with AI." }, { status: 500 });
  }
}
