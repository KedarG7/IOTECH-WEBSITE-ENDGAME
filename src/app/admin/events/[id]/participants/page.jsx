"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Users } from "lucide-react";

export default function ParticipantsPage() {
  const params = useParams();
  const id = params?.id;
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventRes, regsRes] = await Promise.all([
          fetch(`/api/events/${id}`),
          fetch(`/api/registrations?eventId=${id}`)
        ]);
        
        const eventData = await eventRes.json();
        const regsData = await regsRes.json();

        if (eventData.success) setEvent(eventData.event);
        if (regsData.success) setParticipants(regsData.registrations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  const handleExportCSV = () => {
    if (!participants.length) return;
    
    const headers = ["Registration ID", "Name", "Email", "Student ID", "Department", "Year", "Date Registered", "Status"];
    const csvContent = [
      headers.join(","),
      ...participants.map(p => {
        const date = new Date(p.registeredAt).toLocaleDateString();
        return `${p.registrationId},"${p.userId?.name}","${p.userId?.email}","${p.userId?.studentId}","${p.userId?.department}","${p.userId?.year}","${date}","${p.status}"`;
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `participants-${event?.slug || "event"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/events" className="p-2 text-foreground/50 hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Participants</p>
          <h1 className="mt-1 text-3xl font-display font-black text-white">{event?.title || "Event"}</h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="glass rounded-2xl border border-surface-border p-6 flex-1 w-full max-w-sm flex items-center gap-6">
          <div className="p-4 rounded-full bg-primary/10 text-primary border border-primary/30 glow-blue">
            <Users size={32} />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-foreground/50">Total Registered</p>
            <p className="text-4xl font-display font-black text-white">
              {participants.length} <span className="text-lg text-foreground/40 font-medium">/ {event?.maxParticipants}</span>
            </p>
          </div>
        </div>

        <button 
          onClick={handleExportCSV}
          disabled={!participants.length}
          className="inline-flex items-center gap-2 px-6 py-3 bg-surface text-white border border-surface-border font-bold uppercase tracking-widest rounded-xl hover:border-primary transition-all disabled:opacity-50"
        >
          <Download size={18} className="text-primary" /> Export CSV
        </button>
      </div>

      <div className="glass rounded-2xl border border-surface-border overflow-hidden">
        {participants.length === 0 ? (
          <div className="text-center py-12 px-6 text-foreground/50">
            <p>No participants have registered for this event yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-foreground/40 border-b border-surface-border bg-white/5">
                  <th className="text-left p-4 font-semibold">Reg ID</th>
                  <th className="text-left p-4 font-semibold">Student</th>
                  <th className="text-left p-4 font-semibold">Academic Info</th>
                  <th className="text-left p-4 font-semibold">Registered At</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {participants.map((p) => (
                  <tr key={p._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-xs text-primary">{p.registrationId}</td>
                    <td className="p-4">
                      <p className="font-bold text-white text-base">{p.userId?.name || "Unknown"}</p>
                      <p className="text-foreground/50 text-xs mt-1">{p.userId?.email}</p>
                    </td>
                    <td className="p-4 text-foreground/70 text-xs">
                      <p><span className="text-foreground/40 mr-1">ID:</span> {p.userId?.studentId}</p>
                      <p><span className="text-foreground/40 mr-1">Dept:</span> {p.userId?.department} ({p.userId?.year})</p>
                    </td>
                    <td className="p-4 text-foreground/70">
                      {new Date(p.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400">
                        {p.status || "confirmed"}
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
