import type { Metadata } from "next";
import Breadcrumb from "@/components/common/Breadcrumb";
import SearchableCategoryContent from "@/components/sections/SearchableCategoryContent";
import {
  ClientCategory,
  ClientWorksheet,
  getClientCategories,
  getClientWorksheets,
} from "@/lib/client-api";
import "./CategoryPage.css";

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
    const currentNode = currentLevel.find((node) => node.slug === slug) ?? null;
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

  const worksheetSlug = slugArray[slugArray.length - 1];
  const categorySlugPath = slugArray.slice(0, -1);
  const categoryPathNodes = findPathNodes(tree, categorySlugPath);
  const worksheetCategory = categoryPathNodes?.[categoryPathNodes.length - 1] ?? null;
  const worksheet = worksheetCategory
    ? worksheets.find(
        (item) => item.slug === worksheetSlug && item.category?._id === worksheetCategory._id,
      ) ?? null
    : null;

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
  } = await resolveCategoryWorksheetData(slugArray);

  if (currentCategory) {
    const currentName = currentCategory.name ?? formatName(slugArray[slugArray.length - 1]);
    const currentTitle = currentCategory.metaTitle?.trim() || currentName;

    const paths = [
      { name: "Home", href: "/" },
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

  const worksheetTitle = worksheet.metaTitle?.trim() || worksheet.title;
  const worksheetPaths = [
    { name: "Home", href: "/" },
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
    stripHtml(worksheet.metaDescription) ||
    stripHtml(worksheet.description) ||
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
    <div className="category-page">
      <div className="category-main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(worksheetStructuredData),
          }}
        />
        <div className="category-page-header">
          <Breadcrumb paths={worksheetPaths} />
          <h1 className="category-page-title">{worksheetTitle}</h1>
          {worksheet.metaDescription ? (
            <div
              className="category-page-desc category-page-desc--detail category-page-desc-rich"
              dangerouslySetInnerHTML={{ __html: worksheet.metaDescription }}
            />
          ) : null}
        </div>

        <section className="worksheet-detail-layout">
          <aside className="worksheet-detail-sidebar">
            {worksheet.thumbnail ? (
              <img
                src={worksheet.thumbnail}
                alt={worksheetTitle}
                className="worksheet-detail-image"
              />
            ) : (
              <div className="worksheet-detail-image-placeholder">📄</div>
            )}
          </aside>

          <div className="worksheet-detail-copy">
            <div className="worksheet-detail-meta-grid">
              {worksheet.subTitle ? (
                <div className="worksheet-detail-meta-item">
                  <span className="worksheet-detail-meta-label">Sub Title</span>
                  <span className="worksheet-detail-meta-value">{worksheet.subTitle}</span>
                </div>
              ) : null}

              <div className="worksheet-detail-meta-item">
                <span className="worksheet-detail-meta-label">Category</span>
                <a href={categoryHref} className="worksheet-detail-meta-link">
                  {worksheetCategory.name}
                </a>
              </div>

              {renderWorksheetRating(worksheet.rating)}
            </div>

            {worksheet.description ? (
              <div
                className="worksheet-detail-description"
                dangerouslySetInnerHTML={{ __html: worksheet.description }}
              />
            ) : null}

            <div className="worksheet-detail-actions">
              {downloadHref ? (
                <a href={downloadHref} className="worksheet-detail-download">
                  Download Worksheet
                </a>
              ) : (
                <button className="worksheet-detail-download worksheet-detail-download--disabled" disabled>
                  Coming Soon
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
