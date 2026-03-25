import { useEffect, useRef } from "react";

const EDGE_THRESHOLD = 30;
const VELOCITY_THRESHOLD = 0.5;
const DISTANCE_RATIO = 0.4;

export function useSwipeBack(
  ref: React.RefObject<HTMLDivElement | null>,
  onBack: () => void,
  enabled: boolean = true,
) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch.clientX > EDGE_THRESHOLD) return;

      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
      isDragging = true;
      el.style.transition = "none";
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (Math.abs(dy) > Math.abs(dx) && dx < 10) {
        isDragging = false;
        el.style.transform = "";
        el.style.transition = "";
        return;
      }

      if (dx > 0) {
        e.preventDefault();
        el.style.transform = `translateX(${dx}px)`;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return;
      isDragging = false;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const elapsed = Date.now() - startTime;
      const velocity = dx / Math.max(elapsed, 1);
      const threshold = window.innerWidth * DISTANCE_RATIO;

      if (dx > threshold || velocity > VELOCITY_THRESHOLD) {
        el.style.transition = "transform 200ms ease-out";
        el.style.transform = "translateX(100%)";
        el.addEventListener(
          "transitionend",
          () => {
            el.style.transition = "";
            el.style.transform = "";
            onBackRef.current();
          },
          { once: true },
        );
      } else {
        el.style.transition = "transform 200ms ease-out";
        el.style.transform = "translateX(0)";
        el.addEventListener(
          "transitionend",
          () => {
            el.style.transition = "";
            el.style.transform = "";
          },
          { once: true },
        );
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [ref, enabled]);
}
