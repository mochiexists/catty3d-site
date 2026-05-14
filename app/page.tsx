import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="hero container">
        <span className="heroEyebrow">macOS · free · open source</span>
        <h1 className="heroTitle">
          A terminal <br />
          that lives in <span className="accent">3D space.</span>
        </h1>
        <p className="heroLede">
          Catty is a macOS terminal rendered as a floating panel in a real-time
          3D scene. Local shell or SSH. There&rsquo;s a cat in the room.
        </p>

        <div className="ctaRow">
          <Link href="/download/" className="btn btnPrimary">
            ↓ Download for Mac
          </Link>
          <a
            href="https://github.com/mochiexists/catty-3d"
            className="btn btnGhost"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
        </div>

        <div className="videoFrame">
          <video
            src="/cat-demo-1080.mp4"
            poster="/cat-demo-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Catty 3D demo"
          />
        </div>
      </section>

      <section className="section container">
        <h2 className="sectionTitle">What&rsquo;s in the box.</h2>
        <p className="sectionLede">
          Two cards on launch — pick a shape and go. Same scene under each.
        </p>
        <div className="featureGrid">
          <div className="feature">
            <div className="featureIcon">▶</div>
            <h3>Local terminal</h3>
            <p>
              Spawns your default shell in any folder, rendered live in the 3D
              scene. Outdoor (direct download) build only — App Store sandbox
              can&rsquo;t fork your shell.
            </p>
          </div>
          <div className="feature">
            <div className="featureIcon">⤳</div>
            <h3>SSH sessions</h3>
            <p>
              Connect to remote hosts via Citadel, no system openssh required.
              Works on every build, including the App Store one.
            </p>
          </div>
          <div className="feature">
            <div className="featureIcon">◐</div>
            <h3>Indoor &amp; Outdoor</h3>
            <p>
              Outdoor: notarized DMG, Sparkle updates, Homebrew cask. Indoor:
              sandboxed App Store build. Same code, different entitlements.
            </p>
          </div>
          <div className="feature">
            <div className="featureIcon">★</div>
            <h3>A cat in the room</h3>
            <p>
              Maxwell-the-cat lives in the scene. He spins. He doesn&rsquo;t
              judge your typos. Built on RealityKit + SwiftTerm.
            </p>
          </div>
        </div>
      </section>

      <section className="section container">
        <h2 className="sectionTitle">Two ways to get it.</h2>
        <p className="sectionLede">
          Brew if you&rsquo;ve already drunk the Kool-Aid. DMG if you want to
          double-click.
        </p>
        <div className="installGrid">
          <div className="installCard">
            <h3>Homebrew</h3>
            <p>Tap once, then install. Sparkle handles updates after.</p>
            <div className="codeBlock mono">
              <span>brew tap mochiexists/catty3d &amp;&amp; brew install catty</span>
            </div>
          </div>
          <div className="installCard">
            <h3>Direct download</h3>
            <p>Notarized .dmg, signed with our Developer ID.</p>
            <Link href="/download/" className="btn btnPrimary" style={{ width: "fit-content" }}>
              Get the latest release
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
