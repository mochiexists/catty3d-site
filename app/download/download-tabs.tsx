"use client";

import { useState } from "react";
import { CattyTerminal } from "../_components/terminal";
import { DownloadExperience } from "./download-experience";

type Tab = "demo" | "terminal";

type DownloadTabsProps = {
  downloadUrl: string;
  homebrewCmd: string;
  scriptCmd: string;
  appStoreUrl: string | null;
};

export function DownloadTabs(props: DownloadTabsProps) {
  const [tab, setTab] = useState<Tab>("demo");

  return (
    <div className="dlTabs">
      <div className="dlTabBar" role="tablist" aria-label="Download view">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "demo"}
          className={`dlTab${tab === "demo" ? " dlTab--active" : ""}`}
          onClick={() => setTab("demo")}
        >
          <span className="dlTabGlyph">◐</span>
          <span>Demo</span>
          <span className="dlTabSub">picker · App Store</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "terminal"}
          className={`dlTab${tab === "terminal" ? " dlTab--active" : ""}`}
          onClick={() => setTab("terminal")}
        >
          <span className="dlTabGlyph">▌</span>
          <span>Terminal</span>
          <span className="dlTabSub">type to install</span>
        </button>
      </div>

      <div className="dlTabPanel" role="tabpanel">
        {tab === "demo" ? (
          <DownloadExperience
            downloadUrl={props.downloadUrl}
            homebrewCmd={props.homebrewCmd}
            scriptCmd={props.scriptCmd}
            appStoreUrl={props.appStoreUrl}
          />
        ) : (
          <div className="dlTermWrap">
            <CattyTerminal />
            <p className="dlTermHint">
              try <span>download</span>, then press{" "}
              <span>1</span> / <span>2</span> / <span>3</span> ·{" "}
              <span>help</span> lists everything else
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
