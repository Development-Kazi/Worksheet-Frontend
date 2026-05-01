"use client";

import { useDeferredValue, useState } from "react";
import SubCategoryCard from "@/components/cards/SubCategoryCard";
import PDFCard from "@/components/cards/PDFCard";
import ContentSearch from "@/components/common/ContentSearch";
import { ClientCategory, ClientWorksheet } from "@/lib/client-api";

type Props = {
  currentName: string;
  slugPrefix: string;
  childCategories: ClientCategory[];
  worksheetItems: ClientWorksheet[];
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

const matchesWorksheet = (worksheet: ClientWorksheet, query: string) => {
  const searchableText = [
    worksheet.title,
    worksheet.metaTitle,
    worksheet.metaDescription,
    worksheet.description,
    worksheet.subTitle,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(query);
};

export default function SearchableCategoryContent({
  currentName,
  slugPrefix,
  childCategories,
  worksheetItems,
}: Props) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const isLeafCategory = childCategories.length === 0;

  const filteredCategories = normalizedQuery
    ? childCategories.filter((category) => matchesCategory(category, normalizedQuery))
    : childCategories;

  const filteredWorksheets = normalizedQuery
    ? worksheetItems.filter((worksheet) => matchesWorksheet(worksheet, normalizedQuery))
    : worksheetItems;

  const visibleCount = isLeafCategory
    ? filteredWorksheets.length
    : filteredCategories.length;

  return (
    <>
      <div className="category-toolbar">
        <ContentSearch
          value={query}
          onChange={setQuery}
          placeholder={
            isLeafCategory
              ? "Search worksheets by title or description..."
              : "Search subcategories by title or description..."
          }
        />
        <span className="category-results-count">
          {visibleCount} result{visibleCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="category-section-label">
        <span className="category-section-title">
          {isLeafCategory ? "Worksheets" : "Subcategories"}
        </span>
        <span className="category-section-count">
          {isLeafCategory ? `${visibleCount} PDFs` : `${visibleCount} Topics`}
        </span>
      </div>

      {!isLeafCategory ? (
        filteredCategories.length > 0 ? (
          <div className="category-subcat-grid">
            {filteredCategories.map((category) => (
              <SubCategoryCard
                key={category._id}
                title={category.metaTitle?.trim() || category.name}
                slug={`${slugPrefix}/${category.slug}`}
                description={
                  category.metaDescription?.trim() ||
                  "Practice and learn concepts easily."
                }
                image={category.image}
              />
            ))}
          </div>
        ) : (
          <div className="category-empty">
            <span className="category-empty-icon">🔎</span>
            <p className="category-empty-text">
              No subcategories matched &quot;{query.trim()}&quot;.
            </p>
          </div>
        )
      ) : filteredWorksheets.length > 0 ? (
        <div className="category-pdf-grid">
          {filteredWorksheets.map((worksheet) => (
            <PDFCard
              key={worksheet._id}
              title={worksheet.metaTitle?.trim() || worksheet.title}
              href={`/category/${slugPrefix}/${worksheet.slug}`}
              subject={worksheet.subTitle || currentName}
              thumbnail={worksheet.thumbnail}
            />
          ))}
        </div>
      ) : (
        <div className="category-empty">
          <span className="category-empty-icon">🔎</span>
          <p className="category-empty-text">
            No worksheets matched &quot;{query.trim()}&quot;.
          </p>
        </div>
      )}
    </>
  );
}
