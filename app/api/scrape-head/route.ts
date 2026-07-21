import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { targetUrl } = await req.json();

    // Validate targetUrl presence
    if (!targetUrl || typeof targetUrl !== "string") {
      return NextResponse.json({ error: "A valid targetUrl string is required" }, { status: 400 });
    }

    // Validate URL structure and protocol
    try {
      const parsedUrl = new URL(targetUrl);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Only http and https protocols are supported");
      }
    } catch {
      return NextResponse.json({ error: "Invalid targetUrl provided" }, { status: 400 });
    }

    // Ensure API Key is available
    const API_KEY = process.env.SCRAPINGBEE_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: "Server error: Missing ScrapingBee API key configuration" },
        { status: 500 },
      );
    }

    // Build ScrapingBee API request URL
    const scrapingBeeUrl = new URL("https://app.scrapingbee.com/api/v1/");
    scrapingBeeUrl.searchParams.append("api_key", API_KEY);
    scrapingBeeUrl.searchParams.append("url", targetUrl);
    scrapingBeeUrl.searchParams.append("render_js", "true");

    // Set extract_rules to fetch only the inner/outer HTML of the <head> tag
    const extractRules = {
      head: {
        output: "html",
        selector: "head",
      },
    };
    scrapingBeeUrl.searchParams.append("extract_rules", JSON.stringify(extractRules));

    // Send request to ScrapingBee
    const response = await fetch(scrapingBeeUrl.toString());

    // Parse response and handle ScrapingBee-specific errors
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.message || `ScrapingBee returned status code ${response.status}`,
        },
        { status: response.status },
      );
    }

    // Return extracted head HTML
    return NextResponse.json({ head: data.head ?? "" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
