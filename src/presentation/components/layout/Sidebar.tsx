import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FolderKanban,
  LayoutGrid,
  ScrollText,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@presentation/utils/cn";
import { env } from "@infrastructure/config/env";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/projects", label: "Administrar proyectos", icon: FolderKanban },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden flex-col border-r border-[color:var(--color-border)] bg-[linear-gradient(180deg,#0f172a_0%,#111827_40%,#132238_100%)] text-white lg:flex",
        collapsed ? "w-20" : "w-72"
      )}
    >
      <div className="flex min-h-20 items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-2.5">
            <LayoutGrid className="h-5 w-5 text-cyan-300" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-sm font-semibold text-white">
                {env.VITE_APP_NAME ?? "API Hub Showcase"}
              </span>
              <p className="mt-1 text-xs text-white/55">
                Projects + OpenAPI registry
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="rounded-xl p-2 text-white/80 hover:bg-white/8 hover:text-white"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>
      <nav
        className="flex-1 overflow-y-auto px-4 py-5"
        aria-label="Main navigation"
      >
        <ul className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-2xl px-3 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white text-slate-950"
                      : "text-white/72 hover:bg-white/8 hover:text-white"
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-white/10 px-4 py-4">
        <a
          href={env.VITE_MANIFEST_URL || "/manifest.json"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 rounded-2xl px-3 py-3 text-sm text-white/72 transition-colors hover:bg-white/8 hover:text-white"
        >
          <ScrollText className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Abrir manifest</span>}
        </a>
      </div>
    </aside>
  );
}
