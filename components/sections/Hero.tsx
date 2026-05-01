import "./Hero.css";
import { getClientCategories, getClientWorksheets } from "@/lib/client-api";

export default async function Hero() {
  let worksheetCount = 0;
  let categoryCount = 0;

  try {
    const [categories, worksheets] = await Promise.all([
      getClientCategories(),
      getClientWorksheets(),
    ]);

    categoryCount = categories.filter((category) => !category.parent).length;
    worksheetCount = worksheets.length;
  } catch (error) {
    console.error("Failed to load hero stats:", error);
  }

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          100% Free - No Sign Up Required
        </div>

        <h1 className="hero-heading">
          Free Worksheets for{" "}
          <span className="hero-heading-accent">Kids</span>
        </h1>

        <p className="hero-subtext">
          Download printable worksheets for English, Math, and more.
          Simple, fun, and easy learning for school children.
        </p>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-number">{worksheetCount}</span>
            <span className="hero-stat-label">Worksheets</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-number">{categoryCount}</span>
            <span className="hero-stat-label">Categories</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-number">Free</span>
            <span className="hero-stat-label">Always</span>
          </div>
        </div>
      </div>
    </section>
  );
}
