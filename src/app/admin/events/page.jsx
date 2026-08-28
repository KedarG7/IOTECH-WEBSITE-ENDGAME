"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Users, Trash2, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchEvents() {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchEvents();
      } else {
        alert("Failed to delete event");
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-black text-white">Manage Events</h1>
          <p className="text-foreground/70 mt-2">Create, edit, and monitor your club events.</p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-bold uppercase tracking-widest rounded-xl hover:bg-primary-hover transition-all glow-blue-hover"
        >
          <Plus size={18} /> New Event
        </Link>
      </div>

      <div className="glass rounded-2xl border border-surface-border overflow-hidden">
        {events.length === 0 ? (
          <div className="text-center py-12 px-6 text-foreground/50">
            <CalendarDays size={48} className="mx-auto mb-4 opacity-20" />
            <p>No events found. Create your first event to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-foreground/40 border-b border-surface-border bg-white/5">
                  <th className="text-left p-4 font-semibold">Title</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-center p-4 font-semibold">Registrations</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {events.map((event) => {
                  const date = new Date(event.date);
                  const statusColor =
                    event.status === "upcoming" ? "text-primary border-primary/30 bg-primary/10" :
                    event.status === "cancelled" ? "text-red-400 border-red-400/30 bg-red-400/10" :
                    "text-foreground/60 border-surface-border bg-surface";
                  return (
                    <tr key={event._id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <p className="font-bold text-white text-base">{event.title}</p>
                        <p className="text-foreground/50 text-xs mt-1 uppercase tracking-wider">{event.category}</p>
                      </td>
                      <td className="p-4 text-foreground/80">
                        {date.toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${statusColor}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center justify-center font-mono text-sm bg-white/5 border border-surface-border rounded-lg px-3 py-1">
                          <span className="text-white font-bold">{event.registeredCount || 0}</span>
                          <span className="text-foreground/40 mx-1">/</span>
                          <span className="text-foreground/60">{event.maxParticipants}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link href={`/admin/events/${event._id}/participants`} className="inline-flex p-2 text-foreground/50 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View Participants">
                          <Users size={18} />
                        </Link>
                        <Link href={`/admin/events/${event._id}`} className="inline-flex p-2 text-foreground/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Edit Event">
                          <Edit2 size={18} />
                        </Link>
                        <button onClick={() => handleDelete(event._id)} className="inline-flex p-2 text-foreground/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete Event">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
