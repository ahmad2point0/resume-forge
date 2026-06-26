"use client";

import { useEffect, useState } from "react";

/** Subscribe to a CSS media query. Returns false during SSR / first paint. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Convenience: true on screens at least `md` wide. */
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
