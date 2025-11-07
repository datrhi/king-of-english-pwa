import { useEffect, useState } from "react";

interface ViewportState {
  height: number;
  isKeyboardOpen: boolean;
  scale: number;
}

/**
 * Hook to track visual viewport changes (e.g., when keyboard opens on mobile)
 * Uses the Visual Viewport API to detect keyboard state
 */
export function useVisualViewport() {
  const [viewportState, setViewportState] = useState<ViewportState>({
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    isKeyboardOpen: false,
    scale: 1,
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) {
      return;
    }

    // Store initial viewport height to compare against
    const initialHeight = window.innerHeight;
    const threshold = 150; // Minimum height difference to consider keyboard open

    const handleViewportChange = () => {
      if (!window.visualViewport) return;

      const currentHeight = window.visualViewport.height;
      const heightDiff = initialHeight - currentHeight;
      const isKeyboardOpen = heightDiff > threshold;

      setViewportState({
        height: currentHeight,
        isKeyboardOpen,
        scale: window.visualViewport.scale,
      });
    };

    // Listen to both resize and scroll events
    // Scroll event is important for iOS devices
    window.visualViewport.addEventListener("resize", handleViewportChange);
    window.visualViewport.addEventListener("scroll", handleViewportChange);

    // Initial call
    handleViewportChange();

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleViewportChange
        );
        window.visualViewport.removeEventListener(
          "scroll",
          handleViewportChange
        );
      }
    };
  }, []);

  return viewportState;
}
