import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { ShareButtons } from "@/components/ShareButtons";
import { ArticleNav } from "@/components/ArticleNav";
import { SEO } from "@/components/SEO";
import { formatArticleDate } from "@/components/ArticleCard";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
  loadArticleContent,
} from "@/lib/articles";
import { SITE_NAME, SITE_URL } from "@/data/site";
import { NotFound } from "./NotFound";

export function ArticlePage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const [contentHtml, setContentHtml] = useState<string | null>(null);
  const [contentError, setContentError] = useState(false);

  useEffect(() => {
    if (!article) return;
    let cancelled = false;
    setContentHtml(null);
    setContentError(false);
    loadArticleContent(article.slug).then(
      (html) => {
        if (!cancelled) setContentHtml(html);
      },
      () => {
        if (!cancelled) setContentError(true);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [article?.slug]);

  if (!article) return <NotFound />;

  const articles = getAllArticles();
  const index = articles.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? articles[index - 1] : null;
  const next = index >= 0 && index < articles.length - 1 ? articles[index + 1] : null;
  const related = getRelatedArticles(slug);
  const url = `${SITE_URL}/articles/${article.slug}/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: url,
    keywords: article.tags.join(", "),
  };

  return (
    <>
      <SEO
        title={`${article.title} | ${SITE_NAME}`}
        description={article.summary}
        canonical={url}
        type="article"
        image={article.image}
        publishedTime={article.date}
        tags={article.tags}
        jsonLd={jsonLd}
      />
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-accent to-accent/40"
          style={{ scaleX: progress }}
        />
      )}
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <FadeIn>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-muted transition-all hover:border-accent/40 hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> All articles
          </Link>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            {article.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden />
              <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden />
              {article.readingMinutes} min read
            </span>
            <span>By {SITE_NAME}</span>
          </div>
          {article.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/articles/tag/${tag}`}
                  className="rounded-full border border-border bg-card px-3 py-1 font-mono text-xs font-medium text-muted transition-all hover:border-accent/50 hover:text-accent"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
          <div className="mt-6 rounded-2xl border border-border bg-card/60 py-3 pl-1 pr-4">
            <ShareButtons title={article.title} url={url} />
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          {contentError ? (
            <p className="mt-10 rounded-2xl border border-border bg-card/60 p-6 text-sm text-muted">
              Couldn&apos;t load this article&apos;s content. Please check your
              connection and try again.
            </p>
          ) : contentHtml === null ? (
            <div
              className="mt-10 animate-pulse space-y-3"
              aria-label="Loading article content"
            >
              <div className="h-4 w-3/4 rounded bg-card" />
              <div className="h-4 w-full rounded bg-card" />
              <div className="h-4 w-5/6 rounded bg-card" />
              <div className="h-4 w-2/3 rounded bg-card" />
            </div>
          ) : (
            <article
              className="post-body mt-10"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          )}
        </FadeIn>
        <ArticleNav prev={prev} next={next} related={related} />
      </main>
      <Footer />
    </>
  );
}
