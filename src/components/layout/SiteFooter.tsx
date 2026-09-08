import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { footerNav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-alt">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Image
              src="/Assets/PublishYourBook_US_Stacked_Logo.png"
              alt={site.name}
              width={1254}
              height={1254}
              className="h-20 w-auto"
            />
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {site.description}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-block text-sm text-accent underline underline-offset-4"
            >
              {site.email}
            </a>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-eyebrow font-sans font-semibold uppercase text-ink-subtle">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-subtle">
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-ink-subtle hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-ink-subtle hover:text-ink">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
