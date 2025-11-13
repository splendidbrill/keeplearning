"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Mail, MoveRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/components/providers/SupabaseProvider";

const GOOGLE_PROVIDER_ID = "google";
const STATUS_TIMEOUT = 6000;

export default function SignInCard() {
  const { supabase } = useSupabase();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(null);
  const [status, setStatus] = useState(null);

  const origin = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return window.location.origin;
  }, []);

  const redirectUrl = origin ? `${origin}/auth/callback?next=/dashboard` : undefined;

  useEffect(() => {
    if (!status) return;
    const timeoutId = window.setTimeout(() => setStatus(null), STATUS_TIMEOUT);
    return () => window.clearTimeout(timeoutId);
  }, [status]);

  const handleGoogleSignIn = async () => {
    if (loading) return;

    setStatus(null);
    setLoading("google");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: GOOGLE_PROVIDER_ID,
      options: redirectUrl
        ? {
            redirectTo: redirectUrl,
          }
        : undefined,
    });

    if (error) {
      setStatus({ type: "error", message: error.message });
      setLoading(null);
    }
  };

  const handleEmailSignIn = async (event) => {
    event.preventDefault();
    if (loading) return;

    setStatus(null);

    if (!email) {
      setStatus({ type: "error", message: "Please enter your email address." });
      return;
    }

    setLoading("email");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: redirectUrl
        ? {
            emailRedirectTo: redirectUrl,
          }
        : undefined,
    });

    if (error) {
      setStatus({ type: "error", message: error.message });
      setLoading(null);
      return;
    }

    setStatus({
      type: "success",
      message: "Magic link sent! Check your inbox to finish signing in.",
    });
    setLoading(null);
  };

  const isLoadingGoogle = loading === "google";
  const isLoadingEmail = loading === "email";

  return (
    <div className="w-full max-w-lg space-y-8 rounded-3xl border border-white/15 bg-white/5 p-8 shadow-2xl shadow-purple-500/30 backdrop-blur-2xl">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-purple-200/70">Welcome back</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Sign in to LearnFlow</h1>
        <p className="mt-2 text-sm text-slate-300">
          Continue with Google or request a secure magic link to access your automation dashboard.
        </p>
      </div>

      {status && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            status.type === "error"
              ? "border-red-500/30 bg-red-500/10 text-red-100"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="space-y-4">
        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoadingGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20"
        >
          {isLoadingGoogle ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          {isLoadingGoogle ? "Redirecting to Google..." : "Sign in with Google"}
        </Button>

        <div className="relative flex items-center justify-center">
          <span className="h-px w-full bg-white/10" />
          <span className="absolute bg-slate-950 px-3 text-xs uppercase tracking-[0.2em] text-slate-400">or</span>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-300">
            Email Address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </label>

          <Button
            type="submit"
            disabled={isLoadingEmail}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/30"
          >
            {isLoadingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            {isLoadingEmail ? "Sending magic link..." : "Send magic link"}
          </Button>
        </form>
      </div>

      <p className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <MoveRight className="h-4 w-4 text-purple-300" />
        You&apos;ll be redirected to your dashboard after completing the sign-in flow.
      </p>
    </div>
  );
}


