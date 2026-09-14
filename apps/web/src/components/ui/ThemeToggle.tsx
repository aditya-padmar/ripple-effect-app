"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/features/theme/ThemeContext";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`h-9 w-9 rounded-xl ${className}`} />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
        isDark
          ? "border-navy-700/80 bg-navy-900/80 text-amber-300 hover:border-navy-600 hover:bg-navy-800"
          : "border-slate-300 bg-white text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-100"
      } ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
};
