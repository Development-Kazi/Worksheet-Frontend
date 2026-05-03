import type { Metadata } from "next";
import Breadcrumb from "@/components/common/Breadcrumb";
import SearchableCategoryContent from "@/components/sections/SearchableCategoryContent";
import {
  ClientCategory,
  ClientWorksheet,
  getClientCategories,
  getClientWorksheets,
} from "@/lib/client-api";
import { 
  Download, 
  BookOpen,
  ListChecks,
  CheckSquare
} from "lucide-react";
import "./CategoryPage.css";
import "./WorksheetDetail.css";
import PDFCard from "@/components/cards/PDFCard";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

type CategoryNode = ClientCategory & { children: CategoryNode[] };

const formatName = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const stripHtml = (value?: string) =>
  (value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const buildCategoryTree = (categories: ClientCategory[]) => {
  const byId = new Map<string, CategoryNode>();
  categories.forEach((category) =>
    byId.set(category._id, { ...category, children: [] }),
  );

  const roots: CategoryNode[] = [];
  byId.forEach((node) => {
    const parentId = node.parent ?? "";
    const parent = parentId ? byId.get(parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  });

  return roots;
};

const findPathNodes = (roots: CategoryNode[], slugArray: string[]) => {
  const nodes: CategoryNode[] = [];
  let currentLevel = roots;

  for (const slug of slugArray) {
    const decodedSlug = decodeURIComponent(slug);
    const currentNode = currentLevel.find((node) => node.slug === decodedSlug) ?? null;
    if (!currentNode) {
      return null;
    }

    nodes.push(currentNode);
    currentLevel = currentNode.children;
  }

  return nodes;
};

const buildCategoryHref = (
  categoriesById: Map<string, ClientCategory>,
  category: ClientCategory,
) => {
  const path: string[] = [category.slug];
  let parentId = category.parent ?? "";

  while (parentId) {
    const parent = categoriesById.get(parentId);
    if (!parent) break;
    path.unshift(parent.slug);
    parentId = parent.parent ?? "";
  }

  return `/category/${path.join("/")}`;
};

const buildFullUrl = (path: string) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(path, siteUrl).toString();
};

const renderWorksheetRating = (rating?: number) => {
  if (!rating || rating <= 0) return null;

  return (
    <div className="worksheet-detail-meta-item">
      <span className="worksheet-detail-meta-label">Rating</span>
      <span className="worksheet-detail-meta-value">{rating}/5</span>
    </div>
  );
};

async function resolveCategoryWorksheetData(slugArray: string[]) {
  let categories: ClientCategory[] = [];
  let worksheets: ClientWorksheet[] = [];

  try {
    [categories, worksheets] = await Promise.all([
      getClientCategories(),
      getClientWorksheets(),
    ]);
  } catch (error) {
    console.error("Failed to load category page data:", error);
  }

  const tree = buildCategoryTree(categories);
  const categoriesById = new Map(categories.map((category) => [category._id, category]));
  const currentPathNodes = findPathNodes(tree, slugArray);
  const currentCategory = currentPathNodes?.[currentPathNodes.length - 1] ?? null;

  if (currentCategory) {
    const childCategories = currentCategory.children ?? [];
    const worksheetItems: ClientWorksheet[] = worksheets.filter(
      (worksheet) => worksheet.category && worksheet.category._id === currentCategory._id,
    );

    return {
      categoriesById,
      currentPathNodes,
      currentCategory,
      childCategories,
      worksheetItems,
      worksheetCategory: null,
      worksheet: null,
      categoryPathNodes: null,
      categorySlugPath: null,
    };
  }

  const worksheetSlug = decodeURIComponent(slugArray[slugArray.length - 1]);
  const categorySlugPath = slugArray.slice(0, -1);
  const categoryPathNodes = findPathNodes(tree, categorySlugPath);
  const worksheetCategory = categoryPathNodes?.[categoryPathNodes.length - 1] ?? null;
  const worksheet = worksheets.find((item) => item.slug === worksheetSlug) ?? null;

  return {
    categoriesById,
    currentPathNodes,
    currentCategory: null,
    childCategories: [],
    worksheetItems: [],
    worksheetCategory,
    worksheet,
    categoryPathNodes,
    categorySlugPath,
    allWorksheets: worksheets,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugArray } = await params;
  const data = await resolveCategoryWorksheetData(slugArray);

  if (data.currentCategory) {
    const title = data.currentCategory.metaTitle?.trim() || data.currentCategory.name;
    const description =
      stripHtml(data.currentCategory.metaDescription) ||
      `Explore worksheets and learning materials for ${data.currentCategory.name}.`;
    const canonicalPath = `/category/${slugArray.join("/")}`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        title,
        description,
        url: canonicalPath,
        images: data.currentCategory.image ? [data.currentCategory.image] : undefined,
      },
      twitter: {
        card: data.currentCategory.image ? "summary_large_image" : "summary",
        title,
        description,
        images: data.currentCategory.image ? [data.currentCategory.image] : undefined,
      },
    };
  }

  if (data.worksheet) {
    const title = data.worksheet.metaTitle?.trim() || data.worksheet.title;
    const description =
      stripHtml(data.worksheet.metaDescription) ||
      stripHtml(data.worksheet.description) ||
      data.worksheet.subTitle ||
      "Printable worksheet details and download.";
    const canonicalPath = `/category/${slugArray.join("/")}`;

    return {
      title,
      description,
      keywords: data.worksheet.tags,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        title,
        description,
        url: canonicalPath,
        images: data.worksheet.thumbnail ? [data.worksheet.thumbnail] : undefined,
      },
      twitter: {
        card: data.worksheet.thumbnail ? "summary_large_image" : "summary",
        title,
        description,
        images: data.worksheet.thumbnail ? [data.worksheet.thumbnail] : undefined,
      },
    };
  }

  return {
    title: "Page Not Found",
    description: "The requested page could not be found.",
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug: slugArray } = await params;
  const {
    categoriesById,
    currentPathNodes,
    currentCategory,
    childCategories,
    worksheetItems,
    worksheetCategory,
    worksheet,
    categoryPathNodes,
    categorySlugPath,
    allWorksheets,
  } = await resolveCategoryWorksheetData(slugArray);

  if (currentCategory) {
    const currentName = currentCategory.name ?? formatName(slugArray[slugArray.length - 1]);
    const currentTitle = currentCategory.metaTitle?.trim() || currentName;

    const paths = [
      { name: "Categories", href: "/categories" },
      ...(currentPathNodes ?? []).map((node, index) => ({
        name: node.name,
        href: "/category/" + slugArray.slice(0, index + 1).join("/"),
      })),
    ];

    const categoryDescription =
      stripHtml(currentCategory.metaDescription) ||
      `Explore worksheets and learning materials for ${currentName}.`;
    const categoryStructuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: currentTitle,
      description: categoryDescription,
      url: buildFullUrl(`/category/${slugArray.join("/")}`),
      image: currentCategory.image || undefined,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: [
          ...childCategories.map((category, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: buildFullUrl(`/category/${slugArray.join("/")}/${category.slug}`),
            name: category.metaTitle?.trim() || category.name,
          })),
          ...worksheetItems.map((item, index) => ({
            "@type": "ListItem",
            position: childCategories.length + index + 1,
            url: buildFullUrl(`/category/${slugArray.join("/")}/${item.slug}`),
            name: item.metaTitle?.trim() || item.title,
          })),
        ],
      },
    };

    const parentNode = currentPathNodes && currentPathNodes.length > 1 
      ? currentPathNodes[currentPathNodes.length - 2] 
      : null;
    const parentName = parentNode?.name || "";

    return (
      <div className="category-page">
        <div className="category-main">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(categoryStructuredData),
            }}
          />
          <div className="category-page-header">
            <Breadcrumb paths={paths} />
            <h1 className="category-page-title">{currentTitle}</h1>
            {currentCategory.metaDescription ? (
              <div
                className="category-page-desc category-page-desc-rich"
                dangerouslySetInnerHTML={{ __html: currentCategory.metaDescription }}
              />
            ) : (
              <p className="category-page-desc">
                Explore worksheets and learning materials for{" "}
                <span>{currentName}</span>.
              </p>
            )}
          </div>

          <SearchableCategoryContent
            currentName={currentName}
            parentName={parentName}
            slugPrefix={slugArray.join("/")}
            childCategories={childCategories}
            worksheetItems={worksheetItems}
          />
        </div>
      </div>
    );
  }

  if (!worksheet || !worksheetCategory || !categoryPathNodes || !categorySlugPath) {
    return (
      <div className="category-page">
        <div className="category-main">
          <div className="category-empty">
            <span className="category-empty-icon">🔎</span>
            <p className="category-empty-text">The page you requested could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const worksheetTitle = worksheet.title;
  const worksheetPaths = [
    { name: "Categories", href: "/categories" },
    ...categoryPathNodes.map((node, index) => ({
      name: node.name,
      href: "/category/" + categorySlugPath.slice(0, index + 1).join("/"),
    })),
    {
      name: worksheetTitle,
      href: `/category/${slugArray.join("/")}`,
    },
  ];

  const categoryHref = buildCategoryHref(categoriesById, worksheetCategory);
  const downloadHref = worksheet.fileUrl
    ? `/api/download?url=${encodeURIComponent(worksheet.fileUrl)}`
    : undefined;
  const worksheetDescription =
    worksheet.metaDescription ||
    worksheet.subTitle ||
    "Printable worksheet details and download.";
  const worksheetStructuredData = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: worksheetTitle,
    description: worksheetDescription,
    url: buildFullUrl(`/category/${slugArray.join("/")}`),
    image: worksheet.thumbnail || undefined,
    educationalUse: "worksheet",
    learningResourceType: "Worksheet",
    about: worksheetCategory.name,
    keywords: worksheet.tags?.join(", "),
    aggregateRating:
      worksheet.rating && worksheet.rating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: worksheet.rating,
            bestRating: 5,
            ratingCount: 1,
          }
        : undefined,
  };



  return (
    <div className="worksheet-detail-page">
      <div className="worksheet-container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(worksheetStructuredData),
          }}
        />

        {/* Breadcrumbs */}
        <div className="breadcrumb-wrapper">
          <Breadcrumb paths={worksheetPaths} />
        </div>

        <div className="worksheet-layout">
          {/* Left Column (Main Content) */}
          <div className="worksheet-main-content">
            
            <header className="worksheet-header">
              <h1 className="worksheet-title">{worksheetTitle}</h1>
              <p className="worksheet-subtitle">{worksheetDescription}</p>

              {/* Author / Meta Row */}
              <div className="author-row">
                <img 
                  src={worksheet.authorImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"} 
                  alt={worksheet.author || "Author"} 
                  className="author-img"
                />
                <div className="author-meta">
                  <h4>{worksheet.author || "Admin User"}</h4>
                  <p>
                    Published { (worksheet.publishedDate || worksheet.createdAt)
                      ? new Date(worksheet.publishedDate || worksheet.createdAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : "Oct 12, 2023"}
                  </p>
                </div>
              </div>
            </header>


            {worksheet.description ? (
              <div
                className="worksheet-detail-description"
                style={{ marginTop: '3rem' }}
                dangerouslySetInnerHTML={{ __html: worksheet.description }}
              />
            ) : null}

            
          </div>

          {/* Right Column (Sidebar) */}
          <aside className="worksheet-sidebar">
            
            <div className="download-card">
              <div className="card-media">
                <img 
                  src={worksheet.thumbnail || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800"} 
                  alt={worksheetTitle} 
                  className="card-img"
                />
              </div>

              <div className="btn-group">
                {downloadHref ? (
                  <a href={downloadHref} className="btn-secondary">
                    <Download size={18} />
                    Download PDF
                  </a>
                ) : (
                  <button className="btn-secondary disabled" disabled>
                    <Download size={18} />
                    Coming Soon
                  </button>
                )}
              </div>
            </div>

            <div className="includes-card">
              <h3 className="includes-title">Includes</h3>
              {worksheet.includes ? (
                <div 
                  className="includes-rich-content"
                  dangerouslySetInnerHTML={{ __html: worksheet.includes }}
                />
              ) : (
                <div className="includes-list">
                  <div className="includes-item">
                    <BookOpen size={20} />
                    Comprehensive Theory Guide
                  </div>
                  <div className="includes-item">
                    <ListChecks size={20} />
                    25 Practice Problems
                  </div>
                  <div className="includes-item">
                    <CheckSquare size={20} />
                    Step-by-step Answer Key
                  </div>
                </div>
              )}
            </div>
            
          </aside>
        </div>

        {/* You Might Also Like Section */}
        {allWorksheets && worksheetCategory && (
          (() => {
            const related = allWorksheets.filter(
              (item) =>
                item.category?._id === worksheetCategory._id &&
                item._id !== worksheet._id
            );
            if (related.length === 0) return null;
            return (
              <section className="related-worksheets-section">
                <h2 className="related-title">You might also like</h2>
                <div className="related-grid">
                  {related.slice(0, 4).map((item) => (
                    <PDFCard
                      key={item._id}
                      title={item.title}
                      subject={worksheetCategory.name}
                      thumbnail={item.thumbnail}
                      href={buildCategoryHref(categoriesById, worksheetCategory) + "/" + item.slug}
                    />
                  ))}
                </div>
              </section>
            );
          })()
        )}
      </div>
    </div>
  );
}
