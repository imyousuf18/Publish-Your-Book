import type { Metadata } from "next";
import { Playfair_Display, Roboto } from "next/font/google";
import { FooterReveal } from "@/components/layout/FooterReveal";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BookLoader } from "@/components/loader/BookLoader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { organizationSchema } from "@/lib/schema";
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

/* Display serif: Playfair Display, matched to the serif logo wordmark.
 * Italic is loaded because emphasis inside headings is set in italic of the
 * same face. */
const display = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
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
        {/* Structured data only — no visual output. Lets search engines read
            the business as a ProfessionalService rather than guessing from copy. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <SmoothScroll />
        <BookLoader />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-card focus:bg-accent focus:px-4 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        {/* Everything that slides up off the footer. The header is fixed and
            the loader is an overlay, so only this needs to move. */}
        <div id="page-content" className="flex flex-1 flex-col">
          <main id="main" className="flex-1">
            {children}
          </main>
        </div>
        <SiteFooter />
        <FooterReveal />
      </body>
    </html>
  );
}
