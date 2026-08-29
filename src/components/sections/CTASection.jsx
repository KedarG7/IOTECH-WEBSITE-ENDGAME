"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { animate } from "animejs";
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
        
        animate( contentRef.current, {
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
            <svg
          className="relative h-28 w-28 text-primary drop-shadow-[0_0_35px_var(--color-primary)] animate-flash"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13 2L3 14h7l-2 8 10-12h-7l2-8z" />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 tracking-widest leading-tight">
            GOT CRAZY<br/><span className="text-primary text-glow-blue ">IDEAS?</span>
          </h2>
          <p className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-2xl mx-auto font-semibold">
            Feel free to bring ideas to the desk ! 
            <br/>
            The weirdest & sillest ideas matter ! 
          </p>
          <Link 
            href="/login" 
            className="inline-block px-12 py-5 bg-white text-background font-bold text-lg uppercase tracking-[0.2em] rounded-sm hover:bg-gray-200 transition-colors hover-perspective custom-cursor-hover"
          >
            CONNECT
          </Link>
        </div>
      </div>
    </section>
  );
}
