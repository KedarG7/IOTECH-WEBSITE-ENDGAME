"use client";

import { useEffect, useState } from "react";

export default function LoadingOverlay() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Ensure the overlay only renders after client hydration
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm transition-opacity duration-500">
      {/* Outer glow ring */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-44 w-44 rounded-full bg-primary/10 animate-ping" />
        <div className="absolute h-32 w-32 rounded-full bg-primary/5 animate-pulse" />

        {/* Lightning bolt */}
        <svg
          className="relative h-28 w-28 text-primary drop-shadow-[0_0_35px_var(--color-primary)] animate-flash"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13 2L3 14h7l-2 8 10-12h-7l2-8z" />
        </svg>
      </div>

      {/* Tagline */}
      <p className="mt-10 text-xs uppercase tracking-[0.5em] text-primary/70 font-semibold animate-pulse">
        Loading...
      </p>

      {/* Inline keyframes for the flash effect */}
      <style jsx>{`
        @keyframes flash {
          0%,
          100% {
            opacity: 1;
            filter: drop-shadow(0 0 12px var(--color-primary));
            transform: scale(1);
          }
          25% {
            opacity: 0.2;
            filter: drop-shadow(0 0 50px var(--color-primary));
            transform: scale(1.08);
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 20px var(--color-primary));
            transform: scale(0.96);
          }
          75% {
            opacity: 0.4;
            filter: drop-shadow(0 0 40px var(--color-primary));
            transform: scale(1.04);
          }
        }
        .animate-flash {
          animation: flash 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
