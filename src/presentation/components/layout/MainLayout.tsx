import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[color:var(--color-app-bg)]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-[color:var(--color-border)] bg-white/80 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[color:var(--color-accent-soft)] p-2 text-[color:var(--color-accent-ink)]">
              <LayoutGridIcon />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">
                API Hub Showcase
              </p>
              <p className="text-xs text-slate-500">
                Project + OpenAPI catalog
              </p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function LayoutGridIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
