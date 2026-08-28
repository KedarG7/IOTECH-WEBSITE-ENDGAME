"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, MailCheck, RefreshCcw } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const email = initialEmail;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialEmail) {
      router.push("/signup");
    }
  }, [initialEmail, router]);

  const handleVerify = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "OTP verification failed.");
      }

      setMessage(data.message || "Email verified successfully.");
      router.push("/dashboard");
      router.refresh();
    } catch (verifyError) {
      setError(verifyError.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to resend OTP.");
      }

      setMessage(data.message || "A new OTP has been sent.");
    } catch (resendError) {
      setError(resendError.message || "Unable to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-xl rounded-3xl border border-surface-border bg-background/80 p-8 shadow-[0_0_30px_rgba(0,210,255,0.12)] backdrop-blur-xl">
        <div className="mb-8 flex items-center gap-3 text-primary">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
            <MailCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Verification</p>
            <h1 className="mt-2 text-3xl font-display font-black text-white">Verify your email</h1>
          </div>
        </div>

        <p className="mb-6 text-foreground/70">
          A 6-digit OTP has been sent to <span className="font-semibold text-white">{email || "your email"}</span>. Enter it below to activate your student account.
        </p>

        <form onSubmit={handleVerify} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/70">
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              required
              className="w-full rounded-xl border border-surface-border bg-surface/50 px-4 py-3 text-white placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {message && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-base font-bold uppercase tracking-[0.2em] text-background transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending || !email}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover disabled:opacity-60"
        >
          <RefreshCcw size={16} className={resending ? "animate-spin" : ""} />
          {resending ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </main>
  );
}
