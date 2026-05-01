"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import "./Navbar.css";

type Props = {
  onMenuClick?: () => void;
};

export default function Navbar({ onMenuClick }: Props) {
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
          <Link href="/#footer-about" className="navbar-nav-link">About Us</Link>
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
