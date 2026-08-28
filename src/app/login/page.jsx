"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/events";
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Please try again.");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (submitError) {
      setError(submitError.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,210,255,0.15),transparent_40%)]" />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-surface-border bg-background/75 shadow-[0_0_30px_rgba(0,210,255,0.12)] backdrop-blur-xl">
        <div className="grid lg:grid-cols-2">
          <div className="hidden lg:flex flex-col justify-between border-r border-surface-border bg-gradient-to-br from-primary/10 via-background to-background p-10">
            <div>
              <div className="mb-8 inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Student Portal
              </div>
              <h1 className="text-4xl font-display font-black text-white leading-tight">
                Welcome back to <span className="text-primary text-glow-blue">IOTECH</span>
              </h1>
              <p className="mt-5 max-w-md text-base text-foreground/70 leading-relaxed">
                Access your student dashboard, register for club events, and stay updated with the latest workshops and hackathons.
              </p>
            </div>

            <div className="space-y-4 text-sm text-foreground/70">
              <div className="flex items-center gap-3 rounded-2xl border border-surface-border bg-white/5 p-4">
                <Mail className="text-primary" size={18} />
                <span>Use your official college email: @sigce.edu.in</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-surface-border bg-white/5 p-4">
                <LockKeyhole className="text-primary" size={18} />
                <span>Secure student-only access for event registrations</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Sign in</p>
                <h2 className="mt-2 text-3xl font-display font-black text-white">Student Login</h2>
              </div>
              <Link href="/" className="text-sm font-semibold text-foreground/70 transition-colors hover:text-primary">
                Back home
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/70">
                  College Email
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface/50 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <Mail size={18} className="text-foreground/40" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="yourname@sigce.edu.in"
                    required
                    className="w-full bg-transparent text-white placeholder:text-foreground/40 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/70">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface/50 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <LockKeyhole size={18} className="text-foreground/40" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full bg-transparent text-white placeholder:text-foreground/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-foreground/60 transition-colors hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-base font-bold uppercase tracking-[0.2em] text-background transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-8 border-t border-surface-border pt-6 text-center text-sm text-foreground/70">
              New here? {" "}
              <Link href="/signup" className="font-bold text-primary hover:text-primary-hover">
                Create student account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
