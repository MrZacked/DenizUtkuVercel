import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const source = readFileSync(new URL("../app/landscape-scenes.tsx", import.meta.url), "utf8");
const pageSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const motionSource = readFileSync(new URL("../app/motion-effects.tsx", import.meta.url), "utf8");

function rulesFor(selector) {
  return Array.from(css.matchAll(/([^{}]+)\{([^{}]*)\}/g))
    .filter(([, selectors]) => selectors.split(",").some((value) => value.trim() === selector))
    .map(([, , declarations]) => declarations);
}

function paletteFor(selector) {
  return Object.fromEntries(rulesFor(selector).flatMap((block) =>
    Array.from(block.matchAll(/(--[\w-]+):\s*([^;]+);/g), ([, name, value]) => [name, value])));
}

function zIndexFor(selector) {
  const declarations = rulesFor(selector).join("\n");
  const values = Array.from(declarations.matchAll(/z-index:\s*(-?\d+)\s*;/g), ([, value]) => Number(value));
  assert.ok(values.length, `${selector} has no stacking order`);
  return values.at(-1);
}

function luminance(hex) {
  assert.match(hex, /^#[\da-f]{6}$/i);
  const channels = hex.slice(1).match(/../g).map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(first, second) {
  const [brighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (brighter + 0.05) / (darker + 0.05);
}

const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    jsx: ts.JsxEmit.ReactJSX,
  },
}).outputText;
const exportsHolder = { exports: {} };
vm.runInNewContext(compiled, {
  module: exportsHolder,
  exports: exportsHolder.exports,
  require: (name) => {
    assert.equal(name, "react/jsx-runtime");
    return jsxRuntime;
  },
}, { filename: "landscape-scenes.js" });

test("the experience entry does not clip the landscape at the section boundary", () => {
  const rules = rulesFor(".experience-entry");
  assert.ok(rules.length);
  for (const block of rules) {
    assert.doesNotMatch(block, /overflow(?:-[xy])?:\s*(?:hidden|clip)/);
    assert.doesNotMatch(block, /(?:margin-top|top):\s*-/);
  }
  assert.match(rules[0], /background:\s*var\(--valley-bg\)/);
  assert.match(rules[0], /color:\s*var\(--light\)/);
});

test("only the decorative artwork extends upward and cannot intercept input", () => {
  const rules = rulesFor(".valley-scene");
  const artwork = rules.find((block) => /\btop:/.test(block));
  assert.ok(artwork);
  assert.match(artwork, /top:\s*calc\(-1\s*\*\s*clamp\(/);
  assert.match(artwork, /overflow:\s*(?:hidden|clip)/);
  assert.ok(rules.some((block) => /pointer-events:\s*none/.test(block)));
  assert.ok(rules.some((block) => /position:\s*absolute/.test(block)));
});

test("hero and experience share a stacking context with readable content above the bridge", () => {
  assert.ok(rulesFor(".intro-flow").some((block) => /isolation:\s*isolate/.test(block)));
  for (const selector of [".hero", ".experience-entry"]) {
    for (const block of rulesFor(selector)) assert.doesNotMatch(block, /isolation:\s*isolate/);
  }
  const bridgeOrder = zIndexFor(".valley-scene");
  assert.ok(zIndexFor(".hero-scene") < bridgeOrder);
  for (const selector of [".hero-inner", ".experience-entry .section-intro", ".experience-body"]) {
    assert.ok(zIndexFor(selector) > bridgeOrder, `${selector} must stay above the landscape`);
  }

  const page = ts.createSourceFile("page.tsx", pageSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const className = (element) => element.openingElement.attributes.properties.find((property) =>
    ts.isJsxAttribute(property) && property.name.text === "className")?.initializer?.text;
  let wrapper;
  const visit = (node) => {
    if (ts.isJsxElement(node) && className(node) === "intro-flow") wrapper = node;
    ts.forEachChild(node, visit);
  };
  visit(page);
  assert.ok(wrapper, "the landscape needs one shared wrapper");
  assert.deepEqual(wrapper.children.filter(ts.isJsxElement).map(className), ["hero", "experience-section"]);
});

test("scroll offsets initialize before the overlapping artwork reaches the viewport", () => {
  assert.match(motionSource, /const sceneObserver = new IntersectionObserver\([\s\S]*?rootMargin:\s*"300px"/);
});

test("both themes keep the experience copy readable on the green landscape planes", () => {
  const light = paletteFor(":root");
  const dark = { ...light, ...paletteFor('html[data-theme="dark"]') };
  for (const [mode, palette] of Object.entries({ light, dark })) {
    for (const surface of ["--valley-bg", "--scene-distant", "--scene-middle", "--scene-foreground"]) {
      const ratio = contrast(palette["--light"], palette[surface]);
      assert.ok(ratio >= 4.5, `${mode} text on ${surface}: ${ratio.toFixed(2)}`);
    }
  }
});

test("landscape illustrations are decorative with no focusable or interactive content", () => {
  for (const name of ["ValleyScene", "ForestEdge", "WoodlandScene"]) {
    const markup = renderToStaticMarkup(React.createElement(exportsHolder.exports[name]));
    assert.match(markup, /^<div\b[^>]*\baria-hidden="true"/);
    const drawings = Array.from(markup.matchAll(/<svg\b[^>]*>/g), ([drawing]) => drawing);
    assert.ok(drawings.length);
    for (const drawing of drawings) assert.match(drawing, /\bfocusable="false"/);
    assert.doesNotMatch(markup, /<(?:a|button|input|select|textarea|iframe)\b|\btabindex=|\bon\w+=/i);
  }
});

test("valley silhouettes enter below the canvas top instead of starting with a flat roof", () => {
  const markup = renderToStaticMarkup(React.createElement(exportsHolder.exports.ValleyScene));
  const paths = Array.from(markup.matchAll(/<path\b[^>]*\bd="([^"]+)"/g), ([, path]) => path);
  assert.ok(paths.length >= 4);
  for (const path of paths) {
    const start = path.match(/^[Mm]\s*(-?(?:\d*\.)?\d+)[ ,]+(-?(?:\d*\.)?\d+)/);
    assert.ok(start, path);
    assert.ok(Number(start[2]) > 0, `silhouette begins at the canvas edge: ${path}`);
  }
});
