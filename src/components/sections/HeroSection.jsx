"use client";
import { useEffect, useRef } from "react";
import { animate, createTimeline, stagger } from "animejs";
import Link from "next/link";
import { prefersReducedMotion } from "@/lib/animations";
import SpinningLogo from "../SpinningLogo";

export default function HeroSection() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

  const tl = createTimeline({
  defaults: {
    ease: "out(4)",
  },
});

    const titleChars = titleRef.current.querySelectorAll(".char");
    
    tl.add({
      targets: titleChars,
      translateY: [80, 0],
      rotateX: [-90, 0],
      opacity: [0, 1],
      duration: 1200,
      delay: stagger(100, { start: 200 })
    })
    .add({
      targets: subtitleRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800
    }, "-=600")
    .add({
      targets: ctaRef.current,
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 800
    }, "-=600");

  }, []);

  const splitText = (text) => {
    return text.split("").map((char, i) => (
      <span key={i} className="char inline-block origin-bottom" style={{ opacity: prefersReducedMotion() ? 1 : 0 }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
      <div className="z-10 w-full max-w-5xl mx-auto flex flex-col items-center" style={{ perspective: "1000px" }}>
        <h1 
          ref={titleRef}
          className="text-7xl md:text-9xl lg:text-[10rem] font-display font-black text-primary mb-2 text-glow-blue tracking-tighter leading-none"
        >
          {/* Component to be added  */}
          <SpinningLogo />
          {splitText("IOTECH")}
        </h1>
        
        <div ref={subtitleRef} className="opacity-0 flex flex-col items-center mt-6">
          <p className="text-xl md:text-3xl font-semibold max-w-3xl text-white mb-6 tracking-widest uppercase">
            Build. Innovate. Connect.
          </p>
          <p className="text-lg md:text-xl max-w-2xl text-foreground/80 mb-12">
            A student-driven technical club where we build ideas, skills and experiences beyond the classroom.
          </p>
        </div>
        
        <div ref={ctaRef} className="opacity-0 flex flex-col sm:flex-row gap-6">
          <Link href="/events" className="px-10 py-4 bg-primary text-background font-bold rounded-sm hover-perspective glow-blue-hover custom-cursor-hover tracking-widest uppercase border border-primary">
            Explore Events
          </Link>
          {/* <Link href="/login" className="px-10 py-4 glass text-white font-bold rounded-sm border border-surface-border hover:bg-white/10 hover-perspective custom-cursor-hover tracking-widest uppercase">
            Join Community
          </Link> */}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60">
        <span className="text-[10px] uppercase tracking-[0.3em] mb-3 font-semibold text-primary">Go Beyond</span>
        <div className="w-px h-16 bg-gradient-to-b from-primary/80 to-transparent"></div>
      </div>
    </section>
  );
}
