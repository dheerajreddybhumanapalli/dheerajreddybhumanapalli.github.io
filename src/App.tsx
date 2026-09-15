import { Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Home } from "./pages/Home";
import { BlogIndex } from "./pages/BlogIndex";
import { BlogPost } from "./pages/BlogPost";
import { TagPage } from "./pages/TagPage";
import { NotFound } from "./pages/NotFound";

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/blog/tag/:tag" element={<TagPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
