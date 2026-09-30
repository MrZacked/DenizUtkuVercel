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
      for (const foreground of ["--ink", "--muted", "--accent", "--link-hover"]) {
        const ratio = contrast(palette[surface], palette[foreground]);
        assert.ok(ratio >= 4.5, `${mode} ${foreground} on ${surface}: ${ratio.toFixed(2)}`);
      }
    }
  }
});

test("photo overlays and clay panels retain contrasting text and focus colors", () => {
  for (const palette of [light, dark]) {
    for (const surface of ["--deep", "--clay"]) {
      for (const foreground of ["--light", "--warm-hover"]) {
        assert.ok(contrast(palette[surface], palette[foreground]) >= 4.5);
      }
      assert.ok(contrast(palette[surface], palette["--warm"]) >= 3);
    }
    assert.ok(contrast(palette["--deep"], palette["--warm"]) >= 4.5);
  }
});

test("theme control borders and hover states are visible in both palettes", () => {
  for (const palette of [light, dark]) {
    assert.ok(contrast(palette["--toggle-border"], palette["--header-bg"]) >= 3);
    assert.ok(contrast(palette["--ink"], palette["--toggle-hover"]) >= 4.5);
    assert.ok(contrast(palette["--accent"], palette["--toggle-hover"]) >= 3);
  }
});

test("day and night artwork references resolve to local SVG files", () => {
  assert.notEqual(light["--hero-sky"], dark["--hero-sky"]);
  for (const palette of [light, dark]) {
    const path = palette["--hero-sky"].match(/^url\("(\/work\/[^\"]+\.svg)"\)$/)?.[1];
    assert.ok(path);
    const artwork = readFileSync(new URL(`../public${path}`, import.meta.url), "utf8");
    assert.match(artwork, /<svg\b/);
    assert.doesNotMatch(artwork, /<script\b|<image\b|href="https?:/i);
  }
});
