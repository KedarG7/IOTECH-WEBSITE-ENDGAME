"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Users, ListOrdered, Plus, ArrowRight, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalEvents: 0, totalParticipants: 0, upcomingEvents: 0 });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, regsRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/registrations"),
        ]);
        const eventsData = await eventsRes.json();
        const regsData = await regsRes.json();

        const events = eventsData.events || [];
        const registrations = regsData.registrations || [];

        setStats({
          totalEvents: events.length,
          totalParticipants: registrations.length,
          upcomingEvents: events.filter((e) => e.status === "upcoming").length,
        });
        setRecentRegistrations(registrations.slice(0, 8));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Events", value: stats.totalEvents, icon: CalendarDays, color: "text-primary" },
    { label: "Total Registrations", value: stats.totalParticipants, icon: Users, color: "text-green-400" },
    { label: "Upcoming Events", value: stats.upcomingEvents, icon: TrendingUp, color: "text-accent-violet" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">IOTECH Club</p>
          <h1 className="mt-2 text-4xl font-display font-black text-white">Admin Dashboard</h1>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-bold uppercase tracking-widest rounded-xl hover:bg-primary-hover transition-all glow-blue-hover"
        >
          <Plus size={18} /> Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass rounded-2xl border border-surface-border p-6 hover-perspective">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50">{card.label}</p>
                <div className={card.color}><Icon size={22} /></div>
              </div>
              <p className={`text-5xl font-display font-black ${card.color}`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/events" className="glass rounded-2xl border border-surface-border p-6 flex items-center justify-between hover:border-primary group transition-all">
          <div className="flex items-center gap-3">
            <ListOrdered size={22} className="text-primary" />
            <span className="font-bold uppercase tracking-wider text-white">Manage Events</span>
          </div>
          <ArrowRight size={18} className="text-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/admin/timeline" className="glass rounded-2xl border border-surface-border p-6 flex items-center justify-between hover:border-primary group transition-all">
          <div className="flex items-center gap-3">
            <CalendarDays size={22} className="text-primary" />
            <span className="font-bold uppercase tracking-wider text-white">Yearly Timeline</span>
          </div>
          <ArrowRight size={18} className="text-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      <div className="glass rounded-2xl border border-surface-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-white">Recent Registrations</h2>
          <span className="text-xs font-bold uppercase tracking-widest text-primary border border-primary/30 bg-primary/10 px-3 py-1 rounded-full">
            {recentRegistrations.length} shown
          </span>
        </div>
        {recentRegistrations.length === 0 ? (
          <div className="text-center text-foreground/50 py-8 border border-dashed border-surface-border rounded-xl">
            No registrations yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-foreground/40 border-b border-surface-border">
                  <th className="text-left pb-3 pr-4">Student</th>
                  <th className="text-left pb-3 pr-4">Event</th>
                  <th className="text-left pb-3 pr-4">Reg. ID</th>
                  <th className="text-left pb-3">Date</th>
                  <th className="text-left pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {recentRegistrations.map((reg) => (
                  <tr key={reg._id} className="border-b border-surface-border/50 last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-white">{reg.userId?.name || "Unknown"}</p>
                      <p className="text-foreground/50 text-xs">{reg.userId?.email || ""}</p>
                    </td>
                    <td className="py-3 pr-4 text-foreground/70">{reg.eventId?.title || "Event"}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-primary">{reg.registrationId}</td>
                    <td className="py-3 text-foreground/60 text-xs">
                      {reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3">
                      <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400">
                        {reg.status || "confirmed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
