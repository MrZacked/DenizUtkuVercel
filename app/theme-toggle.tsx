"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

function subscribe() {
  return () => {};
}

type ThemeTransition = {
  ready: Promise<unknown>;
  finished: Promise<unknown>;
  skipTransition: () => void;
};

type ThemeDocument = Document & {
  startViewTransition?: (update: () => void) => ThemeTransition;
};

type ThemeReveal = {
  theme: "light" | "dark";
  transition: ThemeTransition | null;
};

export function ThemeToggle() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { resolvedTheme, setTheme } = useTheme();
  const transitionTimer = useRef<number | null>(null);
  const reveal = useRef<ThemeReveal | null>(null);

  useEffect(() => () => {
    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
      document.documentElement.removeAttribute("data-theme-transition");
    }
    const active = reveal.current;
    reveal.current = null;
    active?.transition?.skipTransition();
    if (active) document.documentElement.removeAttribute("data-theme-reveal");
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = mounted
    ? `Switch to ${isDark ? "light" : "dark"} mode`
    : "Change color theme";

  function changeTheme() {
    if (!mounted) return;

    const root = document.documentElement;
    const currentTheme = reveal.current?.theme ?? resolvedTheme;
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    const active = reveal.current;
    reveal.current = null;
    active?.transition?.skipTransition();
    if (active) root.removeAttribute("data-theme-reveal");
    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
      transitionTimer.current = null;
      root.removeAttribute("data-theme-transition");
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.removeAttribute("data-theme-transition");
      setTheme(nextTheme);
      return;
    }

    const themeDocument = document as ThemeDocument;
    if (typeof themeDocument.startViewTransition === "function") {
      const next: ThemeReveal = { theme: nextTheme, transition: null };
      reveal.current = next;
      root.setAttribute("data-theme-reveal", "");
      try {
        const transition = themeDocument.startViewTransition(() => {
          if (reveal.current === next) flushSync(() => setTheme(nextTheme));
        });
        next.transition = transition;
        const finish = () => {
          if (reveal.current !== next) return;
          reveal.current = null;
          root.removeAttribute("data-theme-reveal");
        };
        void transition.ready.catch(() => {});
        void transition.finished.then(finish, finish);
        return;
      } catch {
        reveal.current = null;
        root.removeAttribute("data-theme-reveal");
      }
    }

    root.setAttribute("data-theme-transition", "");
    window.getComputedStyle(root).getPropertyValue("color");
    transitionTimer.current = window.setTimeout(() => {
      root.removeAttribute("data-theme-transition");
      transitionTimer.current = null;
    }, 1000);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      title={label}
      disabled={!mounted}
      onClick={changeTheme}
    >
      <Sun className="theme-icon-light" size={20} strokeWidth={1.75} aria-hidden="true" focusable="false" />
      <Moon className="theme-icon-dark" size={20} strokeWidth={1.75} aria-hidden="true" focusable="false" />
    </button>
  );
}
