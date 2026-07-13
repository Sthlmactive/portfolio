"use client";

import { useState, type CSSProperties, type FormEvent } from "react";

type DelayStyle = CSSProperties & { "--delay": string };

type Status = "idle" | "submitting" | "success" | "error";

export default function EmailCapture({ delay }: { delay: number }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const style = { "--delay": `${delay}s` } as DelayStyle;

  return (
    <div className="hero-cta fade-rise" style={style}>
      <p className="hero-cta-label">
        You&apos;re one email signup away from the unfiltered version of
        building companies at 21.
      </p>

      {status === "success" ? (
        <p className="hero-cta-success" role="status">
          You&apos;re in.
        </p>
      ) : (
        <form className="hero-cta-row" onSubmit={handleSubmit}>
          <input
            className="hero-cta-input"
            type="email"
            required
            aria-label="Email address"
            placeholder="your@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={status === "submitting"}
          />
          <button
            className="hero-cta-btn"
            type="submit"
            disabled={status === "submitting"}
            aria-label="Sign up"
          >
            {status === "submitting" ? "…" : "Sign up"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="hero-cta-error" role="alert">
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
