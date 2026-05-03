"use client";

import { useDeferredValue, useState } from "react";
import Link from "next/link";
import { BookOpen, FileText, ArrowRight, Layers, Clock } from "lucide-react";
import ContentSearch from "@/components/common/ContentSearch";
import { ClientCategory, ClientWorksheet } from "@/lib/client-api";

type Props = {
  currentName: string;
  parentName: string;
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
  parentName,
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

  return (
    <div className="category-content-wrap">
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
      </div>

      <div className={isLeafCategory ? "worksheet-grid-3-col" : "category-vertical-stack"}>
        {!isLeafCategory ? (
          filteredCategories.map((cat) => (
            <div key={cat._id} className="content-card card-horizontal">
              <div className="card-info">
                <div className="card-icon-pill">
                  {cat.icon ? (
                    <img src={cat.icon} alt="" className="card-db-icon" />
                  ) : (
                    <BookOpen size={18} />
                  )}
                </div>
                <h3 className="card-title">{cat.name}</h3>
                <p className="card-desc">
                  {cat.metaDescription || "Master the foundations with structured, evidence-based learning modules."}
                </p>
                <Link href={`/category/${slugPrefix}/${cat.slug}`} className="card-action-link">
                  Explore Topics <ArrowRight size={16} />
                </Link>
              </div>
              <div className="card-media">
                <img src={cat.image || "/images/placeholder-topic.jpg"} alt={cat.name} />
              </div>
            </div>
          ))
        ) : (
          filteredWorksheets.map((ws) => (
            <div key={ws._id} className="worksheet-card-vertical">
              <div className="ws-card-header">
                <div className="ws-card-icon">
                  {ws.icon ? (
                    <img src={ws.icon} alt="" />
                  ) : ws.thumbnail ? (
                    <img src={ws.thumbnail} alt="" />
                  ) : (
                    <div className="ws-icon-placeholder">{ws.title.substring(0, 2).toUpperCase()}</div>
                  )}
                </div>
                {currentName && <span className="ws-card-parent-label">{currentName}</span>}
              </div>
              
              <div className="ws-card-body">
                <h3 className="ws-card-title">{ws.title}</h3>
                <p className="ws-card-desc">
                  {ws.metaDescription || ws.subTitle || "Comprehensive modules focusing on specific academic goals and practice."}
                </p>
              </div>

              <div className="ws-card-footer">
                <span className="ws-footer-detail-text">View Details</span>
                <ArrowRight size={18} className="ws-footer-arrow" />
              </div>
              <Link href={`/category/${slugPrefix}/${ws.slug}`} className="ws-card-link" aria-label={`View ${ws.title}`} />
            </div>
          ))
        )}
      </div>

      {(isLeafCategory ? filteredWorksheets : filteredCategories).length === 0 && (
        <div className="category-empty">
          <span className="category-empty-icon">🔎</span>
          <p className="category-empty-text">
            {normalizedQuery 
              ? `No results found for "${deferredQuery}". Try searching for something else.` 
              : `We haven't added any worksheets to this category yet. Please check back later!`}
          </p>
        </div>
      )}
    </div>
  );
}
