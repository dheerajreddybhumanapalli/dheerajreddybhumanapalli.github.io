import { Link } from "react-router-dom";
import { assetPath } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 text-center text-sm text-muted">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6">
        <div className="flex items-center gap-4">
          <Link to="/blog" className="transition-colors hover:text-foreground">
            Blog
          </Link>
          <a
            href={assetPath("/rss.xml")}
            className="transition-colors hover:text-foreground"
          >
            RSS
          </a>
          <a
            href={assetPath("/resume.pdf")}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Resume
          </a>
        </div>
        <p>© {new Date().getFullYear()} Dheeraj Reddy Bhumanapalli</p>
      </div>
    </footer>
  );
}
