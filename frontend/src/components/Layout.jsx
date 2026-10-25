import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ErrorBoundary from "./ErrorBoundary";

export default function Layout() {
  const [open, setOpen] = useState(false); // mobile sidebar drawer

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <Navbar onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-7xl p-4 sm:p-6">
          <ErrorBoundary>
            {" "}
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
