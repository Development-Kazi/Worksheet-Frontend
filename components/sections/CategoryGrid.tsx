import Link from "next/link";
import CategoryCard from "@/components/cards/CategoryCard";
import { ClientCategory, getClientCategories } from "@/lib/client-api";
import "./CategoryGrid.css";

const iconPool = ["📖", "🔢", "🌍", "🧩", "🎨", "🧠", "📝", "📚"];

export default async function CategoryGrid() {
  let categories: ClientCategory[] = [];
  try {
    categories = (await getClientCategories()).filter((category) => !category.parent);
  } catch (error) {
    console.error("Failed to load categories:", error);
  }

  return (
    <section className="category-grid-section">

      {/* Header */}
      <div className="category-grid-header">
        <div className="category-grid-title-wrap">
          <span className="category-grid-label">Explore</span>
          <h2 className="category-grid-title">Browse Categories</h2>
        </div>
        <Link href="/categories" className="category-grid-view-all">
          View All →
        </Link>
      </div>

      {/* Grid */}
      <div className="category-grid">
        {categories.map((cat, index) => (
          <CategoryCard
            key={cat._id}
            title={cat.metaTitle?.trim() || cat.name}
            slug={cat.slug}
            description={
              cat.metaDescription?.trim() ||
              "Explore worksheets and learning materials"
            }
            image={cat.image}
            icon={iconPool[index % iconPool.length]}
          />
        ))}
      </div>

    </section>
  );
}
