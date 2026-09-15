import { useState } from "react";
import { Check, Copy, Github, Linkedin, Mail, Phone, Send } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { SITE_EMAIL, socials } from "@/data/site";
import { cn } from "@/lib/utils";

const contactMethods = [
  {
    label: "Email",
    value: SITE_EMAIL,
    href: `mailto:${SITE_EMAIL}`,
    icon: Mail,
    note: "Best for opportunities",
  },
  {
    label: "Phone",
    value: "(+91) 7674051671",
    href: "tel:+917674051671",
    icon: Phone,
    note: "Call or WhatsApp",
  },
  {
    label: "GitHub",
    value: "github.com",
    href: socials.github,
    icon: Github,
    note: "Code & experiments",
    external: true,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com",
    href: socials.linkedin,
    icon: Linkedin,
    note: "Professional network",
    external: true,
  },
];

export function Contact() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(value);
    window.setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="contact" className="scroll-mt-20 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeading
            eyebrow="Get in touch"
            title="Contact"
            subtitle="Reach out for collaborations, opportunities, or a conversation about AI systems."
          />
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2">
          {contactMethods.map((item, i) => (
            <FadeIn key={item.label} delay={i * 0.07}>
              <div className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 sm:p-6">
                <div className="rounded-xl bg-accent/10 p-3 text-accent transition-colors group-hover:bg-accent/15">
                  <item.icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">
                    {item.label} · {item.note}
                  </p>
                  <a
                    href={item.href}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="mt-1 block truncate font-medium transition-colors hover:text-accent"
                  >
                    {item.value}
                  </a>
                </div>
                {!item.external ? (
                  <button
                    type="button"
                    onClick={() => handleCopy(item.value)}
                    className="shrink-0 rounded-lg p-2 text-muted transition-colors hover:bg-subtle hover:text-foreground"
                    aria-label={`Copy ${item.label}`}
                  >
                    {copied === item.value ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                ) : (
                  <Send className="h-4 w-4 shrink-0 text-muted transition-all group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
