"use client";

import Link from "next/link";
import { useState } from "react";
import "./SubCategoryCard.css";

type Props = {
  title: string;
  slug: string;
  description?: string;
  image?: string;
  eyebrow?: string;
};

export default function SubCategoryCard({
  title,
  slug,
  description,
  image,
  eyebrow,
}: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(image) && !imageFailed;

  return (
    <Link href={`/category/${slug}`} className="subcat-card-link">
      <div className="subcat-card">
        <div className="subcat-card-media">
          {showImage ? (
            <img
              src={image}
              alt={title}
              className="subcat-card-image"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="subcat-card-placeholder">
              <span className="subcat-card-placeholder-icon">📂</span>
            </div>
          )}
        </div>

        {eyebrow && (
          <span className="subcat-card-eyebrow">{eyebrow}</span>
        )}

        <h3 className="subcat-card-title">{title}</h3>

        {description && (
          <div
            className="subcat-card-desc"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        <span className="subcat-card-arrow">Explore →</span>
      </div>
    </Link>
  );
}
