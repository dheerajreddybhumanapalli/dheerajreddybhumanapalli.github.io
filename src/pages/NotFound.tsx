import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

export function NotFound() {
  return (
    <>
      <SEO
        title="Page not found | Dheeraj Reddy Bhumanapalli"
        description="The page you are looking for does not exist."
      />
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
        <h1 className="text-5xl font-bold tracking-tight">404</h1>
        <p className="mt-4 text-lg text-muted">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
        >
          Go home
        </Link>
      </main>
      <Footer />
    </>
  );
}
