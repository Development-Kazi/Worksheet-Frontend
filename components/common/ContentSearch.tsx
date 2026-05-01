"use client";

import { Search } from "lucide-react";
import "./ContentSearch.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export default function ContentSearch({ value, onChange, placeholder }: Props) {
  return (
    <div className="content-search">
      <Search size={18} className="content-search-icon" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="content-search-input"
        aria-label={placeholder}
      />
    </div>
  );
}
