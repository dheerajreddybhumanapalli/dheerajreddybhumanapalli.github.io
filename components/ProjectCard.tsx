import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/data/portfolio";

interface ProjectCardProps {
  title: string;
  role: Role;
}

function parseTechStack(designation: string): string[] {
  return designation.split(",").map((tech) => tech.trim()).filter(Boolean);
}

export function ProjectCard({ title, role }: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const techStack = parseTechStack(role.designation);

  return (
    <article
      className={cn(
        "group rounded-2xl border border-border bg-card p-6 transition-all duration-300",
        "hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold leading-snug">{title}</h3>
          <p className="mt-1 text-sm text-muted">{role.duration}</p>
        </div>
        <ChevronDown
          className={cn(
            "mt-1 h-5 w-5 shrink-0 text-muted transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>

      <div className="mt-4 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-xs text-muted"
          >
            {tech}
          </span>
        ))}
      </div>

      <div
        className={cn(
          "grid transition-all duration-300",
          open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <ul className="space-y-2 border-t border-border pt-4">
            {role.description.map((point) => (
              <li
                key={point}
                className="flex gap-2 text-sm leading-relaxed text-muted"
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
