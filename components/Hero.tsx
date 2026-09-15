import { ArrowDown, FileText, MapPin } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { SocialLinks } from "@/components/SocialLinks";
import { assetPath } from "@/lib/utils";
import { SITE_ROLE, resumeUrl } from "@/data/site";

export function Hero() {
  return (
    <section
      id="home"
      className="relative scroll-mt-20 overflow-hidden px-6 pb-20 pt-24 sm:pb-28 sm:pt-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[280px] w-[380px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-10 text-center sm:flex-row sm:gap-12 sm:text-left">
          <FadeIn>
            <div className="relative shrink-0">
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-accent via-accent/40 to-transparent blur-md" />
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-accent/50 to-transparent" aria-hidden />
              <img
                src={assetPath("/profile_image.jpg")}
                alt="Dheeraj Reddy Bhumanapalli"
                width={168}
                height={168}
                loading="eager"
                className="relative h-40 w-40 rounded-full border-4 border-background object-cover sm:h-44 sm:w-44"
              />
              <span
                className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-accent"
                title="Open to opportunities"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-accent-foreground" />
              </span>
            </div>
          </FadeIn>

          <div className="flex-1">
            <FadeIn delay={0.1}>
              <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 font-mono text-xs font-medium text-accent">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" aria-hidden />
                Open to opportunities
              </p>
              <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Dheeraj Reddy{" "}
                <span className="bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                  Bhumanapalli
                </span>
              </h1>
              <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xl text-muted sm:justify-start">
                {SITE_ROLE}
                <span aria-hidden className="text-border">·</span>
                <span className="inline-flex items-center gap-1 text-base">
                  <MapPin className="h-4 w-4" aria-hidden /> India
                </span>
              </p>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted sm:mx-0">
                Building Generative AI solutions and production software — RAG,
                agentic workflows, and LLM inference — with Python, FastAPI,
                Django, PyTorch, and AWS.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30"
                >
                  View Projects
                  <ArrowDown className="h-4 w-4" />
                </a>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                >
                  <FileText className="h-4 w-4" />
                  Resume
                </a>
                <SocialLinks />
              </div>
            </FadeIn>
          </div>
        </div>

      </div>
    </section>
  );
}
