"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

// ---------------------------------------------------------------------------
// Edit this list to add / remove / reorder projects. Layout reads from it —
// no markup changes needed below.
//   teaser:      short one liner, always visible at rest
//   description: longer line, revealed on hover (desktop) / tap (touch)
//   stack:       tags (display is capped to the first 4)
//   status:      "LIVE" | "BUILDING" | "ARCHIVED"
//   links:       clickable links, e.g. { label: "LIVE" | "SOURCE", href }.
//                Empty array for none. Renders inline in the reveal footer.
//   repo:        "public" | "private" | undefined. "private" shows a muted,
//                non-clickable PRIVATE label in the footer (repo exists, source
//                closed). To expose source instead, drop the repo field and add
//                a { label: "SOURCE", href } entry to links.
// Copy rule: no em dashes, no connector hyphens, no underscores in visible text.
// ---------------------------------------------------------------------------
type BuildStatus = "LIVE" | "BUILDING" | "ARCHIVED";
type BuildLink = { label: string; href: string };
type Build = {
  name: string;
  teaser: string;
  description: string;
  stack: string[];
  year: string;
  status: BuildStatus;
  // Optional display override for the status label. Color, dot, and casing still
  // come from `status` — this only changes the visible text (e.g. a "LIVE" build
  // that also wants to note "INTERNAL USE"). Keep it short; it must fit the
  // right-hand status column without shoving the year out of alignment.
  statusLabel?: string;
  links: BuildLink[];
  repo?: "public" | "private";
};

const BUILDS: Build[] = [
  {
    name: "Backing Nordics",
    teaser: "AI procurement agent for Nordic SMEs.",
    description:
      "An AI procurement agent for Nordic SMEs. Enterprise leverage without the enterprise.",
    stack: ["NEXT.JS", "TYPESCRIPT", "POSTGRES", "LLM"],
    year: "2026",
    status: "LIVE",
    links: [{ label: "LIVE", href: "https://backingnordics.com" }],
  },
  {
    name: "Echo AI",
    teaser: "The voice to text AI that turns speech into clear, polished writing.",
    description:
      "I built Echo AI after spraining my wrist. A privacy first macOS dictation app: seamless speech to text that lets me create, code, message, and write entirely by voice, then polishes the result in my own style. It runs on Apple Intelligence on device rather than a paid API, so there are no cloud costs and nothing ever leaves my Mac.",
    stack: ["SWIFT", "SPEECHANALYZER", "FOUNDATIONMODELS", "AVAUDIOENGINE"],
    year: "2026",
    status: "BUILDING",
    links: [],
    repo: "private",
  },
  {
    name: "GTM Engineer",
    teaser: "AI sales, running on autopilot.",
    description:
      "An AI sales platform that prospects, enriches, and runs outreach on autopilot from public market signals.",
    stack: ["NEXT.JS", "PYTHON", "AUTOMATIONS"],
    year: "2026",
    status: "BUILDING",
    links: [],
  },
  {
    name: "Content.io",
    teaser: "Kill the search for viral content.",
    description:
      "A content research engine for creators. You describe your niche, your location, and the brand you are building. The AI then finds creators like you, scans the last 90 days of their output, and returns a ranked list of what actually went viral. Instead of scrolling for hours looking for inspiration, you get proven formats you can rebuild for your own audience.",
    stack: ["AI", "CONTENT", "RESEARCH"],
    year: "2025",
    status: "LIVE",
    statusLabel: "LIVE / INTERNAL USE",
    links: [],
  },
  {
    name: "STHLM Active",
    teaser: "A network for Sweden's founders under 30.",
    description:
      "A network for Sweden's CEOs and founders under 30, where they meet, solve problems, and build together.",
    stack: ["NEXT.JS", "TAILWIND", "SUPABASE"],
    year: "2024",
    status: "LIVE",
    links: [{ label: "LIVE", href: "https://sthlmactive.se" }],
  },
];

type IndexVar = CSSProperties & { "--i"?: number };

export default function BuildList() {
  const ref = useRef<HTMLUListElement>(null);
  // Touch-only expand state — one row open at a time. Ignored on hover devices,
  // where CSS `:hover` / `:focus-within` drives the reveal instead.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Reveal each row as it scrolls into view (one-shot entrance).
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const rows = root.querySelectorAll<HTMLElement>(".build-row");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  const toggle = (i: number) =>
    setOpenIndex((cur) => (cur === i ? null : i));

  return (
    <ul className="build-list" ref={ref}>
      {BUILDS.map((build, i) => {
        const open = openIndex === i;
        return (
          <li
            className="build-row"
            key={build.name}
            data-open={open ? "" : undefined}
            style={{ "--i": i } as IndexVar}
          >
            <button
              type="button"
              className="build-head"
              aria-expanded={open}
              onClick={() => toggle(i)}
            >
              <span className="build-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="build-main">
                <span className="build-name">{build.name}</span>
                <span className="build-teaser">{build.teaser}</span>
              </span>

              <span className="build-meta">
                <span
                  className={`build-status build-status--${build.status.toLowerCase()}`}
                >
                  <span className="build-status-dot" aria-hidden="true" />
                  {build.statusLabel ?? build.status}
                </span>
                <span className="build-year">{build.year}</span>
              </span>

              <span className="build-arrow" aria-hidden="true">
                ↗
              </span>
            </button>

            <div className="build-reveal">
              <div className="build-reveal-inner">
                <p className="build-desc">{build.description}</p>

                {build.stack.length > 0 && (
                  <ul className="build-stack" aria-label="Stack">
                    {build.stack.slice(0, 4).map((tag) => (
                      <li className="build-tag" key={tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}

                {(build.links.length > 0 || build.repo === "private") && (
                  <div className="build-links">
                    {build.links.map((link) => (
                      <a
                        className="build-link"
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                        <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                    {build.repo === "private" && (
                      <span className="build-private">Private</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
