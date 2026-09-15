import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogList } from "@/components/BlogList";
import { FadeIn } from "@/components/FadeIn";
import { SEO } from "@/components/SEO";
import { getAllPosts, getAllTags } from "@/lib/posts";

export function BlogIndex() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <>
      <SEO
        title="Blog | Dheeraj Reddy Bhumanapalli"
        description="AI news and technical newsletters by Dheeraj Reddy Bhumanapalli — hands-on notes on Generative AI, LLM inference, RAG, and agentic workflows."
        canonical="https://dheerajreddybhumanapalli.github.io/blog/"
      />
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <FadeIn>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            AI news and technical newsletters from my explorations with new tools.
          </p>
        </FadeIn>
        <div className="mt-10">
          <BlogList posts={posts} tags={tags} />
        </div>
      </main>
      <Footer />
    </>
  );
}
