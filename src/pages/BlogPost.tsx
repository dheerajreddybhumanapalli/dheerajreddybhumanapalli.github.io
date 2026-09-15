import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { ShareButtons } from "@/components/ShareButtons";
import { PostNav } from "@/components/PostNav";
import { SEO } from "@/components/SEO";
import { formatPostDate } from "@/components/BlogCard";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { NotFound } from "./NotFound";

const SITE_URL = "https://dheerajreddybhumanapalli.github.io";

export function BlogPost() {
  const { slug = "" } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug);
  if (!post) return <NotFound />;

  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? posts[index - 1] : null;
  const next = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null;
  const related = getRelatedPosts(slug);
  const url = `${SITE_URL}/blog/${post.slug}/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Dheeraj Reddy Bhumanapalli",
      url: SITE_URL,
    },
    mainEntityOfPage: url,
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <SEO
        title={`${post.title} | Dheeraj Reddy Bhumanapalli`}
        description={post.summary}
        canonical={url}
        type="article"
        image={post.image}
        publishedTime={post.date}
        tags={post.tags}
        jsonLd={jsonLd}
      />
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <FadeIn>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> All posts
          </Link>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden />
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden />
              {post.readingMinutes} min read
            </span>
            <span>By Dheeraj Reddy Bhumanapalli</span>
          </div>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog/tag/${tag}`}
                  className="rounded-full bg-card px-3 py-1 text-xs font-medium text-muted transition-colors hover:text-accent"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          <div className="mt-6 border-y border-border py-4">
            <ShareButtons title={post.title} url={url} />
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <article
            className="post-body mt-10"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </FadeIn>
        <PostNav prev={prev} next={next} related={related} />
      </main>
      <Footer />
    </>
  );
}
