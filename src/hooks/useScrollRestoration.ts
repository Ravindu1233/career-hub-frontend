import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions: Record<string, number> = {};

export const useScrollRestoration = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if this is a navigation to the same page
    // (e.g., clicking the navbar link when already on that page)
    const currentPath = location.pathname;
    const currentScroll = window.scrollY;

    // If we're at the same path and clicked the link again, scroll to top
    // This is detected by checking if the state indicates a fresh navigation
    if (location.state?.scrollToTop || currentScroll === 0) {
      window.scrollTo(0, 0);
      delete scrollPositions[currentPath]; // Clear saved position
      return;
    }

    // Check if we have a saved position for this route
    const savedPosition = scrollPositions[currentPath];

    if (savedPosition !== undefined) {
      // Restore saved position
      window.scrollTo(0, savedPosition);
    } else {
      // No saved position = first visit, scroll to top
      window.scrollTo(0, 0);
    }

    // Save scroll position on scroll
    const handleScroll = () => {
      scrollPositions[currentPath] = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      // Save position when leaving this route
      scrollPositions[currentPath] = window.scrollY;
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname, location.key]); // Added location.key to detect same-page navigation
};
