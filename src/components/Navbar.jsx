import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FiTruck,
  FiLogOut,
  FiRefreshCw,
  FiLayers,
} from "react-icons/fi";

const Navbar = () => {
  const { currentUser, logout, isDemoMode, toggleDemoMode, resetData } = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link
            to="/orders"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <FiTruck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  SwiftDeliver
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Agent Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Allied Scientific Products
              </p>
            </div>
          </Link>

          {/* Center Navigation Links (if on nested pages) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
            <Link
              to="/orders"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                location.pathname === "/orders"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Assigned Deliveries
            </Link>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mode Badge & Switcher */}
            <div className="relative">
              <button
                onClick={() => toggleDemoMode()}
                title={
                  isDemoMode
                    ? "Running in Demo Mode (Mock data). Click to attempt Live API."
                    : "Running with Live Backend API. Click to switch to Demo Mode."
                }
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all ${
                  isDemoMode
                    ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                    : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isDemoMode ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                />
                <span className="hidden xs:inline">
                  {isDemoMode ? "Demo Mode" : "Live API"}
                </span>
              </button>
            </div>

            {/* Reset mock data button if demo mode */}
            {isDemoMode && (
              <button
                onClick={() => {
                  resetData();
                  alert("Sample delivery orders have been reset!");
                }}
                title="Reset sample orders to initial state"
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FiRefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* User Profile Info */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {currentUser.name || "Delivery Agent"}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    On Duty
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 mb-2">
                      <p className="text-xs font-medium text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {currentUser.name || "Delivery Executive"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {currentUser.email || "delivery@alliedscientific.com"}
                      </p>
                      {currentUser.assignedVehicle && (
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-700 font-mono">
                          <FiTruck className="w-3 h-3" />
                          {currentUser.assignedVehicle}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          toggleDemoMode();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <FiLayers className="w-3.5 h-3.5 text-slate-500" />
                          Toggle Data Source
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-600">
                          {isDemoMode ? "Mock" : "Server"}
                        </span>
                      </button>

                      {isDemoMode && (
                        <button
                          onClick={() => {
                            resetData();
                            setShowUserMenu(false);
                            alert("Orders reset to original demo state.");
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <FiRefreshCw className="w-3.5 h-3.5 text-slate-500" />
                          Reset Sample Orders
                        </button>
                      )}

                      <hr className="my-1 border-slate-100" />

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiLogOut className="w-3.5 h-3.5" />
                        Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Logout Icon on mobile */}
            <button
              onClick={logout}
              title="Log Out"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors sm:hidden"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
