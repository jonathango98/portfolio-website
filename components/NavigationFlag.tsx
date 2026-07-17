"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

/**
 * Marks <html> with .navigated after the first client-side route change,
 * so entrance animations only play on a real page load — not when
 * crossfading between Work and Life.
 */
export default function NavigationFlag() {
  const pathname = usePathname();
  const initialLoad = useRef(true);

  useLayoutEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    document.documentElement.classList.add("navigated");
  }, [pathname]);

  return null;
}
