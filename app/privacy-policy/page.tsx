import SitePageContent from "@/components/sections/SitePageContent";
import { getClientSitePage } from "@/lib/client-api";

export default async function PrivacyPolicyPage() {
  let title = "Privacy Policy";
  let description =
    "We respect your privacy and collect only essential data needed to improve website performance and user experience.";
  let content = "";

  try {
    const page = await getClientSitePage("privacy-policy");
    title = page.title;
    description = page.metaDescription || description;
    content = page.content || "";
  } catch (error) {
    console.error("Failed to load privacy policy page:", error);
  }

  return <SitePageContent title={title} description={description} content={content} />;
}
