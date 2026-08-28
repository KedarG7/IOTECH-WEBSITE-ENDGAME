"use client";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/animations";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const isHoveringRef = useRef(false);
  
  useEffect(() => {
    if (prefersReducedMotion() || typeof window === "undefined") return;
    
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    
    let cursorX = 0;
    let cursorY = 0;
    let animationFrameId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const updateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      
      // Combine translation and scale directly in JS so they don't overwrite each other
      const currentScale = isHoveringRef.current ? 2 : 1;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(${currentScale})`;
      animationFrameId = requestAnimationFrame(updateCursor);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === "button" || 
        target.tagName.toLowerCase() === "a" ||
        target.closest(".custom-cursor-hover") ||
        target.closest("a") ||
        target.closest("button")
      ) {
        isHoveringRef.current = true;
        setIsHovering(true);
      } else {
        isHoveringRef.current = false;
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    animationFrameId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  // Base cursor is w-4 h-4. When hovering, JS scales it by 3x (w-12 h-12)
  return (
    <div 
      ref={cursorRef} 
      className={`fixed top-0 left-0 w-4 h-4 -ml-2 -mt-2 rounded-full pointer-events-none z-[100] mix-blend-difference transition-colors duration-300 ease-out flex items-center justify-center
        ${isHovering ? "bg-primary/90 border border-primary" : "bg-white/90 border border-white"}`}
      style={{ willChange: "transform" }}
    >
      {isHovering && (
        <span className="text-[3px] font-bold text-background tracking-widest opacity-90 uppercase" style={{ transform: "scale(0.5)" }}>
          
        </span>
      )}
    </div>
  );
}
