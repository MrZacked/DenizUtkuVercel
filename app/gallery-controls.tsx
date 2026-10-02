"use client";

import type { KeyboardEvent } from "react";

type GalleryControlsProps = {
  name: string;
  title: string;
  index: number;
  count: number;
  ready: boolean;
  controls: string;
  onStep: (direction: -1 | 1) => void;
};

export function GalleryControls({ name, title, index, count, ready, controls, onStep }: GalleryControlsProps) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!ready || count < 2 || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
    event.preventDefault();
    onStep(event.key === "ArrowLeft" ? -1 : 1);
  }

  return (
    <div className="gallery-controls" role="group" aria-label={`${name} gallery controls`} onKeyDown={onKeyDown}>
      <div className="gallery-current" aria-live="polite" aria-atomic="true">
        <span className="gallery-count">{index + 1} / {count}</span>
        <span>{title}</span>
      </div>
      <div className="gallery-arrows">
        {([-1, 1] as const).map((direction) => (
          <button
            key={direction}
            type="button"
            disabled={!ready || count < 2}
            aria-label={`${direction === -1 ? "Previous" : "Next"} ${name.toLowerCase()} example`}
            aria-controls={controls}
            onClick={() => onStep(direction)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d={direction === -1 ? "M20 12H4m6-6-6 6 6 6" : "M4 12h16m-6-6 6 6-6 6"} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export type PhotoSource = {
  title?: string;
  author: string;
  source: string;
  license: string;
  licenseUrl: string;
};

export function PhotoCredit({ photo, changes }: { photo: PhotoSource; changes: string }) {
  return (
    <>
      {photo.title ? `Photo: “${photo.title}” by ` : "Photo by "}<a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.author}</a>
      {" ("}<a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.license}</a>{"). "}{changes}
    </>
  );
}
