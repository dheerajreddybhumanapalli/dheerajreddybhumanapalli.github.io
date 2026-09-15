import { useState } from "react";
import { Check, Link2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  /** Canonical (production) URL of the page being shared. */
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-card hover:text-foreground"
      >
        X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-card hover:text-foreground"
      >
        LinkedIn
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-card hover:text-foreground"
        aria-live="polite"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-accent" aria-hidden /> Copied
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4" aria-hidden /> Copy link
          </>
        )}
      </button>
    </div>
  );
}
