import "./Hero.css";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Users } from "lucide-react";
import { getClientCategories, getClientWorksheets } from "@/lib/client-api";

export default async function Hero() {
  let categoriesCount = 0;
  let worksheetsCount = 0;

  try {
    const [categories, worksheets] = await Promise.all([
      getClientCategories(),
      getClientWorksheets(),
    ]);
    // Only count parent categories
    categoriesCount = categories.filter(c => !c.parent).length;
    worksheetsCount = worksheets.length;
  } catch (error) {
    console.error("Failed to fetch hero stats:", error);
  }

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-pill">
          ACADEMIC EXCELLENCE REDEFINED
        </div>

        <h1 className="hero-heading">
          Master Complex Subjects with <br />
          <span className="hero-heading-accent">Structured Clarity</span>
        </h1>

        <p className="hero-subtext">
          A minimalist, distraction-free environment designed to enhance focus, 
          deepen comprehension, and accelerate learning across foundational disciplines.
        </p>

        <div className="hero-actions">
          <Link href="#categories" className="btn-primary">
            Explore Paths
          </Link>
          <Link href="#why-choose-us" className="btn-secondary">
            Learn More <ArrowRight size={18} />
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">{categoriesCount}+</span>
            <span className="stat-label">Subjects</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">{worksheetsCount}+</span>
            <span className="stat-label">Worksheets</span>
          </div>
        </div>
      </div>
    </section>
  );
}
