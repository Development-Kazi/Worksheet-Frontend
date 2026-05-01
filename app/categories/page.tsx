import type { Metadata } from "next";
import SearchableCategoriesGrid from "@/components/sections/SearchableCategoriesGrid";
import { ClientCategory, getClientCategories } from "@/lib/client-api";
import "./page.css";

const iconPool = ["📖", "🔢", "🌍", "🧩", "🎨", "🧠", "📝", "📚"];

export const metadata: Metadata = {
  title: "All Categories",
  description:
    "Browse all worksheet categories and explore printable learning resources by topic for kids.",
};

export default async function CategoriesPage() {
  let categories: ClientCategory[] = [];

  try {
    categories = (await getClientCategories()).filter((category) => !category.parent);
  } catch (error) {
    console.error("Failed to load all categories:", error);
  }

  return (
    <main className="categories-page">
      <section className="categories-section">
        <div className="categories-header">
          <h1 className="categories-title">All Categories</h1>
          <p className="categories-subtitle">
            Browse all main categories and open worksheets by topic.
          </p>
        </div>

        <SearchableCategoriesGrid categories={categories} iconPool={iconPool} />
      </section>
    </main>
  );
}
