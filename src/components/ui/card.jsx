"use client";

import { cn } from "@/lib/utils";

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/70 p-6 shadow-lg shadow-black/5 backdrop-blur-sm transition-colors dark:border-white/5 dark:bg-white/5",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("mb-4 flex flex-col gap-1", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-sm text-slate-500 dark:text-slate-400", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return (
    <div
      className={cn("text-sm text-slate-700 dark:text-slate-200", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent };

