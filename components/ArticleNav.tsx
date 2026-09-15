import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ArticleMeta } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";

interface ArticleNavProps {
  prev: ArticleMeta | null;
  next: ArticleMeta | null;
  related: ArticleMeta[];
}

export function ArticleNav({ prev, next, related }: ArticleNavProps) {
  return (
    <div className="mt-16">
      <nav
        aria-label="More articles"
        className="grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
      >
        {prev ? (
          <Link
            to={`/articles/${prev.slug}`}
            className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              Newer
            </span>
            <span className="mt-2 block font-medium leading-snug transition-colors group-hover:text-accent">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span aria-hidden className="hidden sm:block" />
        )}
        {next && (
          <Link
            to={`/articles/${next.slug}`}
            className="group rounded-2xl border border-border bg-card p-5 text-right transition-all hover:-translate-y-0.5 hover:border-accent/40"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted">
              Older
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
            <span className="mt-2 block font-medium leading-snug transition-colors group-hover:text-accent">
              {next.title}
            </span>
          </Link>
        )}
      </nav>

      {related.length > 0 && (
        <section aria-label="Related articles" className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Related articles</h2>
          <span aria-hidden className="mt-3 block h-1 w-10 rounded-full bg-gradient-to-r from-accent to-accent/30" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((article, i) => (
              <ArticleCard key={article.slug} article={article} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
