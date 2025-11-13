import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import SignInCard from "./sign-in-card";

export const metadata = {
  title: "Sign In | LearnFlow",
  description: "Access your LearnFlow dashboard by signing in with Google or email.",
};

export default async function AuthPage({ searchParams }) {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const target = typeof searchParams?.redirectedFrom === "string" ? searchParams.redirectedFrom : "/dashboard";
    redirect(target);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 px-4 py-16">
      <SignInCard />
    </div>
  );
}


