"use client";

import { useState } from "react";
import Navbar from "@/components/layouts/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";

type Props = {
  children: React.ReactNode;
};

export default function AppShell({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="app-body">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="app-content">
          {children}
        </main>
      </div>
    </>
  );
}
