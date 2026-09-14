"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  FolderKanban,
  LogIn,
  LogOut,
  Menu,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";

export const Header: React.FC = () => {
  const { user, loading, isConfigured, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  return (
    <header className="sticky top-0 z-50 border-b border-navy-700/70 bg-[#070b14]/90 backdrop-blur-xl">
      {!isConfigured && (
        <div className="flex items-center justify-center gap-2 border-b border-amber-400/20 bg-amber-500/10 px-3 py-1.5 text-center text-[11px] text-amber-100">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-300" />
          <span>
            Authentication is not configured. Add Firebase values in{" "}
            <code className="rounded bg-navy-950 px-1 text-amber-200">
              apps/web/.env.local
            </code>{" "}
            — see{" "}
            <code className="rounded bg-navy-950 px-1 text-amber-200">
              docs/FIREBASE_SETUP.md
            </code>
            .
          </span>
        </div>
      )}
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={close}
          className="group flex items-center gap-2.5"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-teal-400/30 bg-teal-400/10 text-teal-300 transition group-hover:border-teal-300">
            <Shield className="h-5 w-5" />
          </span>
          <span>
            <b className="block text-[15px] tracking-tight text-white">
              RippleGuard
            </b>
            <small className="block text-[9px] font-medium uppercase tracking-[.16em] text-slate-400">
              Impact observatory
            </small>
          </span>
        </Link>
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary navigation"
        >
          <Link href="/demo" className="header-link">
            <Sparkles className="h-3.5 w-3.5" /> Synthetic demo
          </Link>
          <Link href="/dashboard" className="header-link">
            <FolderKanban className="h-3.5 w-3.5" /> Workspace
          </Link>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {loading ? (
            <span className="h-8 w-24 animate-pulse rounded-lg bg-navy-800" />
          ) : user ? (
            <>
              <span className="hidden max-w-[170px] truncate text-xs text-slate-400 lg:block">
                {user.email}
              </span>
              <button
                onClick={() => logout()}
                className="icon-button"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="header-link">
                <LogIn className="h-3.5 w-3.5" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-teal-400 px-3 py-2 text-xs font-bold text-navy-950 transition hover:bg-teal-300"
              >
                Analyze a project
              </Link>
            </>
          )}
        </div>
        <button
          className="icon-button md:hidden"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {menuOpen && (
        <div className="border-t border-navy-700/70 bg-navy-900 px-4 py-3 md:hidden">
          <nav className="grid gap-1" aria-label="Mobile navigation">
            <Link onClick={close} href="/demo" className="mobile-nav-link">
              <Sparkles className="h-4 w-4" /> Synthetic demo
            </Link>
            <Link onClick={close} href="/dashboard" className="mobile-nav-link">
              <FolderKanban className="h-4 w-4" /> Workspace
            </Link>
            {user ? (
              <button
                onClick={() => {
                  close();
                  logout();
                }}
                className="mobile-nav-link text-left"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            ) : (
              <>
                <Link onClick={close} href="/login" className="mobile-nav-link">
                  <LogIn className="h-4 w-4" /> Sign in
                </Link>
                <Link
                  onClick={close}
                  href="/signup"
                  className="mobile-nav-link text-teal-200"
                >
                  <Shield className="h-4 w-4" /> Analyze a project
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
