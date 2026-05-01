"use client";

import { useDeferredValue, useState } from "react";
import CategoryCard from "@/components/cards/CategoryCard";
import ContentSearch from "@/components/common/ContentSearch";
import { ClientCategory } from "@/lib/client-api";

type Props = {
  categories: ClientCategory[];
  iconPool: string[];
};

const matchesCategory = (category: ClientCategory, query: string) => {
  const searchableText = [
    category.name,
    category.metaTitle,
    category.metaDescription,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(query);
};

export default function SearchableCategoriesGrid({ categories, iconPool }: Props) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredCategories = normalizedQuery
    ? categories.filter((category) => matchesCategory(category, normalizedQuery))
    : categories;

  return (
    <>
      <div className="categories-toolbar">
        <ContentSearch
          value={query}
          onChange={setQuery}
          placeholder="Search categories by title or description..."
        />
        <span className="categories-results-count">
          {filteredCategories.length} result{filteredCategories.length === 1 ? "" : "s"}
        </span>
      </div>

      {filteredCategories.length > 0 ? (
        <div className="categories-grid">
          {filteredCategories.map((category, index) => (
            <CategoryCard
              key={category._id}
              title={category.metaTitle?.trim() || category.name}
              slug={category.slug}
              description={
                category.metaDescription?.trim() ||
                "Explore worksheets and learning materials"
              }
              image={category.image}
              icon={iconPool[index % iconPool.length]}
            />
          ))}
        </div>
      ) : (
        <div className="categories-empty">
          <span className="categories-empty-icon">🔎</span>
          <p className="categories-empty-text">
            No categories matched &quot;{query.trim()}&quot;.
          </p>
        </div>
      )}
    </>
  );
}
