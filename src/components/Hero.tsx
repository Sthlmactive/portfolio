import type { CSSProperties } from "react";

// Letter reveal timing: OSKAR reveals first, then TANG continues the stagger.
const LETTER_BASE_DELAY = 0.15; // seconds before the first letter rises
const LETTER_STAGGER = 0.05; // ~50ms per letter

type DelayStyle = CSSProperties & { "--delay": string };

function delay(seconds: number): DelayStyle {
  return { "--delay": `${seconds}s` };
}

// Render a word as masked, individually-animated letters.
function RevealWord({ word, startIndex }: { word: string; startIndex: number }) {
  return (
    <span className="reveal-row">
      {word.split("").map((char, i) => (
        <span
          key={i}
          className="letter"
          style={delay(LETTER_BASE_DELAY + (startIndex + i) * LETTER_STAGGER)}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section className="hero">
      {/* Top bar */}
      <header className="hero-topbar fade-rise" style={delay(0.7)}>
        <span>Portfolio — 2026</span>
        <span>Stockholm, SE</span>
      </header>

      {/* Center */}
      <div className="hero-center">
        <p className="hero-kicker fade-rise" style={delay(0.85)}>
          Founder · Builder · 20
        </p>

        <h1 className="hero-name">
          <RevealWord word="OSKAR" startIndex={0} />
          <RevealWord word="TANG" startIndex={5} />
        </h1>

        <p className="hero-lede fade-rise" style={delay(1.0)}>
          I build B2B products that ship — solo, fast, from positioning to
          production.
        </p>
      </div>

      {/* Bottom cue */}
      <footer className="hero-bottom fade-rise" style={delay(1.15)}>
        <span className="swipe-bar" aria-hidden="true" />
        <span>Selected work</span>
      </footer>
    </section>
  );
}
