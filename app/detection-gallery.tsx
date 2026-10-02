"use client";

import Image from "next/image";
import { useState, useSyncExternalStore, type CSSProperties } from "react";
import { GalleryControls, PhotoCredit, type PhotoSource } from "./gallery-controls";

export type DetectionExample = {
  id: string;
  title: string;
  src: string;
  alt: string;
  photo: PhotoSource;
  boxes: readonly {
    label: string;
    confidence: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
};

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function DetectionGallery({ examples }: { examples: readonly DetectionExample[] }) {
  const [{ index, direction, imageStatus }, setSelection] = useState({
    index: 0,
    direction: undefined as "next" | "previous" | undefined,
    imageStatus: "loading" as "loading" | "loaded" | "error",
  });
  const [confidence, setConfidence] = useState(50);
  const [showBoxes, setShowBoxes] = useState(true);
  const ready = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const example = examples[index];
  if (!example) return null;
  const boxes = example.boxes.filter((box) => box.confidence >= confidence / 100);

  function step(change: -1 | 1) {
    if (!ready || examples.length < 2) return;
    setSelection((current) => ({
      index: (current.index + change + examples.length) % examples.length,
      direction: change === 1 ? "next" : "previous",
      imageStatus: "loading",
    }));
  }

  function markImage(status: "loaded" | "error") {
    setSelection((current) => current.index === index ? { ...current, imageStatus: status } : current);
  }

  return (
    <figure className="project-figure detection-figure" aria-label="Object detection examples">
      <div className="gallery-frame project-image detection-stage" id="detection-example" data-direction={direction} data-reveal="image" aria-busy={ready && imageStatus === "loading"}>
        <div className="gallery-slide detection-slide" key={example.id}>
          <Image
            src={example.src}
            alt={example.alt}
            fill
            sizes="(max-width: 760px) calc(100vw - 2rem), (max-width: 1000px) calc(55vw - 2.75rem), (max-width: 1296px) calc(58.75vw - 1.875rem), (max-width: 1600px) calc(780px - 3.75vw), 720px"
            onLoad={() => markImage("loaded")}
            onError={() => markImage("error")}
          />
          {showBoxes && imageStatus === "loaded" && <div className="detection-overlay" aria-hidden="true">
            {boxes.map((box, number) => (
              <div
                key={`${example.id}-${number}`}
                className="detection-box"
                data-label-align={box.x > 80 ? "right" : undefined}
                style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.width}%`, height: `${box.height}%` } as CSSProperties}
              >
                <span>{box.label} {Math.round(box.confidence * 100)}%</span>
              </div>
            ))}
          </div>}
        </div>
        <div className={imageStatus === "loaded" ? "visually-hidden" : "gallery-feedback"} role="status" aria-atomic="true" hidden={!ready}>
          {imageStatus === "error" ? <>
            <p>This photo couldn’t load.</p>
            <a href={example.src}>Open photo</a>
          </> : imageStatus === "loaded" ? "Photo loaded." : "Loading photo…"}
        </div>
      </div>
      <GalleryControls
        name="Detection"
        title={example.title}
        index={index}
        count={examples.length}
        ready={ready}
        controls="detection-example"
        onStep={step}
      />
      <details className="sample-playground">
        <summary>Try the samples</summary>
        <div className="sample-settings">
          <p>These are saved results from my Python app, not live inference. Move the filter to hide lower-confidence predictions.</p>
          <label className="confidence-label" htmlFor="detection-confidence">
            <span>Minimum confidence</span><span>{confidence}%</span>
          </label>
          <input
            id="detection-confidence"
            type="range"
            min="15"
            max="95"
            step="1"
            disabled={!ready}
            value={confidence}
            onChange={(event) => setConfidence(Number(event.target.value))}
            aria-valuetext={`${confidence}% minimum confidence`}
            aria-describedby="detection-results-help"
          />
          <label className="boxes-label">
            <input type="checkbox" checked={showBoxes} disabled={!ready} onChange={(event) => setShowBoxes(event.target.checked)} />
            Show detection boxes
          </label>
          <p className="sample-results" id="detection-results-help">
            {boxes.length === 0 ? "No detections at this confidence level." : `${boxes.length} ${boxes.length === 1 ? "detection" : "detections"}: ${boxes.map((box) => `${box.label} ${Math.round(box.confidence * 100)}%`).join(", ")}.`}
          </p>
          <span className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
            {boxes.length === 0 ? "No detections at this confidence level." : `${boxes.length} ${boxes.length === 1 ? "detection" : "detections"} at this confidence level.`}
          </span>
          <p className="sample-limit">Confidence is the model’s score, not a guarantee that a prediction is correct.</p>
        </div>
      </details>
      <noscript>
        <p>More sample photos: {examples.map((sample, number) => (
          <span key={sample.id}>{number > 0 ? " · " : ""}<a href={sample.src}>{sample.title}</a></span>
        ))}. The sample controls need JavaScript.</p>
      </noscript>
      <figcaption>
        <PhotoCredit photo={example.photo} changes="Run through my detection code." />
      </figcaption>
    </figure>
  );
}
