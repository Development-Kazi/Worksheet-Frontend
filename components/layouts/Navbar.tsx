"use client";
 
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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
        // Filter for only parent categories
        const parents = data.filter((cat) => !cat.parent);
        setCategories(parents);
      } catch (error) {
        console.error("Failed to load navbar categories:", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          
          <div className="navbar-dropdown" ref={dropdownRef}>
            <button 
              className={`navbar-nav-link navbar-dropdown-trigger ${dropdownOpen ? "active" : ""}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Categories <ChevronDown size={14} className={`dropdown-chevron ${dropdownOpen ? "rotated" : ""}`} />
            </button>
            
            {dropdownOpen && (
              <div className="navbar-dropdown-content">
                {categories.map((cat) => (
                  <Link 
                    key={cat._id} 
                    href={`/category/${cat.slug}`} 
                    className="navbar-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/#footer-about" className="navbar-nav-link">About Us</Link>
          <Link href="/contact-us" className="navbar-nav-link">Contact Us</Link>
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
