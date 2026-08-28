"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import anime from "animejs";
import { prefersReducedMotion } from "@/lib/animations";

export default function CTASection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        
        anime({
          targets: contentRef.current,
          opacity: [0, 1],
          scale: [0.95, 1],
          translateY: [50, 0],
          duration: 1200,
          easing: "easeOutElastic(1, 0.8)"
        });
      }
    }, { threshold: 0.3 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 relative z-10 px-6 border-t border-surface-border">
      <div 
        ref={contentRef}
        className="max-w-5xl mx-auto opacity-0 glass rounded-3xl border border-primary/20 p-12 md:p-24 text-center relative overflow-hidden group glow-blue"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 tracking-tighter leading-tight">
            READY TO BUILD <br/><span className="text-primary text-glow-blue">SOMETHING?</span>
          </h2>
          <p className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-2xl mx-auto font-semibold">
            Join a community of students who learn, experiment and create.
          </p>
          <Link 
            href="/login" 
            className="inline-block px-12 py-5 bg-white text-background font-bold text-lg uppercase tracking-[0.2em] rounded-sm hover:bg-gray-200 transition-colors hover-perspective custom-cursor-hover"
          >
            JOIN IOTECH
          </Link>
        </div>
      </div>
    </section>
  );
}
