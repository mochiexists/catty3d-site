import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Download Catty 3D",
  description:
    "Download Catty 3D for macOS. Notarized DMG or Homebrew cask, your call.",
};

const RELEASES_URL = "https://github.com/mochiexists/catty-3d/releases/latest";

export default function DownloadPage() {
  return (
    <main className="container" style={{ paddingTop: 64, paddingBottom: 80 }}>
      <header style={{ textAlign: "center", marginBottom: 56 }}>
        <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)", marginBottom: 16 }}>
          Get Catty 3D.
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 18, maxWidth: 560, margin: "0 auto" }}>
          Pick the shape that fits how you live. Both run the same scene.
        </p>
      </header>

      <div className="installGrid">
        <div className="installCard">
          <h3>🍺 Homebrew (recommended)</h3>
          <p>
            Tap once, install, get Sparkle auto-updates after. It&rsquo;s free
            — no subscription, no account.
          </p>
          <div className="codeBlock mono" style={{ display: "block" }}>
            <div>brew tap mochiexists/catty3d</div>
            <div>brew install catty</div>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-faint)", margin: 0 }}>
            Tap source:{" "}
            <a
              href="https://github.com/mochiexists/homebrew-catty3d"
              style={{ color: "var(--accent-soft)" }}
              target="_blank"
              rel="noreferrer"
            >
              mochiexists/homebrew-catty3d
            </a>
            . Modern brew auto-detects the cask, so no <code>--cask</code> flag
            needed.
          </p>
        </div>

        <div className="installCard">
          <h3>💾 Direct .dmg</h3>
          <p>
            Notarized, signed with our Developer ID. Drag-to-Applications,
            done. Sparkle still auto-updates from inside the app.
          </p>
          <a
            href={RELEASES_URL}
            className="btn btnPrimary"
            style={{ width: "fit-content" }}
            target="_blank"
            rel="noreferrer"
          >
            ↓ Latest release on GitHub
          </a>
          <p style={{ fontSize: 13, color: "var(--text-faint)", margin: 0 }}>
            Apple Silicon and Intel both supported, macOS 14+.
          </p>
        </div>

        <div className="installCard">
          <h3>📱 Mac App Store (Indoor)</h3>
          <p>
            The sandboxed build, for people who like their installers
            uniform. Local-shell sessions are disabled (sandbox limitation),
            but SSH works fine.
          </p>
          <p style={{ color: "var(--text-faint)", fontSize: 14, margin: 0 }}>
            Coming soon — Indoor build is in App Review. Use the Outdoor DMG
            in the meantime.
          </p>
        </div>
      </div>

      <section style={{ marginTop: 72, textAlign: "center" }}>
        <p style={{ color: "var(--text-dim)", fontSize: 14 }}>
          First time running? macOS will prompt to confirm the Developer ID.
          See <Link href="/support/" style={{ color: "var(--accent-soft)", textDecoration: "underline" }}>support</Link> if Gatekeeper acts up.
        </p>
      </section>
    </main>
  );
}
