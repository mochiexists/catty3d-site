"use client";

import { useState } from "react";

function CopyBlock({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="commandBlockWrap">
      <pre className="commandBlock">
        <code>{command}</code>
      </pre>
      <button
        className="copyButton"
        onClick={handleCopy}
        type="button"
        aria-label="Copy to clipboard"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

type InstallMethod = "script" | "brew" | "dmg";

type DownloadExperienceProps = {
  downloadUrl: string;
  homebrewCmd: string;
  scriptCmd: string;
  appStoreUrl: string | null;
  releaseStatus: string;
};

export function DownloadExperience({
  downloadUrl,
  homebrewCmd,
  scriptCmd,
  appStoreUrl,
  releaseStatus,
}: DownloadExperienceProps) {
  const [method, setMethod] = useState<InstallMethod>("brew");

  const methods: { id: InstallMethod; label: string }[] = [
    { id: "script", label: "Script" },
    { id: "brew", label: "Homebrew" },
    { id: "dmg", label: ".dmg" },
  ];

  return (
    <div className="downloadPaths">
      {/* ─── Outdoor Catty / direct path ─── */}
      <article className="downloadPath">
        <p className="downloadPathEyebrow">Outdoor · Direct</p>
        <h3>Notarized for <em>your shell</em>.</h3>
        <p className="downloadPathBody">
          The unsandboxed Mac build with the full local-terminal feature
          set. Notarized, signed with our Developer ID, Sparkle handles
          updates from inside the app. Pick how you want it on disk.
        </p>

        <div className="installToggle" role="tablist" aria-label="Install method">
          {methods.map((m) => (
            <button
              className={`installToggleBtn${method === m.id ? " installToggleBtnActive" : ""}`}
              key={m.id}
              onClick={() => setMethod(m.id)}
              type="button"
              role="tab"
              aria-selected={method === m.id}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="installPanel">
          {method === "script" && <CopyBlock command={scriptCmd} />}
          {method === "brew" && <CopyBlock command={homebrewCmd} />}
          {method === "dmg" && (
            <>
              <a className="planButton" href={downloadUrl}>
                ↓ Download .dmg
              </a>
              <ul className="installMeta">
                <li>Apple Silicon &amp; Intel · macOS 14+</li>
                <li>Resolves to /releases/latest on GitHub</li>
              </ul>
            </>
          )}
        </div>

        <p className="downloadPathComingSoon">{releaseStatus}</p>
      </article>

      {/* ─── Indoor Catty / App Store path ─── */}
      <article className="downloadPath">
        <p className="downloadPathEyebrow">Indoor · App Store</p>
        <h3>Sandboxed, <em>uniform</em>.</h3>
        <p className="downloadPathBody">
          For people who like their installers from one place. SSH still
          works. Local-shell sessions are disabled — Apple&rsquo;s sandbox
          can&rsquo;t fork your zsh. Grab Outdoor for that.
        </p>
        <div className="downloadPathActions">
          {appStoreUrl ? (
            <a href={appStoreUrl} target="_blank" rel="noreferrer">
              <img
                src="https://tools.applemediaservices.com/api/badges/download-on-the-mac-app-store/black/en-us?size=250x83"
                alt="Download on the Mac App Store"
                style={{ height: 52 }}
              />
            </a>
          ) : (
            <span className="appStoreBadgeDisabled" aria-label="Coming soon to the Mac App Store">
              <img
                src="https://tools.applemediaservices.com/api/badges/download-on-the-mac-app-store/black/en-us?size=250x83"
                alt=""
                style={{ height: 52, opacity: 0.5 }}
              />
            </span>
          )}
        </div>
        {!appStoreUrl && (
          <p className="downloadPathComingSoon">
            In App Review — link goes live with first approval.
          </p>
        )}
      </article>
    </div>
  );
}
