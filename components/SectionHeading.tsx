import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  id?: string;
  title: string;
  subtitle?: string;
  className?: string;
  eyebrow?: string;
}

export function SectionHeading({
  id,
  title,
  subtitle,
  className,
  eyebrow,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-12", className)}>
      {eyebrow && (
        <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <span aria-hidden className="mt-3 block h-1 w-12 rounded-full bg-gradient-to-r from-accent to-accent/30" />
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg text-muted">{subtitle}</p>
      )}
    </div>
  );
}
