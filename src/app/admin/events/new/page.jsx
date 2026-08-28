"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "", slug: "", category: "Workshop", description: "", date: "", time: "10:00 AM",
    venue: "", registrationDeadline: "", maxParticipants: 100, bannerImage: "", status: "upcoming", rules: "", prizes: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title" && !formData.slug) {
      setFormData(prev => ({
        ...prev, title: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        maxParticipants: parseInt(formData.maxParticipants) || 100,
        rules: formData.rules.split("\n").filter(Boolean),
        prizes: formData.prizes.split("\n").filter(Boolean),
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create event");

      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/events" className="p-2 text-foreground/50 hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-black text-white">Create New Event</h1>
          <p className="text-foreground/70 mt-1">Fill out the details to schedule a new club event.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 flex items-start gap-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass rounded-3xl border border-surface-border p-6 sm:p-10 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Event Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="e.g. IOTECH Hackfest" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">URL Slug</label>
            <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="e.g. iotech-hackfest" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
              <option>Workshop</option><option>Hackathon</option><option>Tech Talk</option>
              <option>Seminar</option><option>Cultural</option><option>Sports</option><option>Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Description</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Event details and schedule..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Date</label>
            <input required type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" style={{colorScheme:"dark"}} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Time (Text)</label>
            <input type="text" name="time" value={formData.time} onChange={handleChange} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="e.g. 10:00 AM - 5:00 PM" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Venue / Location</label>
            <input type="text" name="venue" value={formData.venue} onChange={handleChange} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="e.g. Main Auditorium" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Max Participants</label>
            <input required type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} min="1" className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Banner Image URL</label>
          <input type="url" name="bannerImage" value={formData.bannerImage} onChange={handleChange} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="https://..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Rules (One per line)</label>
            <textarea name="rules" value={formData.rules} onChange={handleChange} rows={4} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Prizes (One per line)</label>
            <textarea name="prizes" value={formData.prizes} onChange={handleChange} rows={4} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none" />
          </div>
        </div>

        <div className="pt-6 border-t border-surface-border flex justify-end gap-4">
          <Link href="/admin/events" className="px-6 py-3 font-bold uppercase tracking-widest text-foreground/70 hover:text-white transition-colors">Cancel</Link>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-background font-bold uppercase tracking-widest rounded-xl hover:bg-primary-hover transition-all glow-blue-hover disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-background/20 border-t-background rounded-full animate-spin" /> : <Save size={18} />}
            {loading ? "Saving..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
