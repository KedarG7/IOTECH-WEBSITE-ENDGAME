"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronRight, LogOut, Mail, UserRound, School, GraduationCap, ArrowUpRight } from "lucide-react";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [profileRes, registrationsRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/registrations")
        ]);

        if (!profileRes.ok) {
          router.push("/login?redirect=/dashboard");
          return;
        }

        const profileData = await profileRes.json();
        setUser(profileData.user || null);

        if (registrationsRes.ok) {
          const registrationsData = await registrationsRes.json();
          setEvents(registrationsData.registrations || []);
        }
      } catch {
        router.push("/login?redirect=/dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [router]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen px-6 pb-20 pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Student Dashboard</p>
            <h1 className="mt-2 text-4xl font-display font-black text-white">Welcome back, {user.name}</h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface/60 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
          >
            <LogOut size={16} />
            {logoutLoading ? "Logging out..." : "Logout"}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="glass rounded-3xl border border-surface-border p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-surface-border pb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Profile</p>
                <h2 className="mt-2 text-2xl font-display font-bold text-white">Student Information</h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                <UserRound size={24} />
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <ProfileCard icon={<UserRound size={18} />} label="Full Name" value={user.name} />
              <ProfileCard icon={<Mail size={18} />} label="Email" value={user.email} />
              <ProfileCard icon={<School size={18} />} label="Student ID" value={user.studentId || "Not provided"} />
              <ProfileCard icon={<GraduationCap size={18} />} label="Department" value={user.department || "Not provided"} />
              <ProfileCard icon={<CalendarDays size={18} />} label="Year" value={user.year || "Not provided"} />
              <ProfileCard icon={<ArrowUpRight size={18} />} label="Role" value={user.role || "student"} />
            </div>
          </section>

          <section className="glass rounded-3xl border border-surface-border p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Account status</p>
            <h2 className="mt-2 text-2xl font-display font-bold text-white">Verification</h2>
            <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-4">
              <p className="text-sm text-foreground/80">Your email is verified and you can participate in all student events.</p>
            </div>

            <div className="mt-8 space-y-4">
              <Link
                href="/events"
                className="flex items-center justify-between rounded-2xl border border-surface-border bg-white/5 p-4 text-left transition-colors hover:border-primary hover:text-primary"
              >
                <span className="font-semibold uppercase tracking-[0.2em] text-white">Browse Events</span>
                <ChevronRight size={18} />
              </Link>
              <Link
                href="/profile"
                className="flex items-center justify-between rounded-2xl border border-surface-border bg-white/5 p-4 text-left transition-colors hover:border-primary hover:text-primary"
              >
                <span className="font-semibold uppercase tracking-[0.2em] text-white">View Full Profile</span>
                <ChevronRight size={18} />
              </Link>
            </div>
          </section>
        </div>

        <section className="mt-10 glass rounded-3xl border border-surface-border p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Event History</p>
              <h2 className="mt-2 text-2xl font-display font-bold text-white">Your Registrations</h2>
            </div>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {events.length} events
            </span>
          </div>

          {events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-surface-border bg-white/5 p-8 text-center text-foreground/70">
              You have not registered for any events yet. Explore the campus events page to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((item) => (
                <div key={item._id} className="rounded-2xl border border-surface-border bg-white/5 p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-bold text-white">{item.eventId?.title || "Event"}</p>
                      <p className="mt-1 text-sm text-foreground/70">{item.eventId?.category || "Event Category"}</p>
                    </div>
                    <div className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-green-300">
                      {item.status || "confirmed"}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-foreground/70 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Registration ID</p>
                      <p className="mt-1 font-semibold text-white">{item.registrationId}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Date</p>
                      <p className="mt-1 font-semibold text-white">
                        {item.eventId?.date ? new Date(item.eventId.date).toLocaleDateString() : "TBD"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Venue</p>
                      <p className="mt-1 font-semibold text-white">{item.eventId?.venue || "Campus"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function ProfileCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-surface-border bg-white/5 p-4">
      <div className="mb-2 flex items-center gap-2 text-primary">{icon}<span className="text-xs font-bold uppercase tracking-[0.2em]">{label}</span></div>
      <p className="text-base font-semibold text-white">{value}</p>
    </div>
  );
}
