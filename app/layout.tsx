import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = "https://catty3d.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Catty 3D — A terminal that lives in 3D space",
    template: "%s | Catty 3D",
  },
  description:
    "Catty is a macOS terminal rendered in 3D space. Local shell or SSH, with a real cat in the room.",
  openGraph: {
    title: "Catty 3D — A terminal that lives in 3D space",
    description:
      "Catty is a macOS terminal rendered in 3D space. Local shell or SSH, with a real cat in the room.",
    url: SITE_URL,
    siteName: "Catty 3D",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catty 3D — A terminal that lives in 3D space",
    description:
      "Catty is a macOS terminal rendered in 3D space. Local shell or SSH, with a real cat in the room.",
  },
  other: { "theme-color": "#06070a" },
};

function Header() {
  return (
    <header className="siteHeader">
      <div className="container">
        <Link href="/" className="brand">
          <span className="brandMark">🐱</span>
          <span>Catty 3D</span>
        </Link>
        <nav className="nav">
          <Link href="/download/">Download</Link>
          <Link href="/support/">Support</Link>
          <a href="https://github.com/mochiexists/catty-3d" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="siteFooter">
      <div className="container">
        <div>© {new Date().getFullYear()} Catty 3D · made with affection by mochiexists</div>
        <div className="footerLinks">
          <Link href="/privacy/">Privacy</Link>
          <Link href="/support/">Support</Link>
          <a href="https://github.com/mochiexists/catty-3d" target="_blank" rel="noreferrer">Source</a>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${displayFont.variable} ${bodyFont.variable}`} lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
