import Link from "next/link";
import "./CategoryCard.css";

type Props = {
  title: string;
  slug: string;
  href?: string;
  description?: string;
  icon?: string;
  image?: string;
  eyebrow?: string;
};

export default function CategoryCard({
  title,
  slug,
  href,
  description,
  icon,
  image,
  eyebrow,
}: Props) {
  return (
    <Link href={href ?? `/category/${slug}`} className="category-card-link">
      <div className="category-card">
        <div className="category-card-media">
          {image ? (
            <img
              src={image}
              alt={title}
              className="category-card-image"
            />
          ) : (
            <div className="category-card-icon">
              {icon ?? "📂"}
            </div>
          )}
        </div>

        {eyebrow && (
          <span className="category-card-eyebrow">{eyebrow}</span>
        )}

        <h3 className="category-card-title">{title}</h3>

        {description && (
          <div
            className="category-card-desc"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        <span className="category-card-arrow">Explore →</span>
      </div>
    </Link>
  );
}
