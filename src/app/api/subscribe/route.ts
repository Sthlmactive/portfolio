import { NextResponse } from "next/server";

// Permissive email shape check — real validation happens on the list side.
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  // Guard: only accept JSON requests.
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { ok: false, message: "Expected JSON." },
      { status: 400 },
    );
  }

  // Guard: reject empty / malformed bodies.
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 },
    );
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email." },
      { status: 400 },
    );
  }

  const webhookUrl = process.env.ZAPIER_SUBSCRIBE_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { ok: false, message: "Signup is not configured right now." },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        source: "oskartang.com",
        list: "email subscriber from oskartang.com",
        submitted_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, message: "Could not complete signup. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Could not complete signup. Please try again." },
      { status: 500 },
    );
  }
}
