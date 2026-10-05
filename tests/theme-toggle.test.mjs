import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const source = readFileSync(new URL("../app/theme-toggle.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    jsx: ts.JsxEmit.ReactJSX,
  },
}).outputText;

function loadComponent({ hooks = React, useTheme, browser = {} }) {
  const exportsHolder = { exports: {} };
  const Icon = ({ size, strokeWidth, ...props }) => React.createElement("svg", {
    width: size,
    height: size,
    strokeWidth,
    ...props,
  });
  vm.runInNewContext(compiled, {
    ...browser,
    module: exportsHolder,
    exports: exportsHolder.exports,
    require: (name) => {
      if (name === "react") return hooks;
      if (name === "react/jsx-runtime") return jsxRuntime;
      if (name === "react-dom") return { flushSync: (callback) => callback() };
      if (name === "next-themes") return { useTheme };
      assert.equal(name, "lucide-react");
      return { Moon: Icon, Sun: Icon };
    },
  }, { filename: "theme-toggle.js" });
  return exportsHolder.exports.ThemeToggle;
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((complete, fail) => { resolve = complete; reject = fail; });
  return { promise, resolve, reject };
}

function mount({ server = false, resolvedTheme = "light", reducedMotion = false, nativeReveal = false, nativeFailure = false } = {}) {
  let beforeHydration = server;
  let selectedTheme = resolvedTheme;
  let store;
  let tree;
  const changes = [];
  const attributes = new Map();
  const timers = new Map();
  const events = [];
  const refs = [];
  let refIndex = 0;
  const reveals = [];
  let cleanup;
  let nextTimer = 1;
  const root = {
    setAttribute: (name, value) => { attributes.set(name, value); events.push(`set:${name}`); },
    removeAttribute: (name) => { attributes.delete(name); events.push(`remove:${name}`); },
  };
  const browserDocument = { documentElement: root };
  if (nativeReveal) {
    browserDocument.startViewTransition = (update) => {
      if (nativeFailure) throw new Error("Transition unavailable");
      const ready = deferred();
      const finished = deferred();
      const state = { update, ready, finished, skips: 0 };
      reveals.push(state);
      return {
        ready: ready.promise,
        finished: finished.promise,
        skipTransition: () => { state.skips++; ready.reject(new Error("Transition skipped")); },
      };
    };
  }
  const Component = loadComponent({
    hooks: {
      useRef: (initial) => refs[refIndex++] ?? (refs[refIndex - 1] = { current: initial }),
      useEffect: (effect) => { cleanup ??= effect(); },
      useSyncExternalStore: (subscribe, getSnapshot, getServerSnapshot) => {
        store = { subscribe, getSnapshot, getServerSnapshot };
        return beforeHydration ? getServerSnapshot() : getSnapshot();
      },
    },
    useTheme: () => ({
      resolvedTheme: selectedTheme,
      setTheme: (next) => {
        changes.push(next);
        events.push(`theme:${next}`);
        selectedTheme = next;
      },
    }),
    browser: {
      document: browserDocument,
      window: {
        matchMedia: (query) => {
          assert.equal(query, "(prefers-reduced-motion: reduce)");
          return { matches: reducedMotion };
        },
        getComputedStyle: (element) => {
          assert.equal(element, root);
          events.push("style");
          return { getPropertyValue: (name) => { assert.equal(name, "color"); return "rgb(27, 41, 34)"; } };
        },
        setTimeout: (callback, delay) => {
          const id = nextTimer++;
          timers.set(id, { callback, delay });
          return id;
        },
        clearTimeout: (id) => { timers.delete(id); events.push(`cancel:${id}`); },
      },
    },
  });
  const render = () => { refIndex = 0; tree = Component(); };
  render();
  return {
    button: () => tree,
    changes: () => changes,
    store: () => store,
    attributes: () => attributes,
    timers: () => timers,
    events: () => events,
    reveals: () => reveals,
    updateReveal: (index = reveals.length - 1) => { reveals[index].update(); render(); },
    finishReveal: (index = reveals.length - 1) => { reveals[index].ready.resolve(); reveals[index].finished.resolve(); },
    setReducedMotion: (value) => { reducedMotion = value; },
    finishTransition: () => {
      const [id, timer] = timers.entries().next().value;
      timers.delete(id);
      timer.callback();
    },
    unmount: () => cleanup?.(),
    render,
    hydrate: () => {
      beforeHydration = false;
      render();
    },
    click: () => {
      assert.equal(tree.props.disabled, false);
      tree.props.onClick();
      render();
    },
  };
}

test("server rendering keeps the theme control disabled with a stable label", () => {
  for (const resolvedTheme of [undefined, "light", "dark"]) {
    const changes = [];
    const Component = loadComponent({
      useTheme: () => ({ resolvedTheme, setTheme: (next) => { changes.push(next); } }),
    });
    const markup = renderToStaticMarkup(React.createElement(Component));
    const button = markup.match(/<button\b[^>]*>/)?.[0];
    assert.ok(button);
    assert.match(button, /\btype="button"/);
    assert.match(button, /\bdisabled=""/);
    assert.match(button, /\baria-label="Change color theme"/);
    assert.match(button, /\btitle="Change color theme"/);
    assert.deepEqual(changes, []);
  }
});

test("server and client snapshots enable the control only after hydration", () => {
  const toggle = mount({ server: true });
  const store = toggle.store();
  assert.equal(store.getServerSnapshot(), false);
  assert.equal(store.getSnapshot(), true);
  assert.equal(toggle.button().props.disabled, true);
  const unsubscribe = store.subscribe(() => {});
  assert.equal(typeof unsubscribe, "function");
  assert.doesNotThrow(unsubscribe);
  toggle.hydrate();
  assert.equal(toggle.button().props.disabled, false);
  assert.deepEqual(toggle.changes(), []);
  assert.deepEqual(toggle.events(), []);
});

test("the dark theme offers light mode in its accessible label and tooltip", () => {
  const toggle = mount({ resolvedTheme: "dark" });
  assert.equal(toggle.button().props["aria-label"], "Switch to light mode");
  assert.equal(toggle.button().props.title, "Switch to light mode");
  assert.equal(toggle.button().props.disabled, false);
});

test("the light theme offers dark mode in its accessible label and tooltip", () => {
  const toggle = mount({ resolvedTheme: "light" });
  assert.equal(toggle.button().props["aria-label"], "Switch to dark mode");
  assert.equal(toggle.button().props.title, "Switch to dark mode");
  assert.equal(toggle.button().props.disabled, false);
});

test("each click selects the opposite resolved theme and updates the action label", () => {
  for (const initial of ["light", "dark"]) {
    const toggle = mount({ resolvedTheme: initial });
    const opposite = initial === "dark" ? "light" : "dark";
    toggle.click();
    assert.deepEqual(toggle.changes(), [opposite]);
    assert.equal(toggle.button().props["aria-label"], `Switch to ${initial} mode`);
    toggle.click();
    assert.deepEqual(toggle.changes(), [opposite, initial]);
    assert.equal(toggle.button().props["aria-label"], `Switch to ${opposite} mode`);
  }
});

test("rendering and reading snapshots before mount do not change the theme", () => {
  const toggle = mount({ server: true, resolvedTheme: "dark" });
  toggle.render();
  toggle.render();
  toggle.store().getSnapshot();
  toggle.store().getServerSnapshot();
  const unsubscribe = toggle.store().subscribe(() => {});
  unsubscribe();
  assert.deepEqual(toggle.changes(), []);
  assert.equal(toggle.button().props.disabled, true);
  assert.equal(toggle.button().props["aria-label"], "Change color theme");
  toggle.hydrate();
  assert.deepEqual(toggle.changes(), []);
  assert.equal(toggle.button().props["aria-label"], "Switch to light mode");
});

test("the theme icons are decorative and do not add keyboard stops", () => {
  const children = React.Children.toArray(mount().button().props.children);
  assert.equal(children.length, 2);
  assert.deepEqual(children.map((icon) => icon.props.className), [
    "theme-icon-light",
    "theme-icon-dark",
  ]);
  for (const icon of children) {
    assert.equal(icon.props["aria-hidden"], "true");
    assert.equal(icon.props.focusable, "false");
    assert.equal(icon.props.size, 20);
    assert.equal(icon.props.strokeWidth, 1.75);
  }
});

test("an explicit theme change opts into motion before changing the theme", () => {
  const toggle = mount();
  assert.equal(toggle.attributes().size, 0);
  toggle.click();
  assert.deepEqual(toggle.events(), ["set:data-theme-transition", "style", "theme:dark"]);
  assert.equal(toggle.attributes().has("data-theme-transition"), true);
  assert.equal(toggle.timers().size, 1);
  assert.equal([...toggle.timers().values()][0].delay, 1000);
  toggle.finishTransition();
  assert.equal(toggle.attributes().size, 0);
  assert.equal(toggle.timers().size, 0);
});

test("rapid clicks replace the cleanup timer without ending the new transition", () => {
  const toggle = mount();
  toggle.click();
  const firstTimer = [...toggle.timers().keys()][0];
  toggle.click();
  assert.equal(toggle.timers().has(firstTimer), false);
  assert.equal(toggle.timers().size, 1);
  assert.equal(toggle.attributes().has("data-theme-transition"), true);
  assert.ok(toggle.events().includes(`cancel:${firstTimer}`));
  toggle.finishTransition();
  assert.equal(toggle.attributes().size, 0);
});

test("reduced motion changes themes without starting a transition", () => {
  const toggle = mount({ reducedMotion: true });
  toggle.click();
  assert.deepEqual(toggle.changes(), ["dark"]);
  assert.equal(toggle.attributes().size, 0);
  assert.equal(toggle.timers().size, 0);
  assert.equal(toggle.events().includes("style"), false);
});

test("unmounting cancels the pending transition and removes its attribute", () => {
  const toggle = mount();
  toggle.click();
  toggle.unmount();
  assert.equal(toggle.attributes().size, 0);
  assert.equal(toggle.timers().size, 0);
});

test("a pre-hydration click cannot write theme or motion state", () => {
  const toggle = mount({ server: true });
  toggle.button().props.onClick();
  assert.deepEqual(toggle.changes(), []);
  assert.deepEqual(toggle.events(), []);
  assert.equal(toggle.timers().size, 0);
});

test("supported browsers reveal a coherent palette without a fallback timer", async () => {
  const toggle = mount({ nativeReveal: true });
  toggle.click();
  assert.equal(toggle.reveals().length, 1);
  assert.equal(toggle.attributes().has("data-theme-reveal"), true);
  assert.equal(toggle.attributes().has("data-theme-transition"), false);
  assert.equal(toggle.timers().size, 0);
  assert.equal(toggle.events().includes("style"), false);
  assert.deepEqual(toggle.changes(), []);
  toggle.updateReveal();
  assert.deepEqual(toggle.changes(), ["dark"]);
  assert.equal(toggle.button().props["aria-label"], "Switch to light mode");
  toggle.finishReveal();
  await Promise.resolve();
  assert.equal(toggle.attributes().size, 0);
});

test("rapid clicks before capture keep the latest requested theme", async () => {
  const toggle = mount({ nativeReveal: true });
  toggle.click();
  toggle.click();
  assert.equal(toggle.reveals()[0].skips, 1);
  toggle.updateReveal(0);
  assert.deepEqual(toggle.changes(), []);
  toggle.finishReveal(0);
  await Promise.resolve();
  assert.equal(toggle.attributes().has("data-theme-reveal"), true);
  toggle.updateReveal(1);
  assert.deepEqual(toggle.changes(), ["light"]);
  toggle.finishReveal(1);
  await Promise.resolve();
  assert.equal(toggle.attributes().size, 0);
});

test("rapid clicks after capture reverse the theme and replace the active reveal", async () => {
  const toggle = mount({ nativeReveal: true });
  toggle.click();
  toggle.updateReveal(0);
  toggle.click();
  toggle.updateReveal(1);
  assert.deepEqual(toggle.changes(), ["dark", "light"]);
  assert.equal(toggle.reveals()[0].skips, 1);
  toggle.finishReveal(0);
  await Promise.resolve();
  assert.equal(toggle.attributes().has("data-theme-reveal"), true);
  toggle.finishReveal(1);
  await Promise.resolve();
  assert.equal(toggle.attributes().size, 0);
});

test("reduced motion bypasses the native reveal", () => {
  const toggle = mount({ nativeReveal: true, reducedMotion: true });
  toggle.click();
  assert.deepEqual(toggle.changes(), ["dark"]);
  assert.equal(toggle.reveals().length, 0);
  assert.equal(toggle.attributes().size, 0);
});

test("a reduced-motion click cancels pending capture without a stale theme update", async () => {
  const toggle = mount({ nativeReveal: true });
  toggle.click();
  toggle.setReducedMotion(true);
  toggle.click();
  assert.deepEqual(toggle.changes(), ["light"]);
  assert.equal(toggle.reveals()[0].skips, 1);
  assert.equal(toggle.attributes().size, 0);
  toggle.updateReveal(0);
  toggle.finishReveal(0);
  await Promise.resolve();
  assert.deepEqual(toggle.changes(), ["light"]);
});

test("unmounting cancels capture and prevents pending theme changes", async () => {
  const toggle = mount({ nativeReveal: true });
  toggle.click();
  toggle.unmount();
  assert.equal(toggle.reveals()[0].skips, 1);
  assert.equal(toggle.attributes().size, 0);
  toggle.updateReveal(0);
  toggle.finishReveal(0);
  await Promise.resolve();
  assert.deepEqual(toggle.changes(), []);
});

test("a native API failure keeps the existing theme-switch fallback", () => {
  const toggle = mount({ nativeReveal: true, nativeFailure: true });
  toggle.click();
  assert.deepEqual(toggle.changes(), ["dark"]);
  assert.equal(toggle.attributes().has("data-theme-reveal"), false);
  assert.equal(toggle.attributes().has("data-theme-transition"), true);
  assert.equal(toggle.timers().size, 1);
  toggle.finishTransition();
  assert.equal(toggle.attributes().size, 0);
});

test("a failed reveal clears its marker without an unhandled rejection", async () => {
  const toggle = mount({ nativeReveal: true });
  toggle.click();
  toggle.updateReveal();
  toggle.reveals()[0].ready.reject(new Error("Capture unavailable"));
  toggle.reveals()[0].finished.reject(new Error("Capture unavailable"));
  await Promise.resolve();
  assert.deepEqual(toggle.changes(), ["dark"]);
  assert.equal(toggle.attributes().size, 0);
});
