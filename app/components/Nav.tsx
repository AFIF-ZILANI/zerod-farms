"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "../lib/constants";

const NAV_HEIGHT = 48; // h-12 — kept in sync with the bar height below

// `solid` renders the opaque bar from the first paint — for pages without a
// dark hero behind the nav (e.g. batch pages), where the transparent state
// would put light text on a light background until hydration.
export function Nav({ solid: alwaysSolid = false }: { solid?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(alwaysSolid);

  // Transparent while the hero sits behind the bar; solid once it's scrolled past.
  useEffect(() => {
    if (alwaysSolid) return;
    const hero = document.getElementById("hero");
    if (!hero) {
      // No hero on this route → always solid (deferred to keep the effect pure).
      const frame = requestAnimationFrame(() => setScrolled(true));
      return () => cancelAnimationFrame(frame);
    }
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px`, threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [alwaysSolid]);

  // Solid look also while the mobile menu is open, so bar + panel read as one.
  const solid = scrolled || mobileMenuOpen;

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen, closeMobileMenu]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 ease-out ${
        solid
          ? "bg-ivory-shell/95 backdrop-blur-md border-b border-steel-mesh/20 shadow-[0_1px_0_0_rgba(20,18,15,0.05),0_12px_28px_-18px_rgba(20,18,15,0.45)]"
          : "bg-transparent border-b border-transparent"
      }`}
      aria-label="Main navigation"
    >
      {/* Scrim keeps the light logo + links legible over the hero image */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-black/55 to-transparent transition-opacity duration-500 ${
          solid ? "opacity-0" : "opacity-100"
        }`}
      />

      <div className="relative max-w-content mx-auto px-6 h-12 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center" aria-label="ZeroD Farms — home">
          <Image
            src="/zerod-farms-logo.svg"
            alt="ZeroD Farms"
            width={110}
            height={30}
            className={`transition duration-500 ${solid ? "" : "invert"}`}
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-mono text-caption transition-colors ${
                solid
                  ? "text-steel-mesh hover:text-ink-black"
                  : "text-ivory-shell/85 hover:text-ivory-shell"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 min-touch items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`block w-5 h-0.5 transition-all duration-200 ${solid ? "bg-ink-black" : "bg-ivory-shell"} ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 transition-all duration-200 ${solid ? "bg-ink-black" : "bg-ivory-shell"} ${mobileMenuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 transition-all duration-200 ${solid ? "bg-ink-black" : "bg-ivory-shell"} ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-steel-mesh/20 bg-ivory-shell"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-body-m text-steel-mesh hover:text-ink-black transition-colors py-2"
                onClick={closeMobileMenu}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
