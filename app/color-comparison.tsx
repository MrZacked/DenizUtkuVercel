"use client";

import Image from "next/image";
import { useState, useSyncExternalStore, type CSSProperties } from "react";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

type ColorComparisonProps = {
  input?: string;
  output?: string;
  inputAlt?: string;
  outputAlt?: string;
  id?: string;
};

export function ColorComparison({
  input = "/work/color-input.jpg",
  output = "/work/color-output.jpg",
  inputAlt = "Grayscale view of a street in Urla, İzmir",
  outputAlt = "The same Urla street with colors estimated by the model",
  id = "color-position",
}: ColorComparisonProps = {}) {
  const [position, setPosition] = useState(50);
  const [imageStates, setImageStates] = useState<Record<string, "loaded" | "error">>({});
  const ready = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const helpId = id === "color-position" ? "comparison-help" : `${id}-help`;
  const loaded = imageStates[input] === "loaded" && imageStates[output] === "loaded";
  const failed = imageStates[input] === "error" || imageStates[output] === "error";

  function markImage(source: string, status: "loaded" | "error") {
    setImageStates((current) => ({ ...current, [source]: status }));
  }

  return (
    <div className="color-comparison">
      <div className="comparison-stage" style={{ "--comparison-position": `${position}%` } as CSSProperties} aria-busy={ready && !loaded && !failed}>
        <Image
          src={input}
          alt={inputAlt}
          fill
          sizes="(max-width: 760px) calc(100vw - 2rem), (max-width: 1296px) calc(100vw - 3rem), 1248px"
          onLoad={() => markImage(input, "loaded")}
          onError={() => markImage(input, "error")}
        />
        <div className="comparison-color">
          <Image
            src={output}
            alt={outputAlt}
            fill
            sizes="(max-width: 760px) calc(100vw - 2rem), (max-width: 1296px) calc(100vw - 3rem), 1248px"
            onLoad={() => markImage(output, "loaded")}
            onError={() => markImage(output, "error")}
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
          id={id}
          type="range"
          min="0"
          max="100"
          step="1"
          disabled={!ready || !loaded}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="Compare grayscale input with estimated color"
          aria-valuetext={`${position}% estimated color`}
          aria-describedby={helpId}
        />
        <div className={loaded ? "visually-hidden" : "gallery-feedback"} role="status" aria-atomic="true" hidden={!ready}>
          {failed ? <>
            <p>This comparison couldn’t load.</p>
            <div className="gallery-photo-links"><a href={input}>Open input</a><a href={output}>Open result</a></div>
          </> : loaded ? "Comparison ready." : "Loading photos…"}
        </div>
      </div>
      <div className="comparison-labels" aria-hidden="true">
        <span>Estimated color</span>
        <span>Grayscale input</span>
      </div>
      <p className="comparison-help" id={helpId}>
        {!ready ? "Grayscale input and estimated color shown together." : loaded ? "Drag to compare. You can also use the arrow keys." : failed ? "Open the photos above or choose another sample." : "The comparison will be ready when both photos load."}
      </p>
      <noscript>
        <p>Open the <a href={input}>grayscale input</a> or <a href={output}>color result</a> to see the full image.</p>
      </noscript>
    </div>
  );
}
