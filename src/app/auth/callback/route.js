import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function ensureEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createRouteSupabaseClient() {
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
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({
            name,
            value: "",
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );
}

export async function GET(request) {
  const supabase = createRouteSupabaseClient();
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error("[Supabase] Failed to exchange code for session", error);
      return NextResponse.redirect(new URL("/auth?error=auth", requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}

export async function POST(request) {
  const supabase = createRouteSupabaseClient();
  const { event, session } = await request.json();

  try {
    if (event === "SIGNED_OUT") {
      await supabase.auth.signOut();
    } else if (session) {
      await supabase.auth.setSession(session);
    }
  } catch (error) {
    console.error("[Supabase] Failed to sync session in callback", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}


