
"use client";

import { useState, useRef, useEffect } from "react";
import { animate, stagger } from "animejs";
import { prefersReducedMotion } from "@/lib/animations";

export default function DomainsSection() {
  const [activeDomain, setActiveDomain] = useState(null);

  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  const domains = [
    {
      id: "01",
      name: "AI / ML",
      tech: "Python, TensorFlow, PyTorch",
      desc: "Building intelligent systems and predictive models.",
    },
    {
      id: "02",
      name: "IoT",
      tech: "C++, Arduino, Raspberry Pi",
      desc: "Connecting the physical world with digital networks.",
    },
    {
      id: "03",
      name: "Web Development",
      tech: "React, Next.js, Node.js",
      desc: "Crafting scalable and interactive web platforms.",
    },
    {
      id: "04",
      name: "Cybersecurity",
      tech: "Kali Linux, Wireshark, Metasploit",
      desc: "Securing systems through ethical hacking and defensive security.",
    },
    {
      id: "05",
      name: "Blockchain",
      tech: "Solidity, Web3.js, Ethereum",
      desc: "Exploring decentralized applications and smart contracts.",
    },
    {
      id: "06",
      name: "Robotics",
      tech: "ROS, Python, C++",
      desc: "Designing autonomous and intelligent mechanical systems.",
    },
    {
      id: "07",
      name: "Cloud",
      tech: "AWS, Docker, Kubernetes",
      desc: "Deploying and scaling modern distributed architectures.",
    },
    {
      id: "08",
      name: "UI/UX",
      tech: "Figma, Framer",
      desc: "Designing premium digital interfaces and experiences.",
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    /*
     * Respect user's reduced-motion preference.
     */
    if (prefersReducedMotion()) {
      section
        .querySelectorAll(".domain-item")
        .forEach((element) => {
          element.style.opacity = "1";
        });

      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) {
          return;
        }

        hasAnimated.current = true;

        const items = section.querySelectorAll(".domain-item");

        /*
         * Anime.js v4
         *
         * ❌ animate({
         *      targets: ...
         *    })
         *
         * ✅ animate(target, {...})
         */
        animate(items, {
          opacity: [0, 1],
          x: [-30, 0],
          duration: 800,
          delay: stagger(100),
          ease: "out(4)",
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
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
      id="domains"
      className="
        relative
        z-10
        overflow-hidden
        border-t
        border-surface-border
        bg-background
        py-24
        md:py-32
      "
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-20
          h-80
          w-80
          -translate-x-1/2
          rounded-full
          bg-primary/5
          blur-[120px]
        "
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* =========================
            SECTION HEADER
        ========================== */}
        <div className="mb-16 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-primary/50" />

            <span
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.3em]
                text-primary
              "
            >
              What We Explore
            </span>

            <span className="h-px w-8 bg-primary/50" />
          </div>

          <h2
            className="
              text-4xl
              font-black
              tracking-tight
              text-white
              sm:text-5xl
              md:text-6xl
            "
          >
            OUR{" "}
            <span
              className="
                text-primary
                [text-shadow:0_0_25px_rgba(59,130,246,0.45)]
              "
            >
              DOMAINS
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-base
              leading-7
              text-foreground/60
              md:text-lg
            "
          >
            Explore the technologies and disciplines where
            our community learns, experiments, and builds.
          </p>
        </div>

        {/* =========================
            DOMAIN LIST
        ========================== */}
        <div className="mx-auto max-w-5xl">
          {domains.map((domain) => {
            const isActive = activeDomain === domain.id;

            return (
              <div
                key={domain.id}
                className="
                  domain-item
                  group
                  relative
                  border-b
                  border-surface-border
                  opacity-0
                  last:border-b-0
                "
                onMouseEnter={() =>
                  setActiveDomain(domain.id)
                }
                onMouseLeave={() =>
                  setActiveDomain(null)
                }
              >
                {/* Main row */}
                <div
                  className="
                    flex
                    cursor-pointer
                    items-center
                    justify-between
                    gap-6
                    py-6
                    md:py-8
                  "
                >
                  {/* Left */}
                  <div className="flex min-w-0 items-center gap-5 md:gap-8">
                    {/* Number */}
                    <span
                      className="
                        shrink-0
                        text-xs
                        font-black
                        tracking-widest
                        text-foreground/30
                        transition-colors
                        duration-300
                        group-hover:text-primary
                        md:text-sm
                      "
                    >
                      {domain.id}
                    </span>

                    {/* Domain name */}
                    <span
                      className="
                        truncate
                        text-xl
                        font-bold
                        tracking-tight
                        text-white
                        transition-all
                        duration-500
                        group-hover:translate-x-2
                        group-hover:text-primary
                        sm:text-2xl
                        md:text-4xl
                      "
                    >
                      {domain.name}
                    </span>
                  </div>

                  {/* Right side */}
                  <div
                    className="
                      hidden
                      shrink-0
                      items-center
                      gap-4
                      md:flex
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.25em]
                        text-primary/0
                        transition-all
                        duration-300
                        group-hover:text-primary
                      "
                    >
                      Explore
                    </span>

                    {/* Arrow */}
                   
                  </div>
                </div>

                {/* =========================
                    EXPANDED CONTENT
                ========================== */}
                <div
                  className={`
                    grid
                    overflow-hidden
                    transition-all
                    duration-500
                    ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${
                      isActive
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >
                  <div className="min-h-0">
                    <div className="pb-7 pl-12 pr-4 md:pb-9 md:pl-20 md:pr-12">
                      <div className="max-w-2xl">
                        <p
                          className="
                            mb-4
                            text-base
                            font-medium
                            leading-7
                            text-foreground/70
                            md:text-lg
                          "
                        >
                          {domain.desc}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                          {domain.tech
                            .split(", ")
                            .map((technology) => (
                              <span
                                key={technology}
                                className="
                                  rounded-full
                                  border
                                  border-primary/20
                                  bg-primary/5
                                  px-3
                                  py-1.5
                                  text-[10px]
                                  font-bold
                                  uppercase
                                  tracking-wider
                                  text-primary/80
                                  md:text-xs
                                "
                              >
                                {technology}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover indicator */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-px
                    w-0
                    bg-primary
                    shadow-[0_0_10px_rgba(59,130,246,0.6)]
                    transition-all
                    duration-500
                    group-hover:w-full
                  "
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

