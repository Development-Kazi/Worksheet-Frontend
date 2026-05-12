"use client";
 
import Link from "next/link";
import { useEffect, useState, useRef, useMemo } from "react";
import { Menu, Search, ChevronDown } from "lucide-react";
import { ClientCategory, getClientCategories } from "@/lib/client-api";
import "./Navbar.css";
 
type Props = {
  onMenuClick?: () => void;
};
 
export default function Navbar({ onMenuClick }: Props) {
  const [categories, setCategories] = useState<ClientCategory[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getClientCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load navbar categories:", error);
      }
    };
    loadCategories();
  }, []);

  const categoryTree = useMemo(() => {
    const byId = new Map<string, any>();
    categories.forEach(c => byId.set(c._id, { ...c, children: [] }));
    const roots: any[] = [];
    byId.forEach(node => {
      if (node.parent && byId.has(node.parent)) {
        byId.get(node.parent).children.push(node);
      } else if (!node.parent) {
        roots.push(node);
      }
    });
    return roots;
  }, [categories]);

  const categoriesById = useMemo(() => {
    return new Map(categories.map(c => [c._id, c]));
  }, [categories]);

  const getCategoryHref = (category: ClientCategory) => {
    const path: string[] = [category.slug];
    let parentId = category.parent ?? "";

    while (parentId) {
      const parent = categoriesById.get(parentId);
      if (!parent) break;
      path.unshift(parent.slug);
      parentId = parent.parent ?? "";
    }

    return `/category/${path.join("/")}`;
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">

        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">D</div>
          <span className="navbar-logo-text">Dynoba</span>
        </Link>

        <div className="navbar-search navbar-search-desktop">
          <Search size={16} className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Search worksheets..."
            className="navbar-search-input"
          />
        </div>

        <nav className="navbar-nav">
          <Link href="/" className="navbar-nav-link">Home</Link>
          
          <div 
            className="navbar-dropdown" 
            ref={dropdownRef}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button 
              className={`navbar-nav-link navbar-dropdown-trigger ${dropdownOpen ? "active" : ""}`}
            >
              Categories <ChevronDown size={14} className={`dropdown-chevron ${dropdownOpen ? "rotated" : ""}`} />
            </button>
            
            {dropdownOpen && (
              <div className="navbar-mega-menu">
                <div className="mega-menu-content-card">
                  <div className="mega-menu-grid-container">
                    {categoryTree.map((parent) => (
                      <div key={parent._id} className="mega-menu-column">
                        <h4 className="mega-menu-column-title">
                          <Link href={getCategoryHref(parent)} onClick={() => setDropdownOpen(false)}>
                            {parent.name}
                          </Link>
                        </h4>
                        
                        <div className="mega-menu-column-links">
                          {parent.children.map((child: any) => (
                            <div key={child._id} className="mega-menu-child-group">
                              <Link 
                                href={getCategoryHref(child)} 
                                className="mega-menu-child-link"
                                onClick={() => setDropdownOpen(false)}
                              >
                                {child.name}
                              </Link>

                              {child.children.length > 0 && (
                                <div className="mega-menu-subchild-list">
                                  {child.children.map((grand: any) => (
                                    <Link 
                                      key={grand._id} 
                                      href={getCategoryHref(grand)} 
                                      className="mega-menu-subchild-link"
                                      onClick={() => setDropdownOpen(false)}
                                    >
                                      {grand.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/#footer-about" className="navbar-nav-link">About Us</Link>
          <Link href="/#footer-about" className="navbar-nav-link">Contact Us</Link>
        </nav>
 
        {/* Menu button — opens Sidebar */}
        <button
          className="navbar-mobile-btn"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
 
      </div>
    </header>
  );
}
