"use client";

import { cn } from "@/lib/utils";

function Table({ className, ...props }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/60 shadow-lg shadow-black/5 backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
      <table
        className={cn("w-full min-w-full border-collapse text-left text-sm text-slate-700 dark:text-slate-200", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }) {
  return (
    <thead
      className={cn("bg-white/70 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/10 dark:text-slate-400", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }) {
  return (
    <tbody
      className={cn("divide-y divide-white/10 dark:divide-white/5", className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn("transition-colors hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10", className)}
      {...props}
    />
  );
}

function TableHead({ className, ...props }) {
  return (
    <th
      className={cn("px-5 py-3 font-medium", className)}
      {...props}
    />
  );
}

function TableCell({ className, ...props }) {
  return (
    <td
      className={cn("px-5 py-4 align-middle text-sm", className)}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };

