import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 200000); // 20s timeout

  try {
    const { topic } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    // We use the exact model we found in your debug list
    const URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Generate a YouTube Short script about ${topic} in JSON format: {"title": "str", "script": "str", "scenes": [{"voiceover": "str", "visual_prompt": "str"}]}` }] }]
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.error?.message }, { status: response.status });
    }

    const result = await response.json();
    const text = result.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(text));

  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error("Connection Error:", err.message);
    
    const isTimeout = err.name === 'AbortError';
    return NextResponse.json({ 
      error: isTimeout ? "Connection timed out. Try a mobile hotspot." : "Network reset." 
    }, { status: 500 });
  }
}