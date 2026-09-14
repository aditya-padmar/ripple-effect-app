import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ThemeProvider } from "@/features/theme/ThemeContext";
import { Header } from "@/components/ui/Header";

export const metadata: Metadata = {
  title:
    "RippleGuard — Explainable Open-Source Dependency Risk & Scenario Analysis",
  description:
    "Simulate downstream exposure from compromised software dependencies, evaluate counterfactual mitigations, and prioritize engineering repair with mathematical rigor.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('rippleguard_theme');
                  var theme = saved || 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-navy-950 dark:text-slate-100 antialiased min-h-screen flex flex-col selection:bg-teal-400 selection:text-navy-950 transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>
            <Header />
            <main
              id="main-content"
              tabIndex={-1}
              className="flex-1 flex flex-col"
            >
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
