import type { Metadata } from "next";
import Link from "next/link";
import { DownloadExperience } from "./download-experience";

export const metadata: Metadata = {
  title: "Download Catty 3D",
  description:
    "Download Catty 3D for macOS. Script, Homebrew, or .dmg — your call.",
};

// GitHub auto-redirects /releases/latest/download/<asset> to the latest
// release's matching asset; 404s before the first release ships.
const DMG_URL = "https://github.com/mochiexists/catty-3d/releases/latest/download/Catty.dmg";
const HOMEBREW_CMD = "brew tap mochiexists/catty3d && brew install catty";
const SCRIPT_CMD = "curl -fsSL https://catty3d.com/install.sh | sh";
const APP_STORE_URL: string | null = null; // pre-approval

export default function DownloadPage() {
  return (
    <main className="container" style={{ paddingTop: 64, paddingBottom: 80 }}>
      <header style={{ textAlign: "center", marginBottom: 56 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "var(--text-dim)", margin: "0 0 12px",
        }}>
          Download
        </p>
        <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)", marginBottom: 16 }}>
          Get Catty 3D.
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 18, maxWidth: 600, margin: "0 auto" }}>
          The base app is free on both paths. Outdoor Catty is the full
          Mac direct-download route; Indoor Catty is the App Store one.
        </p>
      </header>

      <DownloadExperience
        downloadUrl={DMG_URL}
        homebrewCmd={HOMEBREW_CMD}
        scriptCmd={SCRIPT_CMD}
        appStoreUrl={APP_STORE_URL}
        releaseStatus="First public release ships shortly. Install commands above will work the moment it lands."
      />

      <section style={{ marginTop: 72, textAlign: "center" }}>
        <p style={{ color: "var(--text-dim)", fontSize: 14 }}>
          First time running? macOS may prompt to confirm the Developer ID.
          See <Link href="/support/" style={{ color: "var(--accent-soft)", textDecoration: "underline" }}>support</Link> if Gatekeeper acts up.
        </p>
      </section>
    </main>
  );
}
