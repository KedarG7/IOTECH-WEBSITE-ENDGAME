"use client";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { prefersReducedMotion, animateCounter } from "@/lib/animations";

export default function AboutSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const statsRef = useRef(null);
  
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        
        const tl = animate.timeline({ easing: "easeOutExpo" });

        tl.add({
          targets: headingRef.current,
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 800
        })
        .add({
          targets: textRef.current.querySelectorAll("p"),
          opacity: [0, 1],
          translateX: [-30, 0],
          duration: 800,
          delay: stagger(200)
        }, "-=400")
        .add({
          targets: statsRef.current.querySelectorAll(".stat-card"),
          opacity: [0, 1],
          scale: [0.8, 1],
          translateY: [20, 0],
          duration: 800,
          delay: stagger(150),
          begin: () => {
            const numbers = statsRef.current.querySelectorAll(".stat-num");
            numbers.forEach(el => {
              const target = parseInt(el.getAttribute("data-target"), 10);
              animateCounter(el, 0, target, 2500);
            });
          }
        }, "-=400");
      }
    }, { threshold: 0.3 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    
    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: "Members", value: 25, suffix: "+" },
    { label: "Events", value: 10, suffix: "+" },
    { label: "Workshops", value: 5, suffix: "+" },
    { label: "Projects", value: 5, suffix: "+" },
  ];

  return (
    <section ref={sectionRef} className="py-24 relative z-10 bg-background/50 backdrop-blur-md border-y border-surface-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div ref={textRef} className="space-y-6">
            <h2 ref={headingRef} className="opacity-0 text-4xl md:text-5xl font-display font-black text-white mb-8 tracking-wide">
              WHAT IS <span className="text-primary text-glow-blue">IOTECH?</span>
            </h2>
            <p className="opacity-0 text-lg md:text-xl text-foreground/80 leading-relaxed font-semibold">
              We are a collective of team of engineers, designers, and innovators. Our mission is to bridge the gap between academic theory and industry-grade engineering by providing hands on events and experiences to students. We believe in learning by doing, and we strive to create an environment where students can experiment, build, and grow their skills.
            </p>
            <p className="opacity-0 text-lg text-foreground/70 leading-relaxed">
              From IoT robotics to AI applications and full-stack platforms, we provide the environment, resources, and community for students to experiment and grow.
            </p>
          </div>

          <div ref={statsRef} className="grid grid-cols-2 gap-6">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="stat-card opacity-0 p-8 glass rounded-md border border-surface-border text-center hover-perspective glow-blue"
              >
                <div className="flex items-end justify-center mb-2">
                  <span 
                    className="stat-num text-5xl md:text-6xl font-display font-black text-white tracking-tighter" 
                    data-target={stat.value}
                  >
                    0
                  </span>
                  <span className="text-4xl font-display font-black text-primary ml-1">{stat.suffix}</span>
                </div>
                <div className="text-sm font-semibold tracking-widest text-primary/80 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
