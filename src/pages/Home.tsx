import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { LatestPosts } from "@/components/LatestPosts";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const SITE_URL = "https://dheerajreddybhumanapalli.github.io";

export function Home() {
  return (
    <>
      <SEO
        title="Dheeraj Reddy Bhumanapalli | AI Software Engineer"
        description="Portfolio of Dheeraj Reddy Bhumanapalli — AI Software Engineer specializing in Generative AI, RAG, agentic workflows, LLM inference, and production backend systems."
        canonical={SITE_URL}
      />
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <LatestPosts />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
