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
        {copied ? "Copied!" : "Copy"}
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
        <p className="downloadPathEyebrow">Outdoor Catty</p>
        <h3>Direct download for Mac.</h3>
        <p className="downloadPathBody">
          Unsandboxed build with the full local-terminal feature set.
          Notarized, signed with our Developer ID, Sparkle auto-updates
          from inside the app.
        </p>

        <div className="installToggle" role="tablist">
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
                Download .dmg
              </a>
              <ul className="installMeta">
                <li>Apple Silicon &amp; Intel · macOS 14+</li>
                <li>Resolves to the latest release on GitHub</li>
              </ul>
            </>
          )}
        </div>

        <p className="downloadPathComingSoon">{releaseStatus}</p>
      </article>

      {/* ─── Indoor Catty / App Store path ─── */}
      <article className="downloadPath">
        <p className="downloadPathEyebrow">Indoor Catty</p>
        <h3>Mac App Store.</h3>
        <p className="downloadPathBody">
          Sandboxed build for people who like their installers uniform.
          SSH works fine. Local shell sessions are disabled (sandbox can&rsquo;t
          fork your shell) — grab Outdoor for that.
        </p>
        <div className="downloadPathActions">
          {appStoreUrl ? (
            <a href={appStoreUrl} target="_blank" rel="noreferrer">
              <img
                src="https://tools.applemediaservices.com/api/badges/download-on-the-mac-app-store/black/en-us?size=250x83"
                alt="Download on the Mac App Store"
                style={{ height: 48 }}
              />
            </a>
          ) : (
            <span className="appStoreBadgeDisabled" aria-label="Coming soon to the Mac App Store">
              <img
                src="https://tools.applemediaservices.com/api/badges/download-on-the-mac-app-store/black/en-us?size=250x83"
                alt=""
                style={{ height: 48, opacity: 0.5 }}
              />
            </span>
          )}
        </div>
        {!appStoreUrl && (
          <p className="downloadPathComingSoon">In App Review — link goes live with first approval.</p>
        )}
      </article>
    </div>
  );
}
