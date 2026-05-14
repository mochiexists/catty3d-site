"use client";

import { useState } from "react";
import { CattyTerminal } from "./terminal";

type Stage = "video" | "terminal";

export function HeroStage() {
  const [stage, setStage] = useState<Stage>("video");
  const showTerminal = stage === "terminal";

  return (
    <>
      <div
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
          marginBottom: 60,
        }}
      >
        <button
          type="button"
          className="btn btnPrimary"
          aria-pressed={showTerminal}
          onClick={() => setStage(showTerminal ? "video" : "terminal")}
        >
          {showTerminal ? "⟵ Back to demo" : "⟶ Get Catty 3D"}
        </button>
        <a
          href="https://github.com/mochiexists/catty-3d"
          className="btn btnGhost"
          target="_blank"
          rel="noreferrer"
        >
          View source
        </a>
      </div>

      {showTerminal ? (
        <div className="heroTermStage">
          <CattyTerminal />
          <p className="videoCaption">
            ↳ try <code>download</code> · <code>help</code> lists everything
          </p>
        </div>
      ) : (
        <>
          <div className="videoPorthole">
            <video
              src="/cat-demo-1080.mp4"
              poster="/cat-demo-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Catty 3D demo — terminal panel orbited by a cat and a wireframe rat"
            />
          </div>
          <p className="videoCaption">
            ↳ Maxwell + the rat orbit · drag to spin in the real app
          </p>
        </>
      )}
    </>
  );
}
