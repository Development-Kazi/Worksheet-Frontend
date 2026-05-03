export type ApiResponse<T> = {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
};

export type ClientCategory = {
  _id: string;
  name: string;
  slug: string;
  parent?: string | null;
  order?: number;
  image?: string;
  icon?: string;
  status?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type WorksheetCategory = {
  _id: string;
  name: string;
  slug: string;
  parent?: string | null;
};

export type ClientWorksheet = {
  _id: string;
  title: string;
  subTitle?: string;
  slug: string;
  price?: number;
  cutPrice?: number;
  rating?: number;
  description?: string;
  includes?: string;
  metaTitle?: string;
  metaDescription?: string;
  category?: WorksheetCategory | null;
  fileUrl?: string;
  thumbnail?: string;
  icon?: string;
  tags?: string[];
  status?: string;
  author?: string;
  authorImage?: string;
  publishedDate?: string;
  createdAt?: string;
};

export type ClientSitePage = {
  _id: string;
  key: "about-us" | "contact-us" | "privacy-policy";
  title: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const normalizePath = (value: string) => {
  const normalized = value.replace(/\\/g, "/").trim();
  if (normalized.startsWith("public/")) {
    return normalized.slice("public/".length);
  }
  return normalized;
};

const fixMalformedAbsoluteUrl = (value: string) =>
  value
    .replace(/^(https?:\/\/[^/]+)public\//i, "$1/public/")
    .replace(/^(https?:\/\/[^/]+)\/public\//i, "$1/");

const normalizeUrl = (value: string) => {
  if (!value) return value;
  const cleanValue = fixMalformedAbsoluteUrl(normalizePath(value));
  return isAbsoluteUrl(cleanValue)
    ? cleanValue
    : `${API_BASE_URL.replace(/\/$/, "")}/${cleanValue.replace(/^\//, "")}`;
};

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL.replace(/\/$/, "")}${endpoint}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;

  if (!payload.success) {
    throw new Error(payload.message || "API returned unsuccessful response");
  }

  return payload.data;
}

export async function getClientCategories(): Promise<ClientCategory[]> {
  const categories = await fetchFromApi<ClientCategory[]>("/v1/client/category/all");
  return categories.map((category) => ({
    ...category,
    image: category.image ? normalizeUrl(category.image) : category.image,
    icon: category.icon ? normalizeUrl(category.icon) : category.icon,
  }));
}

export async function getClientWorksheets(): Promise<ClientWorksheet[]> {
  const worksheets = await fetchFromApi<ClientWorksheet[]>("/v1/client/worksheet/all");
  return worksheets.map((worksheet) => ({
    ...worksheet,
    fileUrl: worksheet.fileUrl ? normalizeUrl(worksheet.fileUrl) : worksheet.fileUrl,
    thumbnail: worksheet.thumbnail ? normalizeUrl(worksheet.thumbnail) : worksheet.thumbnail,
    icon: worksheet.icon ? normalizeUrl(worksheet.icon) : worksheet.icon,
    authorImage: worksheet.authorImage ? normalizeUrl(worksheet.authorImage) : worksheet.authorImage,
  }));
}

export async function getClientWorksheetBySlug(slug: string): Promise<ClientWorksheet> {
  const worksheet = await fetchFromApi<ClientWorksheet>(`/v1/client/worksheet/slug/${slug}`);

  return {
    ...worksheet,
    fileUrl: worksheet.fileUrl ? normalizeUrl(worksheet.fileUrl) : worksheet.fileUrl,
    thumbnail: worksheet.thumbnail ? normalizeUrl(worksheet.thumbnail) : worksheet.thumbnail,
    icon: worksheet.icon ? normalizeUrl(worksheet.icon) : worksheet.icon,
    authorImage: worksheet.authorImage ? normalizeUrl(worksheet.authorImage) : worksheet.authorImage,
  };
}

export async function getClientSitePage(key: ClientSitePage["key"]): Promise<ClientSitePage> {
  return fetchFromApi<ClientSitePage>(`/v1/client/site-page/${key}`);
}
