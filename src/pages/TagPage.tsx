import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/BlogCard";
import { FadeIn } from "@/components/FadeIn";
import { SEO } from "@/components/SEO";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { NotFound } from "./NotFound";

export function TagPage() {
  const { tag = "" } = useParams<{ tag: string }>();
  const tags = getAllTags();
  if (!tags.includes(tag)) return <NotFound />;
  const posts = getAllPosts().filter((post) => post.tags.includes(tag));

  return (
    <>
      <SEO
        title={`Posts tagged "${tag}" | Dheeraj Reddy Bhumanapalli`}
        description={`All blog posts tagged "${tag}" — AI news and technical newsletters by Dheeraj Reddy Bhumanapalli.`}
        canonical={`https://dheerajreddybhumanapalli.github.io/blog/tag/${tag}/`}
      />
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <FadeIn>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> All posts
          </Link>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Posts tagged{" "}
            <span className="rounded-full bg-card px-4 py-1 align-middle text-2xl text-accent sm:text-3xl">
              {tag}
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </FadeIn>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
