"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type DelayVar = CSSProperties & { "--d"?: string };
const d = (seconds: number): DelayVar => ({ "--d": `${seconds}s` });

type Chapter = {
  index: string;
  lines: string[];
  desc: string;
  status: string;
  year: string;
};

// Newest first.
const CHAPTERS: Chapter[] = [
  {
    index: "01 — 2026 → now",
    lines: ["BACKING", "NORDICS"],
    desc: "An AI procurement agent for Nordic SMEs. Enterprise buying power — without the purchasing department.",
    status: "Live in production",
    year: "2026",
  },
  {
    index: "02 — 2026",
    lines: ["GTM", "ENGINEER"],
    desc: "An AI sales platform that kills the admin — prospecting, enrichment, and outreach on autopilot, so sellers actually sell.",
    status: "Live · Gmail + Outlook",
    year: "2026",
  },
  {
    index: "03 — Since 2024",
    lines: ["STHLMACTIVE"],
    desc: "A private network for Sweden's CEOs and founders under 30 — distribution starts with the room you're in.",
    status: "Active · Invite-only",
    year: "2024",
  },
];

// Supporting elements reveal after the name has masked up.
const REVEAL_DELAYS = { index: 0.25, desc: 0.37, status: 0.49 };

export default function Timeline() {
  const blockRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const closerRef = useRef<HTMLElement>(null);
  const [activeYear, setActiveYear] = useState(CHAPTERS[0].year);

  // Reveal sections as they scroll into view (one-shot).
  useEffect(() => {
    const targets = [
      introRef.current,
      ...chapterRefs.current.filter(Boolean),
      closerRef.current,
    ].filter(Boolean) as HTMLElement[];

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

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // Track which chapter owns the viewport centre → drives the rail year.
  useEffect(() => {
    const targets = chapterRefs.current.filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const year = entry.target.getAttribute("data-year");
            if (year) setActiveYear(year);
          }
        }
      },
      // A thin band across the viewport centre.
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // Scroll progress through the whole timeline block → fill + dot.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const block = blockRef.current;
      if (!block) return;
      const rect = block.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;
      // Scoped to :root so both the desktop rail fill and the mobile
      // left-edge progress bar read from the same value.
      document.documentElement.style.setProperty(
        "--progress",
        progress.toFixed(4),
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="story" aria-label="Story">
      {/* Mobile-only fixed progress bar on the left screen edge */}
      <div className="tl-edge" aria-hidden="true">
        <span className="tl-edge-fill" />
      </div>

      {/* Intro */}
      <div className="story-intro" ref={introRef}>
        <p className="story-eyebrow">The story so far</p>
        <h2 className="story-headline">
          {["Freelanced.", "Sold.", "Built.", "Now scaling."].map((line, i) => (
            <span className="tl-mask" key={i}>
              <span className="tl-line" style={d(i * 0.09)}>
                {line}
              </span>
            </span>
          ))}
        </h2>
        <div className="story-scroll">
          <span className="swipe-bar" aria-hidden="true" />
          <span>Scroll</span>
        </div>
      </div>

      {/* Timeline block: rail + chapters */}
      <div className="tl-block" ref={blockRef}>
        <div className="tl-rail">
          <div className="tl-rail-inner">
            <span key={activeYear} className="tl-year">
              {activeYear}
            </span>
            <span className="tl-track">
              <span className="tl-fill" />
              <span className="tl-dot" />
            </span>
          </div>
        </div>

        <div className="tl-chapters">
          {CHAPTERS.map((ch, i) => (
            <article
              key={ch.index}
              className="tl-chapter"
              data-year={ch.year}
              ref={(el) => {
                chapterRefs.current[i] = el;
              }}
            >
              <p className="tl-index reveal" style={d(REVEAL_DELAYS.index)}>
                {ch.index}
              </p>
              <h3 className="tl-name">
                {ch.lines.map((line, li) => (
                  <span className="tl-mask" key={li}>
                    <span className="tl-line" style={d(li * 0.09)}>
                      {line}
                    </span>
                  </span>
                ))}
              </h3>
              <p className="tl-desc reveal" style={d(REVEAL_DELAYS.desc)}>
                {ch.desc}
              </p>
              <p className="tl-status reveal" style={d(REVEAL_DELAYS.status)}>
                <span className="tl-status-dot" aria-hidden="true" />
                {ch.status}
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* Closer */}
      <section className="story-closer" ref={closerRef}>
        <h2 className="story-closer-head">
          {["Three products.", "One operator.", "Still building."].map(
            (line, i) => (
              <span className="tl-mask" key={i}>
                <span className="tl-line" style={d(i * 0.09)}>
                  {line}
                </span>
              </span>
            ),
          )}
        </h2>
      </section>
    </section>
  );
}
