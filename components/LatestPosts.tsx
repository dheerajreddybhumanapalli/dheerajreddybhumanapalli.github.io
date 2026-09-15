import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { BlogCard } from "@/components/BlogCard";
import { SectionHeading } from "@/components/SectionHeading";

export function LatestPosts() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section id="blog" aria-label="Latest posts" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeading
        title="Latest posts"
        subtitle="AI news and technical newsletters from my explorations."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
        >
          View all posts <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
