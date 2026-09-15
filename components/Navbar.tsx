import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn, assetPath } from "@/lib/utils";

const homeLinks = [
  { href: "#home", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const sectionIds = ["home", "projects", "experience", "contact"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const themeButton = (className?: string) => (
    <button
      type="button"
      onClick={toggleTheme}
      className={className ?? "ml-2 rounded-lg p-2 text-muted transition-colors hover:bg-card hover:text-foreground"}
      aria-label="Toggle theme"
    >
      {mounted && theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );

  const resumeLink = (className: string) => (
    <a
      href={assetPath("/resume.pdf")}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      Resume
    </a>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {isHome ? (
          <button
            type="button"
            onClick={() => handleNavClick("#home")}
            className="text-lg font-semibold tracking-tight"
          >
            DRB
          </button>
        ) : (
          <Link to="/" className="text-lg font-semibold tracking-tight">
            DRB
          </Link>
        )}

        <div className="hidden items-center gap-1 md:flex">
          {isHome ? (
            homeLinks.map((link) => {
              const id = link.href.replace("#", "");
              return (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    activeSection === id
                      ? "text-accent"
                      : "text-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </button>
              );
            })
          ) : (
            <>
              <Link
                to="/"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                Home
              </Link>
              <Link
                to="/blog"
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith("/blog")
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                )}
              >
                Blog
              </Link>
            </>
          )}
          {isHome && (
            <Link
              to="/blog"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Blog
            </Link>
          )}
          {resumeLink("rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground")}
          {themeButton()}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {themeButton("rounded-lg p-2 text-muted")}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-muted"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {isHome ? (
              homeLinks.map((link) => {
                const id = link.href.replace("#", "");
                return (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => handleNavClick(link.href)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-left text-sm font-medium",
                      activeSection === id ? "text-accent" : "text-muted"
                    )}
                  >
                    {link.label}
                  </button>
                );
              })
            ) : (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-muted"
                >
                  Home
                </Link>
                <Link
                  to="/blog"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-left text-sm font-medium",
                    pathname.startsWith("/blog") ? "text-accent" : "text-muted"
                  )}
                >
                  Blog
                </Link>
              </>
            )}
            {isHome && (
              <Link
                to="/blog"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-muted"
              >
                Blog
              </Link>
            )}
            {resumeLink("rounded-lg px-3 py-2 text-sm font-medium text-muted")}
          </div>
        </div>
      )}
    </header>
  );
}
