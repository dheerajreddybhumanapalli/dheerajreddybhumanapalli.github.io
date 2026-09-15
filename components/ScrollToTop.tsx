import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scrolls to top on route changes, preserving in-page anchor behavior. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
