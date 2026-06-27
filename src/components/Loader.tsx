"use client";

import { useEffect, useState } from "react";

// Timing: hold the curtain ~1.1s while "OSKAR TANG" rises, then wipe up
// over ~1s. The hero's letter-reveal is triggered at the wipe moment via
// the `hero-revealed` class on <html>.
const HOLD_MS = 1100;
const WIPE_MS = 1000;

export default function Loader() {
  const [phase, setPhase] = useState<"hold" | "wiping" | "done">("hold");

  useEffect(() => {
    const root = document.documentElement;

    // The inline pre-paint script (in layout) sets `loader-done` when the
    // loader should be skipped (already seen this session, or reduced motion).
    // In that case CSS keeps it hidden — nothing to animate.
    if (root.classList.contains("loader-done")) {
      return;
    }

    try {
      sessionStorage.setItem("oskar_loader", "1");
    } catch {
      // ignore (private mode etc.) — loader still plays once this load
    }

    const t1 = setTimeout(() => {
      setPhase("wiping");
      root.classList.add("hero-revealed"); // lift the hero as the curtain goes
    }, HOLD_MS);

    const t2 = setTimeout(() => {
      setPhase("done");
      root.classList.add("loader-done");
    }, HOLD_MS + WIPE_MS + 60);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`loader${phase === "wiping" ? " loader--wipe" : ""}`}
      aria-hidden="true"
    >
      <span className="loader-mask">
        <span className="loader-line">Oskar Tang</span>
      </span>
      <span className="loader-foot">Portfolio — 2026</span>
    </div>
  );
}
