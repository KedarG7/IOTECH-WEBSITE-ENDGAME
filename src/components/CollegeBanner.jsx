"use client";
import { useEffect, useRef } from "react";
import { animate } from "animejs";
import Image from "next/image";

export default function CollegeBanner() {
  const bannerRef = useRef(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    animate(bannerRef.current, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 1400,
      easing: "easeOutQuart",
      delay: 150,
    });
  }, []);

  return (
    <div
      ref={bannerRef}
      className="relative group mx-auto max-w-fit cursor-default opacity-0"
    >
      {/* Minimalist ambient background glow (only visible on hover) */}
      <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
      
      {/* Liquid Glass Container */}
      <div className="relative z-10 flex flex-row items-center gap-3 sm:gap-5 bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-[24px] px-4 py-2 sm:px-8 sm:py-3 rounded-2xl sm:rounded-full border border-white/10 hover:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-700 max-w-[92vw] sm:max-w-none">
        
        {/* Glossy top edge reflection (Liquid surface effect) */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] pointer-events-none" />
        
        {/* Logo */}
        <div className="relative shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 transform transition-transform duration-700 group-hover:scale-105">
          <Image
            src="/sigce logo.png"
            alt="Smt. Indira Gandhi College Of Engineering Logo"
            fill
            sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 56px"
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>

        {/* Minimalist Divider */}
        <div className="block w-[1px] h-8 sm:h-10 bg-gradient-to-b from-transparent via-white/20 to-transparent transition-opacity duration-500 group-hover:via-white/40" />

        {/* Text Area */}
        <div className="flex flex-col justify-center text-left z-10">
          <span className="text-[8px] sm:text-[9px] font-medium tracking-[0.2em] text-white/40 uppercase mb-0.5 transition-colors duration-500 group-hover:text-primary/70">
            In Association With
          </span>
          <h2 className="text-[10px] sm:text-xs md:text-sm lg:text-base font-display font-bold text-white/90 tracking-wider sm:tracking-widest uppercase transition-colors duration-500 group-hover:text-white leading-tight">
            Smt. Indira Gandhi
            <span className="block text-[9px] sm:text-[10px] md:text-xs text-white/60 font-medium tracking-wide sm:tracking-widest mt-0.5 transition-colors duration-500 group-hover:text-white/90">
              College Of Engineering
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
}
