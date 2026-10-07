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

function countClass(markup, name) {
  return Array.from(markup.matchAll(/\bclass="([^"]+)"/g), ([, classes]) => classes.split(/\s+/))
    .filter((classes) => classes.includes(name)).length;
}

function componentSource(name) {
  const file = ts.createSourceFile("landscape-scenes.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const component = file.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === name);
  assert.ok(component, `${name} is missing`);
  return component.getText(file);
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

function blendedColor(foreground, background, opacity) {
  const channel = (hex, position) => parseInt(hex.slice(position, position + 2), 16);
  return `#${[1, 3, 5].map((position) => Math.round(
    channel(foreground, position) * opacity + channel(background, position) * (1 - opacity),
  ).toString(16).padStart(2, "0")).join("")}`;
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
  assert.match(rules[0], /color:\s*var\(--scene-ink\)/);
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
      const ratio = contrast(palette["--scene-ink"], palette[surface]);
      assert.ok(ratio >= 4.5, `${mode} text on ${surface}: ${ratio.toFixed(2)}`);
    }
  }
});

test("landscape illustrations are decorative with no focusable or interactive content", () => {
  const ids = [];
  for (const name of ["ValleyScene", "ExperienceTerrain", "ForestEdge", "CaveScene", "CaveFloor"]) {
    const markup = renderToStaticMarkup(React.createElement(exportsHolder.exports[name]));
    assert.match(markup, /^<div\b[^>]*\baria-hidden="true"/);
    const drawings = Array.from(markup.matchAll(/<svg\b[^>]*>/g), ([drawing]) => drawing);
    assert.ok(drawings.length);
    for (const drawing of drawings) assert.match(drawing, /\bfocusable="false"/);
    assert.doesNotMatch(markup, /<(?:a|button|input|select|textarea|iframe)\b|\btabindex=|\bon\w+=/i);
    ids.push(...Array.from(markup.matchAll(/\bid="([^"]+)"/g), ([, id]) => id));
  }
  assert.equal(new Set(ids).size, ids.length, "paired edge crops must not repeat gradient IDs");
  const references = Array.from(css.matchAll(/url\(["']?#([^"')]+)["']?\)/g), ([, id]) => id);
  assert.ok(references.length >= 2, "the cave gradients need matching references");
  for (const id of references) {
    assert.ok(ids.includes(id), `${id} must point to an existing drawing definition`);
  }
});

test("Experience has quiet terrain behind its details without covering controls", () => {
  assert.match(pageSource, /className="experience-section"[^>]*>\s*<ExperienceTerrain\s*\/>/);
  assert.ok(zIndexFor(".experience-body") > zIndexFor(".experience-terrain"));
  assert.ok(rulesFor(".experience-terrain").some((block) => /pointer-events:\s*none/.test(block)));
  assert.match(rulesFor(".experience-terrain").join("\n"), /opacity:\s*var\(--experience-terrain-opacity\)/);
  const light = paletteFor(":root");
  const dark = { ...light, ...paletteFor('html[data-theme="dark"]') };
  assert.ok(Number(light["--experience-terrain-opacity"]) > 0);
  assert.ok(Number(light["--experience-terrain-opacity"]) <= 0.2);
  assert.ok(Number(dark["--experience-terrain-opacity"]) > Number(light["--experience-terrain-opacity"]));
  assert.ok(Number(dark["--experience-terrain-opacity"]) <= 0.3);
  for (const [mode, palette] of Object.entries({ light, dark })) {
    const opacity = Number(palette["--experience-terrain-opacity"]);
    for (const terrain of ["--forest-distant", "--forest-middle", "--forest-trail"]) {
      const surface = blendedColor(palette[terrain], palette["--experience-bg"], opacity);
      for (const foreground of ["--ink", "--muted"]) {
        assert.ok(contrast(palette[foreground], surface) >= 4.5, `${mode} ${foreground} behind ${terrain}`);
      }
    }
  }
  const markup = renderToStaticMarkup(React.createElement(exportsHolder.exports.ExperienceTerrain));
  assert.doesNotMatch(markup, /preserveAspectRatio="none"/);
  assert.equal(countClass(markup, "experience-terrain-panel"), 1);
  assert.equal(countClass(markup, "experience-terrain-continuous"), 1);
  assert.equal(countClass(markup, "forest-panels"), 1);
  assert.equal((markup.match(/viewBox="0 0 1600 1600"/g) || []).length, 2);
  assert.doesNotMatch(markup, /terrain-tree|forest-trees|experience-terrain-(?:upper|lower)/);
  assert.doesNotMatch(componentSource("ExperienceTerrain"), /<Pine\b/);
});

test("the forest spans the projects and the cave joins About to Contact", () => {
  const forest = renderToStaticMarkup(React.createElement(exportsHolder.exports.ForestEdge));
  assert.match(forest, /forest-depth-back/);
  assert.match(forest, /forest-depth-front/);
  assert.ok(rulesFor(".projects-section").some((block) => /padding-bottom:\s*clamp\(8rem,/.test(block)));
  assert.ok(rulesFor(".forest-edge").every((block) => !/height:\s*22rem/.test(block)));
  assert.match(pageSource, /id="about"[^>]*data-motion-scene="cave"/);
  assert.match(pageSource, /<CaveScene\s*\/>/);
  assert.match(pageSource, /<footer[^>]*>[\s\S]*?<CaveFloor\s*\/>/);
  assert.doesNotMatch(pageSource, /WoodlandScene/);
  const light = paletteFor(":root");
  const dark = { ...light, ...paletteFor('html[data-theme="dark"]') };
  for (const palette of [light, dark]) assert.equal(palette["--about-bg"], palette["--contact-bg"]);
});

test("the irregular cave entrance overlaps only decorative space above About", () => {
  const rules = rulesFor(".cave-mouth").join("\n");
  assert.match(rules, /(?:inset|top):\s*-\d/);
  assert.ok(rulesFor(".about-section").every((block) => !/overflow:\s*(?:hidden|clip)/.test(block)));
  assert.ok(zIndexFor(".about-inner") > zIndexFor(".cave-scene"));
  assert.ok(rulesFor(".cave-scene").some((block) => /pointer-events:\s*none/.test(block)));
  const cave = renderToStaticMarkup(React.createElement(exportsHolder.exports.CaveScene));
  assert.match(cave, /cave-root/);
  assert.match(cave, /cave-stratum/);
  assert.match(cave, /cave-water/);
  assert.doesNotMatch(cave, /cave-forest|forest-threshold-trees|forest-trees/);
  assert.doesNotMatch(componentSource("CaveScene"), /<Pine\b/);
});

test("the cavern has an opening, a rim and light without restarting the forest", () => {
  const cave = renderToStaticMarkup(React.createElement(exportsHolder.exports.CaveScene));
  for (const className of ["cave-opening", "cave-opening-rim", "cave-light-shaft"]) {
    assert.ok(countClass(cave, className) > 0, `${className} gives the cavern depth`);
  }
  assert.match(cave, /viewBox="0 0 1600 1000"/);
  assert.match(cave, /cave-striation/);
  const floor = renderToStaticMarkup(React.createElement(exportsHolder.exports.CaveFloor));
  const paths = Array.from(floor.matchAll(/<path\b[^>]*\bclass="cave-(?:distant|rock|near)"[^>]*\bd="([^"]+)"/g), ([, path]) => path);
  assert.ok(paths.length >= 2);
  for (const path of paths) assert.match(path, /[cCqQ]/, "the floor should continue with curved rock shapes");
  assert.ok(rulesFor(".cave-layer").every((block) => !/transparent\s+92%/.test(block)),
    "the cave should not fade into a separate empty section above Contact");
});

test("both cave palettes keep copy, links and focus visible on the rock planes", () => {
  const light = paletteFor(":root");
  const dark = { ...light, ...paletteFor('html[data-theme="dark"]') };
  for (const [mode, palette] of Object.entries({ light, dark })) {
    for (const surface of ["--about-bg", "--contact-bg", "--cave-distant", "--cave-rock", "--cave-facet", "--cave-near", "--cave-water", "--cave-shadow"]) {
      for (const foreground of ["--cave-ink", "--cave-muted", "--cave-accent", "--cave-hover"]) {
        const ratio = contrast(palette[foreground], palette[surface]);
        assert.ok(ratio >= 4.5, `${mode} ${foreground} on ${surface}: ${ratio.toFixed(2)}`);
      }
    }
  }
  assert.match(css, /\.about-section,\s*\.contact\s*\{[\s\S]*?--ink:\s*var\(--cave-ink\)/);
  const reducedRules = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.match(reducedRules, /\.forest-depth,[\s\S]*?\.cave-layer,[\s\S]*?transform:\s*none/);
});

test("forest layers behind copy retain contrast in both themes", () => {
  const light = paletteFor(":root");
  const dark = { ...light, ...paletteFor('html[data-theme="dark"]') };
  const opacity = Number(rulesFor(".forest-edge").join("\n").match(/opacity:\s*([\d.]+)\s*;/)?.[1]);
  assert.ok(opacity > 0 && opacity <= 1);
  for (const [mode, palette] of Object.entries({ light, dark })) {
    for (const tree of ["--forest-distant", "--forest-middle", "--forest-foreground"]) {
      const surface = blendedColor(palette[tree], palette["--projects-bg"], opacity);
      for (const foreground of ["--ink", "--muted", "--accent", "--link-hover"]) {
        assert.ok(contrast(palette[foreground], surface) >= 4.5, `${mode} ${foreground} behind ${tree}`);
      }
    }
  }
  for (const selector of [".forest-layer", ".forest-depth"]) {
    assert.ok(rulesFor(selector).every((block) => !/opacity:/.test(block)), "opacity belongs on the shared artwork wrapper");
  }
});

test("forest and cave artwork keep their proportions as the content height changes", () => {
  for (const name of ["ForestEdge", "CaveScene"]) {
    const markup = renderToStaticMarkup(React.createElement(exportsHolder.exports[name]));
    assert.doesNotMatch(markup, /preserveAspectRatio="none"/);
    assert.match(markup, /preserveAspectRatio="x(?:Mid|Max)YMid slice"/);
  }
  const forest = renderToStaticMarkup(React.createElement(exportsHolder.exports.ForestEdge));
  for (const grove of ["upper", "middle", "lower"]) assert.match(forest, new RegExp(`forest-grove-${grove}`));
  const cave = renderToStaticMarkup(React.createElement(exportsHolder.exports.CaveScene));
  assert.doesNotMatch(cave, /forest-threshold-trees/);
  assert.match(cave, /cave-striation/);
});

test("paired terrain and forest panels retain the edges on phones", () => {
  for (const name of ["ExperienceTerrain", "ForestEdge"]) {
    const markup = renderToStaticMarkup(React.createElement(exportsHolder.exports[name]));
    const panels = Array.from(markup.matchAll(/<div class="forest-panels">([\s\S]*?)<\/div>/g), ([, contents]) => contents);
    assert.ok(panels.length);
    for (const panel of panels) {
      assert.equal((panel.match(/<svg\b/g) || []).length, 2);
      assert.match(panel, /preserveAspectRatio="xMinYMid slice"/);
      assert.match(panel, /preserveAspectRatio="xMaxYMid slice"/);
    }
  }
  assert.match(rulesFor(".forest-panels svg").join("\n"), /width:\s*50%/);
  assert.match(rulesFor(".forest-panels svg:first-child").join("\n"), /left:\s*0/);
  assert.match(rulesFor(".forest-panels svg:last-child").join("\n"), /right:\s*0/);
});

test("the cave stays cropped at the right edge on narrow screens", () => {
  const narrow = css.slice(css.indexOf("@media (max-width: 1000px)"), css.indexOf("@media (max-width: 760px)"));
  const canvas = narrow.match(/\.cave-layer svg\s*\{([^}]*)\}/)?.[1];
  assert.ok(canvas, "the narrow layout needs its own cave framing");
  const extension = canvas.match(/width:\s*calc\(100%\s*\+\s*([\d.]+)rem\)/);
  assert.ok(extension);
  assert.ok(Number(extension[1]) > 0 && Number(extension[1]) <= 16,
    "the wider canvas should keep the opening away from copy without excessive clipping");
  assert.ok(rulesFor(".cave-layer").some((block) => /overflow:\s*hidden/.test(block)),
    "the wider artwork must not create page overflow");
  const cave = renderToStaticMarkup(React.createElement(exportsHolder.exports.CaveScene));
  assert.equal((cave.match(/preserveAspectRatio="xMaxYMid slice"/g) || []).length, 2);
});

test("the narrow cave opening stays readable beneath About text", () => {
  const narrow = css.slice(css.indexOf("@media (max-width: 1000px)"), css.indexOf("@media (max-width: 760px)"));
  const layer = narrow.match(/\.cave-layer\s*\{([^}]*)\}/)?.[1];
  assert.ok(layer);
  const opacity = Number(layer.match(/opacity:\s*([\d.]+)/)?.[1]);
  assert.ok(opacity > 0 && opacity <= 0.35);
  const light = paletteFor(":root");
  const dark = { ...light, ...paletteFor('html[data-theme="dark"]') };
  for (const [mode, palette] of Object.entries({ light, dark })) {
    const glow = palette["--cave-glow"].match(/rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)%\)/);
    assert.ok(glow);
    const glowColor = `#${glow.slice(1, 4).map((channel) => Number(channel).toString(16).padStart(2, "0")).join("")}`;
    const background = blendedColor(glowColor, palette["--about-bg"], Number(glow[4]) / 100);
    const surface = blendedColor(palette["--cave-opening"], background, opacity);
    assert.ok(contrast(palette["--cave-ink"], surface) >= 4.5, `${mode} copy beneath the cave opening`);
  }
});

test("the scenic handoff has a bounded spacing budget instead of two large blank sections", () => {
  const projects = rulesFor(".projects-section")[0];
  const about = rulesFor(".about-section")[0];
  assert.match(projects, /padding-bottom:\s*clamp\(8rem,\s*11vw,\s*11rem\)/);
  assert.match(about, /padding-top:\s*clamp\(8rem,\s*11vw,\s*11rem\)/);
  assert.match(about, /min-height:\s*40rem/);
  assert.ok(rulesFor(".about-section").some((block) => /padding-block:\s*8rem\s+5rem/.test(block)));
  assert.ok(rulesFor(".forest-depth-back").some((block) => /var\(--forest-back-shift/.test(block)));
  assert.ok(rulesFor(".forest-depth-front").some((block) => /var\(--forest-front-shift/.test(block)));
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
