import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: "website" | "article";
  image?: string;
  publishedTime?: string;
  tags?: string[];
  jsonLd?: Record<string, unknown>;
}

function upsertMeta(attr: string, key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Sets document title + meta tags for the current route (client-side). */
export function SEO({
  title,
  description,
  canonical,
  type = "website",
  image,
  publishedTime,
  tags = [],
  jsonLd,
}: SEOProps) {
  // Stabilize array/object deps (ArticlePage builds these inline each render).
  const tagsKey = (tags ?? []).join("\0");
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";
  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    if (canonical) {
      upsertLink("canonical", canonical);
      upsertMeta("property", "og:url", canonical);
    }
    if (image) upsertMeta("property", "og:image", image);
    else
      document.head.querySelector('meta[property="og:image"]')?.remove();
    if (publishedTime) {
      upsertMeta("property", "article:published_time", publishedTime);
    } else {
      document.head
        .querySelector('meta[property="article:published_time"]')
        ?.remove();
    }
    // There can be multiple article:tag metas, so reset them on each run
    // (upsertMeta alone would collapse them down to a single tag).
    document.head
      .querySelectorAll('meta[property="article:tag"]')
      .forEach((el) => el.remove());
    for (const tag of tags) {
      const el = document.createElement("meta");
      el.setAttribute("property", "article:tag");
      el.setAttribute("content", tag);
      document.head.appendChild(el);
    }
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    if (image) upsertMeta("name", "twitter:image", image);
    else document.head.querySelector('meta[name="twitter:image"]')?.remove();

    let jsonLdEl: HTMLScriptElement | null = null;
    if (jsonLd) {
      jsonLdEl = document.createElement("script");
      jsonLdEl.type = "application/ld+json";
      jsonLdEl.textContent = JSON.stringify(jsonLd);
      jsonLdEl.dataset.seoJsonLd = "true";
      document.head.appendChild(jsonLdEl);
    }
    return () => {
      document.head
        .querySelectorAll("script[data-seo-json-ld]")
        .forEach((el) => el.remove());
    };
  }, [title, description, canonical, type, image, publishedTime, tagsKey, jsonLdKey]);

  return null;
}
