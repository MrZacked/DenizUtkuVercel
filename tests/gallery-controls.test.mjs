import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const compiled = ts.transpileModule(readFileSync(new URL("../app/gallery-controls.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const holder = { exports: {} };
vm.runInNewContext(compiled, {
  module: holder,
  exports: holder.exports,
  require: (request) => { assert.equal(request, "react/jsx-runtime"); return jsxRuntime; },
}, { filename: "gallery-controls.js" });
const { GalleryControls, PhotoCredit } = holder.exports;

function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!React.isValidElement(node)) return [];
  return [node, ...elements(node.props.children)];
}

function controls(overrides = {}) {
  const steps = [];
  const tree = GalleryControls({ name: "Detection", title: "Street", index: 1, count: 3, ready: true, controls: "detection-example", onStep: (direction) => steps.push(direction), ...overrides });
  const buttons = elements(tree).filter((element) => element.type === "button");
  return { tree, buttons, steps };
}

test("arrows are native named buttons with a stable controlled frame", () => {
  const { tree, buttons, steps } = controls();
  assert.equal(tree.props.role, "group");
  assert.equal(tree.props["aria-label"], "Detection gallery controls");
  assert.deepEqual(buttons.map((button) => button.props["aria-label"]), ["Previous detection example", "Next detection example"]);
  for (const button of buttons) {
    assert.equal(button.props.type, "button");
    assert.equal(button.props["aria-controls"], "detection-example");
    assert.equal(button.props.disabled, false);
    button.props.onClick();
    const icon = elements(button).find((element) => element.type === "svg");
    assert.equal(icon.props["aria-hidden"], "true");
    assert.equal(icon.props.focusable, "false");
  }
  assert.deepEqual(steps, [-1, 1]);
});

test("current title and count share one polite atomic announcement", () => {
  const { tree } = controls();
  const current = elements(tree).find((element) => element.props.className === "gallery-current");
  assert.equal(current.props["aria-live"], "polite");
  assert.equal(current.props["aria-atomic"], "true");
  const spans = elements(current).filter((element) => element.type === "span");
  assert.equal(spans[0].props.children.join(""), "2 / 3");
  assert.equal(spans[1].props.children, "Street");
});

test("buttons and arrow shortcuts stay inactive before hydration or with one example", () => {
  for (const props of [{ ready: false }, { count: 1 }]) {
    const { tree, buttons, steps } = controls(props);
    assert.ok(buttons.every((button) => button.props.disabled));
    for (const key of ["ArrowLeft", "ArrowRight"]) {
      let prevented = false;
      tree.props.onKeyDown({ key, preventDefault: () => { prevented = true; } });
      assert.equal(prevented, false);
    }
    assert.deepEqual(steps, []);
  }
});

test("only left and right shortcuts prevent the browser default", () => {
  const { tree, steps } = controls();
  for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter", " "]) {
    let prevented = false;
    tree.props.onKeyDown({ key, preventDefault: () => { prevented = true; } });
    assert.equal(prevented, key === "ArrowLeft" || key === "ArrowRight");
  }
  assert.deepEqual(steps, [-1, 1]);
});

test("photo credit keeps the source, license and changes together", () => {
  const photo = { author: "Street photographer", source: "https://example.com/photo/street", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" };
  const tree = PhotoCredit({ photo, changes: "Resized for the gallery." });
  const links = elements(tree).filter((element) => element.type === "a");
  assert.deepEqual(links.map((link) => link.props.href), [photo.source, photo.licenseUrl]);
  assert.deepEqual(links.map((link) => link.props.children), [photo.author, photo.license]);
  for (const link of links) {
    assert.equal(link.props.target, "_blank");
    assert.equal(link.props.rel, "noopener noreferrer");
  }
  const markup = renderToStaticMarkup(tree);
  assert.match(markup, /Photo by /);
  assert.match(markup, /Resized for the gallery\./);
});
