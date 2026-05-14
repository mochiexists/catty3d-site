import Link from "next/link";
import { CattyTerminal } from "./_components/terminal";

export default function HomePage() {
  return (
    <main>
      <section className="hero container">
        <span className="heroEyebrow">Now boarding · macOS 14+</span>
        <h1 className="heroTitle">
          A terminal <em>that lives</em>
          <br />
          in <span className="accent">3D space.</span>
        </h1>
        <p className="heroLede">
          Catty renders your shell as a floating panel inside a real-time
          3D scene. Local <code>zsh</code> or SSH. There&rsquo;s a cat in
          the room and a magenta wireframe rat orbiting your prompt.
        </p>

        <CattyTerminal />

        <p style={{
          marginTop: 26,
          color: "var(--cream-faint)",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 12,
          letterSpacing: "0.08em",
        }}>
          ↑ try typing <span style={{ color: "var(--magenta)" }}>download</span>,{" "}
          <span style={{ color: "var(--magenta)" }}>brew</span>, or{" "}
          <span style={{ color: "var(--magenta)" }}>meow</span>
        </p>

        <div className="videoPorthole">
          <video
            src="/cat-demo-1080.mp4"
            poster="/cat-demo-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Catty 3D demo — terminal panel orbited by a cat and a wireframe rat"
          />
        </div>
        <p className="videoCaption">
          ↳ Maxwell + the rat orbit · drag to spin in the real app
        </p>
      </section>

      <section className="section container">
        <div className="sectionHead">
          <p className="eyebrow">Specifications</p>
          <h2 className="sectionTitle">Built for <em>shells in space.</em></h2>
          <p className="sectionLede">
            Two distribution channels, four surface modes, three cameras —
            and a cat that watches all of it.
          </p>
        </div>

        <div className="featureGrid">
          <article className="feature">
            <div className="featureGlyph">PTY · 01</div>
            <h3>Local terminal</h3>
            <p>
              Spawns your default shell in any folder, rendered live as a
              texture inside the RealityKit scene. Outdoor build only —
              the App Store sandbox can&rsquo;t fork your zsh.
            </p>
          </article>

          <article className="feature">
            <div className="featureGlyph">SSH · 02</div>
            <h3>Remote sessions</h3>
            <p>
              Pure-Swift SSH via Citadel — no system openssh required.
              Works on every build, including the sandboxed App Store one.
              Bring any host that accepts a shell.
            </p>
          </article>

          <article className="feature">
            <div className="featureGlyph">UI · 03</div>
            <h3>Indoor &amp; Outdoor</h3>
            <p>
              Outdoor: notarized DMG, Sparkle updates, Homebrew cask.
              Indoor: sandboxed Mac App Store build. One codebase, two
              entitlement files, one bundle ID.
            </p>
          </article>

          <article className="feature">
            <div className="featureGlyph">FUR · 04</div>
            <h3>A cat in the room</h3>
            <p>
              Maxwell-the-cat orbits the scene. He doesn&rsquo;t judge
              your typos. The rat is a wireframe homage to Ratty
              (Orhun Parmaksız) — the project that inspired all of this.
            </p>
          </article>

          <article className="feature">
            <div className="featureGlyph">GEO · 05</div>
            <h3>Surface modes</h3>
            <p>
              Map your terminal onto a flat plane, an IMAX curve, a Möbius
              strip, or a centre-bulge CRT warp. Each pane has its own
              shape — mix and match.
            </p>
          </article>

          <article className="feature">
            <div className="featureGlyph">CAM · 06</div>
            <h3>Three cameras</h3>
            <p>
              Orbit (turntable around the panel), ride-along on the rat,
              or mount Maxwell&rsquo;s head and pirouette through the
              scene. Drag to look. Scroll to dolly.
            </p>
          </article>
        </div>
      </section>

      <section className="section container">
        <div className="sectionHead">
          <p className="eyebrow">Two paths in</p>
          <h2 className="sectionTitle"><em>Get</em> Catty 3D.</h2>
          <p className="sectionLede">
            Brew if you&rsquo;ve drunk the Kool-Aid. DMG if you want to
            double-click. Script if you trust us with a curl pipe.
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/download/" className="btn btnPrimary">
            ⟶ Open the install picker
          </Link>
        </div>
      </section>
    </main>
  );
}
