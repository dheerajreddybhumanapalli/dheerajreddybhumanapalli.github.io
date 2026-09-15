import { ArrowDown, FileText } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { assetPath } from "@/lib/utils";

export function Hero() {
  return (
    <section
      id="home"
      className="relative scroll-mt-20 overflow-hidden px-6 py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 text-center sm:flex-row sm:text-left">
        <FadeIn>
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-accent/60 to-accent/20 blur-sm" />
            <img
              src={assetPath("/profile_image.jpg")}
              alt="Dheeraj Reddy Bhumanapalli"
              width={160}
              height={160}
              loading="eager"
              className="relative h-40 w-40 rounded-full border-4 border-background object-cover"
            />
          </div>
        </FadeIn>

        <div className="flex-1">
          <FadeIn delay={0.1}>
            <p className="font-mono text-sm text-accent">Hi, I&apos;m</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Dheeraj Reddy Bhumanapalli
            </h1>
            <p className="mt-3 text-xl text-muted">AI Software Engineer</p>
            <p className="mt-4 max-w-xl text-muted leading-relaxed">
              Building Generative AI solutions and production software — RAG,
              agentic workflows, and LLM inference — with Python, FastAPI,
              Django, PyTorch, and AWS.</p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-wrap justify-center gap-4 sm:justify-start">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                View Projects
                <ArrowDown className="h-4 w-4" />
              </a>
              <a
                href={assetPath("/resume.pdf")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent/40"
              >
                <FileText className="h-4 w-4" />
                Resume
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
