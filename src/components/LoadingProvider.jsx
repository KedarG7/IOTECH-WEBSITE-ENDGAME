"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay";

const LoadingContext = createContext({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export function useLoading() {
  return useContext(LoadingContext);
}

export default function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true); // true on first mount
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);

  // ---------- Initial page load ----------
  useEffect(() => {
    const dismiss = () => setIsLoading(false);

    if (document.readyState === "complete") {
      // Give a tiny moment so the flash animation plays
      const id = setTimeout(dismiss, 600);
      return () => clearTimeout(id);
    }

    window.addEventListener("load", dismiss);
    return () => window.removeEventListener("load", dismiss);
  }, []);

  // ---------- Route change detection ----------
  useEffect(() => {
    // Show loader on every client-side navigation
    setIsLoading(true);

    // Hide it once the new route's components have mounted
    const id = requestAnimationFrame(() => {
      // Wait one more frame so React finishes rendering
      requestAnimationFrame(() => setIsLoading(false));
    });

    return () => cancelAnimationFrame(id);
    // Re-run when the path or query string changes
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {isLoading && <LoadingOverlay />}
      {children}
    </LoadingContext.Provider>
  );
}
