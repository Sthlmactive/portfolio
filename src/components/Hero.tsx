import type { CSSProperties } from "react";

type DelayStyle = CSSProperties & { "--delay": string };

function delay(seconds: number): DelayStyle {
  return { "--delay": `${seconds}s` };
}

export default function Hero() {
  return (
    <section className="hero">
      {/* Center */}
      <div className="hero-center">
        <p className="hero-kicker fade-rise" style={delay(0.85)}>
          Founder · Builder · 21
        </p>

        <h1 className="hero-name fade-rise" style={delay(0.95)}>
          Building impact driven companies with a lot of cool people.
        </h1>
      </div>

      {/* Bottom cue */}
      <footer className="hero-bottom fade-rise" style={delay(1.15)}>
        <span className="swipe-bar" aria-hidden="true" />
        <span>Selected work</span>
      </footer>
    </section>
  );
}
