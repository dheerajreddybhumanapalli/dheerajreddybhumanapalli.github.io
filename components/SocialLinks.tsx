import { Github, Linkedin } from "lucide-react";
import { socials } from "@/data/site";
import { cn } from "@/lib/utils";

const links = [
  { label: "GitHub", href: socials.github, icon: Github },
  { label: "LinkedIn", href: socials.linkedin, icon: Linkedin },
];

interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
}

export function SocialLinks({ className, iconClassName }: SocialLinksProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="rounded-lg border border-border bg-card p-2.5 text-muted transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
        >
          <link.icon className={cn("h-4 w-4", iconClassName)} aria-hidden />
        </a>
      ))}
    </div>
  );
}
