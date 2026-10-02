import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const compiled = Object.fromEntries(["color-gallery", "color-comparison", "gallery-controls"].map((name) => [name, ts.transpileModule(
  readFileSync(new URL(`../app/${name}.tsx`, import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } },
).outputText]));

function loadComponents(hooks = React) {
  const modules = {};
  function load(name) {
    if (modules[name]) return modules[name];
    const holder = { exports: {} };
    vm.runInNewContext(compiled[name], {
      module: holder,
      exports: holder.exports,
      require: (request) => {
        if (request === "react") return hooks;
        if (request === "react/jsx-runtime") return jsxRuntime;
        if (request === "next/image") return { __esModule: true, default: ({ src, alt }) => React.createElement("img", { src, alt }) };
        assert.ok(request.startsWith("./"));
        return load(request.slice(2));
      },
    }, { filename: `${name}.js` });
    modules[name] = holder.exports;
    return holder.exports;
  }
  return { ...load("color-gallery"), ...load("color-comparison"), ...load("gallery-controls") };
}

function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!React.isValidElement(node)) return [];
  return [node, ...elements(node.props.children)];
}

function findElement(tree, predicate) {
  const found = elements(tree).filter(predicate);
  assert.equal(found.length, 1);
  return found[0];
}

const examples = ["street", "market", "harbour"].map((id) => ({
  id,
  title: id[0].toUpperCase() + id.slice(1),
  input: `/work/color-gallery/${id}-input.jpg`,
  output: `/work/color-gallery/${id}-output.jpg`,
  inputAlt: `Grayscale ${id}`,
  outputAlt: `${id} with estimated colors`,
  photo: { author: `${id} photographer`, source: `https://example.com/photos/${id}`, license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" },
}));

function mount({ server = false, samples = examples } = {}) {
  let selection;
  const components = loadComponents({
    useState: (initial) => {
      selection ??= initial;
      return [selection, (next) => { selection = typeof next === "function" ? next(selection) : next; }];
    },
    useSyncExternalStore: (_subscribe, getSnapshot, getServerSnapshot) => server ? getServerSnapshot() : getSnapshot(),
  });
  let tree;
  const render = () => { tree = components.ColorGallery({ examples: samples }); };
  render();
  const controls = () => findElement(tree, (element) => element.type === components.GalleryControls);
  return {
    components,
    tree: () => tree,
    controls,
    comparison: () => findElement(tree, (element) => element.type === components.ColorComparison),
    slide: () => findElement(tree, (element) => element.props.className === "gallery-slide"),
    frame: () => findElement(tree, (element) => element.props.className === "gallery-frame"),
    credit: () => findElement(tree, (element) => element.type === components.PhotoCredit),
    step: (direction) => { controls().props.onStep(direction); render(); },
  };
}

test("server output has one comparison with disabled navigation and no hidden images", () => {
  const { ColorGallery } = loadComponents();
  const markup = renderToStaticMarkup(React.createElement(ColorGallery, { examples }));
  assert.match(markup, /--comparison-position:50%/);
  assert.match(markup, /1 \/ 3/);
  assert.match(markup, /aria-controls="color-example"/);
  const buttons = markup.match(/<button\b[^>]*>/g);
  assert.equal(buttons.length, 2);
  assert.ok(buttons.every((button) => /\bdisabled=""/.test(button)));
  assert.match(markup, /street-input\.jpg/);
  assert.match(markup, /street-output\.jpg/);
  assert.doesNotMatch(markup, /market-(input|output)\.jpg|harbour-(input|output)\.jpg/);
});

test("next and previous change the comparison and wrap at both ends", () => {
  const gallery = mount();
  assert.equal(gallery.controls().props.index, 0);
  gallery.step(1);
  assert.equal(gallery.controls().props.index, 1);
  assert.equal(gallery.controls().props.title, "Market");
  assert.equal(gallery.frame().props["data-direction"], "next");
  assert.equal(gallery.comparison().props.input, examples[1].input);
  gallery.step(-1);
  assert.equal(gallery.controls().props.index, 0);
  assert.equal(gallery.frame().props["data-direction"], "previous");
  gallery.step(-1);
  assert.equal(gallery.controls().props.index, 2);
  gallery.step(1);
  assert.equal(gallery.controls().props.index, 0);
});

test("example changes remount the comparison so its range starts at the middle", () => {
  const gallery = mount();
  const firstKey = gallery.slide().key;
  gallery.step(1);
  assert.notEqual(gallery.slide().key, firstKey);
  assert.equal(gallery.slide().key, examples[1].id);
  const positions = [];
  const { ColorComparison } = loadComponents({
    useState: (initial) => { positions.push(initial); return [initial, () => {}]; },
    useSyncExternalStore: (_subscribe, getSnapshot) => getSnapshot(),
  });
  const comparison = ColorComparison(gallery.comparison().props);
  assert.equal(positions[0], 50);
  assert.equal(Object.keys(positions[1]).length, 0);
  assert.equal(findElement(comparison, (element) => element.type === "input").props.value, 50);
});

test("descriptions and photo credits follow the current example", () => {
  const gallery = mount();
  gallery.step(-1);
  const { props } = gallery.comparison();
  assert.equal(props.input, examples[2].input);
  assert.equal(props.output, examples[2].output);
  assert.equal(props.inputAlt, examples[2].inputAlt);
  assert.equal(props.outputAlt, examples[2].outputAlt);
  assert.equal(props.id, `color-position-${examples[2].id}`);
  assert.equal(gallery.credit().props.photo, examples[2].photo);
  assert.match(gallery.credit().props.changes, /colors are estimates/);
});

test("gallery keys stay on the controls so the range keeps its arrow keys", () => {
  const gallery = mount();
  assert.equal(gallery.frame().props.id, gallery.controls().props.controls);
  assert.equal(gallery.frame().props.onKeyDown, undefined);
  assert.equal(gallery.frame().props.onPointerDown, undefined);
  assert.equal(gallery.frame().props.onTouchStart, undefined);
  assert.equal(elements(gallery.frame()).some((element) => element.type === gallery.components.GalleryControls), false);
});

test("navigation does not change the static or single-example gallery", () => {
  const server = mount({ server: true });
  assert.equal(server.controls().props.ready, false);
  server.step(1);
  assert.equal(server.controls().props.index, 0);
  const single = mount({ samples: [examples[0]] });
  single.step(-1);
  assert.equal(single.controls().props.index, 0);
  assert.equal(single.controls().props.count, 1);
});

test("an empty gallery does not leave an unusable frame", () => {
  assert.equal(mount({ samples: [] }).tree(), null);
});
