import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { SITE_NAME } from "@/data/site";

export function NotFound() {
  return (
    <>
      <SEO
        title={`Page not found | ${SITE_NAME}`}
        description="The page you are looking for does not exist."
      />
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
        <p className="font-mono text-sm uppercase tracking-[0.25em] text-accent">
          404
        </p>
        <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Lost in the static files
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted">
          The page you are looking for does not exist — or it moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4" aria-hidden /> Go home
          </Link>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Browse articles
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
