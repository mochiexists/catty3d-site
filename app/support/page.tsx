import type { Metadata } from "next";

export const metadata: Metadata = { title: "Support" };

export default function SupportPage() {
  return (
    <main className="container">
      <article className="prose">
        <p className="eyebrow">Catalogue · 004</p>
        <h1 style={{ marginTop: 16 }}><em>Support</em></h1>
        <p style={{ color: "var(--cream-dim)", marginTop: 12, fontSize: 17 }}>
          The fastest way to reach us is GitHub Issues — we read every one.
        </p>

        <h2>Report a bug or request a feature</h2>
        <p>
          Open an issue at{" "}
          <a href="https://github.com/mochiexists/catty-3d/issues">
            github.com/mochiexists/catty-3d/issues
          </a>
          . Include your macOS version, the build (Indoor / Outdoor), and
          a short description of what happened vs. what you expected.
        </p>

        <h2>Gatekeeper / &ldquo;unidentified developer&rdquo;</h2>
        <p>
          The Outdoor build is signed with our Developer ID and notarized
          by Apple, so this should not happen. If it does:
        </p>
        <ul>
          <li>Right-click the app in Finder → Open → Open.</li>
          <li>
            Or: System Settings → Privacy &amp; Security → scroll to the
            blocked-app message and click &ldquo;Open Anyway&rdquo;.
          </li>
        </ul>

        <h2>Local terminal won&rsquo;t open</h2>
        <p>
          If you&rsquo;re on the App Store (Indoor) build, local shell
          sessions are disabled — the sandbox can&rsquo;t fork your shell.
          Grab the Outdoor DMG from the <a href="/download/">download page</a>.
        </p>

        <h2>SSH connection failing</h2>
        <p>
          Catty uses Citadel, a pure-Swift SSH client. If your server uses
          unusual key types or kex algorithms, please file an issue with the
          server&rsquo;s banner string and we&rsquo;ll add support.
        </p>

        <h2>The terminal in the home page</h2>
        <p>
          That&rsquo;s a fake one — canned responses for marketing. The
          real terminal lives in the Mac app and runs your actual shell.
        </p>
      </article>
    </main>
  );
}
