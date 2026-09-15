import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";

export function LatestArticles() {
  const articles = getAllArticles().slice(0, 3);
  if (articles.length === 0) return null;

  return (
    <section id="articles" aria-label="Latest articles" className="mx-auto max-w-5xl px-6 py-20">
      <SectionHeading
        eyebrow="Writing"
        title="Latest articles"
        subtitle="Notes on AI, software engineering, and things worth writing down."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => (
          <ArticleCard key={article.slug} article={article} index={i} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          to="/articles"
          className="group inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30"
        >
          View all articles
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
