"use client";
import { useEffect, useRef, useState } from "react";
import { animate, createTimeline, stagger, utils } from "animejs";
import { prefersReducedMotion } from "@/lib/animations";

export default function SchedulePage() {
  const headerRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Failed to load events", err);
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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const isLeft = entry.target.classList.contains("timeline-left");
          animate(entry.target, {
            translateX: [isLeft ? -50 : 50, 0],
            opacity: [0, 1],
            duration: 800,
            easing: "easeOutBack(1.2)"
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    const items = document.querySelectorAll(".timeline-item");
    items.forEach(i => observer.observe(i));

    return () => observer.disconnect();
  }, [loading]);

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent hidden md:block"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div ref={headerRef} className="text-center mb-32">
          <h1 className="anim-elem opacity-0 text-5xl md:text-7xl lg:text-8xl font-display font-black text-white mb-6 tracking-tighter uppercase">
            Yearly <span className="text-primary text-glow-blue">Timeline</span>
          </h1>
          <p className="anim-elem opacity-0 text-xl text-foreground/80 max-w-2xl mx-auto font-semibold">
            Track our journey, upcoming workshops, and major events.
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-6 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent md:hidden"></div>
          
          {loading ? (
             <div className="flex justify-center items-center h-32">
               <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
             </div>
          ) : events.length === 0 ? (
             <div className="text-center text-foreground/60 p-8 glass rounded-2xl border border-surface-border">
               No events scheduled for this year yet.
             </div>
          ) : (
            events.map((item, idx) => {
              const isEven = idx % 2 === 0;
              const dateObj = new Date(item.date);
              const dateStr = dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" });
              
              return (
                <div key={item._id} className={`timeline-item opacity-0 flex flex-col md:flex-row w-full mb-16 relative ${isEven ? "md:justify-start timeline-left" : "md:justify-end timeline-right"}`}>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary glow-blue hidden md:block z-20"></div>
                  <div className="absolute left-6 top-8 -translate-x-1/2 w-4 h-4 rounded-full bg-primary glow-blue md:hidden z-20"></div>

                  <div className={`w-full md:w-[45%] pl-16 md:pl-0 ${isEven ? "md:pr-16 text-left md:text-right" : "md:pl-16 text-left"}`}>
                    <div className="glass p-8 rounded-2xl border border-surface-border hover-perspective group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <span className="text-primary font-bold tracking-widest uppercase text-sm mb-3 block">{dateStr}</span>
                      <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-foreground/70 font-medium leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
