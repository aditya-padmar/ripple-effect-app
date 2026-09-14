"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Sparkles,
  FolderKanban,
  LogIn,
  LogOut,
  Menu,
  X,
  ArrowRight,
  Activity,
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";

export const Header: React.FC = () => {
  const { user, loading, isConfigured, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-700/60 bg-navy-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          onClick={() => setMenuOpen(false)}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400/20 to-teal-500/5 border border-teal-500/30 text-teal-300 shadow-glow-teal transition-all group-hover:scale-105">
            <Shield className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-teal-400 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-teal-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-white">
                RippleGuard
              </span>
              <span className="rounded bg-teal-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-teal-300 border border-teal-500/20">
                v0.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Dependency Blast-Radius Simulator
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1.5 md:flex" aria-label="Main Navigation">
          <Link
            href="/demo"
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              isActive("/demo")
                ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                : "text-slate-300 hover:bg-navy-850 hover:text-white"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span>Interactive Demo</span>
          </Link>
          <Link
            href="/dashboard"
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              isActive("/dashboard")
                ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                : "text-slate-300 hover:bg-navy-850 hover:text-white"
            }`}
          >
            <FolderKanban className="h-3.5 w-3.5 text-slate-400" />
            <span>Projects & Assets</span>
          </Link>
        </nav>

        {/* Auth / Action Area */}
        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="h-9 w-28 animate-pulse rounded-xl bg-navy-800" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="max-w-[180px] truncate text-xs text-slate-400">
                {user.email}
              </span>
              <button
                onClick={() => logout()}
                className="btn-secondary !p-2 text-slate-400 hover:text-rose-400"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/login" className="btn-ghost text-xs">
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary !text-xs !py-2">
                <span>Start Free</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="btn-secondary !p-2 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="border-b border-navy-850 bg-navy-950/95 px-4 py-4 md:hidden backdrop-blur-2xl">
          <nav className="flex flex-col gap-2">
            <Link
              href="/demo"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-navy-850"
            >
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span>Interactive Demo</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-navy-850"
            >
              <FolderKanban className="h-4 w-4 text-slate-400" />
              <span>Projects & Assets</span>
            </Link>

            <div className="mt-3 border-t border-navy-850 pt-3">
              {user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs text-slate-400 truncate">{user.email}</span>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="btn-secondary w-full justify-center !text-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="btn-primary w-full justify-center !text-xs"
                  >
                    Start Free
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
