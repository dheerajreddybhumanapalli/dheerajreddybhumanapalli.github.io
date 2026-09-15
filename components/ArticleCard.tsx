import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import type { ArticleMeta } from "@/lib/articles";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/FadeIn";

export function formatArticleDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface ArticleCardProps {
  article: ArticleMeta;
  className?: string;
  index?: number;
}

export function ArticleCard({ article, className, index }: ArticleCardProps) {
  return (
    <FadeIn className={className}>
      <Link
        to={`/articles/${article.slug}`}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6",
          "transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10"
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-accent to-accent/40 transition-transform duration-300 group-hover:scale-x-100"
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {article.readingMinutes} min read
            </span>
          </div>
          {index !== undefined && (
            <span aria-hidden className="font-mono text-xs text-muted/60">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-xl font-semibold tracking-tight underline decoration-accent/0 decoration-2 underline-offset-4 transition-all group-hover:decoration-accent/60">
          {article.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {article.summary}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {article.tags.length > 0 &&
              article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-background px-2.5 py-1 font-mono text-xs font-medium text-muted transition-colors group-hover:text-accent"
                >
                  #{tag}
                </span>
              ))}
          </div>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
            aria-hidden
          />
        </div>
      </Link>
    </FadeIn>
  );
}
