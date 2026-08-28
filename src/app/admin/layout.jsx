"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, CalendarDays, ListOrdered, LogOut, ShieldCheck, Menu, X } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Timeline", href: "/admin/timeline", icon: CalendarDays },
  { label: "Manage Events", href: "/admin/events", icon: ListOrdered },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function guardAdmin() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.replace("/login?redirect=/admin"); return; }
        const data = await res.json();
        if (data.user?.role !== "admin") { router.replace("/"); return; }
      } catch { router.replace("/login?redirect=/admin"); return; }
      setChecking(false);
    }
    guardAdmin();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/"); router.refresh();
  };

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row pt-20">
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-surface-border glass sticky top-20 z-30">
        <span className="font-bold text-primary uppercase tracking-widest text-sm flex items-center gap-2">
          <ShieldCheck size={16} /> Admin Panel
        </span>
        <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <aside className={"fixed md:sticky top-20 left-0 z-20 h-[calc(100vh-5rem)] w-64 border-r border-surface-border glass flex flex-col transition-transform duration-300 " + (sidebarOpen ? "translate-x-0" : "-translate-x-full") + " md:translate-x-0"}>
        <div className="p-6 border-b border-surface-border hidden md:flex items-center gap-2">
          <ShieldCheck size={18} className="text-primary" />
          <span className="font-display font-black text-white uppercase tracking-widest text-sm">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={"flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all " + (isActive ? "bg-primary/10 text-primary border border-primary/30" : "text-foreground/60 hover:text-white hover:bg-white/5")}>
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-surface-border">
          <button type="button" onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}
