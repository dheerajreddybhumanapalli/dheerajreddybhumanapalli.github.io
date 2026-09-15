import { useState } from "react";
import { Check, Copy, Mail, Phone } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

const contactInfo = [
  {
    label: "Email",
    value: "dheerajbhumanapalli@gmail.com",
    href: "mailto:dheerajbhumanapalli@gmail.com",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "(+91) 7674051671",
    href: "tel:+917674051671",
    icon: Phone,
  },
];

export function Contact() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="contact" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeading
            title="Contact"
            subtitle="Reach out for collaborations, opportunities, or a conversation."
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid gap-4 sm:grid-cols-2">
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <div className="rounded-xl bg-accent/10 p-3">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted">{item.label}</p>
                  <a
                    href={item.href}
                    className="mt-0.5 block truncate font-medium hover:text-accent"
                  >
                    {item.value}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(item.value)}
                  className={cn(
                    "shrink-0 rounded-lg p-2 text-muted transition-colors hover:bg-background hover:text-foreground"
                  )}
                  aria-label={`Copy ${item.label}`}
                >
                  {copied === item.value ? (
                    <Check className="h-4 w-4 text-accent" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
