import type { Metadata } from "next";
import Link from "next/link";
import { DownloadTabs } from "./download-tabs";

export const metadata: Metadata = {
  title: "Download",
  description:
    "Download Catty 3D for macOS. Script, Homebrew, or direct .dmg — or talk to the terminal.",
};

// GitHub auto-redirects /releases/latest/download/<asset> to the latest
// release's matching asset.
// DMG ships from the SITE repo (release-host pattern, mirrors LAIC).
// catty-3d is the source; catty3d-site is where releases land so the
// versioned + fixed-name DMG sit alongside the appcast.xml under
// /releases/latest/download/.
const DMG_URL = "https://github.com/mochiexists/catty3d-site/releases/latest/download/Catty.dmg";
const HOMEBREW_CMD = "brew tap mochiexists/catty3d && brew install catty";
const SCRIPT_CMD = "curl -fsSL https://catty3d.com/install.sh | sh";
const APP_STORE_URL: string | null = null; // pre-approval

export default function DownloadPage() {
  return (
    <main className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <header style={{
        textAlign: "center",
        marginBottom: 56,
        maxWidth: 640,
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <p className="eyebrow">Catalogue · 002</p>
        <h1 style={{
          fontSize: "clamp(48px, 7vw, 80px)",
          marginTop: 16,
          marginBottom: 18,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}>
          Get <em style={{ fontStyle: "italic", color: "var(--magenta)" }}>Catty</em> 3D.
        </h1>
        <p style={{
          color: "var(--cream-dim)",
          fontSize: 17,
          lineHeight: 1.6,
        }}>
          Pick the picker, or talk to the terminal. Both land you at the
          same install.
        </p>
      </header>

      <DownloadTabs
        downloadUrl={DMG_URL}
        homebrewCmd={HOMEBREW_CMD}
        scriptCmd={SCRIPT_CMD}
        appStoreUrl={APP_STORE_URL}
      />

      <section style={{ marginTop: 64, textAlign: "center" }}>
        <p style={{
          color: "var(--cream-faint)",
          fontSize: 13,
          fontFamily: "var(--font-mono), monospace",
          letterSpacing: "0.06em",
        }}>
          First run? macOS may prompt to confirm the Developer ID.{" "}
          <Link href="/support/" style={{ color: "var(--magenta)", textDecoration: "underline" }}>
            See support
          </Link>{" "}
          if Gatekeeper acts up.
        </p>
      </section>
    </main>
  );
}
