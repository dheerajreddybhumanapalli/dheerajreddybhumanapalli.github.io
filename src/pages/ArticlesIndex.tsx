import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArticleList } from "@/components/ArticleList";
import { FadeIn } from "@/components/FadeIn";
import { SEO } from "@/components/SEO";
import { getAllArticles, getAllTags } from "@/lib/articles";
import { SITE_NAME, SITE_URL } from "@/data/site";

export function ArticlesIndex() {
  const articles = getAllArticles();
  const tags = getAllTags();

  return (
    <>
      <SEO
        title={`Articles | ${SITE_NAME}`}
        description="Articles by Dheeraj Reddy Bhumanapalli — notes on AI, software engineering, and things worth writing down."
        canonical={`${SITE_URL}/articles/`}
      />
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <FadeIn>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Writing
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Articles</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Notes on AI, software engineering, and things worth writing down —
            on whatever topic earns it.
          </p>
        </FadeIn>
        <div className="mt-10">
          <ArticleList articles={articles} tags={tags} />
        </div>
      </main>
      <Footer />
    </>
  );
}
