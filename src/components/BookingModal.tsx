"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { lockScroll, unlockScroll } from "@/lib/smoothScroll";

type Status = "idle" | "sending" | "success" | "error";

const REACH_OPTIONS = ["Company", "Investor", "Just talk"];

// Accessible single-select segmented control (radiogroup) for "reaching out as".
function ReachingOutAs({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const labelId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = REACH_OPTIONS.indexOf(value);
  // Roving tabindex: the selected pill is tabbable, or the first if none.
  const tabbableIndex = selectedIndex >= 0 ? selectedIndex : 0;

  function selectAt(i: number) {
    const idx = (i + REACH_OPTIONS.length) % REACH_OPTIONS.length;
    onChange(REACH_OPTIONS[idx]);
    refs.current[idx]?.focus();
  }

  function onKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, i: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      selectAt(i + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      selectAt(i - 1);
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(REACH_OPTIONS[i]);
    }
  }

  return (
    <div className="booking-field">
      <span className="booking-grouplabel" id={labelId}>
        I&apos;m reaching out as
      </span>
      <div className="booking-segment" role="radiogroup" aria-labelledby={labelId}>
        {REACH_OPTIONS.map((opt, i) => {
          const checked = value === opt;
          return (
            <button
              key={opt}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={i === tabbableIndex ? 0 : -1}
              className={`booking-pill${checked ? " is-selected" : ""}`}
              onClick={() => onChange(opt)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function BookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reachingOutAs, setReachingOutAs] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  // Open/close side effects: scroll lock, focus management, ESC.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    lockScroll();

    const focusTimer = setTimeout(() => firstFieldRef.current?.focus(), 60);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      unlockScroll();
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  // Reset the form a moment after closing (so it doesn't flicker mid-exit).
  useEffect(() => {
    if (open) {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      return;
    }
    resetTimer.current = setTimeout(() => {
      setName("");
      setEmail("");
      setReachingOutAs("");
      setMessage("");
      setWebsite("");
      setStatus("idle");
      setError("");
    }, 400);
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [open]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;

    if (!name.trim() || !emailValid) {
      setError("Please enter your name and a valid email.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          reachingOutAs,
          message,
          website,
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));

      if (res.ok && data.ok) {
        setStatus("success");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  const sending = status === "sending";

  return (
    <div
      ref={overlayRef}
      className={`booking-overlay${open ? " is-open" : ""}`}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      aria-hidden={open ? undefined : true}
    >
      <div
        className="booking-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="booking-close"
          aria-label="Close"
          onClick={onClose}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M3 3l10 10M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {status === "success" ? (
          <div className="booking-success">
            <span className="booking-check" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24">
                <path
                  d="M5 12.5l4.2 4.2L19 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h3 className="booking-title">Request sent</h3>
            <p className="booking-sub">
              Thanks — I&apos;ve got it and I&apos;ll be in touch shortly.
            </p>
          </div>
        ) : (
          <>
            <p className="booking-kicker">Book a meeting</p>
            <h2 id={titleId} className="booking-title">
              Let&apos;s talk.
            </h2>
            <p className="booking-sub">
              Tell me a bit about you and what you&apos;d like to discuss.
              I&apos;ll get back to you within a day.
            </p>

            <form className="booking-form" onSubmit={handleSubmit} noValidate>
              <div className="booking-row">
                <div className="booking-field">
                  <label htmlFor="bk-name">
                    Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={firstFieldRef}
                    id="bk-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="booking-field">
                  <label htmlFor="bk-email">
                    Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="bk-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <ReachingOutAs
                value={reachingOutAs}
                onChange={setReachingOutAs}
              />

              <div className="booking-field">
                <label htmlFor="bk-message">What&apos;s this about?</label>
                <textarea
                  id="bk-message"
                  name="message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Honeypot — hidden from users, catches bots */}
              <div className="booking-hp" aria-hidden="true">
                <label htmlFor="bk-website">Website</label>
                <input
                  id="bk-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {status === "error" && (
                <p className="booking-error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="booking-submit"
                disabled={sending}
              >
                {sending ? "Sending…" : "Send request"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
