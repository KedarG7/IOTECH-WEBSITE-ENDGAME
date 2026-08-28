"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    title: "", slug: "", category: "Workshop", description: "", date: "", time: "",
    venue: "", registrationDeadline: "", maxParticipants: 100, bannerImage: "", status: "upcoming", rules: "", prizes: ""
  });

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch event");
        
        const event = data.event;
        setFormData({
          title: event.title || "",
          slug: event.slug || "",
          category: event.category || "Workshop",
          description: event.description || "",
          date: event.date ? new Date(event.date).toISOString().slice(0,16) : "",
          time: event.time || "",
          venue: event.venue || event.location || "",
          registrationDeadline: event.registrationDeadline || "",
          maxParticipants: event.maxParticipants || 100,
          bannerImage: event.bannerImage || event.banner || "",
          status: event.status || "upcoming",
          rules: Array.isArray(event.rules) ? event.rules.join("\n") : "",
          prizes: Array.isArray(event.prizes) ? event.prizes.join("\n") : ""
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchEvent();
  }, [id]);

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
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        maxParticipants: parseInt(formData.maxParticipants) || 100,
        rules: formData.rules.split("\n").filter(Boolean),
        prizes: formData.prizes.split("\n").filter(Boolean),
        location: formData.venue
      };

      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update event");
      
      setSuccess("Event updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/events" className="p-2 text-foreground/50 hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-black text-white">Edit Event</h1>
          <p className="text-foreground/70 mt-1">Update event details.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 flex items-start gap-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 flex items-start gap-3">
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass rounded-3xl border border-surface-border p-6 sm:p-10 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Event Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">URL Slug</label>
            <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
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
          <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Date</label>
            <input required type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" style={{colorScheme:"dark"}} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Time (Text)</label>
            <input type="text" name="time" value={formData.time} onChange={handleChange} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Venue / Location</label>
            <input type="text" name="venue" value={formData.venue} onChange={handleChange} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Max Participants</label>
            <input required type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} min="1" className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-foreground/70">Banner Image URL</label>
          <input type="url" name="bannerImage" value={formData.bannerImage} onChange={handleChange} className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
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
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-background font-bold uppercase tracking-widest rounded-xl hover:bg-primary-hover transition-all glow-blue-hover disabled:opacity-50">
            {saving ? <div className="w-5 h-5 border-2 border-background/20 border-t-background rounded-full animate-spin" /> : <Save size={18} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
