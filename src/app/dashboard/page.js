"use client";

import { HeaderBar } from "./components/HeaderBar";
import { Sidebar } from "./components/Sidebar";
import { DashboardContent } from "./components/DashboardContent";

export default function DashboardPage() {
  return (
    <div className="relative flex min-h-screen w-full bg-linear-to-br from-slate-100 via-white to-indigo-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_55%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_60%)]" />

      <Sidebar />

      <main className="flex flex-1 flex-col gap-6 p-6 lg:p-10">
        <HeaderBar />
        <div className="flex h-full flex-1 flex-col rounded-3xl border border-white/10 bg-white/70 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl dark:border-white/5 dark:bg-white/5">
          <DashboardContent />
        </div>
      </main>
    </div>
  );
}
