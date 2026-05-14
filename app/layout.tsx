import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { Starfield } from "./_components/starfield";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = "https://catty3d.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Catty 3D — A terminal that lives in 3D space",
    template: "%s · Catty 3D",
  },
  description:
    "Catty is a macOS terminal rendered as a floating panel inside a real-time 3D scene. Local shell or SSH. Maxwell the cat watches a magenta wireframe rat orbit your prompt.",
  openGraph: {
    title: "Catty 3D — A terminal that lives in 3D space",
    description:
      "A macOS terminal that lives in 3D space. Local shell or SSH. Maxwell the cat included.",
    url: SITE_URL,
    siteName: "Catty 3D",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catty 3D",
    description: "A macOS terminal that lives in 3D space.",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: [{ url: "/favicon-32.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: { "theme-color": "#04030a" },
};

function Header() {
  return (
    <header className="siteHeader">
      <div className="container">
        <Link href="/" className="brand" aria-label="Catty 3D — home">
          <img
            src="/icons/icon-64.png"
            alt=""
            width={34}
            height={34}
            className="brandMark"
          />
          <span>Catty</span>
          <span className="brandSuffix">3D</span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/download/">Download</Link>
          <Link href="/support/">Support</Link>
          <a href="https://github.com/mochiexists/catty-3d" target="_blank" rel="noreferrer">
            Source
          </a>
        </nav>
      </div>
    </header>
  );
}

function CoordinateStrip() {
  return (
    <div aria-hidden="true" className="coordStrip">
      <span>RA · 06h 45m 09s</span>
      <span>DEC · −16° 42′ 58″</span>
      <span>VEL · 0.000c</span>
      <span>OBS · CATTY/3D</span>
      <span>SIG · LOCK</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="siteFooter">
      <div className="container">
        <div className="siteFooterMark">
          © {new Date().getFullYear()} Catty 3D · MIT · made by mochiexists
        </div>
        <div className="footerLinks">
          <Link href="/privacy/">Privacy</Link>
          <Link href="/support/">Support</Link>
          <a href="https://github.com/mochiexists/catty-3d" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
      lang="en"
    >
      <body>
        <div aria-hidden="true" className="spaceBackdrop" />
        <Starfield />
        <Header />
        <CoordinateStrip />
        {children}
        <Footer />
      </body>
    </html>
  );
}
