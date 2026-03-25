"use client";

import { memo, useEffect, useRef, type CSSProperties } from "react";
import { RouteContext } from "./NavigationContext";
import {
  animateFadeIn,
  animateFadeOut,
  animateSlideIn,
  animateSlideOut,
} from "./animations";
import { useSwipeBack } from "./gesture";
import type { NavigationOptions, Route, ScreenComponent } from "./types";

interface ScreenWrapperProps {
  route: Route;
  isActive: boolean;
  zIndex: number;
  isEntering: boolean;
  isExiting: boolean;
  onExitComplete?: () => void;
  Component: ScreenComponent;
  options?: NavigationOptions;
  onGestureBack?: () => void;
}

export const ScreenWrapper = memo(function ScreenWrapper({
  route,
  isActive,
  zIndex,
  isEntering,
  isExiting,
  onExitComplete,
  Component,
  options,
  onGestureBack,
}: ScreenWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const animationType = options?.animation ?? "slide";
  const gestureEnabled = options?.gestureEnabled !== false;

  useEffect(() => {
    if (!isEntering || !ref.current || animationType === "none") return;

    const anim =
      animationType === "fade"
        ? animateFadeIn(ref.current)
        : animateSlideIn(ref.current);

    return () => anim.cancel();
  }, [isEntering, animationType]);

  useEffect(() => {
    if (!isExiting || !ref.current) return;

    if (animationType === "none") {
      onExitComplete?.();
      return;
    }

    const anim =
      animationType === "fade"
        ? animateFadeOut(ref.current)
        : animateSlideOut(ref.current);

    anim.onfinish = () => onExitComplete?.();

    return () => anim.cancel();
  }, [isExiting, animationType, onExitComplete]);

  useSwipeBack(
    ref,
    () => onGestureBack?.(),
    isActive && gestureEnabled && !isExiting,
  );

  const style: CSSProperties = {
    position: "absolute",
    inset: 0,
    zIndex,
    pointerEvents: isActive && !isExiting ? "auto" : "none",
    overflowY: isActive ? "auto" : "hidden",
    backgroundColor: "var(--screen-bg, #efeff4)",
    willChange: isEntering || isExiting ? "transform" : "auto",
  };

  return (
    <div
      ref={ref}
      style={style}
      data-screen={route.name}
      aria-hidden={!isActive}
    >
      <RouteContext.Provider value={route}>
        <Component />
      </RouteContext.Provider>
    </div>
  );
});
