"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { lockScroll, unlockScroll } from "@/lib/smoothScroll";

// Static nav — rendered server-side so the links are always in the initial
// HTML (crawler-visible). JS only toggles the open/closed state. Root-relative
// hrefs so the section links work from the home page AND the /books page.
type NavLink = { label: string; href?: string; booking?: boolean };
const LINKS: NavLink[] = [
  { label: "Story", href: "/#story" },
  { label: "Builds", href: "/builds" },
  { label: "About", href: "/#about" },
  { label: "Books", href: "/books" },
  { label: "Contact", booking: true },
];

type IndexVar = CSSProperties & { "--i"?: number };

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");

  // Track the current section hash so active state works on the home page.
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // Open/close side effects: scroll lock + ESC to close.
  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [open]);

  const isActive = (link: NavLink) => {
    if (link.booking || !link.href) return false;
    if (link.href === "/books") return pathname === "/books";
    if (link.href.startsWith("/#")) {
      return pathname === "/" && hash === link.href.slice(1);
    }
    return pathname === link.href;
  };

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <Link href="/" className="site-brand" onClick={close}>
        Oskar Tang
      </Link>

      <nav
        id="primary-nav"
        className="site-nav"
        aria-label="Primary"
        data-open={open ? "" : undefined}
      >
        <ul className="nav-list">
          {LINKS.map((link, i) => {
            const active = isActive(link);
            const inner = (
              <>
                <span className="nav-index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="nav-text">{link.label}</span>
              </>
            );
            return (
              <li
                className="nav-item"
                key={link.label}
                style={{ "--i": i } as IndexVar}
              >
                {link.booking ? (
                  <button
                    type="button"
                    className="nav-link"
                    onClick={() => {
                      close();
                      window.dispatchEvent(
                        new CustomEvent("oskar:open-booking"),
                      );
                    }}
                  >
                    {inner}
                  </button>
                ) : (
                  <Link
                    href={link.href!}
                    className={`nav-link${active ? " is-active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={close}
                  >
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-toggle-box" aria-hidden="true">
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </span>
      </button>
    </header>
  );
}
