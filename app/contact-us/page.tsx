import SitePageContent from "@/components/sections/SitePageContent";
import { getClientSitePage } from "@/lib/client-api";

export default async function ContactUsPage() {
  let title = "Contact Us";
  let description = "For support, feedback, or worksheet requests, contact our team.";
  let content = "";

  try {
    const page = await getClientSitePage("contact-us");
    title = page.title;
    description = page.metaDescription || description;
    content = page.content || "";
  } catch (error) {
    console.error("Failed to load contact us page:", error);
  }

  return <SitePageContent title={title} description={description} content={content} />;
}
