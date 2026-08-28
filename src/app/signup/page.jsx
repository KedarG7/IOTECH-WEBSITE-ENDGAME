"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Eye, EyeOff, GraduationCap, LockKeyhole, Mail, UserRound } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  password: "",
  studentId: "",
  department: "",
  year: "",
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          studentId: form.studentId.trim(),
          department: form.department.trim(),
          year: form.year.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      const email = form.email.trim();
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError.message || "Unable to create your account right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(189,0,255,0.12),transparent_35%)]" />

      <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-surface-border bg-background/75 shadow-[0_0_30px_rgba(189,0,255,0.12)] backdrop-blur-xl">
        <div className="grid lg:grid-cols-2">
          <div className="hidden lg:flex flex-col justify-between border-r border-surface-border bg-gradient-to-br from-accent-violet/10 via-background to-background p-10">
            <div>
              <div className="mb-8 inline-flex items-center rounded-full border border-accent-violet/40 bg-accent-violet/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-accent-violet">
                Join IOTECH
              </div>
              <h1 className="text-4xl font-display font-black text-white leading-tight">
                Create your <span className="text-primary text-glow-blue">student account</span>
              </h1>
              <p className="mt-5 max-w-md text-base text-foreground/70 leading-relaxed">
                Sign up with your college identity to unlock event registration, club updates, and technical workshops designed for SIGCE students.
              </p>
            </div>

            <div className="space-y-4 text-sm text-foreground/70">
              <div className="flex items-center gap-3 rounded-2xl border border-surface-border bg-white/5 p-4">
                <GraduationCap className="text-primary" size={18} />
                <span>Only valid @sigce.edu.in accounts are accepted</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-surface-border bg-white/5 p-4">
                <BookOpen className="text-primary" size={18} />
                <span>Register for student events, workshops, and hackathons</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Sign up</p>
                <h2 className="mt-2 text-3xl font-display font-black text-white">Student Registration</h2>
              </div>
              <Link href="/" className="text-sm font-semibold text-foreground/70 transition-colors hover:text-primary">
                Back home
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="name" className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/70">
                    Full Name
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface/50 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <UserRound size={18} className="text-foreground/40" />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full bg-transparent text-white placeholder:text-foreground/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
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
                      pattern=".+@sigce\.edu\.in"
                      required
                      className="w-full bg-transparent text-white placeholder:text-foreground/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
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
                      placeholder="Create a strong password"
                      minLength={6}
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

                <div className="space-y-2">
                  <label htmlFor="studentId" className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/70">
                    Student ID
                  </label>
                  <input
                    id="studentId"
                    type="text"
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    placeholder="e.g. 2024CS001"
                    required
                    className="w-full rounded-xl border border-surface-border bg-surface/50 px-4 py-3 text-white placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="year" className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/70">
                    Year
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-surface-border bg-surface/50 px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="" className="bg-background">Select year</option>
                    <option value="1st Year" className="bg-background">1st Year</option>
                    <option value="2nd Year" className="bg-background">2nd Year</option>
                    <option value="3rd Year" className="bg-background">3rd Year</option>
                    <option value="4th Year" className="bg-background">4th Year</option>
                  </select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="department" className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/70">
                    Department
                  </label>
                  <input
                    id="department"
                    type="text"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="Computer Science / Electronics / Mechanical"
                    required
                    className="w-full rounded-xl border border-surface-border bg-surface/50 px-4 py-3 text-white placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
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
                {loading ? "Creating account..." : "Create Account"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-8 border-t border-surface-border pt-6 text-center text-sm text-foreground/70">
              Already have an account? {" "}
              <Link href="/login" className="font-bold text-primary hover:text-primary-hover">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
