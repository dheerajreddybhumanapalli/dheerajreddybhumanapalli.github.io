import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { skillGroups } from "@/data/portfolio";

export function Skills() {
  return (
    <section
      id="skills"
      aria-label="Skills"
      className="scroll-mt-20 border-y border-border bg-subtle/60 px-6 py-20"
    >
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeading
            title="Skills"
            subtitle="The stack I reach for in production."
          />
        </FadeIn>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, gi) => (
            <FadeIn key={group.label} delay={gi * 0.07}>
              <div className="h-full rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
                  {group.label}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-foreground"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
