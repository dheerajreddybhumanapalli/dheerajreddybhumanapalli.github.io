import { Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Home } from "./pages/Home";
import { ArticlesIndex } from "./pages/ArticlesIndex";
import { ArticlePage } from "./pages/ArticlePage";
import { TagPage } from "./pages/TagPage";
import { NotFound } from "./pages/NotFound";

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<ArticlesIndex />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/articles/tag/:tag" element={<TagPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
