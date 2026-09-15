import { Link } from "react-router-dom";
import { CalendarDays, Clock } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/FadeIn";

export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface BlogCardProps {
  post: PostMeta;
  className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
  return (
    <FadeIn className={className}>
      <Link
        to={`/blog/${post.slug}`}
        className={cn(
          "group flex h-full flex-col rounded-xl border border-border bg-card p-6",
          "transition-colors hover:border-accent"
        )}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {post.readingMinutes} min read
          </span>
        </div>
        <h3 className="mt-3 text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {post.summary}
        </p>
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </FadeIn>
  );
}
