import Link from "next/link";
import "./Breadcrumb.css";

type Props = {
  paths: { name: string; href: string }[];
};

export default function Breadcrumb({ paths }: Props) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">

      {paths.map((item, index) => {
        const isLast = index === paths.length - 1;

        return (
          <span key={index} className="breadcrumb-item">

            {/* Link or Current */}
            {!isLast ? (
              <Link href={item.href} className="breadcrumb-link">
                {item.name}
              </Link>
            ) : (
              <span className="breadcrumb-current">{item.name}</span>
            )}

            {/* Separator */}
            {!isLast && (
              <span className="breadcrumb-separator">›</span>
            )}

          </span>
        );
      })}

    </nav>
  );
}