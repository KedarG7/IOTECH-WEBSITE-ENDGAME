"use client";
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

export default function AdminTimelinePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-black text-white">Yearly Timeline</h1>
          <p className="text-foreground/70 mt-2">All events ordered chronologically</p>
        </div>
      </div>

      <div className="relative border-l border-surface-border pl-6 space-y-12 py-4">
        {events.length === 0 ? (
          <p className="text-foreground/60">No events found.</p>
        ) : (
          events.map((event, idx) => {
            const date = new Date(event.date);
            const statusColor =
              event.status === "upcoming" ? "text-primary border-primary/30 bg-primary/10" :
              event.status === "cancelled" ? "text-red-400 border-red-400/30 bg-red-400/10" :
              "text-foreground/60 border-surface-border bg-surface";
            
            const markerColor = 
              event.status === "upcoming" ? "bg-primary glow-blue" :
              event.status === "cancelled" ? "bg-red-500" :
              "bg-foreground/40";

            return (
              <div key={event._id} className="relative group">
                <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-background ${markerColor}`} />
                <div className="glass p-6 rounded-2xl border border-surface-border hover-perspective">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-primary font-bold uppercase tracking-widest text-sm">
                          {date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${statusColor}`}>
                          {event.status}
                        </span>
                      </div>
                      <h3 className="text-2xl font-display font-bold text-white group-hover:text-primary transition-colors">{event.title}</h3>
                      <p className="text-foreground/60 text-sm mt-1">{event.category} • {event.location}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold uppercase tracking-widest text-foreground/50">Registrations</p>
                      <p className="text-xl font-bold text-white">{event.registeredCount || 0} <span className="text-foreground/40 text-sm">/ {event.maxParticipants}</span></p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/admin/events/${event._id}`} className="text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
                      Edit Event
                    </Link>
                    <Link href={`/admin/events/${event._id}/participants`} className="text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
                      View Participants
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
