const DURATION = 300;
const EASING = "cubic-bezier(0.2, 0, 0, 1)";

export function animateSlideIn(element: HTMLElement): Animation {
  return element.animate(
    [
      {
        transform: "translateX(100%)",
        boxShadow: "-8px 0 24px rgba(0,0,0,0.15)",
      },
      {
        transform: "translateX(0)",
        boxShadow: "-8px 0 24px rgba(0,0,0,0)",
      },
    ],
    { duration: DURATION, easing: EASING, fill: "forwards" },
  );
}

export function animateSlideOut(element: HTMLElement): Animation {
  return element.animate(
    [
      {
        transform: "translateX(0)",
        boxShadow: "-8px 0 24px rgba(0,0,0,0.15)",
      },
      {
        transform: "translateX(100%)",
        boxShadow: "-8px 0 24px rgba(0,0,0,0)",
      },
    ],
    { duration: DURATION, easing: EASING, fill: "forwards" },
  );
}

export function animateFadeIn(element: HTMLElement): Animation {
  return element.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: DURATION,
    easing: EASING,
    fill: "forwards",
  });
}

export function animateFadeOut(element: HTMLElement): Animation {
  return element.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: DURATION,
    easing: EASING,
    fill: "forwards",
  });
}
