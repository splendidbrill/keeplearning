"use client";

import { createBrowserClient } from "@supabase/ssr";

function ensureEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

let browserClient;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      ensureEnv("NEXT_PUBLIC_SUPABASE_URL"),
      ensureEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    );
  }

  return browserClient;
}


