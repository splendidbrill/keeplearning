// "use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, LogOut, Settings } from "lucide-react"; // Added Settings icon
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import { useSupabase } from "@/components/providers/SupabaseProvider"; // REMOVED AUTH IMPORT
import { cn } from "@/lib/utils";

// Removed useSupabase hook and state
// Removed handleSignOut function

export function HeaderBar({ className, user }) {
  // const { supabase } = useSupabase(); // REMOVED AUTH USAGE
  // const [isSigningOut, setIsSigningOut] = useState(false); // REMOVED AUTH STATE

  // REMOVED: handleSignOut function
  /*
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
    } finally {
      setIsSigningOut(false);
    }
  };
  */

  return (
    <header
      className={cn(
        "flex h-20 w-full items-center justify-between rounded-3xl border border-white/10 bg-white/70 px-6 shadow-lg shadow-black/5 backdrop-blur-md dark:border-white/5 dark:bg-white/5",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500 shadow-md shadow-indigo-500/30">
          <Image
            src="/globe.svg"
            alt="LearnFlow Logo"
            width={32}
            height={32}
            className="h-7 w-7"
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            LearnFlow Workspace
          </p>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Automation Control Center</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right max-md:hidden">
          <p className="text-xs uppercase tracking-widest text-slate-400">User</p>
          {/* Kept user?.email display as it shows generic user info, but changed label */}
          <p className="text-sm font-medium text-slate-700 dark:text-slate-100">{user?.email ?? "Guest"}</p>
        </div>
        <Link
          href="https://docs.n8n.io"
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-full border border-indigo-100 px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50 dark:border-indigo-500/30 dark:text-indigo-200 dark:hover:bg-indigo-500/10 max-md:hidden"
        >
          Docs
        </Link>
        <Button variant="default" size="sm">
          Create Workflow
        </Button>
        {/* REPLACED AUTH BUTTON with a generic settings button */}
        <Button
          variant="outline"
          size="sm"
          // Removed onClick={handleSignOut}
          // Removed disabled={isSigningOut}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        {/* Kept Avatar as it is visual, but removed the need for user?.email to provide fallback text */}
        <Avatar fallback={user?.email?.slice(0, 2)?.toUpperCase() ?? "LF"} className="h-11 w-11" />
      </div>
    </header>
  );
}