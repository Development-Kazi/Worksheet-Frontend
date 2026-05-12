"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
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

  const categoriesById = useMemo(
    () => new Map(categories.map((category) => [category._id, category])),
    [categories],
  );

  const getCategoryPath = (node: ClientCategory) => {
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

  // Auto-expand and highlight based on pathname
  useEffect(() => {
    if (!pathname || categories.length === 0) return;

    categoryTree.forEach((parent, i) => {
      const parentPath = getCategoryPath(parent);
      
      // Check if current path is this parent or its children
      if (pathname.startsWith(parentPath)) {
        setOpenIndex(i);
        
        parent.children.forEach((child, j) => {
          const childPath = getCategoryPath(child);
          if (pathname.startsWith(childPath)) {
            setOpenChild(`${i}-${j}`);
          }
        });
      }
    });
  }, [pathname, categories.length, categoryTree]);

  const isActive = (path: string) => pathname === path;

  return (
    <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>

      <div className="sidebar-close-row">
        <p className="sidebar-heading">Categories</p>
        <button className="sidebar-close-btn" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className="sidebar-list">
        {categoryTree.map((cat, i) => {
          const catPath = getCategoryPath(cat);
          const active = isActive(catPath);

          return (
            <div key={i}>
              <div
                className={`sidebar-parent ${openIndex === i ? "open" : ""} ${active ? "active" : ""}`}
              >
                <span className="sidebar-parent-label" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                  <span className="sidebar-dot" />
                  <Link href={catPath}>
                    {cat.name}
                  </Link>
                </span>
                {cat.children.length > 0 && (
                  <span 
                    className={`sidebar-chevron ${openIndex === i ? "rotated" : ""}`}
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  >
                    ▶
                  </span>
                )}
              </div>

              {openIndex === i && cat.children.length > 0 && (
                <div className="sidebar-children">
                  {cat.children.map((sub, j) => {
                    const key = `${i}-${j}`;
                    const subPath = getCategoryPath(sub);
                    const subActive = isActive(subPath);

                    return (
                      <div key={j}>
                        <div
                          className={`sidebar-sub ${openChild === key ? "open" : ""} ${subActive ? "active" : ""}`}
                        >
                          <Link href={subPath}>
                            {sub.name}
                          </Link>
                          {sub.children.length > 0 && (
                            <span 
                              className={`sidebar-sub-chevron ${openChild === key ? "rotated" : ""}`}
                              onClick={() => setOpenChild(openChild === key ? null : key)}
                            >
                              ▶
                            </span>
                          )}
                        </div>

                        {openChild === key && sub.children.length > 0 && (
                          <div className="sidebar-grandchildren">
                            {sub.children.map((child, k) => {
                              const childPath = getCategoryPath(child);
                              const childActive = isActive(childPath);

                              return (
                                <Link
                                  key={k}
                                  href={childPath}
                                  className={`sidebar-leaf ${childActive ? "active" : ""}`}
                                >
                                  {child.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}