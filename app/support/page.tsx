import type { Metadata } from "next";

export const metadata: Metadata = { title: "Support" };

export default function SupportPage() {
  return (
    <main className="container">
      <article className="prose">
        <h1>Support</h1>

        <p>
          The fastest way to reach us is GitHub Issues — we read every one.
        </p>

        <h2>Report a bug or request a feature</h2>
        <p>
          Open an issue at{" "}
          <a href="https://github.com/mochiexists/catty-3d/issues">
            github.com/mochiexists/catty-3d/issues
          </a>
          . Include your macOS version, the build (Indoor / Outdoor), and a
          short description of what happened vs. what you expected.
        </p>

        <h2>Gatekeeper / "unidentified developer"</h2>
        <p>
          The Outdoor build is signed with our Developer ID and notarized by
          Apple, so this should not happen. If it does:
        </p>
        <ul>
          <li>Right-click the app in Finder → Open → Open.</li>
          <li>
            Or: System Settings → Privacy &amp; Security → scroll to the
            blocked-app message and click "Open Anyway".
          </li>
        </ul>

        <h2>Local terminal won't open</h2>
        <p>
          If you're on the App Store (Indoor) build, local shell sessions
          are disabled — the sandbox can't fork your shell. Grab the Outdoor
          DMG from the <a href="/download/">download page</a>.
        </p>

        <h2>SSH connection failing</h2>
        <p>
          Catty uses Citadel, a pure-Swift SSH client. If your server uses
          unusual key types or kex algorithms, please file an issue with the
          server's banner string and we'll add support.
        </p>
      </article>
    </main>
  );
}
