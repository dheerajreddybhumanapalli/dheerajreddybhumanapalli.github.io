import { Link } from "react-router-dom";
import { ArrowUp, FileText, Rss, type LucideIcon } from "lucide-react";
import { SocialLinks } from "@/components/SocialLinks";
import { SITE_NAME, resumeUrl, rssUrl } from "@/data/site";

const sitemapLinks = [
  { to: "/", label: "Home" },
  { to: "/articles", label: "Articles" },
];

interface ResourceLink {
  href: string;
  label: string;
  icon?: LucideIcon;
  external?: boolean;
}

const resourceLinks: ResourceLink[] = [
  { href: rssUrl, label: "RSS feed", icon: Rss },
  { href: resumeUrl, label: "Resume", icon: FileText, external: true },
];

export function Footer() {
  const scrollTop = () => window.scrollTo({ behavior: "smooth", top: 0 });

  return (
    <footer className="border-t border-border bg-subtle/40">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-mono text-sm font-bold text-accent-foreground">
              D
            </span>
            <span className="text-sm font-semibold tracking-tight">{SITE_NAME}</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            AI Software Engineer building Generative AI systems and production
            software.
          </p>
          <SocialLinks className="mt-4" />
        </div>

        <nav aria-label="Sitemap">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">
            Sitemap
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {sitemapLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-muted transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Resources">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">
            Resources
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {resourceLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent"
                >
                  {link.icon && (
                    <link.icon className="h-3.5 w-3.5" aria-hidden />
                  )}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5 text-xs text-muted">
          <p>© {new Date().getFullYear()} {SITE_NAME}</p>
          <p className="hidden sm:block">Built with React + Tailwind CSS</p>
          <button
            type="button"
            onClick={scrollTop}
            aria-label="Back to top"
            className="rounded-lg border border-border bg-card p-2 transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
          >
            <ArrowUp className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </footer>
  );
}
