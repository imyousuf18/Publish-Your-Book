import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { footerNav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    /* The reveal positioning lives in globals.css under
       html[data-footer-reveal="on"] — see the FOOTER REVEAL block there. */
    <footer id="site-footer" className="border-t border-line bg-surface-alt">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Image
              src="/Assets/PublishYourBook_US_Stacked_Logo.png"
              alt={site.name}
              width={1254}
              height={1254}
              className="h-16 w-auto lg:h-20"
            />
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {site.description}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-flex min-h-11 items-center text-sm text-accent underline underline-offset-4 lg:min-h-0"
            >
              {site.email}
            </a>
          </div>

          {/* Mobile-first. On a phone these stacked into one column of 11
              links and the footer ran to ~1,330px, about 1.6 screens. Now
              Services (six links) spans the width in two columns, and Company
              and Resources sit side by side. From lg, `contents` dissolves this
              wrapper so the groups drop back into the original 4-column row. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:contents">
          {footerNav.map((group, i) => (
            <nav
              key={group.title}
              aria-label={group.title}
              className={cn(i === 0 && "col-span-2 lg:col-span-1")}
            >
              <h2 className="text-eyebrow font-sans font-semibold uppercase text-ink-subtle">
                {group.title}
              </h2>
              {/* Each link is already 44px tall below lg, so the list needs no
                  extra spacing there; lg links are compact and get space-y. */}
              <ul
                className={cn(
                  "mt-3 lg:mt-4 lg:space-y-2.5",
                  i === 0 && "grid grid-cols-2 gap-x-4 lg:block",
                )}
              >
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-sm text-ink-muted transition-colors hover:text-ink lg:min-h-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t sm:mt-14 sm:gap-3 border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-subtle">
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="inline-flex min-h-11 items-center text-sm text-ink-subtle hover:text-ink lg:min-h-0">
              Privacy
            </Link>
            <Link href="/terms" className="inline-flex min-h-11 items-center text-sm text-ink-subtle hover:text-ink lg:min-h-0">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
