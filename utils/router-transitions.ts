export const pushAnimation = () => {
  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: "translateX(0)",
      },
      {
        opacity: 0,
        transform: "translateX(-100%)",
      },
    ],
    {
      duration: 300,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    }
  );

  document.documentElement.animate(
    [
      {
        opacity: 0,
        transform: "translateX(100%)",
      },
      {
        opacity: 1,
        transform: "translateX(0)",
      },
    ],
    {
      duration: 300,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    }
  );
};

export const backAnimation = () => {
  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: "translateX(0)",
      },
      {
        opacity: 0,
        transform: "translateX(100%)",
      },
    ],
    {
      duration: 300,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    }
  );

  document.documentElement.animate(
    [
      {
        opacity: 0,
        transform: "translateX(-100%)",
      },
      {
        opacity: 1,
        transform: "translateX(0)",
      },
    ],
    {
      duration: 300,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    }
  );
};