import Link from "next/link";
import { getClientSitePage } from "@/lib/client-api";
import "./Footer.css";

export default async function Footer() {
  let aboutTitle = "About Us";
  let aboutDescription = "Free worksheets for kids. Simple, fun, and easy learning for school children.";
  let aboutContent = "";

  try {
    const aboutPage = await getClientSitePage("about-us");
    aboutTitle = aboutPage.title || aboutTitle;
    aboutDescription = aboutPage.metaDescription || aboutDescription;
    aboutContent = aboutPage.content || "";
  } catch (error) {
    console.error("Failed to load footer about data:", error);
  }

  return (
    <footer className="footer" id="footer-about">
      <div className="footer-container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="footer-brand-name">
              <div className="footer-brand-icon">D</div>
              <span className="footer-brand-text">Dynoba</span>
            </Link>
            <h3 className="footer-col-heading">{aboutTitle}</h3>
            {aboutContent.trim() ? (
              <div
                className="footer-description footer-description-rich"
                dangerouslySetInnerHTML={{ __html: aboutContent }}
              />
            ) : (
              <p className="footer-description">{aboutDescription}</p>
            )}
          </div>

          <div>
            <h3 className="footer-col-heading">Quick Links</h3>
            <ul className="footer-link-list">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/contact-us">Contact Us</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© {new Date().getFullYear()} Dynoba Websheets. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
