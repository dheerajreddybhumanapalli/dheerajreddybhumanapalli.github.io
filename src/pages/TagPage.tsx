import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { FadeIn } from "@/components/FadeIn";
import { SEO } from "@/components/SEO";
import { getAllArticles, getAllTags } from "@/lib/articles";
import { SITE_NAME, SITE_URL } from "@/data/site";
import { NotFound } from "./NotFound";

export function TagPage() {
  const { tag = "" } = useParams<{ tag: string }>();
  const tags = getAllTags();
  if (!tags.includes(tag)) return <NotFound />;
  const articles = getAllArticles().filter((article) => article.tags.includes(tag));

  return (
    <>
      <SEO
        title={`Articles tagged "${tag}" | ${SITE_NAME}`}
        description={`All articles tagged "${tag}" by ${SITE_NAME}.`}
        canonical={`${SITE_URL}/articles/tag/${tag}/`}
      />
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <FadeIn>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-muted transition-all hover:border-accent/40 hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> All articles
          </Link>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Articles tagged{" "}
            <span className="whitespace-nowrap rounded-full border border-accent/30 bg-accent/10 px-4 py-1 align-middle font-mono text-2xl text-accent sm:text-3xl">
              #{tag}
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted">
            {articles.length} {articles.length === 1 ? "article" : "articles"}
          </p>
        </FadeIn>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {articles.map((article, i) => (
            <ArticleCard key={article.slug} article={article} index={i} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
