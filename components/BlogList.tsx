import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { cn } from "@/lib/utils";
import { BlogCard } from "@/components/BlogCard";

interface BlogListProps {
  posts: PostMeta[];
  tags: string[];
}

export function BlogList({ posts, tags }: BlogListProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (activeTag && !post.tags.includes(activeTag)) return false;
      if (!q) return true;
      const haystack = `${post.title} ${post.summary} ${post.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, query, activeTag]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            aria-label="Search posts"
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </label>
      </div>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeTag === null
                ? "bg-accent text-accent-foreground"
                : "bg-card text-muted hover:text-foreground"
            )}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                activeTag === tag
                  ? "bg-accent text-accent-foreground"
                  : "bg-card text-muted hover:text-foreground"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-muted">
          {posts.length === 0
            ? "No posts yet — check back soon."
            : "No posts match your search."}
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
