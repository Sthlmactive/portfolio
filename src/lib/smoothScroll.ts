import type Lenis from "lenis";

// Lets components (e.g. a modal) lock page scroll. When Lenis is active we
// stop it; otherwise (reduced motion — Lenis not initialized) we fall back
// to overflow:hidden on the document element.
let instance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null): void {
  instance = lenis;
}

export function lockScroll(): void {
  if (instance) {
    instance.stop();
  } else if (typeof document !== "undefined") {
    document.documentElement.style.overflow = "hidden";
  }
}

export function unlockScroll(): void {
  if (instance) {
    instance.start();
  } else if (typeof document !== "undefined") {
    document.documentElement.style.overflow = "";
  }
}
