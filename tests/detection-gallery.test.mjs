import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import ts from "typescript";

const compiled = Object.fromEntries(["detection-gallery", "gallery-controls", "project-samples"].map((name) => [name, ts.transpileModule(
  readFileSync(new URL(`../app/${name}.${name === "project-samples" ? "ts" : "tsx"}`, import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } },
).outputText]));
const results = JSON.parse(readFileSync(new URL("../app/detection-results.json", import.meta.url), "utf8"));

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
        if (request === "./detection-results.json") return { default: results };
        assert.ok(request.startsWith("./"));
        return load(request.slice(2));
      },
    }, { filename: `${name}.js` });
    modules[name] = holder.exports;
    return holder.exports;
  }
  return { ...load("detection-gallery"), ...load("gallery-controls"), ...load("project-samples") };
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

const examples = ["cat", "bicycle", "street"].map((id, index) => ({
  id,
  title: id[0].toUpperCase() + id.slice(1),
  src: `/work/detection-${id}.webp`,
  alt: `${id} sample photograph`,
  photo: { author: `${id} photographer`, source: `https://example.com/photos/${id}`, license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" },
  boxes: [
    { label: id, confidence: index === 0 ? 0.92 : 0.96, x: 10, y: 20, width: 50, height: 60 },
    { label: "bench", confidence: 0.25, x: 30, y: 40, width: 40, height: 40 },
    { label: "chair", confidence: 0.2499, x: 50, y: 60, width: 20, height: 20 },
    { label: "boat", confidence: 0.15, x: 70, y: 80, width: 10, height: 10 },
  ],
}));

function mount({ server = false, samples = examples, loaded = true } = {}) {
  const state = [];
  let cursor = 0;
  const components = loadComponents({
    useState: (initial) => {
      const position = cursor++;
      if (!(position in state)) state[position] = typeof initial === "function" ? initial() : initial;
      return [state[position], (next) => { state[position] = typeof next === "function" ? next(state[position]) : next; }];
    },
    useSyncExternalStore: (_subscribe, getSnapshot, getServerSnapshot) => server ? getServerSnapshot() : getSnapshot(),
  });
  let tree;
  const render = () => { cursor = 0; tree = components.DetectionGallery({ examples: samples }); };
  render();
  const controls = () => findElement(tree, (element) => element.type === components.GalleryControls);
  const range = () => findElement(tree, (element) => element.type === "input" && element.props.type === "range");
  const checkbox = () => findElement(tree, (element) => element.type === "input" && element.props.type === "checkbox");
  const image = () => findElement(tree, (element) => typeof element.type === "function" && element.props.fill);
  if (loaded && !server && samples.length > 0) {
    image().props.onLoad();
    render();
  }
  return {
    components,
    tree: () => tree,
    controls,
    range,
    checkbox,
    frame: () => findElement(tree, (element) => element.props.id === "detection-example"),
    image,
    render,
    loadImage: () => { image().props.onLoad(); render(); },
    failImage: () => { image().props.onError(); render(); },
    feedback: () => findElement(tree, (element) => element.type === "div" && element.props.role === "status"),
    announcement: () => findElement(tree, (element) => element.type === "span" && element.props.role === "status"),
    boxes: () => elements(tree).filter((element) => element.props.className === "detection-box"),
    result: () => findElement(tree, (element) => element.props.id === "detection-results-help"),
    credit: () => findElement(tree, (element) => element.type === components.PhotoCredit),
    step: (direction) => { controls().props.onStep(direction); render(); },
    changeConfidence: (value) => { range().props.onChange({ target: { value: String(value) } }); render(); },
    showBoxes: (checked) => { checkbox().props.onChange({ target: { checked } }); render(); },
    press: (key) => {
      let prevented = false;
      components.GalleryControls(controls().props).props.onKeyDown({ key, preventDefault: () => { prevented = true; } });
      render();
      return prevented;
    },
  };
}

test("server output has one image with disabled gallery and sample controls", () => {
  const { DetectionGallery } = loadComponents();
  const markup = renderToStaticMarkup(React.createElement(DetectionGallery, { examples }));
  const images = markup.match(/<img\b[^>]*>/g);
  assert.equal(images.length, 1);
  assert.match(images[0], /src="\/work\/detection-cat\.webp"/);
  assert.match(markup, /1 \/ 3/);
  assert.match(markup, /aria-controls="detection-example"/);
  const controls = markup.match(/<(button|input)\b[^>]*>/g);
  assert.equal(controls.length, 4);
  assert.ok(controls.every((control) => /\bdisabled=""/.test(control)));
  assert.match(markup, /saved results from my Python app, not live inference/);
});

test("the photo caption is the last direct child of the figure", () => {
  const children = React.Children.toArray(mount().tree().props.children);
  assert.equal(children.at(-1).type, "figcaption");
  assert.equal(children.filter((child) => child.type === "figcaption").length, 1);
});

test("next and previous loop through images, descriptions and credits", () => {
  const gallery = mount();
  gallery.step(1);
  assert.equal(gallery.controls().props.index, 1);
  assert.equal(gallery.controls().props.title, "Bicycle");
  assert.equal(gallery.frame().props["data-direction"], "next");
  assert.equal(gallery.image().props.src, examples[1].src);
  assert.equal(gallery.image().props.alt, examples[1].alt);
  assert.equal(gallery.credit().props.photo, examples[1].photo);
  gallery.step(-1);
  assert.equal(gallery.controls().props.index, 0);
  assert.equal(gallery.frame().props["data-direction"], "previous");
  gallery.step(-1);
  assert.equal(gallery.controls().props.index, 2);
  gallery.step(1);
  assert.equal(gallery.controls().props.index, 0);
});

test("left and right keys change slides only from gallery controls", () => {
  const gallery = mount();
  assert.equal(gallery.press("ArrowLeft"), true);
  assert.equal(gallery.controls().props.index, 2);
  assert.equal(gallery.press("ArrowRight"), true);
  assert.equal(gallery.controls().props.index, 0);
  for (const key of ["ArrowUp", "ArrowDown", "Home", "End", "Enter", " "]) {
    assert.equal(gallery.press(key), false);
    assert.equal(gallery.controls().props.index, 0);
  }
  assert.equal(gallery.frame().props.onKeyDown, undefined);
  assert.equal(gallery.tree().props.onKeyDown, undefined);
  assert.equal(gallery.range().props.onKeyDown, undefined);
  assert.equal(elements(gallery.frame()).some((element) => element.type === gallery.components.GalleryControls), false);
});

test("confidence filtering includes its boundary and hides lower scores", () => {
  const gallery = mount();
  assert.equal(gallery.range().props.value, 50);
  assert.deepEqual(gallery.boxes().map(textContent), ["cat 92%"]);
  gallery.changeConfidence(25);
  assert.deepEqual(gallery.boxes().map(textContent), ["cat 92%", "bench 25%"]);
  assert.match(textContent(gallery.result()), /^2 detections: cat 92%, bench 25%\.$/);
  gallery.changeConfidence(26);
  assert.deepEqual(gallery.boxes().map(textContent), ["cat 92%"]);
  assert.match(textContent(gallery.result()), /^1 detection: cat 92%\.$/);
  gallery.changeConfidence(15);
  assert.equal(gallery.boxes().length, 4);
  assert.match(textContent(gallery.result()), /boat 15%/);
});

test("zero results remove boxes and give a clear text response", () => {
  const gallery = mount();
  gallery.changeConfidence(95);
  assert.equal(gallery.boxes().length, 0);
  assert.equal(textContent(gallery.result()), "No detections at this confidence level.");
  assert.equal(gallery.range().props["aria-valuetext"], "95% minimum confidence");
  gallery.step(1);
  gallery.loadImage();
  assert.equal(gallery.range().props.value, 95);
  assert.deepEqual(gallery.boxes().map(textContent), ["bicycle 96%"]);
});

test("box toggle changes overlays without losing detection text or filters", () => {
  const gallery = mount();
  const description = textContent(gallery.result());
  gallery.showBoxes(false);
  assert.equal(gallery.checkbox().props.checked, false);
  assert.equal(gallery.boxes().length, 0);
  assert.equal(textContent(gallery.result()), description);
  gallery.step(1);
  gallery.loadImage();
  assert.equal(gallery.checkbox().props.checked, false);
  assert.equal(gallery.boxes().length, 0);
  gallery.showBoxes(true);
  assert.equal(gallery.boxes().length, 1);
  assert.equal(gallery.range().props.value, 50);
});

test("the sample range has bounded values and associated native labels", () => {
  const gallery = mount();
  const range = gallery.range();
  assert.equal(Number(range.props.min), 15);
  assert.equal(Number(range.props.max), 95);
  assert.equal(Number(range.props.step), 1);
  assert.equal(range.props.disabled, false);
  assert.equal(range.props["aria-describedby"], gallery.result().props.id);
  const label = findElement(gallery.tree(), (element) => element.type === "label" && element.props.htmlFor === range.props.id);
  assert.match(textContent(label), /Minimum confidence50%/);
  const checkboxLabel = findElement(gallery.tree(), (element) => element.type === "label" && elements(element).includes(gallery.checkbox()));
  assert.match(textContent(checkboxLabel), /Show detection boxes/);
});

test("overlays use the exact percentage coordinates with hidden duplicate text", () => {
  const gallery = mount();
  const overlay = findElement(gallery.tree(), (element) => element.props.className === "detection-overlay");
  assert.equal(overlay.props["aria-hidden"], "true");
  assert.equal(JSON.stringify(gallery.boxes()[0].props.style), JSON.stringify({ left: "10%", top: "20%", width: "50%", height: "60%" }));
  assert.equal(gallery.image().props.fill, true);
  assert.equal(gallery.image().props.sizes, "(max-width: 760px) calc(100vw - 2rem), (max-width: 1000px) calc(55vw - 2.75rem), (max-width: 1296px) calc(58.75vw - 1.875rem), (max-width: 1600px) calc(780px - 3.75vw), 720px");
});

test("short labels size to their text and right-edge labels stay within the photo", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  const labelRule = css.match(/\.detection-box > span\s*\{([^}]+)\}/)?.[1];
  assert.ok(labelRule);
  assert.match(labelRule, /\bwidth:\s*max-content;/);
  assert.doesNotMatch(labelRule, /max-width:\s*100%;/);
  const edgeRule = css.match(/\.detection-box\[data-label-align="right"\] > span\s*\{([^}]+)\}/)?.[1];
  assert.ok(edgeRule);
  assert.match(edgeRule, /right:\s*0;/);
  assert.match(edgeRule, /left:\s*auto;/);
  const nearEdge = { ...examples[0], boxes: [
    { label: "dog", confidence: 0.71, x: 43, y: 40, width: 11.6, height: 20 },
    { label: "boat", confidence: 0.86, x: 97, y: 50, width: 2.7, height: 8 },
  ] };
  const gallery = mount({ samples: [nearEdge] });
  assert.deepEqual(gallery.boxes().map(textContent), ["dog 71%", "boat 86%"]);
  assert.equal(gallery.boxes()[0].props["data-label-align"], undefined);
  assert.equal(gallery.boxes()[1].props["data-label-align"], "right");
  assert.equal(gallery.boxes()[1].props.style.width, "2.7%");
});

test("loading keeps the frame busy without drawing boxes over an empty photo", () => {
  const gallery = mount({ loaded: false });
  assert.equal(gallery.frame().props["aria-busy"], true);
  assert.equal(gallery.boxes().length, 0);
  assert.equal(gallery.feedback().props.hidden, false);
  assert.equal(gallery.feedback().props.className, "gallery-feedback");
  assert.equal(textContent(gallery.feedback()), "Loading photo…");
  gallery.loadImage();
  assert.equal(gallery.frame().props["aria-busy"], false);
  assert.equal(gallery.boxes().length, 1);
  assert.equal(gallery.feedback().props.className, "visually-hidden");
  assert.equal(textContent(gallery.feedback()), "Photo loaded.");
  gallery.step(1);
  assert.equal(gallery.frame().props["aria-busy"], true);
  assert.equal(gallery.boxes().length, 0);
  gallery.loadImage();
  assert.equal(gallery.boxes().length, 1);
});

test("photo errors give a direct fallback link without boxes or extra images", () => {
  const gallery = mount({ loaded: false });
  gallery.failImage();
  assert.equal(gallery.frame().props["aria-busy"], false);
  assert.equal(gallery.boxes().length, 0);
  assert.match(textContent(gallery.feedback()), /This photo couldn’t load/);
  const link = findElement(gallery.feedback(), (element) => element.type === "a");
  assert.equal(link.props.href, examples[0].src);
  assert.equal(elements(gallery.frame()).filter((element) => typeof element.type === "function" && element.props.fill).length, 1);
  gallery.step(1);
  assert.equal(textContent(gallery.feedback()), "Loading photo…");
  gallery.loadImage();
  assert.equal(gallery.boxes().length, 1);
});

test("late events from an earlier slide do not mark the current image as ready", () => {
  const gallery = mount({ loaded: false });
  const firstImage = gallery.image();
  gallery.step(1);
  firstImage.props.onLoad();
  gallery.render();
  assert.equal(gallery.frame().props["aria-busy"], true);
  assert.equal(gallery.boxes().length, 0);
  firstImage.props.onError();
  gallery.render();
  assert.equal(textContent(gallery.feedback()), "Loading photo…");
  gallery.loadImage();
  assert.equal(gallery.frame().props["aria-busy"], false);
});

test("result announcements report counts without rereading every prediction", () => {
  const gallery = mount();
  const announcement = gallery.announcement();
  assert.equal(announcement.props["aria-live"], "polite");
  assert.equal(announcement.props["aria-atomic"], "true");
  assert.equal(announcement.props.className, "visually-hidden");
  assert.equal(textContent(announcement), "1 detection at this confidence level.");
  gallery.changeConfidence(51);
  assert.equal(textContent(gallery.announcement()), textContent(announcement));
  gallery.changeConfidence(25);
  assert.equal(textContent(gallery.announcement()), "2 detections at this confidence level.");
  assert.doesNotMatch(textContent(gallery.announcement()), /cat|bench/);
  gallery.changeConfidence(95);
  assert.equal(textContent(gallery.announcement()), "No detections at this confidence level.");
});

test("static and single-example galleries do not navigate", () => {
  const server = mount({ server: true });
  server.step(1);
  assert.equal(server.controls().props.index, 0);
  assert.equal(server.press("ArrowRight"), false);
  assert.equal(server.range().props.disabled, true);
  assert.equal(server.checkbox().props.disabled, true);
  const single = mount({ samples: [examples[0]] });
  single.step(-1);
  assert.equal(single.controls().props.index, 0);
  assert.equal(single.press("ArrowRight"), false);
});

test("the no-script fallback links to every complete sample photo", () => {
  const gallery = mount({ server: true });
  const fallback = findElement(gallery.tree(), (element) => element.type === "noscript");
  const links = elements(fallback).filter((element) => element.type === "a");
  assert.deepEqual(links.map((link) => link.props.href), examples.map((example) => example.src));
  assert.deepEqual(links.map(textContent), examples.map((example) => example.title));
  assert.match(textContent(fallback), /controls need JavaScript/);
});

test("empty examples do not render an unusable gallery", () => {
  assert.equal(mount({ samples: [] }).tree(), null);
});

test("saved predictions stay within the photographed frame and match local image dimensions", async () => {
  const { detectionExamples } = loadComponents();
  assert.equal(detectionExamples.length, results.length);
  assert.equal(new Set(results.map((result) => result.id)).size, results.length);
  assert.deepEqual(Array.from(detectionExamples, (example) => example.id).sort(), results.map((result) => result.id).sort());
  for (const example of detectionExamples) {
    const result = results.find((entry) => entry.id === example.id);
    assert.ok(example.src.startsWith("/work/"));
    const path = new URL(`../public${example.src}`, import.meta.url);
    assert.equal(existsSync(path), true, example.src);
    const metadata = await sharp(readFileSync(path)).metadata();
    assert.equal(result.width, 1280);
    assert.equal(result.height, 853);
    assert.equal(metadata.width, result.width, example.src);
    assert.equal(metadata.height, result.height, example.src);
    assert.equal(example.boxes, result.boxes);
    assert.ok(example.alt.length > 10);
    assert.ok(result.boxes.length > 0);
    for (const box of result.boxes) {
      assert.ok(box.label.length > 0);
      assert.ok(Number.isFinite(box.confidence) && box.confidence >= 0.15 && box.confidence <= 1);
      for (const value of [box.x, box.y, box.width, box.height]) assert.ok(Number.isFinite(value) && value >= 0 && value <= 100);
      assert.ok(box.width > 0 && box.height > 0);
      assert.ok(box.x + box.width <= 100 + 0.000001);
      assert.ok(box.y + box.height <= 100 + 0.000001);
    }
  }
});
