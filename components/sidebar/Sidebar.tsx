"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { ClientCategory, getClientCategories } from "@/lib/client-api";
import "./Sidebar.css";

type CategoryNode = ClientCategory & { children: CategoryNode[] };

type Props = {
  open?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ open = false, onClose }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openChild, setOpenChild] = useState<string | null>(null);
  const [categories, setCategories] = useState<ClientCategory[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        const response = await getClientCategories();
        if (mounted) {
          setCategories(response);
        }
      } catch (error) {
        console.error("Failed to load sidebar categories:", error);
      }
    };

    void loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const categoryTree = useMemo(() => {
    const byId = new Map<string, CategoryNode>();

    categories.forEach((category) => {
      byId.set(category._id, { ...category, children: [] });
    });

    const roots: CategoryNode[] = [];
    byId.forEach((node) => {
      const parentId = node.parent ?? "";
      const parent = parentId ? byId.get(parentId) : undefined;

      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [categories]);

  const categoriesById = useMemo(
    () => new Map(categories.map((category) => [category._id, category])),
    [categories],
  );

  const getCategoryPath = (node: CategoryNode) => {
    const path: string[] = [node.slug];
    let parentId = node.parent ?? "";

    while (parentId) {
      const parent = categoriesById.get(parentId);

      if (!parent) break;
      path.unshift(parent.slug);
      parentId = parent.parent ?? "";
    }

    return `/category/${path.join("/")}`;
  };

  return (
    <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>

      {/* Header row */}
      <div className="sidebar-close-row">
        <p className="sidebar-heading">Categories</p>
        <button className="sidebar-close-btn" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className="sidebar-list">
        {categoryTree.map((cat, i) => (
          <div key={i}>

            <div
              className={`sidebar-parent ${openIndex === i ? "open" : ""}`}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="sidebar-parent-label">
                <span className="sidebar-dot" />
                <Link href={getCategoryPath(cat)} onClick={onClose}>
                  {cat.name}
                </Link>
              </span>
              <span className={`sidebar-chevron ${openIndex === i ? "rotated" : ""}`}>▶</span>
            </div>

            {openIndex === i && cat.children.length > 0 && (
              <div className="sidebar-children">
                {cat.children.map((sub, j) => {
                  const key = `${i}-${j}`;
                  return (
                    <div key={j}>
                      <div
                        className={`sidebar-sub ${openChild === key ? "open" : ""}`}
                        onClick={() => setOpenChild(openChild === key ? null : key)}
                      >
                        <Link href={getCategoryPath(sub)} onClick={onClose}>
                          {sub.name}
                        </Link>
                        {sub.children.length > 0 && (
                          <span className={`sidebar-sub-chevron ${openChild === key ? "rotated" : ""}`}>▶</span>
                        )}
                      </div>

                      {openChild === key && sub.children.length > 0 && (
                        <div className="sidebar-grandchildren">
                          {sub.children.map((child, k) => (
                            <Link
                              key={k}
                              href={getCategoryPath(child)}
                              className="sidebar-leaf"
                              onClick={onClose}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        ))}
      </div>
    </aside>
  );
}