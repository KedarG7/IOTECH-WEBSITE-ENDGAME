"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, GraduationCap, Mail, School, UserRound, BadgeCheck, Ticket } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileRes, registrationRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/registrations")
        ]);

        if (!profileRes.ok) {
          router.push("/login?redirect=/profile");
          return;
        }

        const profileData = await profileRes.json();
        setUser(profileData.user || null);

        if (registrationRes.ok) {
          const registrationData = await registrationRes.json();
          setRegistrations(registrationData.registrations || []);
        }
      } catch {
        router.push("/login?redirect=/profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

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
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-primary hover:text-primary-hover">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="glass rounded-3xl border border-surface-border p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                <UserRound size={28} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Profile</p>
                <h1 className="mt-2 text-3xl font-display font-black text-white">{user.name}</h1>
              </div>
            </div>

            <div className="space-y-4">
              <InfoRow icon={<Mail size={18} />} label="College Email" value={user.email} />
              <InfoRow icon={<School size={18} />} label="Student ID" value={user.studentId || "Not provided"} />
              <InfoRow icon={<GraduationCap size={18} />} label="Department" value={user.department || "Not provided"} />
              <InfoRow icon={<CalendarDays size={18} />} label="Year" value={user.year || "Not provided"} />
              <InfoRow icon={<BadgeCheck size={18} />} label="Verification" value={user.isEmailVerified ? "Verified" : "Pending verification"} />
            </div>
          </section>

          <section className="glass rounded-3xl border border-surface-border p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Registrations</p>
                <h2 className="mt-2 text-2xl font-display font-bold text-white">Event Activity</h2>
              </div>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {registrations.length} total
              </span>
            </div>

            {registrations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-surface-border bg-white/5 p-8 text-center text-foreground/70">
                No event bookings yet.
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((item) => (
                  <div key={item._id} className="rounded-2xl border border-surface-border bg-white/5 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-bold text-white">{item.eventId?.title || "Event"}</p>
                        <p className="mt-1 text-sm text-foreground/70">{item.eventId?.category || "Technical Event"}</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-green-300">
                        <Ticket size={14} />
                        {item.status || "confirmed"}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-foreground/70 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Registration ID</p>
                        <p className="mt-1 font-semibold text-white">{item.registrationId}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Registered On</p>
                        <p className="mt-1 font-semibold text-white">{new Date(item.registeredAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Event Date</p>
                        <p className="mt-1 font-semibold text-white">{item.eventId?.date ? new Date(item.eventId.date).toLocaleDateString() : "TBD"}</p>
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
      </div>
    </main>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-surface-border bg-white/5 p-4">
      <div className="mt-0.5 text-primary">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60">{label}</p>
        <p className="mt-2 break-all text-base font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
