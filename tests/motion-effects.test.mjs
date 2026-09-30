import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../app/motion-effects.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

class Events {
  listeners = new Map();
  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }
  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }
  emit(type, event = {}) {
    for (const listener of [...(this.listeners.get(type) ?? [])]) listener(event);
  }
  listenerCount() {
    return [...this.listeners.values()].reduce((total, listeners) => total + listeners.size, 0);
  }
}

class Element {
  animations = [];
  children = [];
  properties = new Map();
  style = {
    setProperty: (name, value) => this.properties.set(name, value),
    removeProperty: (name) => this.properties.delete(name),
  };
  constructor({ dataset = {}, top = 1000, height = 200 } = {}) {
    this.dataset = dataset;
    this.bounds = { top, bottom: top + height, height };
  }
  getBoundingClientRect() {
    return this.bounds;
  }
  contains(element) {
    return this === element || this.children.some((child) => child.contains(element));
  }
  animate(keyframes, options) {
    let finish;
    let reject;
    const animation = {
      keyframes,
      options,
      cancellations: 0,
      finished: new Promise((resolve, fail) => { finish = resolve; reject = fail; }),
      finish: () => finish(),
      cancel() {
        this.cancellations += 1;
        reject(new Error("Animation cancelled"));
      },
    };
    this.animations.push(animation);
    return animation;
  }
}

function mount({ reduced = false, desktop = true, reveals = [{}], scenes = [], footer,
  missingMain = false, missingObserver = false, missingAnimation = false } = {}) {
  const targets = reveals.map((options) => new Element(options));
  const sceneElements = scenes.map((options) => new Element(options));
  const footerElement = footer && new Element(footer);
  const main = new Element();
  main.querySelectorAll = (selector) => selector === "[data-reveal]" ? targets : sceneElements;
  const document = Object.assign(new Events(), {
    activeElement: null,
    hidden: false,
    getElementById: () => missingMain ? null : main,
    querySelector: () => footerElement ?? null,
  });
  const preference = Object.assign(new Events(), { matches: reduced });
  const desktopQuery = Object.assign(new Events(), { matches: desktop });
  const observers = [];
  class IntersectionObserver {
    observed = new Set();
    removed = new Set();
    disconnected = false;
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      observers.push(this);
    }
    observe(element) { this.observed.add(element); }
    unobserve(element) { this.observed.delete(element); this.removed.add(element); }
    disconnect() { this.disconnected = true; this.observed.clear(); }
    emit(entries) {
      if (!this.disconnected) this.callback(entries);
    }
  }
  let nextFrame = 1;
  const frames = new Map();
  const cancelledFrames = [];
  const window = Object.assign(new Events(), {
    innerHeight: 800,
    matchMedia: (query) => query.includes("reduced-motion") ? preference : desktopQuery,
    requestAnimationFrame: (callback) => {
      const id = nextFrame++;
      frames.set(id, callback);
      return id;
    },
    cancelAnimationFrame: (id) => { cancelledFrames.push(id); frames.delete(id); },
  });
  if (!missingObserver) window.IntersectionObserver = IntersectionObserver;
  let cleanup;
  const exportsHolder = { exports: {} };
  vm.runInNewContext(compiled, {
    module: exportsHolder, exports: exportsHolder.exports, window, document,
    Element: missingAnimation ? class {} : Element, IntersectionObserver,
    require: (name) => {
      assert.equal(name, "react");
      return { useEffect: (effect) => { cleanup = effect(); } };
    },
  }, { filename: "motion-effects.js" });
  assert.equal(exportsHolder.exports.MotionEffects(), null);
  return {
    targets, scenes: sceneElements, footer: footerElement, document, window,
    preference, desktop: desktopQuery, observers, frames, cancelledFrames,
    cleanup: () => cleanup?.(),
    flushFrame: () => {
      const [id, callback] = frames.entries().next().value;
      frames.delete(id);
      callback(0);
    },
    intersect: (observer, element, isIntersecting = true) =>
      observer.emit([{ target: element, isIntersecting }]),
    setReduced: (matches) => { preference.matches = matches; preference.emit("change"); },
  };
}

test("missing content or motion support leaves the page untouched", () => {
  for (const options of [{ missingMain: true }, { missingObserver: true }, { missingAnimation: true }]) {
    const page = mount(options);
    assert.equal(page.observers.length, 0);
    assert.equal(page.window.listenerCount() + page.document.listenerCount(), 0);
    assert.equal(page.preference.listenerCount(), 0);
    page.cleanup();
  }
});

test("visible content is skipped and each offscreen item reveals once", () => {
  const page = mount({
    reveals: [
      { top: 30 },
      { dataset: { reveal: "image", revealDelay: "240" } },
      { top: -300 },
    ],
    footer: { dataset: { revealDelay: "80" } },
  });
  const [observer] = page.observers;
  const [visible, image, above] = page.targets;
  assert.equal(observer.observed.has(visible), false);
  assert.equal(observer.observed.has(above), true);
  assert.equal(observer.observed.has(page.footer), true);
  page.intersect(observer, image, false);
  assert.equal(image.animations.length, 0);
  page.intersect(observer, image);
  page.intersect(observer, image);
  page.intersect(observer, visible);
  page.intersect(observer, page.footer);
  assert.equal(image.animations.length, 1);
  assert.equal(visible.animations.length, 0);
  assert.equal(observer.observed.has(image), false);
  assert.equal(image.animations[0].options.duration, 950);
  assert.equal(image.animations[0].options.delay, 160);
  assert.equal(image.animations[0].options.fill, "backwards");
  assert.equal(page.footer.animations[0].options.duration, 720);
  assert.equal(page.footer.animations[0].options.delay, 80);
  page.cleanup();
});

test("focused content stays visible before and during a reveal", () => {
  const page = mount({ reveals: [{}, {}, {}] });
  const [observer] = page.observers;
  const [focused, waiting, moving] = page.targets;
  const field = new Element();
  focused.children.push(field);
  page.document.activeElement = field;
  page.intersect(observer, focused);
  assert.equal(focused.animations.length, 0);
  page.document.emit("focusin", { target: waiting });
  page.intersect(observer, waiting);
  assert.equal(waiting.animations.length, 0);
  page.intersect(observer, moving);
  const link = new Element();
  moving.children.push(link);
  page.document.emit("focusin", { target: link });
  assert.equal(moving.animations[0].cancellations, 1);
  assert.equal(observer.removed.has(moving), true);
  page.intersect(observer, moving);
  assert.equal(moving.animations.length, 1);
  page.document.emit("focusin", { target: {} });
  page.cleanup();
});

test("finished animations are released before cleanup", async () => {
  const page = mount();
  page.intersect(page.observers[0], page.targets[0]);
  const animation = page.targets[0].animations[0];
  animation.finish();
  await Promise.resolve();
  page.cleanup();
  assert.equal(animation.cancellations, 0);
});

test("reduced motion at startup does not register motion work", () => {
  const page = mount({ reduced: true, scenes: [{}] });
  assert.equal(page.observers.length, 0);
  assert.equal(page.frames.size, 0);
  assert.equal(page.window.listenerCount() + page.document.listenerCount(), 0);
  assert.equal(page.preference.listenerCount(), 1);
  page.setReduced(false);
  assert.equal(page.observers.length, 2);
  assert.equal(page.observers[0].observed.has(page.targets[0]), true);
  page.cleanup();
  assert.equal(page.preference.listenerCount(), 0);
});

test("live reduced-motion changes cancel work and preserve completed reveals", () => {
  const page = mount({ scenes: [{ dataset: { motionScene: "horizon" }, top: -100, height: 600 }] });
  const [revealObserver, sceneObserver] = page.observers;
  page.intersect(revealObserver, page.targets[0]);
  page.intersect(sceneObserver, page.scenes[0]);
  page.flushFrame();
  assert.equal(page.scenes[0].properties.get("--sky-shift"), "18.0px");
  page.window.emit("scroll");
  const [pendingFrame] = page.frames.keys();
  page.setReduced(true);
  assert.equal(page.targets[0].animations[0].cancellations, 1);
  assert.equal(page.frames.size, 0);
  assert.equal(page.cancelledFrames.includes(pendingFrame), true);
  assert.equal(page.scenes[0].properties.size, 0);
  assert.equal(page.window.listenerCount() + page.document.listenerCount(), 0);
  assert.equal(revealObserver.disconnected && sceneObserver.disconnected, true);
  page.window.emit("scroll");
  assert.equal(page.frames.size, 0);
  page.setReduced(false);
  assert.equal(page.observers.length, 4);
  assert.equal(page.observers[2].observed.has(page.targets[0]), false);
  page.intersect(page.observers[2], page.targets[0]);
  assert.equal(page.targets[0].animations.length, 1);
  page.cleanup();
  assert.equal(page.preference.listenerCount(), 0);
});

test("scene frames are coalesced and require an active visible desktop scene", () => {
  const page = mount({ scenes: [{ dataset: { motionScene: "card" }, top: 100, height: 400 }] });
  const observer = page.observers[1];
  page.window.emit("scroll");
  page.window.emit("resize");
  assert.equal(page.frames.size, 0);
  page.intersect(observer, page.scenes[0]);
  page.window.emit("scroll");
  page.window.emit("scroll");
  assert.equal(page.frames.size, 1);
  page.flushFrame();
  assert.equal(page.scenes[0].properties.get("--scene-shift"), "5.0px");
  assert.equal(page.frames.size, 0);
  page.intersect(observer, page.scenes[0], false);
  page.window.emit("scroll");
  assert.equal(page.frames.size, 0);
  page.desktop.matches = false;
  page.window.emit("resize");
  assert.equal(page.scenes[0].properties.size, 0);
  page.intersect(observer, page.scenes[0]);
  page.window.emit("scroll");
  assert.equal(page.frames.size, 0);
  page.desktop.matches = true;
  page.document.hidden = true;
  page.window.emit("scroll");
  assert.equal(page.frames.size, 0);
  page.document.hidden = false;
  page.document.emit("visibilitychange");
  assert.equal(page.frames.size, 1);
  page.cleanup();
});

test("unmount cancels pending frames and animations and removes every listener", () => {
  const page = mount({ scenes: [{}] });
  page.intersect(page.observers[0], page.targets[0]);
  page.intersect(page.observers[1], page.scenes[0]);
  const [pendingFrame] = page.frames.keys();
  page.cleanup();
  assert.equal(page.targets[0].animations[0].cancellations, 1);
  assert.equal(page.cancelledFrames.includes(pendingFrame), true);
  assert.equal(page.frames.size, 0);
  assert.equal(page.observers.every((observer) => observer.disconnected), true);
  assert.equal(page.window.listenerCount() + page.document.listenerCount() + page.preference.listenerCount(), 0);
  page.window.emit("scroll");
  page.window.emit("resize");
  page.document.emit("visibilitychange");
  page.setReduced(false);
  assert.equal(page.frames.size, 0);
  assert.equal(page.observers.length, 2);
});
