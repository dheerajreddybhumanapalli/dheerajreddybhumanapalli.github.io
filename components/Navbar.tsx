import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { resumeUrl } from "@/data/site";

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
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isArticles = pathname.startsWith("/articles");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      className={className ?? "ml-1 rounded-lg p-2 text-muted transition-colors hover:bg-card hover:text-foreground"}
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
      href={resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      Resume
    </a>
  );

  const logo = isHome ? (
    <button
      type="button"
      onClick={() => handleNavClick("#home")}
      className="group flex items-center gap-2.5"
      aria-label="Back to top"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-mono text-sm font-bold text-accent-foreground transition-transform group-hover:scale-105">
        D
      </span>
      <span className="hidden text-sm font-semibold tracking-tight sm:block">
        Dheeraj Reddy
      </span>
    </button>
  ) : (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Home">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-mono text-sm font-bold text-accent-foreground transition-transform group-hover:scale-105">
        D
      </span>
      <span className="hidden text-sm font-semibold tracking-tight sm:block">
        Dheeraj Reddy
      </span>
    </Link>
  );

  const desktopLinks = isHome ? (
    homeLinks.map((link) => {
      const id = link.href.replace("#", "");
      const active = activeSection === id;
      return (
        <button
          key={link.href}
          type="button"
          onClick={() => handleNavClick(link.href)}
          aria-current={active ? "true" : undefined}
          className={cn(
            "rounded-full px-3.5 py-2 text-sm font-medium transition-all",
            active
              ? "bg-accent/15 text-accent"
              : "text-muted hover:bg-card hover:text-foreground"
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
        className="rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-card hover:text-foreground"
      >
        Home
      </Link>
      <Link
        to="/articles"
        aria-current={isArticles ? "page" : undefined}
        className={cn(
          "rounded-full px-3.5 py-2 text-sm font-medium transition-all",
          isArticles
            ? "bg-accent/15 text-accent"
            : "text-muted hover:bg-card hover:text-foreground"
        )}
      >
        Articles
      </Link>
    </>
  );

  const mobileLinks = isHome ? (
    homeLinks.map((link) => {
      const id = link.href.replace("#", "");
      const active = activeSection === id;
      return (
        <button
          key={link.href}
          type="button"
          onClick={() => handleNavClick(link.href)}
          className={cn(
            "rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors",
            active ? "bg-accent/15 text-accent" : "text-muted hover:bg-card"
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
        className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-muted hover:bg-card"
      >
        Home
      </Link>
      <Link
        to="/articles"
        onClick={() => setMobileOpen(false)}
        className={cn(
          "rounded-xl px-4 py-2.5 text-left text-sm font-medium",
          isArticles ? "bg-accent/15 text-accent" : "text-muted hover:bg-card"
        )}
      >
        Articles
      </Link>
    </>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-md transition-all",
        scrolled
          ? "border-border/80 bg-background/90 shadow-sm shadow-black/5"
          : "border-border/60 bg-background/80"
      )}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
        {logo}

        <div className="hidden items-center gap-1 md:flex">
          {desktopLinks}
          {isHome && (
            <Link
              to="/articles"
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-card hover:text-foreground"
            >
              Articles
            </Link>
          )}
          {resumeLink("rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-card hover:text-foreground")}
          {themeButton()}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          {themeButton("rounded-lg p-2 text-muted")}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-card"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {mobileLinks}
              {isHome && (
                <Link
                  to="/articles"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-muted hover:bg-card"
                >
                  Articles
                </Link>
              )}
              {resumeLink("rounded-xl px-4 py-2.5 text-sm font-medium text-muted hover:bg-card")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
