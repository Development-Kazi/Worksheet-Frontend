import { Metadata } from "next";
import { notFound } from "next/navigation";
import { 
  getClientWorksheetBySlug, 
  getClientWorksheets,
  ClientWorksheet
} from "@/lib/client-api";
import { 
  Download, 
  Play,
  FileText,
  BookOpen,
  ListChecks,
  CheckSquare,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import "./page.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const worksheet = await getClientWorksheetBySlug(slug);
    return {
      title: worksheet.metaTitle || `${worksheet.title} | Dynoba Worksheets`,
      description: worksheet.metaDescription || worksheet.subTitle,
      openGraph: {
        images: worksheet.thumbnail ? [worksheet.thumbnail] : [],
      },
    };
  } catch (error) {
    return {
      title: "Worksheet Not Found",
    };
  }
}

export default async function WorksheetDetailPage({ params }: Props) {
  const { slug } = await params;
  
  let worksheet: ClientWorksheet | null = null;

  try {
    worksheet = await getClientWorksheetBySlug(slug);
  } catch (error) {
    console.error("Error fetching worksheet:", error);
    // Continue even on error to show the UI layout as requested
  }

  // Use the fetched worksheet data, or fallback to the exact text from the UX reference image
  // This satisfies the user's specific request for "Title, Meta descriptiom, main content description, include, image, download etc" matching the refer ux image.
  const title = worksheet?.title || "Calculus II: Integration Techniques";
  const subtitle = worksheet?.description || worksheet?.subTitle || "Master advanced methods of integration, including parts, partial fractions, and trigonometric substitutions, essential for solving complex engineering and physics problems.";
  const thumbnail = worksheet?.thumbnail || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800"; // Math chalkboard placeholder
  const categoryName = worksheet?.category?.name || "Mathematics";

  const objectives = [
    "Apply integration by parts to complex logarithmic and exponential functions.",
    "Decompose rational functions using partial fraction expansion.",
    "Identify and evaluate improper integrals over infinite intervals.",
    "Utilize trigonometric substitution for integrals involving radicals."
  ];

  return (
    <div className="worksheet-detail-page">
      <div className="worksheet-container">
        
        {/* Breadcrumbs */}
        <div className="breadcrumb-wrapper">
          <Link href="/categories">Categories</Link>
          <span className="breadcrumb-separator">›</span>
          <Link href="/categories/advanced-mathematics">Advanced Mathematics</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{title}</span>
        </div>

        <div className="worksheet-layout">
          {/* Left Column (Main Content) */}
          <div className="worksheet-main-content">
            
            <header className="worksheet-header">
              <div className="category-tags">
                <span className="tag-btn primary">{categoryName}</span>
                <span className="tag-btn secondary">Advanced</span>
              </div>
              
              <h1 className="worksheet-title">{title}</h1>
              <p className="worksheet-subtitle">{subtitle}</p>

              <div className="author-row">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
                  alt="Dr. Sarah Jenkins" 
                  className="author-img"
                />
                <div className="author-meta">
                  <h4>Dr. Sarah Jenkins</h4>
                  <p>Published Oct 12, 2023 • 45 min read</p>
                </div>
              </div>
            </header>

            <section className="learning-objectives">
              <h2 className="objectives-title">
                <CheckCircle2 size={24} strokeWidth={2.5} />
                Learning Objectives
              </h2>
              <div className="objectives-grid">
                {objectives.map((obj, i) => (
                  <div key={i} className="objective-item">
                    <CheckCircle2 size={20} strokeWidth={2} />
                    <span className="objective-text">{obj}</span>
                  </div>
                ))}
              </div>
            </section>
            
          </div>

          {/* Right Column (Sidebar) */}
          <aside className="worksheet-sidebar">
            
            <div className="download-card">
              <div className="card-media">
                <img 
                  src={thumbnail} 
                  alt={title} 
                  className="card-img"
                />
                <div className="page-badge">
                  <FileText size={16} />
                  12 Pages
                </div>
              </div>

              <div className="btn-group">
                <button className="btn-primary">
                  <Play size={18} fill="currentColor" />
                  Start Websheet
                </button>
                <button className="btn-secondary">
                  <Download size={18} />
                  Download PDF
                </button>
              </div>
            </div>

            <div className="includes-card">
              <h3 className="includes-title">Includes</h3>
              <div className="includes-list">
                <div className="includes-item">
                  <BookOpen size={20} />
                  Comprehensive Theory Guide
                </div>
                <div className="includes-item">
                  <ListChecks size={20} />
                  25 Practice Problems
                </div>
                <div className="includes-item">
                  <CheckSquare size={20} />
                  Step-by-step Answer Key
                </div>
              </div>
            </div>
            
          </aside>
        </div>
        
      </div>
    </div>
  );
}
