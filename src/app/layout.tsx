import type { Metadata } from "next";
import { Noto_Serif_Display, Roboto } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BookLoader } from "@/components/loader/BookLoader";
import { Cursor } from "@/components/motion/Cursor";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { site } from "@/lib/site";
import "./globals.css";

/*
 * Type pairing taken from creativeans.com: Roboto for everything functional
 * (body, navigation, buttons, labels) and a high-contrast display serif for
 * headings, set at regular weight with italic used for emphasis.
 */
const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
  weight: ["300", "400", "500", "600", "700"],
});

/*
 * STAND-IN FOR MEMOGRAM. The reference site's display face is Memogram by
 * Letterena Studios, a commercial font: the free download is licensed for
 * personal use only, and their webfont files cannot be reused. Noto Serif
 * Display (SIL Open Font License) was the closest free match in width,
 * contrast and italic when set side by side.
 *
 * Once a Memogram webfont licence is bought, replace this block with
 * next/font/local pointing at the licensed files, keeping the same
 * `variable` name so nothing else has to change:
 *
 *   const display = localFont({
 *     src: [
 *       { path: "./fonts/Memogram-Regular.woff2", weight: "400", style: "normal" },
 *       { path: "./fonts/Memogram-Italic.woff2", weight: "400", style: "italic" },
 *     ],
 *     variable: "--font-display-face",
 *     display: "swap",
 *   });
 */
const display = Noto_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-face",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${roboto.variable} ${display.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SmoothScroll />
        <BookLoader />
        <Cursor />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-card focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
