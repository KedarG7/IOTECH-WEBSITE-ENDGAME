"use client";
import { useEffect, useState, useRef } from "react";
import { animate, createTimeline, stagger, utils } from "animejs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Clock, Users, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { prefersReducedMotion } from "@/lib/animations";

const fallbackEvent = {
  _id: null,
  title: "IOTECH HACKFEST 2026",
  slug: "iotech-hackfest",
  description: "Our flagship 48-hour hackathon. Build innovative solutions, win prizes, and connect with industry leaders. Whether you're a seasoned developer or a first-time hacker, this is the place to be. We provide the food, the space, and the mentors. You bring the ideas.\n\nSchedule:\nDay 1: Ideation & Prototyping\nDay 2: MVP Development & Workshops\nDay 3: Final Pitches & Judging\n\nPrizes:\n1st Place: $1,000 + Tech Gear\n2nd Place: $500\n3rd Place: $250\n\nDon't miss the biggest campus tech event of the year!",
  date: new Date("2026-08-24T09:00:00").toISOString(),
  location: "Main Campus Auditorium",
  category: "Hackathon",
  status: "upcoming",
  registeredCount: 45,
  maxParticipants: 150,
  bannerImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000"
};

export default function EventDetailsClient({ slug }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState("");
  const [user, setUser] = useState(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${slug}`);
        const data = await res.json();
        if (data.success && data.event) {
          setEvent(data.event);
        } else {
          setEvent(fallbackEvent);
        }
      } catch {
        setEvent(fallbackEvent);
      } finally {
        setLoading(false);
      }
    }

    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
          if (data.user) {
            setAuthError("");
          }
        }
      } catch {
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    }

    fetchEvent();
    fetchUser();
  }, [slug]);

  useEffect(() => {
    if (loading || !event || prefersReducedMotion()) return;

    const tl = createTimeline({ easing: "easeOutExpo" });

    tl.add(heroRef.current, {
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 1000
    })
    .add(contentRef.current.querySelectorAll(".anim-content"), {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      delay: stagger(150)
    }, "-=600");

  }, [loading, event]);

  const handleRegister = async () => {
    if (!user) {
      router.push(`/login?redirect=/events/${slug}`);
      return;
    }

    if (!user.email?.endsWith("@sigce.edu.in")) {
      setAuthError("Only SIGCE students can register for this event.");
      return;
    }

    if (!event?._id) {
      setAuthError("This event is unavailable for registration right now.");
      return;
    }

    setRegistering(true);
    setAuthError("");

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event?._id })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to register for this event.");
      }

      setRegistered(true);
      animate(".success-modal", {
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 600,
        easing: "easeOutElastic(1, 0.8)"
      });
    } catch (error) {
      setAuthError(error.message || "Unable to register for this event.");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) return <div className="min-h-screen pt-32 text-center text-white">Event not found</div>;

  const eventDate = new Date(event.date);
  const capacityPercent = Math.min(100, ((event.registeredCount || 0) / (event.maxParticipants || 100)) * 100);

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <Link href="/events" className="inline-flex items-center text-primary hover:text-white transition-colors mb-8 uppercase tracking-widest text-sm font-bold custom-cursor-hover">
          <ArrowLeft size={16} className="mr-2" /> Back to Events
        </Link>

        {/* Hero Banner Section */}
        <div ref={heroRef} className="opacity-0 w-full h-[400px] md:h-[500px] relative rounded-3xl overflow-hidden mb-12 glass border border-surface-border group">
          <Image 
            src={event.bannerImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000"} 
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
            <div className="inline-block px-4 py-1 border border-primary text-primary font-bold tracking-widest uppercase text-xs rounded-full mb-4 bg-primary/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,210,255,0.3)]">
              {event.category}
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-tight text-glow-blue tracking-tighter">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="anim-content opacity-0 prose prose-invert prose-lg max-w-none">
              <h3 className="text-3xl font-display font-bold text-white mb-6">About this event</h3>
              {event.description.split('\n').map((para, idx) => (
                <p key={idx} className="text-foreground/80 leading-relaxed font-medium mb-4">{para}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="anim-content opacity-0 glass rounded-2xl p-8 border border-surface-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <h3 className="text-xl font-display font-bold text-white mb-8 uppercase tracking-widest border-b border-surface-border pb-4">Details</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Calendar size={24} className="text-primary mr-4 shrink-0" />
                  <div>
                    <p className="text-white font-bold tracking-wide">{eventDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-foreground/50 text-sm mt-1 uppercase tracking-widest font-semibold">Date</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock size={24} className="text-primary mr-4 shrink-0" />
                  <div>
                    <p className="text-white font-bold tracking-wide">{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-foreground/50 text-sm mt-1 uppercase tracking-widest font-semibold">Time</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin size={24} className="text-primary mr-4 shrink-0" />
                  <div>
                    <p className="text-white font-bold tracking-wide">{event.location}</p>
                    <p className="text-foreground/50 text-sm mt-1 uppercase tracking-widest font-semibold">Location</p>
                  </div>
                </div>

                <div className="flex items-start pt-4 border-t border-surface-border">
                  <Users size={24} className="text-primary mr-4 shrink-0" />
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-white font-bold">{event.registeredCount || 0} / {event.maxParticipants || 100}</p>
                      <p className="text-foreground/50 text-xs uppercase tracking-widest font-semibold">Registered</p>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full h-2 bg-surface-border rounded-full overflow-hidden mt-3">
                      <div 
                        className="h-full bg-primary rounded-full relative" 
                        style={{ width: `${capacityPercent}%` }}
                      >
                        <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="anim-content opacity-0">
              {!registered ? (
                <>
                  <button 
                    onClick={handleRegister}
                    disabled={registering || capacityPercent >= 100 || !authChecked || !event?._id}
                    className="w-full py-5 bg-primary text-background font-bold text-lg uppercase tracking-[0.2em] rounded-xl hover:bg-primary-hover transition-all hover-perspective glow-blue-hover disabled:opacity-50 disabled:cursor-not-allowed custom-cursor-hover"
                  >
                    {registering ? "Confirming..." : !authChecked ? "Checking access..." : !event?._id ? "Unavailable" : capacityPercent >= 100 ? "Sold Out" : user ? "Register Now" : "Login to Register"}
                  </button>
                  {authError && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      <AlertCircle size={18} className="mt-0.5 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="success-modal opacity-0 w-full py-5 glass border border-green-500/50 text-green-400 font-bold text-lg uppercase tracking-widest rounded-xl flex items-center justify-center glow-blue bg-green-500/10">
                  <CheckCircle2 size={24} className="mr-3" /> Ticket Confirmed
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
