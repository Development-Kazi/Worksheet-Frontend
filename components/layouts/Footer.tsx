import Link from "next/link";
import { getClientSitePage, getClientCategories, getClientWorksheets } from "@/lib/client-api";
import * as Icons from "lucide-react";
import "./Footer.css";

export default async function Footer() {
  let aboutDescription = "Free worksheets for kids. Simple, fun, and easy learning for school children.";
  let aboutContent = "";
  let categories: any[] = [];
  let latestWorksheets: any[] = [];

  try {
    const aboutPage = await getClientSitePage("about-us");
    aboutDescription = aboutPage.metaDescription || aboutDescription;
    aboutContent = aboutPage.content || "";

    const allCategories = await getClientCategories();
    categories = allCategories.filter(c => !c.parent).slice(0, 5);

    const allWorksheets = await getClientWorksheets();
    latestWorksheets = allWorksheets.slice(0, 5);
  } catch (error) {
    console.error("Failed to load footer data:", error);
  }

  // Safe icon mapping with fallbacks
  const Instagram = (Icons as any).Instagram || Icons.Globe;
  const Facebook = (Icons as any).Facebook || Icons.Users;
  const Twitter = (Icons as any).Twitter || (Icons as any).TwitterX || Icons.Zap;
  const Linkedin = (Icons as any).Linkedin || Icons.Activity;
  const Mail = (Icons as any).Mail || Icons.FileText;
  const Phone = (Icons as any).Phone || Icons.Activity;

  return (
    <footer className="footer" id="footer-about">
      <div className="footer-container">
        <div className="footer-main-grid">
          {/* Column 1: About */}
          <div className="footer-col about-col">
            <Link href="/" className="footer-logo">
              <div className="footer-logo-icon">D</div>
              <span className="footer-logo-text">Dynoba</span>
            </Link>

            {aboutContent.trim() ? (
              <div
                className="footer-about-text footer-about-rich"
                dangerouslySetInnerHTML={{ __html: aboutContent }}
              />
            ) : (
              <p className="footer-about-text">{aboutDescription}</p>
            )}

            <div className="footer-socials">
              <Link href="https://instagram.com" className="social-link"><Instagram size={20} /></Link>
              <Link href="https://facebook.com" className="social-link"><Facebook size={20} /></Link>
              <Link href="https://twitter.com" className="social-link"><Twitter size={20} /></Link>
              <Link href="https://linkedin.com" className="social-link"><Linkedin size={20} /></Link>
            </div>
          </div>

          {/* Column 2: Parent Categories */}
          <div className="footer-col">
            <h3 className="footer-col-title">Top Categories</h3>
            <ul className="footer-links">
              {categories.map(cat => (
                <li key={cat._id}><Link href={`/category/${cat.slug}`}>{cat.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Column 3: Latest Worksheets */}
          <div className="footer-col">
            <h3 className="footer-col-title">Latest Resources</h3>
            <ul className="footer-links">
              {latestWorksheets.map(ws => (
                <li key={ws._id}><Link href={`/worksheet/${ws.slug}`}>{ws.title}</Link></li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Info */}
          <div className="footer-col">
            <h3 className="footer-col-title">Contact Us</h3>
            <div className="footer-contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <span>support@dynoba.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+1 (234) 567-890</span>
              </div>
            </div>

            <h3 className="footer-col-title" style={{ marginTop: '24px' }}>Quick Links</h3>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/categories">All Categories</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-inner">
            <p>© {new Date().getFullYear()} Dynoba. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
