import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { navLinks, site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <Container className="flex h-18 items-center justify-between gap-8">
        <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
          {/* The wordmark is the brand. Height-constrained and auto-width so
              the aspect ratio is never distorted; `priority` because it is
              above the fold on every route. */}
          <Image
            src="/Assets/PublishYourBook_US_Main_Logo_Transparent.png"
            alt={site.name}
            width={1981}
            height={793}
            priority
            className="h-7 w-auto lg:h-8"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink href="/contact" variant="ghost" className="hidden sm:inline-flex">
            Talk to us
          </ButtonLink>
          <ButtonLink href="/contact">Start your book</ButtonLink>
        </div>
      </Container>
    </header>
  );
}
