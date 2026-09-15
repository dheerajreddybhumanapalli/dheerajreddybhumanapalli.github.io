import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { LatestArticles } from "@/components/LatestArticles";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { SITE_NAME, SITE_ROLE, SITE_URL } from "@/data/site";

export function Home() {
  return (
    <>
      <SEO
        title={`${SITE_NAME} | ${SITE_ROLE}`}
        description={`Portfolio of ${SITE_NAME} — ${SITE_ROLE} specializing in Generative AI, RAG, agentic workflows, LLM inference, and production backend systems.`}
        canonical={SITE_URL}
      />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <LatestArticles />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
