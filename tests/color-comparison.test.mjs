import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const source = readFileSync(new URL("../app/color-comparison.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    jsx: ts.JsxEmit.ReactJSX,
  },
}).outputText;

function loadComponent(hooks = React) {
  const exportsHolder = { exports: {} };
  vm.runInNewContext(compiled, {
    module: exportsHolder,
    exports: exportsHolder.exports,
    require: (name) => {
      if (name === "react") return hooks;
      if (name === "react/jsx-runtime") return jsxRuntime;
      assert.equal(name, "next/image");
      return {
        __esModule: true,
        default: ({ src, alt }) => React.createElement("img", { src, alt }),
      };
    },
  }, { filename: "color-comparison.js" });
  return exportsHolder.exports.ColorComparison;
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

function textContent(node) {
  if (Array.isArray(node)) return node.map(textContent).join("");
  if (React.isValidElement(node)) return textContent(node.props.children);
  return node === undefined || node === null ? "" : String(node);
}

function mount({ server = false, props, loaded = true } = {}) {
  const state = [];
  let cursor = 0;
  let currentProps = props;
  let store;
  const Component = loadComponent({
    useState: (initial) => {
      const index = cursor++;
      if (!(index in state)) state[index] = typeof initial === "function" ? initial() : initial;
      return [state[index], (next) => { state[index] = typeof next === "function" ? next(state[index]) : next; }];
    },
    useSyncExternalStore: (subscribe, getSnapshot, getServerSnapshot) => {
      store = { subscribe, getSnapshot, getServerSnapshot };
      return server ? getServerSnapshot() : getSnapshot();
    },
  });
  let tree;
  const render = () => { cursor = 0; tree = Component(currentProps); };
  render();
  const range = () => findElement(tree, (element) => element.type === "input");
  const images = () => elements(tree).filter((element) => typeof element.type === "function" && element.props.fill);
  if (loaded && !server) {
    images().forEach((image) => image.props.onLoad());
    render();
  }
  return {
    tree: () => tree,
    range,
    images,
    render,
    updateProps: (next) => { currentProps = next; render(); },
    loadImage: (index) => { images()[index].props.onLoad(); render(); },
    failImage: (index) => { images()[index].props.onError(); render(); },
    feedback: () => findElement(tree, (element) => element.props.role === "status"),
    store: () => store,
    stage: () => findElement(tree, (element) => element.props.className === "comparison-stage"),
    help: () => findElement(tree, (element) => element.props.id === range().props["aria-describedby"]),
    change: (value) => {
      range().props.onChange({ target: { value: String(value) } });
      render();
    },
  };
}

test("server rendering shows a static half split before hydration", () => {
  const Component = loadComponent();
  const markup = renderToStaticMarkup(React.createElement(Component));
  const input = markup.match(/<input\b[^>]*>/)?.[0];
  assert.ok(input);
  assert.match(markup, /--comparison-position:50%/);
  assert.match(input, /\bvalue="50"/);
  assert.match(input, /\bdisabled=""/);
  assert.match(input, /\baria-valuetext="50% estimated color"/);
  assert.match(markup, /Grayscale input and estimated color shown together\./);
});

test("server and client snapshots keep the control disabled until hydration", () => {
  const server = mount({ server: true });
  const client = mount();
  for (const comparison of [server, client]) {
    const store = comparison.store();
    assert.equal(store.getServerSnapshot(), false);
    assert.equal(store.getSnapshot(), true);
    const unsubscribe = store.subscribe(() => {});
    assert.equal(typeof unsubscribe, "function");
    assert.doesNotThrow(unsubscribe);
    assert.equal(comparison.range().props.value, 50);
  }
  assert.equal(server.range().props.disabled, true);
  assert.equal(client.range().props.disabled, false);
  assert.doesNotMatch(textContent(server.help()), /arrow keys/i);
  assert.match(textContent(client.help()), /arrow keys/i);
});

test("the range has explicit bounds and an accessible description", () => {
  const comparison = mount();
  const { props } = comparison.range();
  assert.equal(props.type, "range");
  assert.equal(Number(props.min), 0);
  assert.equal(Number(props.max), 100);
  assert.equal(Number(props.step), 1);
  assert.equal(props["aria-label"], "Compare grayscale input with estimated color");
  assert.equal(props["aria-valuetext"], "50% estimated color");
  assert.ok(props.id);
  assert.ok(props["aria-describedby"]);
  assert.equal(comparison.help().props.id, props["aria-describedby"]);
  assert.match(textContent(comparison.help()), /drag to compare/i);
});

test("onChange updates the visual split and announced value together", () => {
  const comparison = mount();
  comparison.change(37);
  assert.equal(comparison.range().props.value, 37);
  assert.equal(comparison.range().props["aria-valuetext"], "37% estimated color");
  assert.equal(comparison.stage().props.style["--comparison-position"], "37%");
  assert.equal(comparison.range().props.disabled, false);
});

test("both ends of the comparison retain their exact position", () => {
  const comparison = mount();
  for (const position of [0, 100, 50]) {
    comparison.change(position);
    assert.equal(comparison.range().props.value, position);
    assert.equal(comparison.stage().props.style["--comparison-position"], `${position}%`);
    assert.equal(comparison.range().props["aria-valuetext"], `${position}% estimated color`);
  }
});

test("the input and color layer use matching image sizing", () => {
  const comparison = mount();
  const images = elements(comparison.stage()).filter((element) => typeof element.type === "function");
  assert.equal(images.length, 2);
  const [input, output] = images;
  assert.equal(input.props.src, "/work/color-input.jpg");
  assert.equal(output.props.src, "/work/color-output.jpg");
  assert.equal(input.props.fill, true);
  assert.equal(output.props.fill, true);
  assert.equal(input.props.sizes, output.props.sizes);
  assert.match(input.props.alt, /grayscale/i);
  assert.match(output.props.alt, /estimated/i);
  const colorLayer = findElement(comparison.tree(), (element) => element.props.className === "comparison-color");
  assert.ok(elements(colorLayer).includes(output));
});

test("the no-script fallback links to both complete images", () => {
  const comparison = mount({ server: true });
  const fallback = findElement(comparison.tree(), (element) => element.type === "noscript");
  const links = elements(fallback).filter((element) => element.type === "a");
  assert.deepEqual(links.map((link) => link.props.href), [
    "/work/color-input.jpg",
    "/work/color-output.jpg",
  ]);
  assert.match(textContent(links[0]), /grayscale input/i);
  assert.match(textContent(links[1]), /color result/i);
  const Component = loadComponent();
  const markup = renderToStaticMarkup(React.createElement(Component));
  const renderedFallback = markup.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1];
  assert.ok(renderedFallback);
  assert.match(renderedFallback, /href="\/work\/color-input\.jpg"/);
  assert.match(renderedFallback, /href="\/work\/color-output\.jpg"/);
});

test("example props update both images, descriptions and fallback links", () => {
  const props = {
    input: "/work/color-gallery/market-input.jpg",
    output: "/work/color-gallery/market-output.jpg",
    inputAlt: "Grayscale market stalls",
    outputAlt: "Market stalls with estimated colors",
    id: "color-position-market",
  };
  const comparison = mount({ props });
  const images = elements(comparison.stage()).filter((element) => typeof element.type === "function");
  assert.deepEqual(images.map((image) => [image.props.src, image.props.alt]), [
    [props.input, props.inputAlt],
    [props.output, props.outputAlt],
  ]);
  assert.equal(comparison.range().props.id, props.id);
  assert.equal(comparison.range().props["aria-describedby"], `${props.id}-help`);
  assert.equal(comparison.help().props.id, `${props.id}-help`);
  const fallback = findElement(comparison.tree(), (element) => element.type === "noscript");
  assert.deepEqual(elements(fallback).filter((element) => element.type === "a").map((link) => link.props.href), [props.input, props.output]);
});

test("comparison stays disabled until both photos have loaded", () => {
  const comparison = mount({ loaded: false });
  assert.equal(comparison.images().length, 2);
  assert.equal(comparison.range().props.disabled, true);
  assert.equal(comparison.stage().props["aria-busy"], true);
  assert.equal(comparison.feedback().props.hidden, false);
  assert.equal(textContent(comparison.feedback()), "Loading photos…");
  comparison.loadImage(1);
  assert.equal(comparison.range().props.disabled, true);
  assert.equal(comparison.stage().props["aria-busy"], true);
  comparison.loadImage(0);
  assert.equal(comparison.range().props.disabled, false);
  assert.equal(comparison.stage().props["aria-busy"], false);
  assert.equal(comparison.feedback().props.className, "visually-hidden");
  assert.equal(textContent(comparison.feedback()), "Comparison ready.");
  assert.equal(comparison.feedback().props["aria-atomic"], "true");
});

test("either failed photo gives usable links and leaves the comparison disabled", () => {
  for (const failedImage of [0, 1]) {
    const comparison = mount({ loaded: false });
    comparison.failImage(failedImage);
    comparison.loadImage(1 - failedImage);
    assert.equal(comparison.range().props.disabled, true);
    assert.equal(comparison.stage().props["aria-busy"], false);
    assert.match(textContent(comparison.feedback()), /This comparison couldn’t load/);
    const links = elements(comparison.feedback()).filter((element) => element.type === "a");
    assert.deepEqual(links.map((link) => link.props.href), comparison.images().map((image) => image.props.src));
    assert.match(textContent(comparison.help()), /Open the photos above/);
  }
});

test("new source pairs cannot reuse an earlier pair’s loaded state", () => {
  const comparison = mount();
  const firstImages = comparison.images();
  comparison.updateProps({ input: "/work/color-market-input.jpg", output: "/work/color-market-output.jpg" });
  assert.equal(comparison.range().props.disabled, true);
  assert.equal(textContent(comparison.feedback()), "Loading photos…");
  firstImages[0].props.onLoad();
  firstImages[1].props.onError();
  comparison.render();
  assert.equal(comparison.range().props.disabled, true);
  assert.equal(textContent(comparison.feedback()), "Loading photos…");
  comparison.loadImage(0);
  comparison.loadImage(1);
  assert.equal(comparison.range().props.disabled, false);
  assert.equal(comparison.images().length, 2);
});

test("loading feedback is hidden in static output so the photos remain visible without scripts", () => {
  const comparison = mount({ server: true, loaded: false });
  assert.equal(comparison.feedback().props.hidden, true);
  assert.equal(comparison.stage().props["aria-busy"], false);
  assert.equal(comparison.images().length, 2);
});
