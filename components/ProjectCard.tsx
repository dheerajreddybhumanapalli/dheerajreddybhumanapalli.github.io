import { useState } from "react";
import { ChevronDown, FolderGit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/data/portfolio";

interface ProjectCardProps {
  title: string;
  role: Role;
  featured?: boolean;
}

function parseTechStack(designation: string): string[] {
  return designation.split(",").map((tech) => tech.trim()).filter(Boolean);
}

export function ProjectCard({ title, role, featured = false }: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const techStack = parseTechStack(role.designation);

  return (
    <article
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 sm:p-7",
        "hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10",
        featured && "border-accent/25 bg-gradient-to-br from-card via-card to-accent/5"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span className="mt-0.5 rounded-xl bg-accent/10 p-2.5 text-accent transition-colors group-hover:bg-accent/15">
            <FolderGit2 className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold leading-snug tracking-tight">
                {title}
              </h3>
              {featured && (
                <span className="rounded-full bg-accent/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent">
                  Featured
                </span>
              )}
            </div>
            <p className="mt-1.5 font-mono text-xs text-muted sm:text-sm">
              {role.duration}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Collapse details" : "Expand details"}
          className="shrink-0 rounded-lg border border-border p-2 text-muted transition-all hover:border-accent/50 hover:text-accent"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              open && "rotate-180"
            )}
          />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {techStack.slice(0, open ? undefined : 6).map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/40 hover:text-foreground"
          >
            {tech}
          </span>
        ))}
        {!open && techStack.length > 6 && (
          <span className="rounded-full bg-subtle px-2.5 py-1 font-mono text-xs text-muted">
            +{techStack.length - 6} more
          </span>
        )}
      </div>

      <div
        className={cn(
          "grid transition-all duration-300",
          open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <ul className="space-y-2.5 border-t border-border pt-4">
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
      </div>
    </article>
  );
}
