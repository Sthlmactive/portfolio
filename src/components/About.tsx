"use client";

import { useEffect, useRef, type CSSProperties } from "react";

// lucide-react dropped brand/logo icons (Instagram, LinkedIn, …) for trademark
// reasons, so these are inline monochrome glyphs. They draw with currentColor,
// inheriting the chip's muted → bone hover transition.
function InstagramIcon() {
  return (
    <svg
      className="connect-chip-icon"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      className="connect-chip-icon"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

type DelayVar = CSSProperties & { "--d"?: string };
const d = (seconds: number): DelayVar => ({ "--d": `${seconds}s` });

const HEADLINE_LINES = ["Building,", "from Stockholm."];

const PARAGRAPHS = [
  "I'm 21. I've been freelancing since 17. Websites, automations, whatever needed building. A sales job taught me how to close, and how much companies overpay along the way. Then I started Sthlmactive, my network for CEOs under 30. Everywhere I looked, the same problem: companies overpaying on procurement, with no one handling it.",
  "So I built BackingNordics to fix it. Everything since has been in service of that. Early, fast, still figuring it out.",
];

const META = "Stockholm · Founder";

const STACK = [
  "Claude Code",
  "Codex",
  "Cursor",
  "Zapier",
  "Apify",
  "Sentry",
  "Supabase",
  "Vercel",
  "Next.js",
  "Make",
  "Loops",
  "Seedance",
  "Wispr Flow",
  "Claude",
  "ElevenLabs",
  "Canva",
  "and more",
];

export default function About() {
  const ref = useRef<HTMLElement>(null);

  // Reveal the section as it scrolls into view (one-shot) — same pattern
  // as the Timeline sections.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" className="about" aria-label="About" ref={ref}>
      <p className="about-eyebrow reveal" style={d(0.22)}>
        About
      </p>

      <h2 className="about-headline">
        {HEADLINE_LINES.map((line, i) => (
          <span className="tl-mask" key={i}>
            <span className="tl-line" style={d(i * 0.09)}>
              {line}
            </span>
          </span>
        ))}
      </h2>

      <div className="about-body">
        {PARAGRAPHS.map((p, i) => (
          <p className="about-p reveal" key={i} style={d(0.32 + i * 0.12)}>
            {p}
          </p>
        ))}
      </div>

      <div className="about-stack reveal" style={d(0.56)}>
        <p className="about-stack-label">Stack for building</p>
        <p className="about-stack-list">{STACK.join(" · ")}</p>
      </div>

      <div className="about-stack reveal" style={d(0.62)}>
        <p className="about-stack-label">Connect</p>
        <div className="about-connect-row">
          <a
            className="connect-chip"
            href="https://www.instagram.com/tang.oskar/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
            <span>Instagram</span>
          </a>
          <a
            className="connect-chip"
            href="https://www.linkedin.com/in/oskar-tang-662743273/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedinIcon />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      <p className="about-meta reveal" style={d(0.74)}>
        {META}
      </p>
    </section>
  );
}
