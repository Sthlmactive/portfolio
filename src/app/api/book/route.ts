import { NextResponse } from "next/server";

// Basic, permissive email shape check — real validation happens by replying.
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 },
    );
  }

  const name = asString(payload.name);
  const email = asString(payload.email);
  const reachingOutAs = asString(payload.reachingOutAs);
  const message = asString(payload.message);
  const website = asString(payload.website); // honeypot

  // Honeypot: a real user never fills this. Silently accept, don't forward.
  if (website !== "") {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter your name and a valid email." },
      { status: 400 },
    );
  }

  const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { ok: false, message: "Booking is not configured right now." },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        reachingOutAs,
        message,
        source: "oskartang.com",
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, message: "Could not send your request. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Could not send your request. Please try again." },
      { status: 502 },
    );
  }
}
