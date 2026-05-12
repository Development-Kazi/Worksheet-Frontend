"use client";

import { useDeferredValue, useState } from "react";
import Link from "next/link";
import { Book, Calculator, Globe, BookOpen } from "lucide-react";
import ContentSearch from "@/components/common/ContentSearch";
import { ClientCategory } from "@/lib/client-api";
import "../sections/CategoryGrid.css";

type Props = {
  categories: ClientCategory[];
  iconPool?: string[];
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

const colorPool = ["accent-red", "accent-blue", "accent-yellow"];

export default function SearchableCategoriesGrid({ categories }: Props) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const allParents = categories.filter((cat) => !cat.parent);
  const filteredParents = normalizedQuery
    ? allParents.filter((cat) => matchesCategory(cat, normalizedQuery))
    : allParents;

  const getChildren = (parentId: string) => 
    categories.filter((cat) => cat.parent === parentId).slice(0, 3);

  return (
    <div className="searchable-categories-container">
      <div className="categories-toolbar">
        <ContentSearch
          value={query}
          onChange={setQuery}
          placeholder="Search categories by title or description..."
        />
        <span className="categories-results-count">
          {filteredParents.length} result{filteredParents.length === 1 ? "" : "s"}
        </span>
      </div>

      {filteredParents.length > 0 ? (
        <div className="category-grid">
          {filteredParents.map((parent, index) => {
            const children = getChildren(parent._id);
            const accentClass = colorPool[index % colorPool.length];

            return (
              <Link key={parent._id} href={`/category/${parent.slug}`} className={`discipline-card ${accentClass} has-top-image`}>
                {/* Image Top */}
                {parent.image && (
                  <div className="discipline-card-image-wrap">
                    <img 
                      src={parent.image} 
                      alt={parent.name} 
                      className="discipline-card-main-image" 
                    />
                  </div>
                )}

                <div className="discipline-card-top">
                  <div className="discipline-icon-box">
                    {parent.icon ? (
                      <img 
                        src={parent.icon} 
                        alt={parent.name} 
                        className="discipline-icon-img" 
                      />
                    ) : (
                      <BookOpen size={20} />
                    )}
                  </div>
                </div>

                <div className="discipline-content">
                  <h3 className="discipline-title">{parent.name}</h3>
                  <p className="discipline-desc">
                    {parent.metaDescription || `Explore our comprehensive collection of ${parent.name} resources.`}
                  </p>

                  <ul className="discipline-child-list">
                    {children.map((child) => (
                      <li key={child._id} className="discipline-child-item">
                        <span className="child-text">{child.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="categories-empty">
          <span className="categories-empty-icon">🔎</span>
          <p className="categories-empty-text">
            No categories matched &quot;{query.trim()}&quot;.
          </p>
        </div>
      )}
    </div>
  );
}
