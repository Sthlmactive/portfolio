"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type DelayVar = CSSProperties & { "--d"?: string };
const d = (seconds: number): DelayVar => ({ "--d": `${seconds}s` });

const HEADLINE_LINES = ["Building, fast,", "from Stockholm."];

const PARAGRAPHS = [
  "I'm 21. I've been freelancing since 17 — websites, automations, whatever needed building. A sales job taught me how to close, and how much companies overpay along the way. Then I started Sthlmactive, my network for CEOs under 30. Everywhere I looked, the same problem: companies overpaying on procurement, with no one handling it.",
  "So I built BackingNordics to fix it. Everything since has been in service of that. Early, fast, still figuring it out.",
];

const META = "Stockholm · Solo founder · B2B · AI-native";

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

      <p className="about-meta reveal" style={d(0.56)}>
        {META}
      </p>
    </section>
  );
}
