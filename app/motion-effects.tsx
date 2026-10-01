"use client";

import { useEffect } from "react";

export function MotionEffects() {
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main || !("IntersectionObserver" in window) || !("animate" in Element.prototype)) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 761px)");
    const revealed = new WeakSet<Element>();
    const targets = Array.from(main.querySelectorAll<HTMLElement>("[data-reveal]"));
    const scenes = Array.from(main.querySelectorAll<HTMLElement>("[data-motion-scene]"));
    const footer = document.querySelector<HTMLElement>(".contact-inner");
    if (footer) targets.push(footer);

    let stop: (() => void) | undefined;

    function start() {
      stop?.();
      if (preference.matches) return;

      const animations = new Map<Element, Animation>();
      const revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting || revealed.has(entry.target)) continue;
            const element = entry.target as HTMLElement;
            revealed.add(element);
            revealObserver.unobserve(element);

            if (element.contains(document.activeElement)) continue;
            const image = element.dataset.reveal === "image";
            const animation = element.animate(
              [
                { opacity: image ? 0.9 : 1, transform: image ? "translateY(16px) scale(0.99)" : "translateY(12px)" },
                { opacity: 1, transform: "translateY(0) scale(1)" },
              ],
              {
                duration: image ? 520 : 420,
                delay: Math.min(Number(element.dataset.revealDelay) || 0, 160),
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "backwards",
              },
            );
            animations.set(element, animation);
            animation.finished.then(
              () => animations.delete(element),
              () => animations.delete(element),
            );
          }
        },
        { threshold: 0, rootMargin: "80px 0px" },
      );

      for (const target of targets) {
        const bounds = target.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) {
          revealed.add(target);
        } else if (!revealed.has(target)) {
          revealObserver.observe(target);
        }
      }

      function showFocused(event: FocusEvent) {
        if (!(event.target instanceof Element)) return;
        for (const target of targets) {
          if (!target.contains(event.target)) continue;
          revealed.add(target);
          revealObserver.unobserve(target);
          animations.get(target)?.cancel();
        }
      }

      const activeScenes = new Set<HTMLElement>();
      let frame = 0;

      function updateScenes() {
        frame = 0;
        if (document.hidden) return;
        const depth = desktop.matches ? 1 : 0.35;
        const viewportHeight = window.innerHeight;
        const updates = Array.from(activeScenes, (scene) => {
          const bounds = scene.getBoundingClientRect();
          const midpoint = bounds.top + bounds.height / 2;
          const travel = viewportHeight / 2 + bounds.height / 2;
          const progress = Math.max(-1, Math.min(1, (viewportHeight / 2 - midpoint) / travel));
          const heroOffset = Math.max(0, Math.min(bounds.height, -bounds.top));
          return { scene, progress, heroOffset };
        });

        for (const { scene, progress, heroOffset } of updates) {
          if (scene.dataset.motionScene === "horizon") {
            scene.style.setProperty("--sky-shift", `${(Math.min(heroOffset * 0.18, 100) * depth).toFixed(1)}px`);
            scene.style.setProperty("--ridge-shift", `${(Math.min(heroOffset * 0.1, 60) * depth).toFixed(1)}px`);
            scene.style.setProperty("--shore-shift", `${(Math.max(heroOffset * -0.035, -24) * depth).toFixed(1)}px`);
          } else if (scene.dataset.motionScene === "valley") {
            scene.style.setProperty("--valley-back-shift", `${(progress * 24 * depth).toFixed(1)}px`);
            scene.style.setProperty("--valley-front-shift", `${(progress * -38 * depth).toFixed(1)}px`);
          } else if (scene.dataset.motionScene === "forest") {
            scene.style.setProperty("--forest-shift", `${(progress * -24 * depth).toFixed(1)}px`);
          } else {
            scene.style.setProperty("--scene-shift", `${(progress * 30 * depth).toFixed(1)}px`);
          }
        }
      }

      function schedule() {
        if (!frame && activeScenes.size && !document.hidden) {
          frame = window.requestAnimationFrame(updateScenes);
        }
      }

      const sceneObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const scene = entry.target as HTMLElement;
            if (entry.isIntersecting) activeScenes.add(scene);
            else activeScenes.delete(scene);
          }
          schedule();
        },
        { rootMargin: "300px" },
      );
      scenes.forEach((scene) => sceneObserver.observe(scene));

      function resetScenes() {
        for (const scene of scenes) {
          for (const property of [
            "--sky-shift", "--ridge-shift", "--shore-shift", "--scene-shift",
            "--valley-back-shift", "--valley-front-shift", "--forest-shift",
          ]) {
            scene.style.removeProperty(property);
          }
        }
      }

      function resize() {
        resetScenes();
        schedule();
      }

      document.addEventListener("focusin", showFocused);
      document.addEventListener("visibilitychange", schedule);
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", resize, { passive: true });
      stop = () => {
        revealObserver.disconnect();
        sceneObserver.disconnect();
        animations.forEach((animation) => animation.cancel());
        window.cancelAnimationFrame(frame);
        resetScenes();
        document.removeEventListener("focusin", showFocused);
        document.removeEventListener("visibilitychange", schedule);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", resize);
      };
    }

    start();
    preference.addEventListener("change", start);
    return () => {
      stop?.();
      preference.removeEventListener("change", start);
    };
  }, []);

  return null;
}
