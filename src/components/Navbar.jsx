"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, LogOut } from "lucide-react";
import { animate } from "animejs";
import Image from "next/image";
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }

    fetchUser();
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      anime({
        targets: ".mobile-menu-item",
        translateX: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 600,
        easing: "easeOutExpo"
      });
    }
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Schedule", path: "/schedule" },
    { name: "Team", path: "/team" },
    { name: "Gallery", path: "/gallery" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass-nav py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link
                href="/"
                className="flex items-center custom-cursor-hover hover-perspective"
          >
            <Image
              src="/white_text-removebg.png"
              alt="IOTech Logo"
              width={240}
              height={80}
              priority
              className="h-auto w-[240px] object-contain"
            />
            </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm font-semibold uppercase tracking-widest hover-perspective custom-cursor-hover transition-colors ${
                  pathname === link.path ? "text-primary text-glow-blue" : "text-foreground/80 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-bold uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-background"
                >
                  <User size={16} />
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 rounded-md border border-accent-violet/40 bg-accent-violet/10 px-4 py-2 text-sm font-bold uppercase tracking-widest text-accent-violet transition-colors hover:bg-accent-violet hover:text-background"
                  >
                    <User size={16} />
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 rounded-md border border-surface-border bg-surface/50 px-4 py-2 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:border-primary hover:text-primary"
                >
                  <User size={16} />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-md border border-surface-border bg-surface/50 px-4 py-2 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:border-red-500 hover:text-red-300"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-primary/10 border border-primary text-primary rounded-md font-bold uppercase tracking-widest hover:bg-primary hover:text-background transition-all hover-perspective glow-blue-hover custom-cursor-hover"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 glass bg-background/95 flex flex-col items-center justify-center space-y-8 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-menu-item text-3xl font-display font-bold text-white hover:text-primary transition-colors opacity-0"
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-menu-item text-2xl font-bold text-primary border border-primary px-8 py-3 rounded-md opacity-0"
              >
                DASHBOARD
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-menu-item text-2xl font-bold text-accent-violet border border-accent-violet px-8 py-3 rounded-md opacity-0"
                >
                  ADMIN PANEL
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-menu-item text-2xl font-bold text-white border border-surface-border px-8 py-3 rounded-md opacity-0"
              >
                PROFILE
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="mobile-menu-item text-2xl font-bold text-red-300 border border-red-500/40 px-8 py-3 rounded-md opacity-0"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-menu-item text-2xl font-bold text-primary border border-primary px-8 py-3 rounded-md opacity-0"
            >
              SIGN IN
            </Link>
          )}
        </div>
      )}
    </>
  );
}
