"use client";
import { useEffect, useRef, useState } from "react";
import anime from "animejs";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { prefersReducedMotion } from "@/lib/animations";

export default function GalleryPage() {
  const headerRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { id: 1, src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800", alt: "Hackathon Day 1", span: "col-span-1 md:col-span-2 row-span-2" },
    { id: 2, src: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800", alt: "AI Workshop", span: "col-span-1 row-span-1" },
    { id: 3, src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800", alt: "Cybersecurity CTF", span: "col-span-1 row-span-2" },
    { id: 4, src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800", alt: "Hardware Lab", span: "col-span-1 md:col-span-2 row-span-1" },
    { id: 5, src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800", alt: "Code Review", span: "col-span-1 row-span-1" },
    { id: 6, src: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800", alt: "Team Meeting", span: "col-span-1 row-span-1" },
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
            targets: entry.target,
            scale: [0.85, 1],
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: "easeOutBack(1.2)"
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll(".gallery-item");
    items.forEach(i => observer.observe(i));

    return () => observer.disconnect();
  }, []);

  const openLightbox = (img) => {
    setSelectedImage(img);
    setTimeout(() => {
      anime({
        targets: ".lightbox-overlay",
        opacity: [0, 1],
        duration: 400,
        easing: "easeOutQuad"
      });
      anime({
        targets: ".lightbox-image",
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 600,
        delay: 100,
        easing: "easeOutElastic(1, 0.8)"
      });
    }, 10);
  };

  const closeLightbox = () => {
    anime({
      targets: ".lightbox-overlay",
      opacity: [1, 0],
      duration: 300,
      easing: "easeOutQuad"
    });
    anime({
      targets: ".lightbox-image",
      scale: [1, 0.9],
      opacity: [1, 0],
      duration: 300,
      easing: "easeOutQuad",
      complete: () => setSelectedImage(null)
    });
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="text-center mb-16">
          <h1 className="anim-elem opacity-0 text-5xl md:text-7xl lg:text-8xl font-display font-black text-white mb-6 tracking-tighter uppercase">
            Memory <span className="text-primary text-glow-blue">Bank</span>
          </h1>
          <p className="anim-elem opacity-0 text-xl text-foreground/80 max-w-2xl mx-auto font-semibold">
            Capturing the moments, the events, and the students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
          {images.map((img) => (
            <div 
              key={img.id} 
              className={`gallery-item opacity-0 relative group cursor-pointer overflow-hidden rounded-2xl glass border border-surface-border custom-cursor-hover ${img.span}`}
              onClick={() => openLightbox(img)}
            >
              <Image 
                src={img.src} 
                alt={img.alt} 
                fill 
                className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay pointer-events-none" />
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <ZoomIn size={48} className="text-white scale-50 group-hover:scale-100 transition-transform duration-500 ease-out drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {selectedImage && (
        <div className="lightbox-overlay fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center opacity-0 custom-cursor-active" onClick={closeLightbox}>
          <button 
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-8 right-8 text-white hover:text-primary transition-colors z-20 custom-cursor-hover"
          >
            <X size={48} />
          </button>
          
          <div 
            className="lightbox-image opacity-0 relative w-[90vw] h-[80vh] max-w-6xl max-h-[800px] rounded-2xl overflow-hidden border border-primary/30 glow-blue shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image 
              src={selectedImage.src} 
              alt={selectedImage.alt} 
              fill 
              className="object-contain"
            />
          </div>
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 font-semibold tracking-widest uppercase text-sm">
            {selectedImage.alt}
          </p>
        </div>
      )}
    </main>
  );
}
