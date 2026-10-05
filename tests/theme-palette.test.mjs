import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function tokens(selector) {
  const block = css.slice(css.indexOf(`${selector} {`)).split("}")[0];
  return Object.fromEntries(Array.from(block.matchAll(/(--[\w-]+):\s*([^;]+);/g), ([, name, value]) => [name, value]));
}

const light = tokens(":root");
const dark = { ...light, ...tokens('html[data-theme="dark"]') };
const surfaces = ["--paper", "--header-bg", "--projects-bg", "--contact-bg", "--experience-bg", "--about-bg"];

function luminance(hex) {
  assert.match(hex, /^#[\da-f]{6}$/i);
  const channels = hex.slice(1).match(/../g).map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("each section surface changes with the selected theme", () => {
  for (const name of [...surfaces, "--clay", "--deep"]) {
    assert.notEqual(light[name], dark[name], name);
  }
});

test("both palettes keep normal text, muted text and links readable on section surfaces", () => {
  for (const [mode, palette] of Object.entries({ light, dark })) {
    for (const surface of surfaces) {
      const foregrounds = ["--about-bg", "--contact-bg"].includes(surface)
        ? ["--cave-ink", "--cave-muted", "--cave-accent", "--cave-hover"]
        : ["--ink", "--muted", "--accent", "--link-hover"];
      for (const foreground of foregrounds) {
        const ratio = contrast(palette[surface], palette[foreground]);
        assert.ok(ratio >= 4.5, `${mode} ${foreground} on ${surface}: ${ratio.toFixed(2)}`);
      }
    }
  }
});

test("light sections are genuinely light rather than slightly different dark greens", () => {
  for (const surface of [...surfaces, "--valley-bg", "--clay", "--cave-distant", "--cave-rock", "--cave-facet", "--cave-near", "--cave-water"]) {
    assert.ok(luminance(light[surface]) >= 0.5, `${surface} must stay light in the daytime palette`);
    assert.ok(luminance(dark[surface]) < 0.1, `${surface} must stay dark in the nighttime palette`);
  }
  assert.notEqual(light["--experience-bg"], light["--projects-bg"]);
  assert.notEqual(light["--projects-bg"], light["--about-bg"]);
});

test("clay panels retain contrasting text, links and focus colors in both themes", () => {
  for (const palette of [light, dark]) {
    for (const foreground of ["--clay-ink", "--clay-muted", "--clay-accent", "--clay-hover"]) {
      assert.ok(contrast(palette["--clay"], palette[foreground]) >= 4.5, foreground);
    }
  }
  assert.match(css, /\.project-healem\s*\{[^}]*color:\s*var\(--clay-ink\)/);
  assert.match(css, /\.project-healem a:focus-visible\s*\{[^}]*var\(--clay-accent\)/);
});

test("the hero and construction photo use separate day and night overlays and text", () => {
  for (const name of ["--hero-ink", "--hero-accent", "--hero-hover", "--hero-overlay", "--experience-photo-ink", "--experience-photo-muted", "--experience-photo-accent", "--experience-overlay", "--experience-overlay-mobile"]) {
    assert.notEqual(light[name], dark[name], name);
  }
  assert.match(css, /\.hero::before\s*\{[^}]*background:\s*var\(--hero-overlay\)/);
  assert.match(css, /\.experience-heading::before\s*\{[^}]*background:\s*var\(--experience-overlay\)/);
  assert.match(css, /\.experience-heading::before\s*\{[^}]*background:\s*var\(--experience-overlay-mobile\)/);
  assert.match(css, /\.experience-lead\s*\{[^}]*color:\s*var\(--experience-photo-muted\)/);
});

test("theme control borders and hover states are visible in both palettes", () => {
  for (const palette of [light, dark]) {
    assert.ok(contrast(palette["--toggle-border"], palette["--header-bg"]) >= 3);
    assert.ok(contrast(palette["--ink"], palette["--toggle-hover"]) >= 4.5);
    assert.ok(contrast(palette["--accent"], palette["--toggle-hover"]) >= 3);
  }
});

test("day and night artwork references resolve to local SVG files", () => {
  assert.notEqual(light["--hero-day"], light["--hero-night"]);
  for (const name of ["--hero-day", "--hero-night"]) {
    const path = light[name].match(/^url\("(\/work\/[^\"]+\.svg)"\)$/)?.[1];
    assert.ok(path);
    const artwork = readFileSync(new URL(`../public${path}`, import.meta.url), "utf8");
    assert.match(artwork, /<svg\b/);
    assert.doesNotMatch(artwork, /<script\b|<image\b|href="https?:/i);
  }
});

test("the celestial bodies stay separate from the sky so they can move independently", () => {
  for (const file of ["horizon-sky.svg", "horizon-night.svg"]) {
    const artwork = readFileSync(new URL(`../public/work/${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(artwork, /r="(?:54|68)"/);
  }
  for (const file of ["horizon-sun.svg", "horizon-moon.svg"]) {
    const artwork = readFileSync(new URL(`../public/work/${file}`, import.meta.url), "utf8");
    assert.match(artwork, /viewBox="0 0 1600 900"/);
    assert.doesNotMatch(artwork, /<script\b|<image\b|href="https?:/i);
  }
});

test("theme animation is limited to explicit changes and honors reduced motion", () => {
  const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(layout, /disableTransitionOnChange/);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*html\[data-theme-transition\]/);
  for (const name of ["celestial-sun", "celestial-moon", "hero-layer-sky", "hero-layer-night"]) {
    assert.match(css, new RegExp(`html\\[data-theme-transition\\] :is\\([^)]*\\.${name}[^)]*\\) \\{\\s*transition:`));
  }
  const motionRules = css.slice(css.indexOf("@media (prefers-reduced-motion: no-preference)"));
  assert.doesNotMatch(motionRules, /transition:\s*(?:background-color|color)/);
  for (const [, properties] of motionRules.matchAll(/transition:\s*([^;]+);/g)) {
    assert.doesNotMatch(properties, /(?:^|,)\s*(?:fill|stroke|background(?:-color)?|color|all)\b/);
  }
});

test("the native theme reveal clips complete palettes instead of fading text", () => {
  assert.match(css, /html\[data-theme-reveal\]::view-transition\s*\{\s*pointer-events:\s*none/);
  assert.match(css, /html\[data-theme-reveal\]::view-transition-new\(root\)\s*\{\s*z-index:\s*2;\s*animation:\s*theme-reveal 500ms/);
  const revealFrames = css.slice(css.indexOf("@keyframes theme-reveal") + "@keyframes theme-reveal".length).split("@keyframes")[0];
  assert.match(revealFrames, /from\s*\{\s*clip-path:\s*inset\(0 0 100% 0\)/);
  assert.match(revealFrames, /to\s*\{\s*clip-path:\s*inset\(0\)/);
  assert.doesNotMatch(revealFrames, /opacity:|transform:/);
  const reducedRules = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.match(reducedRules, /html\[data-theme-reveal\]::view-transition-new\(root\)\s*\{\s*animation:\s*none;\s*mix-blend-mode:\s*normal/);
});

test("hero entrances finish quickly with the main text visible from the first frame", () => {
  assert.match(css, /\.hero-scene\s*\{[^}]*animation:\s*scene-arrive 600ms/);
  assert.match(css, /\.hero-intro\s*\{[^}]*animation:\s*copy-arrive 480ms/);
  assert.match(css, /\.hero h1 span\s*\{[^}]*animation:\s*title-arrive 520ms/);
  assert.match(css, /\.hero-intro\s*\{\s*animation-delay:\s*80ms/);
  assert.match(css, /\.hero h1 span:last-child\s*\{[^}]*animation-delay:\s*60ms/);
  for (const name of ["copy-arrive", "title-arrive"]) {
    const frames = css.slice(css.indexOf(`@keyframes ${name}`) + `@keyframes ${name}`.length).split("@keyframes")[0];
    assert.match(frames, /from\s*\{\s*opacity:\s*1;/);
  }
});
