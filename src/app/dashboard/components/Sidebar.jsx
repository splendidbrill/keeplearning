"use client";

import { cn } from "@/lib/utils";
import { FileSpreadsheet, LayoutDashboard, PlugZap, Settings2, Webhook, Workflow } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useDashboardStore } from "../useDashboardStore";

const NAVIGATION_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "workflows", label: "My Workflows", icon: Workflow },
  { id: "executions", label: "Execution Logs", icon: FileSpreadsheet },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "integrations", label: "Integrations", icon: PlugZap },
  { id: "settings", label: "Settings", icon: Settings2 },
];

export function Sidebar() {
  const { selectedView, setSelectedView } = useDashboardStore(
    useShallow((state) => ({
      selectedView: state.selectedView,
      setSelectedView: state.setSelectedView,
    }))
  );

  return (
    <aside className="flex h-full w-72 flex-col justify-between border-r border-white/10 bg-white/70 p-6 shadow-xl shadow-black/5 backdrop-blur-md dark:border-white/5 dark:bg-white/5 max-lg:hidden">
      <nav className="flex flex-col gap-1">
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 p-4 text-white shadow-md shadow-indigo-500/20">
          <LayoutDashboard className="h-7 w-7" />
          <div>
            <span className="block text-sm uppercase tracking-widest text-white/80">Workspace</span>
            <span className="text-base font-semibold">n8n Control</span>
          </div>
        </div>

        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedView(item.id)}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
              selectedView === item.id
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 text-white shadow-sm shadow-indigo-500/25"
                : "text-slate-600 hover:bg-indigo-500/10 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white"
            )}
          >
            <item.icon
              className={cn(
                "h-4 w-4 transition-colors",
                selectedView === item.id ? "text-white" : "text-indigo-500 dark:text-indigo-300"
              )}
            />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="rounded-xl border border-white/10 bg-white/60 p-4 text-xs text-slate-500 shadow-sm shadow-black/5 dark:border-white/5 dark:bg-white/10 dark:text-slate-300">
        <p className="mb-2 font-semibold text-slate-700 dark:text-slate-100">Quick Tips</p>
        <p className="leading-relaxed">
          Monitor workflow executions in real time. Use the dashboard to identify bottlenecks before they impact your
          automations.
        </p>
      </div>
    </aside>
  );
}

