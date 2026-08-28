"use client";
import { useState, useRef, useEffect } from "react";
import anime from "animejs";
import { prefersReducedMotion } from "@/lib/animations";

export default function DomainsSection() {
  const [activeDomain, setActiveDomain] = useState(null);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  const domains = [
    { id: "01", name: "AI / ML", tech: "Python, TensorFlow, PyTorch", desc: "Building intelligent systems and predictive models." },
    { id: "02", name: "IoT", tech: "C++, Arduino, Raspberry Pi", desc: "Connecting the physical world with digital networks." },
    { id: "03", name: "Web Development", tech: "React, Next.js, Node.js", desc: "Crafting scalable and interactive web platforms." },
    { id: "04", name: "Cybersecurity", tech: "Kali Linux, Wireshark, Metasploit", desc: "Securing systems and ethical hacking." },
    { id: "05", name: "Blockchain", tech: "Solidity, Web3.js, Ethereum", desc: "Decentralized applications and smart contracts." },
    { id: "06", name: "Robotics", tech: "ROS, Python, C++", desc: "Designing autonomous mechanical systems." },
    { id: "07", name: "Cloud", tech: "AWS, Docker, Kubernetes", desc: "Deploying and scaling distributed architectures." },
    { id: "08", name: "UI/UX", tech: "Figma, Framer", desc: "Designing premium user interfaces and experiences." },
  ];

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        
        anime({
          targets: ".domain-item",
          opacity: [0, 1],
          translateX: [-30, 0],
          duration: 800,
          delay: anime.stagger(100),
          easing: "easeOutExpo"
        });
      }
    }, { threshold: 0.1 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative z-10 border-t border-surface-border bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-16 tracking-wide text-center">
          OUR <span className="text-primary text-glow-blue">DOMAINS</span>
        </h2>

        <div className="flex flex-col space-y-2 max-w-4xl mx-auto">
          {domains.map((domain) => (
            <div
              key={domain.id}
              className="domain-item opacity-0 group relative border-b border-surface-border last:border-0"
              onMouseEnter={() => setActiveDomain(domain.id)}
              onMouseLeave={() => setActiveDomain(null)}
            >
              <div className="flex items-center justify-between py-6 cursor-pointer custom-cursor-hover">
                <div className="flex items-center space-x-6">
                  <span className="text-sm font-display font-black text-foreground/40 group-hover:text-primary transition-colors duration-300">
                    {domain.id}
                  </span>
                  <span className="text-2xl md:text-4xl font-display font-bold text-white group-hover:translate-x-4 transition-transform duration-300">
                    {domain.name}
                  </span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block text-right">
                  <span className="text-xs tracking-[0.2em] text-primary uppercase font-bold">Explore</span>
                </div>
              </div>

              {/* Expandable Content */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  activeDomain === domain.id ? "max-h-48 opacity-100 mb-6" : "max-h-0 opacity-0"
                }`}
              >
                <div className="pl-12 md:pl-16 pr-6">
                  <p className="text-foreground/80 mb-2 font-semibold text-lg">{domain.desc}</p>
                  <p className="text-primary/80 text-sm tracking-widest uppercase font-bold">{domain.tech}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
