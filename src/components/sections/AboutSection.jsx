// "use client";
// import { useEffect, useRef } from "react";
// import { animate, stagger, createTimeline } from "animejs";
// import { prefersReducedMotion, animateCounter } from "@/lib/animations";

// export default function AboutSection() {
//   const sectionRef = useRef(null);
//   const headingRef = useRef(null);
//   const textRef = useRef(null);
//   const statsRef = useRef(null);
  
//   const hasAnimated = useRef(false);

//   useEffect(() => {
//     if (prefersReducedMotion()) return;

//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting && !hasAnimated.current) {
//         hasAnimated.current = true;
        
//         const tl = animate.createTimeline({ easing: "easeOutExpo" });

//         tl.add({
//           targets: headingRef.current,
//           opacity: [0, 1],
//           translateY: [30, 0],
//           duration: 800
//         })
//         .add({
//           targets: textRef.current.querySelectorAll("p"),
//           opacity: [0, 1],
//           translateX: [-30, 0],
//           duration: 800,
//           delay: stagger(200)
//         }, "-=400")
//         .add({
//           targets: statsRef.current.querySelectorAll(".stat-card"),
//           opacity: [0, 1],
//           scale: [0.8, 1],
//           translateY: [20, 0],
//           duration: 800,
//           delay: stagger(150),
//           begin: () => {
//             const numbers = statsRef.current.querySelectorAll(".stat-num");
//             numbers.forEach(el => {
//               const target = parseInt(el.getAttribute("data-target"), 10);
//               animateCounter(el, 0, target, 2500);
//             });
//           }
//         }, "-=400");
//       }
//     }, { threshold: 0.3 });

//     if (sectionRef.current) observer.observe(sectionRef.current);
    
//     return () => observer.disconnect();
//   }, []);

//   const stats = [
//     { label: "Members", value: 25, suffix: "+" },
//     { label: "Events", value: 10, suffix: "+" },
//     { label: "Workshops", value: 5, suffix: "+" },
//     { label: "Projects", value: 5, suffix: "+" },
//   ];

//   return (
//     <section ref={sectionRef} className="py-24 relative z-10 bg-background/50 backdrop-blur-md border-y border-surface-border">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
//           <div ref={textRef} className="space-y-6">
//             <h2 ref={headingRef} className="opacity-0 text-4xl md:text-5xl font-display font-black text-white mb-8 tracking-wide">
//               WHAT IS <span className="text-primary text-glow-blue">IOTECH?</span>
//             </h2>
//             <p className="opacity-0 text-lg md:text-xl text-foreground/80 leading-relaxed font-semibold">
//               We are a collective of team of engineers, designers, and innovators. Our mission is to bridge the gap between academic theory and industry-grade engineering by providing hands on events and experiences to students. We believe in learning by doing, and we strive to create an environment where students can experiment, build, and grow their skills.
//             </p>
//             <p className="opacity-0 text-lg text-foreground/70 leading-relaxed">
//               From IoT robotics to AI applications and full-stack platforms, we provide the environment, resources, and community for students to experiment and grow.
//             </p>
//           </div>

//           <div ref={statsRef} className="grid grid-cols-2 gap-6">
//             {stats.map((stat, idx) => (
//               <div 
//                 key={idx} 
//                 className="stat-card opacity-0 p-8 glass rounded-md border border-surface-border text-center hover-perspective glow-blue"
//               >
//                 <div className="flex items-end justify-center mb-2">
//                   <span 
//                     className="stat-num text-5xl md:text-6xl font-display font-black text-white tracking-tighter" 
//                     data-target={stat.value}
//                   >
//                     0
//                   </span>
//                   <span className="text-4xl font-display font-black text-primary ml-1">{stat.suffix}</span>
//                 </div>
//                 <div className="text-sm font-semibold tracking-widest text-primary/80 uppercase">
//                   {stat.label}
//                 </div>
//               </div>
//             ))}
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, createTimeline } from "animejs";
import {
  prefersReducedMotion,
  animateCounter,
} from "@/lib/animations";

export default function AboutSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const statsRef = useRef(null);
  const hasAnimated = useRef(false);

  const stats = [
    {
      label: "Members",
      value: 25,
      suffix: "+",
    },
    {
      label: "Events",
      value: 10,
      suffix: "+",
    },
    {
      label: "Workshops",
      value: 5,
      suffix: "+",
    },
    {
      label: "Projects",
      value: 5,
      suffix: "+",
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    /*
     * If the user prefers reduced motion,
     * immediately show everything without animation.
     */
    if (prefersReducedMotion()) {
      if (headingRef.current) {
        headingRef.current.style.opacity = "1";
      }

      textRef.current
        ?.querySelectorAll("p")
        .forEach((el) => {
          el.style.opacity = "1";
        });

      statsRef.current
        ?.querySelectorAll(".stat-card")
        .forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });

      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;

        const paragraphs =
          textRef.current?.querySelectorAll("p");

        const statCards =
          statsRef.current?.querySelectorAll(".stat-card");

        const numbers =
          statsRef.current?.querySelectorAll(".stat-num");

        /*
         * Anime.js v4 Timeline
         */
        const timeline = createTimeline({
          defaults: {
            ease: "out(4)",
          },
        });

        /*
         * Heading
         */
        timeline.add(
          headingRef.current,
          {
            opacity: [0, 1],
            y: [40, 0],
            duration: 900,
          }
        );

        /*
         * Paragraphs
         */
        if (paragraphs?.length) {
          timeline.add(
            paragraphs,
            {
              opacity: [0, 1],
              x: [-30, 0],
              duration: 750,
              delay: stagger(160),
            },
            "-=500"
          );
        }

        /*
         * Statistics cards
         */
        if (statCards?.length) {
          timeline.add(
            statCards,
            {
              opacity: [0, 1],
              scale: [0.85, 1],
              y: [30, 0],
              duration: 750,
              delay: stagger(130),

              /*
               * Start counters once the cards begin appearing.
               */
              begin: () => {
                numbers?.forEach((element) => {
                  const target = Number(
                    element.dataset.target
                  );

                  animateCounter(
                    element,
                    0,
                    target,
                    1800
                  );
                });
              },
            },
            "-=450"
          );
        }
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="
        relative
        z-10
        overflow-hidden
        border-y
        border-surface-border
        bg-background/60
        py-24
        backdrop-blur-xl
        md:py-32
      "
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-32
          top-1/2
          h-96
          w-96
          -translate-y-1/2
          rounded-full
          bg-primary/10
          blur-[120px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-0
          h-80
          w-80
          rounded-full
          bg-primary/5
          blur-[100px]
        "
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
          
          {/* =========================
              CONTENT
          ========================== */}
          <div
            ref={textRef}
            className="max-w-2xl"
          >
            {/* Small label */}
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-primary" />

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.3em]
                  text-primary
                "
              >
                About IOTech
              </span>
            </div>

            {/* Heading */}
            <h2
              ref={headingRef}
              className="
                mb-8
                text-4xl
                font-black
                tracking-tight
                text-white
                opacity-0
                sm:text-5xl
                lg:text-6xl
              "
            >
              WHAT IS{" "}
              <span
                className="
                  text-primary
                  [text-shadow:0_0_25px_rgba(59,130,246,0.45)]
                "
              >
                IOTECH?
              </span>
            </h2>

            {/* Paragraphs */}
            <div className="space-y-6">
              <p
                className="
                  text-lg
                  font-medium
                  leading-8
                  text-foreground/80
                  opacity-0
                  md:text-xl
                "
              >
                We are a collective of engineers, designers,
                and innovators. Our mission is to bridge the
                gap between academic theory and
                industry-grade engineering through
                hands-on events and experiences.
              </p>

              <p
                className="
                  text-base
                  leading-7
                  text-foreground/60
                  opacity-0
                  md:text-lg
                "
              >
                From IoT and robotics to AI applications
                and full-stack platforms, we provide the
                environment, resources, and community for
                students to experiment, build, and grow.
              </p>
            </div>

            {/* Bottom accent */}
            <div className="mt-10 flex items-center gap-3">
              <div className="h-1 w-16 rounded-full bg-primary" />

              <div className="h-1 w-4 rounded-full bg-primary/40" />

              <div className="h-1 w-2 rounded-full bg-primary/20" />
            </div>
          </div>

          {/* =========================
              STATISTICS
          ========================== */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 gap-4 sm:gap-6"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="
                  stat-card
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-surface-border
                  bg-white/[0.03]
                  p-6
                  text-center
                  opacity-0
                  backdrop-blur-xl
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:border-primary/40
                  hover:bg-primary/[0.06]
                  hover:shadow-[0_0_40px_rgba(59,130,246,0.12)]
                  sm:p-8
                "
              >
                {/* Card glow */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-24
                    w-24
                    rounded-full
                    bg-primary/10
                    opacity-0
                    blur-2xl
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                />

                {/* Number */}
                <div
                  className="
                    relative
                    mb-3
                    flex
                    items-baseline
                    justify-center
                  "
                >
                  <span
                    className="
                      stat-num
                      text-5xl
                      font-black
                      tracking-tighter
                      text-white
                      sm:text-6xl
                    "
                    data-target={stat.value}
                  >
                    0
                  </span>

                  <span
                    className="
                      ml-1
                      text-3xl
                      font-black
                      text-primary
                      sm:text-4xl
                    "
                  >
                    {stat.suffix}
                  </span>
                </div>

                {/* Label */}
                <div
                  className="
                    relative
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.25em]
                    text-primary/70
                    sm:text-xs
                  "
                >
                  {stat.label}
                </div>

                {/* Bottom accent */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    h-px
                    w-0
                    -translate-x-1/2
                    bg-primary
                    transition-all
                    duration-500
                    group-hover:w-1/2
                  "
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


