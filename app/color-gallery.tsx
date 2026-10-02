"use client";

import { useState, useSyncExternalStore } from "react";
import { ColorComparison } from "./color-comparison";
import { GalleryControls, PhotoCredit, type PhotoSource } from "./gallery-controls";

export type ColorExample = {
  id: string;
  title: string;
  input: string;
  output: string;
  inputAlt: string;
  outputAlt: string;
  photo: PhotoSource;
};

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ColorGallery({ examples }: { examples: readonly ColorExample[] }) {
  const [selection, setSelection] = useState({ index: 0, direction: "next" });
  const ready = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);

  if (examples.length === 0) return null;

  const index = selection.index % examples.length;
  const example = examples[index];

  function step(direction: -1 | 1) {
    if (!ready || examples.length < 2) return;
    setSelection((previous) => ({
      index: (previous.index + direction + examples.length) % examples.length,
      direction: direction === 1 ? "next" : "previous",
    }));
  }

  return (
    <figure className="colorization-figure color-gallery" aria-label="Colorization examples">
      <div className="gallery-frame" id="color-example" data-direction={selection.direction}>
        <div className="gallery-slide" key={example.id}>
          <ColorComparison
            id={`color-position-${example.id}`}
            input={example.input}
            output={example.output}
            inputAlt={example.inputAlt}
            outputAlt={example.outputAlt}
          />
        </div>
      </div>
      <GalleryControls
        name="Colorization"
        title={example.title}
        index={index}
        count={examples.length}
        ready={ready}
        controls="color-example"
        onStep={step}
      />
      <figcaption>
        <PhotoCredit photo={example.photo} changes="Made grayscale then colorized with my tool. The colors are estimates." />
      </figcaption>
    </figure>
  );
}
