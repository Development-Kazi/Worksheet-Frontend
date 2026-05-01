import SitePageContent from "@/components/sections/SitePageContent";
import { getClientSitePage } from "@/lib/client-api";

export default async function AboutUsPage() {
  let title = "About Us";
  let description =
    "Dynoba Worksheets provides simple and high-quality printable worksheets for kids.";
  let content = "";

  try {
    const page = await getClientSitePage("about-us");
    title = page.title;
    description = page.metaDescription || description;
    content = page.content || "";
  } catch (error) {
    console.error("Failed to load about us page:", error);
  }

  return <SitePageContent title={title} description={description} content={content} />;
}
