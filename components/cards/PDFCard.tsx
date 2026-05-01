import Link from "next/link";
import "./PDFCard.css";

type Props = {
  title: string;
  href?: string;
  subject?: string;
  className?: string;
  thumbnail?: string;
};

export default function PDFCard({
  title,
  href,
  subject,
  className,
  thumbnail,
}: Props) {
  const content = (
    <div className={`pdf-card ${className ?? ""}`}>
      <div className="pdf-card-media">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="pdf-card-image"
          />
        ) : (
          <div className="pdf-card-icon">📄</div>
        )}
      </div>

      <div className="pdf-card-top">
        <h3 className="pdf-card-title">{title}</h3>
        {subject ? (
          <span className="pdf-card-subject">{subject}</span>
        ) : null}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="pdf-card-link">
      {content}
    </Link>
  ) : (
    content
  );
}
