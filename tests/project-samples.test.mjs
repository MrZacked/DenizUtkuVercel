import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import sharp from "sharp";
import ts from "typescript";

const holder = { exports: {} };
const results = JSON.parse(readFileSync(new URL("../app/detection-results.json", import.meta.url), "utf8"));
const compiled = ts.transpileModule(readFileSync(new URL("../app/project-samples.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
vm.runInNewContext(compiled, {
  module: holder,
  exports: holder.exports,
  require: (name) => {
    assert.equal(name, "./detection-results.json");
    return { default: results };
  },
});
const { detectionExamples, colorExamples } = holder.exports;

test("each gallery photo has its own source and clear license", () => {
  const photos = [...detectionExamples, ...colorExamples].map((example) => example.photo);
  assert.equal(photos.length, 6);
  assert.equal(new Set(photos.map((photo) => photo.source)).size, photos.length);
  for (const photo of photos) {
    assert.ok(photo.author.length > 2);
    assert.ok(photo.license.length > 2);
    assert.equal(new URL(photo.source).protocol, "https:");
    assert.equal(new URL(photo.licenseUrl).protocol, "https:");
    if (photo.license === "CC BY 2.0") assert.ok(photo.title);
  }
});

test("detection examples use the cat and clean high-confidence results", async () => {
  assert.deepEqual(Array.from(detectionExamples, (example) => example.id), ["cat", "car", "horse"]);
  for (const example of detectionExamples) {
    const path = new URL(`../public${example.src}`, import.meta.url);
    const metadata = await sharp(readFileSync(path)).metadata();
    assert.equal(metadata.format, "webp");
    assert.equal(metadata.width, 1280);
    assert.equal(metadata.height, 853);
    assert.ok(statSync(path).size < 400_000, example.src);
    const visible = example.boxes.filter((box) => box.confidence >= 0.5);
    assert.equal(visible.length, 1, example.id);
    assert.equal(visible[0].label, example.id);
    assert.ok(visible[0].confidence >= 0.9, example.id);
  }
});

test("color inputs and outputs have matching display frames and modest file sizes", async () => {
  for (const example of colorExamples) {
    const sizes = [];
    for (const src of [example.input, example.output]) {
      assert.ok(src.startsWith("/work/color-"));
      assert.ok(src.endsWith(".webp"));
      const path = new URL(`../public${src}`, import.meta.url);
      const metadata = await sharp(readFileSync(path)).metadata();
      assert.equal(metadata.width, 1280);
      assert.equal(metadata.height, 800);
      assert.ok(statSync(path).size < 400_000, src);
      sizes.push([metadata.width, metadata.height]);
    }
    assert.deepEqual(sizes[0], sizes[1]);
    assert.match(example.inputAlt, /grayscale/i);
    assert.match(example.outputAlt, /estimated/i);
  }
});

test("public copy describes the tools without claiming model ownership", () => {
  const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
  const gallery = readFileSync(new URL("../app/detection-gallery.tsx", import.meta.url), "utf8");
  const colors = readFileSync(new URL("../app/color-gallery.tsx", import.meta.url), "utf8");
  assert.match(page, /app for object detection/);
  assert.doesNotMatch(page, /pretrained/i);
  assert.doesNotMatch(colors, /I used a|pretrained/i);
  assert.match(gallery, /Run through my detection code\./);
  assert.doesNotMatch(gallery, /pretrained YOLO/);
});
