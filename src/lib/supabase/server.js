import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function ensureEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    ensureEnv("NEXT_PUBLIC_SUPABASE_URL"),
    ensureEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Ignore write errors (e.g., in edge runtimes).
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({
              name,
              value: "",
              ...options,
              maxAge: 0,
            });
          } catch {
            // Ignore removal errors (e.g., in edge runtimes).
          }
        },
      },
    }
  );
}


