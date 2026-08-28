import { animate } from "animejs";
import { useEffect, useRef } from "react";

// Check if user prefers reduced motion for accessibility
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Basic Fade Up
export const animateFadeInUp = (targets, delay = 0) => {
  if (prefersReducedMotion()) return animate.set(targets, { opacity: 1, translateY: 0 });
  return animate({
    targets,
    translateY: [40, 0],
    opacity: [0, 1],
    duration: 800,
    easing: "easeOutExpo",
    delay,
  });
};

// Staggered Grid Reveal
export const animateStaggerReveal = (targets, staggerDelay = 100) => {
  if (prefersReducedMotion()) return animate.set(targets, { opacity: 1, scale: 1 });
  return animate({
    targets,
    opacity: [0, 1],
    scale: [0.95, 1],
    translateY: [20, 0],
    duration: 800,
    delay: animate.stagger(staggerDelay),
    easing: "easeOutElastic(1, 0.8)",
  });
};

// Counter Animation for stats
export const animateCounter = (target, start, end, duration = 2000) => {
  const obj = { val: start };
  return animate({
    targets: obj,
    val: end,
    duration,
    easing: "easeOutExpo",
    round: 1,
    update: function() {
      if (target) target.innerHTML = obj.val;
    }
  });
};

// React Hook for intersection-based scroll reveal
export const useScrollReveal = (animationFn, options = { threshold: 0.2 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animationFn(el);
        observer.unobserve(el);
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [animationFn, options]);

  return ref;
};

// React Hook for Mouse Magnetic Effect on Buttons/Cards
export const useMagneticEffect = (strength = 0.3) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const move = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      animate({
        targets: el,
        translateX: x * strength,
        translateY: y * strength,
        scale: 1.05,
        duration: 400,
        easing: "easeOutExpo"
      });
    };

    const leave = () => {
      animate({
        targets: el,
        translateX: 0,
        translateY: 0,
        scale: 1,
        duration: 800,
        easing: "easeOutElastic(1, 0.5)"
      });
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);

    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [strength]);

  return ref;
};

// General Page Transition In
export const pageTransitionIn = () => {
  if (prefersReducedMotion()) return;
  return animate({
    targets: "main",
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 600,
    easing: "easeOutExpo"
  });
};
