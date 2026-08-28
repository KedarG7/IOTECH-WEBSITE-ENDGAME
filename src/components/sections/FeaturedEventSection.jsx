"use client";
import { useEffect, useState, useRef } from "react";
import { animate } from "animejs";
import Link from "next/link";
import { prefersReducedMotion } from "@/lib/animations";

export default function FeaturedEventSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({ d: "00", h: "00", m: "00", s: "00" });
  const hasAnimated = useRef(false);

  const targetDate = new Date("2026-08-24T09:00:00").getTime();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        d: days.toString().padStart(2, "0"),
        h: hours.toString().padStart(2, "0"),
        m: minutes.toString().padStart(2, "0"),
        s: seconds.toString().padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        
        animate(contentRef.current, {
          
          opacity: [0, 1],
          translateY: [40, 0],
          scale: [0.97, 1],
          duration: 1000,
          easing: "easeOutExpo"
        });
      }
    }, { threshold: 0.2 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative z-10 px-6">
      <div 
        ref={contentRef}
        className="max-w-6xl mx-auto opacity-0 glass rounded-2xl border border-primary/30 p-8 md:p-16 relative overflow-hidden group hover-perspective glow-blue transition-all duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-[2] transition-transform duration-1000 ease-out" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-1 border border-primary text-primary font-bold tracking-widest uppercase text-xs rounded-full mb-6 bg-primary/10">
              Featured Event
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-4 text-glow-blue leading-tight tracking-tighter">
              IOTECH<br/>HACKFEST
            </h2>
            <p className="text-xl text-foreground/80 mb-8 font-semibold tracking-wide">
              48 HOURS OF BUILDING. INNOVATION. GLORY.
            </p>
            <Link 
              href="/events/iotech-hackfest" 
              className="inline-block px-10 py-4 bg-primary text-background font-bold uppercase tracking-widest rounded-sm hover:bg-primary-hover transition-colors custom-cursor-hover"
            >
              Register Now
            </Link>
          </div>

          <div className="flex flex-col items-center lg:items-end justify-center">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-6 font-bold">Hackathon begins in</p>
            <div className="flex space-x-3 md:space-x-6 text-center">
              {[
                { label: "Days", val: timeLeft.d },
                { label: "Hours", val: timeLeft.h },
                { label: "Mins", val: timeLeft.m },
                { label: "Secs", val: timeLeft.s },
              ].map((time, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-24 md:h-24 glass rounded-lg flex items-center justify-center border border-white/10 mb-3 shadow-lg">
                    <span className="text-3xl md:text-5xl font-display font-black text-white">{time.val}</span>
                  </div>
                  <span className="text-xs uppercase tracking-widest font-semibold text-foreground/60">{time.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
