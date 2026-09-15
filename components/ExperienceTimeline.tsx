import { Building2 } from "lucide-react";
import type { CardItem } from "@/data/portfolio";

interface ExperienceTimelineProps {
  experiences: CardItem[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <ol className="relative space-y-10">
      <div
        aria-hidden
        className="absolute bottom-2 left-[19px] top-2 w-px bg-gradient-to-b from-accent/60 via-border to-transparent sm:left-[23px]"
      />

      {experiences.map((company) => (
        <li key={company.title} className="relative pl-12 sm:pl-14">
          <span
            aria-hidden
            className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/30 bg-card text-accent shadow-sm sm:h-12 sm:w-12"
          >
            <Building2 className="h-5 w-5" />
          </span>

          <h3 className="pt-1 text-xl font-semibold tracking-tight sm:pt-2">
            {company.title}
          </h3>

          <div className="mt-4 space-y-5">
            {company.roles.map((role) => (
              <div
                key={`${company.title}-${role.designation}-${role.duration}`}
                className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/30 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{role.designation}</p>
                  <p className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs font-medium text-accent">
                    {role.duration}
                  </p>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {role.description.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-sm leading-relaxed text-muted"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
