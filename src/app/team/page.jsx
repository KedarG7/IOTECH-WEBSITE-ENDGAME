"use client";
import { useEffect, useRef } from "react";
import anime from "animejs";
import Image from "next/image";
import { Code2, Briefcase, Globe } from "lucide-react";
import { prefersReducedMotion } from "@/lib/animations";

export default function TeamPage() {
  const headerRef = useRef(null);

  const leads = [
    { name: "Charan Shetty", role: "President", domain: "IOTECH", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    { name: "Parth Narse", role: "Tech Lead", domain: "Technical", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { name: "Marcus Johnson", role: "Tech Lead", domain: "Engineering", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
    { name: "Emma Watson", role: "Design Lead", domain: "UI/UX", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
    { name: "Emma Watson", role: "Design Lead", domain: "UI/UX", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
    { name: "Emma Watson", role: "Design Lead", domain: "UI/UX", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },

  ];

  const coLeads = [
    { name: "David Kim", role: "AI/ML Co-Lead", domain: "Artificial Intelligence", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
    { name: "Priya Patel", role: "Web Dev Co-Lead", domain: "Frontend", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
    { name: "James Wilson", role: "IoT Co-Lead", domain: "Hardware", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=James" },
    { name: "Lisa Chang", role: "Cybersec Co-Lead", domain: "Security", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa" },
    { name: "Omar Farooq", role: "Cloud Co-Lead", domain: "DevOps", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar" },
    { name: "Rachel Green", role: "PR Co-Lead", domain: "Public Relations", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel" },
  ];

  useEffect(() => {
    if (prefersReducedMotion()) return;

    anime({
      targets: headerRef.current.querySelectorAll(".anim-elem"),
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: anime.stagger(150),
      easing: "easeOutExpo"
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target.querySelectorAll(".team-card"),
            translateY: [50, 0],
            opacity: [0, 1],
            scale: [0.9, 1],
            duration: 800,
            delay: anime.stagger(100),
            easing: "easeOutBack(1.2)"
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const grids = document.querySelectorAll(".team-grid");
    grids.forEach(g => observer.observe(g));

    return () => observer.disconnect();
  }, []);

  const TeamCard = ({ member }) => (
    <div className="team-card opacity-0 glass rounded-2xl p-6 border border-surface-border flex flex-col items-center text-center group hover-perspective glow-blue transition-all duration-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-primary/30 group-hover:border-primary transition-colors duration-300 relative z-10 bg-surface-card">
        <Image 
          src={member.img} 
          alt={member.name} 
          width={128} 
          height={128} 
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-primary transition-colors z-10">
        {member.name}
      </h3>
      <p className="text-primary font-semibold tracking-widest text-sm uppercase mb-3 z-10">
        {member.role}
      </p>
      <p className="text-foreground/60 text-sm mb-6 z-10">
        {member.domain}
      </p>
      
      <div className="flex space-x-4 z-10 mt-auto">
        <a href="#" className="text-foreground/40 hover:text-white transition-colors custom-cursor-hover">
          <Code2 size={20} />
        </a>
        <a href="#" className="text-foreground/40 hover:text-[#00d2ff] transition-colors custom-cursor-hover">
          <Briefcase size={20} />
        </a>
        <a href="#" className="text-foreground/40 hover:text-[#00d2ff] transition-colors custom-cursor-hover">
          <Globe size={20} />
        </a>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="text-center mb-24">
          <h1 className="anim-elem opacity-0 text-5xl md:text-7xl lg:text-8xl font-display font-black text-white mb-6 tracking-tighter">
            MEET THE <span className="text-primary text-glow-blue">MINDS</span>
          </h1>
          <p className="anim-elem opacity-0 text-xl text-foreground/80 max-w-2xl mx-auto font-semibold">
            The visionary leaders and engineers driving IOTECH forward.
          </p>
        </div>

        <div className="mb-24">
          <div className="flex items-center space-x-4 mb-12">
            <h2 className="text-3xl font-display font-bold text-white tracking-widest uppercase">Core Leads</h2>
            <div className="h-px bg-surface-border flex-grow"></div>
          </div>
          
          <div className="team-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leads.map((lead, idx) => (
              <TeamCard key={idx} member={lead} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-4 mb-12">
            <h2 className="text-3xl font-display font-bold text-white tracking-widest uppercase">Co-Leads</h2>
            <div className="h-px bg-surface-border flex-grow"></div>
          </div>
          
          <div className="team-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coLeads.map((lead, idx) => (
              <TeamCard key={idx} member={lead} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
