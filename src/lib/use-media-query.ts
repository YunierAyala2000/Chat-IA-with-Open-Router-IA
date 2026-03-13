import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(query);

    setMatches(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", handleChange);
      return () => mediaQueryList.removeEventListener("change", handleChange);
    } else {
      mediaQueryList.addListener(handleChange);
      return () => mediaQueryList.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

export function useTailwindBreakpoints() {
  const breakpoints = {
    isSm: useMediaQuery("(min-width: 640px)"),
    isMd: useMediaQuery("(min-width: 768px)"),
    isLg: useMediaQuery("(min-width: 1024px)"),
    isXl: useMediaQuery("(min-width: 1280px)"),
    is2xl: useMediaQuery("(min-width: 1536px)"),
    isMobile: useMediaQuery("(max-width: 767px)"),
    isTablet: useMediaQuery("(min-width: 768px) and (max-width: 1023px)"),
    isDesktop: useMediaQuery("(min-width: 1024px)"),
  };

  return breakpoints;
}

export function usePrefersDarkMode(): boolean {
  return useMediaQuery("(prefers-color-scheme: dark)");
}

export function useOrientation(): "portrait" | "landscape" | undefined {
  const isPortrait = useMediaQuery("(orientation: portrait)");
  const isLandscape = useMediaQuery("(orientation: landscape)");

  if (isPortrait) return "portrait";
  if (isLandscape) return "landscape";
  return undefined;
}

export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}

export function useDevicePixelRatio(): number {
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setDpr(window.devicePixelRatio || 1);

    const handleChange = () => {
      setDpr(window.devicePixelRatio || 1);
    };

    // Algunos navegadores soportan el evento change en matchMedia para DPR
    const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    return undefined;
  }, []);

  return dpr;
}
