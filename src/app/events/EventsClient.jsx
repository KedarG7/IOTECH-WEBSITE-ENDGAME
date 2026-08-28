"use client";
import { useEffect, useState, useRef } from "react";
import { animate, createTimeline, stagger, utils } from "animejs";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { prefersReducedMotion } from "@/lib/animations";

const fallbackEvents = [
  {
    _id: "1",
    title: "IOTECH HACKFEST 2026",
    slug: "iotech-hackfest",
    description: "Our flagship 48-hour hackathon. Build innovative solutions, win prizes, and connect with industry leaders.",
    date: new Date("2026-08-24T09:00:00").toISOString(),
    location: "Main Campus Auditorium",
    category: "Hackathon",
    status: "upcoming",
    bannerImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop"
  },
  {
    _id: "2",
    title: "Intro to Machine Learning",
    slug: "intro-ml-workshop",
    description: "A beginner-friendly workshop on building your first neural network using Python and TensorFlow. No prior AI experience required.",
    date: new Date("2026-09-05T14:00:00").toISOString(),
    location: "Tech Lab 304",
    category: "Workshop",
    status: "upcoming",
    bannerImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1000&auto=format&fit=crop"
  },
  {
    _id: "3",
    title: "Hardware Meets Web3",
    slug: "hardware-web3-symposium",
    description: "Explore the intersection of IoT devices and Blockchain networks in this advanced symposium.",
    date: new Date("2026-09-18T17:00:00").toISOString(),
    location: "Virtual & Room 101",
    category: "Tech Talk",
    status: "upcoming",
    bannerImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function EventsClient() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (data.success && data.events.length > 0) {
          setEvents(data.events);
        } else {
          setEvents(fallbackEvents);
        }
      } catch {
        setEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    if (loading || prefersReducedMotion()) return;

    animate(headerRef.current.querySelectorAll(".anim-elem"), {
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: stagger(150),
      easing: "easeOutExpo"
    });

    animate(".event-card", {
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 800,
      delay: stagger(150, { start: 300 }),
      easing: "easeOutExpo"
    });

  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="text-center mb-24">
          <h1 className="anim-elem opacity-0 text-5xl md:text-7xl lg:text-8xl font-display font-black text-white mb-6 tracking-tighter uppercase">
            Discover <span className="text-primary text-glow-blue">Events</span>
          </h1>
          <p className="anim-elem opacity-0 text-xl text-foreground/80 max-w-2xl mx-auto font-semibold">
            Join our workshops, hackathons, and tech talks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const eventDate = new Date(event.date);
            const month = eventDate.toLocaleString("default", { month: "short" }).toUpperCase();
            const day = eventDate.getDate();

            return (
              <div key={event._id} className="event-card opacity-0 glass rounded-2xl border border-surface-border overflow-hidden group hover-perspective glow-blue transition-all duration-500 flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={event.bannerImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000"} 
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 bg-primary/20 backdrop-blur-md border border-primary/50 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                    {event.category}
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col relative z-10 -mt-12 bg-background/90 backdrop-blur-xl border-t border-surface-border rounded-t-2xl">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-display font-bold text-white leading-tight group-hover:text-primary transition-colors">
                      {event.title}
                    </h2>
                    <div className="flex flex-col items-center justify-center bg-surface-card border border-surface-border rounded-lg px-4 py-2 min-w-[70px] ml-4">
                      <span className="text-sm font-bold text-primary uppercase">{month}</span>
                      <span className="text-2xl font-display font-black text-white">{day}</span>
                    </div>
                  </div>

                  <p className="text-foreground/70 mb-8 text-sm line-clamp-3 flex-grow font-medium leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-sm text-foreground/60 font-semibold">
                      <Clock size={18} className="mr-3 text-primary" />
                      {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center text-sm text-foreground/60 font-semibold">
                      <MapPin size={18} className="mr-3 text-primary" />
                      {event.location}
                    </div>
                  </div>

                  <Link 
                    href={`/events/${event.slug}`}
                    className="flex items-center justify-between w-full pt-6 border-t border-surface-border text-white group-hover:text-primary transition-colors uppercase tracking-widest font-bold text-sm custom-cursor-hover"
                  >
                    <span>View Details</span>
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
