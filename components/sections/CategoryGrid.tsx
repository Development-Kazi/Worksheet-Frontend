import Link from "next/link";
import { ClientCategory, getClientCategories } from "@/lib/client-api";
import { Book, Calculator, Globe, CheckCircle2 } from "lucide-react";
import "./CategoryGrid.css";

const iconPool = [
  <Book size={20} />,
  <Calculator size={20} />,
  <Globe size={20} />,
];

const colorPool = ["accent-red", "accent-blue", "accent-yellow"];

export default async function CategoryGrid() {
  let allCategories: ClientCategory[] = [];
  try {
    allCategories = await getClientCategories();
  } catch (error) {
    console.error("Failed to load categories:", error);
  }

  const parentCategories = allCategories.filter((cat) => !cat.parent);
  
  const getChildren = (parentId: string) => 
    allCategories.filter((cat) => cat.parent === parentId).slice(0, 3);

  return (
    <section className="category-section" id="categories">
      <div className="category-container">
        
        {/* Header */}
        <div className="category-header">
          <div className="category-title-wrap">
            <h2 className="category-heading">Core Disciplines</h2>
            <p className="category-subheading">Focused modules for foundational academic success.</p>
          </div>
          <Link href="/categories" className="category-view-all">
            View all subjects <span className="arrow">→</span>
          </Link>
        </div>

        {/* Grid */}
        <div className="category-grid">
          {parentCategories.map((parent, index) => {
            const children = getChildren(parent._id);
            const accentClass = colorPool[index % colorPool.length];

            return (
              <Link key={parent._id} href={`/category/${parent.slug}`} className={`discipline-card ${accentClass}`}>
                <div className="discipline-card-top">
                  <div className="discipline-icon-box">
                    {parent.icon ? (
                      <img 
                        src={parent.icon} 
                        alt={parent.name} 
                        className="discipline-icon-img" 
                      />
                    ) : (
                      <Book size={20} />
                    )}
                  </div>
                </div>

                <div className="discipline-content">
                  <h3 className="discipline-title">{parent.name}</h3>
                  <p className="discipline-desc">
                    {parent.metaDescription || `Explore our comprehensive collection of ${parent.name} resources and learning materials.`}
                  </p>

                  <ul className="discipline-child-list">
                    {children.map((child) => (
                      <li key={child._id} className="discipline-child-item">
                        <span className="child-text">
                          {child.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            );

          })}
        </div>

      </div>
    </section>
  );
}
