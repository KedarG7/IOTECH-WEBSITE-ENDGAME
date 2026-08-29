"use client";
import { useEffect, useRef } from "react";
import { createTimeline, stagger, utils } from "animejs";
import Link from "next/link";
import { prefersReducedMotion } from "@/lib/animations";
import SpinningLogo from "../SpinningLogo";
import CollegeBanner from "../CollegeBanner";

export default function HeroSection() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const titleChars = titleRef.current?.querySelectorAll(".char");
    if (!titleChars || titleChars.length === 0) return;

    if (prefersReducedMotion()) {
      utils.set(titleChars, { opacity: 1, translateY: 0, rotateX: 0 });
      utils.set(subtitleRef.current, { opacity: 1, translateY: 0 });
      utils.set(ctaRef.current, { opacity: 1, scale: 1 });
      return;
    }

    // Set initial hidden state
    utils.set(titleChars, { opacity: 0, translateY: 80, rotateX: -90 });
    utils.set(subtitleRef.current, { opacity: 0, translateY: 20 });
    utils.set(ctaRef.current, { opacity: 0, scale: 0.9 });

    const tl = createTimeline({
      defaults: { ease: "out(4)" },
    });

    tl.add(titleChars, {
      translateY: [80, 0],
      rotateX: [-90, 0],
      opacity: [0, 1],
      duration: 1200,
      delay: stagger(100, { start: 200 }),
    })
      .add(subtitleRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
      }, "-=600")
      .add(ctaRef.current, {
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 800,
      }, "-=600");
  }, []);

  const splitText = (text) => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block origin-bottom"
        style={{ opacity: 0 }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-12">
      {/* College branding banner - placed in normal flow to prevent overlap */}
      <div className="w-full max-w-4xl mx-auto z-30 mb-8 sm:mb-12">
        <CollegeBanner />
      </div>

      <div
        className="z-10 w-full max-w-5xl mx-auto flex flex-col items-center flex-1 justify-center"
        style={{ perspective: "1000px" }}
      >
        {/* Animated logo above the title */}
        <div className="mb-4">
          <SpinningLogo />
        </div>

        <h1
          ref={titleRef}
          className="text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] font-display font-black text-primary mb-2 text-glow-blue tracking-tighter leading-none"
        >
          {splitText("IOTECH")}
        </h1>

        <div
          ref={subtitleRef}
          className="flex flex-col items-center mt-6"
          style={{ opacity: 0 }}
        >
          <p className="text-xl md:text-3xl font-semibold max-w-3xl text-white mb-6 tracking-widest uppercase">
            Build. Innovate. Connect.
          </p>
          <p className="text-lg md:text-xl max-w-2xl text-foreground/80 mb-12">
            A student-driven technical club where we build ideas, skills and
            experiences beyond the classroom.
          </p>
        </div>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-6"
          style={{ opacity: 0 }}
        >
          <Link
            href="/events"
            className="px-10 py-4 bg-primary text-background font-bold rounded-sm hover-perspective glow-blue-hover custom-cursor-hover tracking-widest uppercase border border-primary"
          >
            Explore Events
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60">
       
      </div>
    </section>
  );
}
