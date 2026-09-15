import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { BlogCard } from "@/components/BlogCard";

interface PostNavProps {
  prev: PostMeta | null;
  next: PostMeta | null;
  related: PostMeta[];
}

export function PostNav({ prev, next, related }: PostNavProps) {
  return (
    <div className="mt-16">
      <nav
        aria-label="More posts"
        className="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between"
      >
        <div className="flex-1">
          {prev && (
            <Link
              to={`/blog/${prev.slug}`}
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              <span>
                <span className="block text-xs uppercase tracking-wide">Previous</span>
                {prev.title}
              </span>
            </Link>
          )}
        </div>
        <div className="flex-1 text-right">
          {next && (
            <Link
              to={`/blog/${next.slug}`}
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              <span>
                <span className="block text-xs uppercase tracking-wide">Next</span>
                {next.title}
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          )}
        </div>
      </nav>

      {related.length > 0 && (
        <section aria-label="Related posts" className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Related posts</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
