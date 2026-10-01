"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

function subscribe() {
  return () => {};
}

export function ThemeToggle() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { resolvedTheme, setTheme } = useTheme();
  const transitionTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
      document.documentElement.removeAttribute("data-theme-transition");
    }
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = mounted
    ? `Switch to ${isDark ? "light" : "dark"} mode`
    : "Change color theme";

  function changeTheme() {
    if (!mounted) return;

    const root = document.documentElement;
    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
      transitionTimer.current = null;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.removeAttribute("data-theme-transition");
    } else {
      root.setAttribute("data-theme-transition", "");
      window.getComputedStyle(root).getPropertyValue("color");
      transitionTimer.current = window.setTimeout(() => {
        root.removeAttribute("data-theme-transition");
        transitionTimer.current = null;
      }, 1000);
    }

    setTheme(isDark ? "light" : "dark");
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
