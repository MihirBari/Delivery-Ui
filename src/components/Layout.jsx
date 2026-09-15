import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-500 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {children}
      </main>
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white/40">
        &copy; {new Date().getFullYear()} Allied Scientific Products &bull; SwiftDeliver Agent Portal v2.0
      </footer>
    </div>
  );
};

export default Layout;
