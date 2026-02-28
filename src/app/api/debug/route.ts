import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY = process.env.GEMINI_API_KEY;
  // This is the official discovery endpoint
  const URL = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`;

  try {
    const res = await fetch(URL);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}