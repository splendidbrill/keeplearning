import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Call n8n from the Next.js SERVER (No CORS issues here!)
    const n8nResponse = await fetch("http://localhost:5678/webhook-test/ai-tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!n8nResponse.ok) {
      return NextResponse.json({ error: "n8n Error" }, { status: n8nResponse.status });
    }

    const data = await n8nResponse.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: "Failed to connect to AI" }, { status: 500 });
  }
}