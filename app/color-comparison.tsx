"use client";

import Image from "next/image";
import { useState, useSyncExternalStore, type CSSProperties } from "react";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ColorComparison() {
  const [position, setPosition] = useState(50);
  const ready = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);

  return (
    <div className="color-comparison">
      <div className="comparison-stage" style={{ "--comparison-position": `${position}%` } as CSSProperties}>
        <Image
          src="/work/color-input.jpg"
          alt="Grayscale view of a street in Urla, İzmir"
          fill
          sizes="(max-width: 760px) calc(100vw - 2rem), (max-width: 1296px) calc(100vw - 3rem), 1248px"
        />
        <div className="comparison-color">
          <Image
            src="/work/color-output.jpg"
            alt="The same Urla street with colors estimated by the model"
            fill
            sizes="(max-width: 760px) calc(100vw - 2rem), (max-width: 1296px) calc(100vw - 3rem), 1248px"
          />
        </div>
        <div className="comparison-divider" aria-hidden="true">
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" focusable="false">
              <path d="m8 7-5 5 5 5m8-10 5 5-5 5" />
            </svg>
          </span>
        </div>
        <input
          className="comparison-range"
          id="color-position"
          type="range"
          min="0"
          max="100"
          step="1"
          disabled={!ready}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="Compare grayscale input with estimated color"
          aria-valuetext={`${position}% estimated color`}
          aria-describedby="comparison-help"
        />
      </div>
      <div className="comparison-labels" aria-hidden="true">
        <span>Estimated color</span>
        <span>Grayscale input</span>
      </div>
      <p className="comparison-help" id="comparison-help">
        {ready ? "Drag to compare. You can also use the arrow keys." : "Grayscale input and estimated color shown together."}
      </p>
      <noscript>
        <p>Open the <a href="/work/color-input.jpg">grayscale input</a> or <a href="/work/color-output.jpg">color result</a> to see the full image.</p>
      </noscript>
    </div>
  );
}
