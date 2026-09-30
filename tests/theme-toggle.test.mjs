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

function loadComponent({ hooks = React, useTheme }) {
  const exportsHolder = { exports: {} };
  const Icon = ({ size, strokeWidth, ...props }) => React.createElement("svg", {
    width: size,
    height: size,
    strokeWidth,
    ...props,
  });
  vm.runInNewContext(compiled, {
    module: exportsHolder,
    exports: exportsHolder.exports,
    require: (name) => {
      if (name === "react") return hooks;
      if (name === "react/jsx-runtime") return jsxRuntime;
      if (name === "next-themes") return { useTheme };
      assert.equal(name, "lucide-react");
      return { Moon: Icon, Sun: Icon };
    },
  }, { filename: "theme-toggle.js" });
  return exportsHolder.exports.ThemeToggle;
}

function mount({ server = false, resolvedTheme = "light" } = {}) {
  let beforeHydration = server;
  let selectedTheme = resolvedTheme;
  let store;
  let tree;
  const changes = [];
  const Component = loadComponent({
    hooks: {
      useSyncExternalStore: (subscribe, getSnapshot, getServerSnapshot) => {
        store = { subscribe, getSnapshot, getServerSnapshot };
        return beforeHydration ? getServerSnapshot() : getSnapshot();
      },
    },
    useTheme: () => ({
      resolvedTheme: selectedTheme,
      setTheme: (next) => {
        changes.push(next);
        selectedTheme = next;
      },
    }),
  });
  const render = () => { tree = Component(); };
  render();
  return {
    button: () => tree,
    changes: () => changes,
    store: () => store,
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
