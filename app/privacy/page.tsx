import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <main className="container">
      <article className="prose">
        <h1>Privacy</h1>
        <p>Last updated: {new Date().getFullYear()}</p>

        <p>
          Catty 3D runs entirely on your Mac. It does not phone home, does
          not analytics-ping, and does not collect telemetry from your
          terminal sessions. What happens in your shell stays in your shell.
        </p>

        <h2>What Catty connects to</h2>
        <ul>
          <li>
            <strong>SSH hosts</strong> — only the hosts you explicitly
            connect to. Authentication uses your provided credentials.
          </li>
          <li>
            <strong>Sparkle update feed</strong> (Outdoor build only) — an
            HTTPS request to the appcast on catty3d.com when checking for
            updates. No identifying data is sent beyond what HTTPS requires.
          </li>
        </ul>

        <h2>What Catty does not do</h2>
        <ul>
          <li>No analytics, no third-party tracking, no crash reporters.</li>
          <li>No transmission of terminal contents, commands, or files.</li>
          <li>No user accounts. Nothing to register for.</li>
        </ul>

        <h2>Local data</h2>
        <p>
          SSH host bookmarks and your chosen working directory are stored in
          standard macOS app preferences on your machine. SSH passwords (if
          you save them) live in the macOS Keychain, scoped to the Catty app.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? File an issue at{" "}
          <a href="https://github.com/mochiexists/catty-3d/issues">
            github.com/mochiexists/catty-3d/issues
          </a>
          .
        </p>
      </article>
    </main>
  );
}
