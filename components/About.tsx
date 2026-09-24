import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { about } from "@/data/portfolio";

export function About() {
  return (
    <section id="about" aria-label="About" className="scroll-mt-20 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeading
            title="About"
            subtitle="AI engineer with strong software fundamentals."
          />
        </FadeIn>
        <FadeIn>
          <div className="mx-auto max-w-3xl space-y-4 text-muted leading-relaxed">
            {about.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
