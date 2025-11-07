export const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};
// Detects if device is in standalone mode
export const isInStandaloneMode = () =>
  (typeof window !== "undefined" &&
    "standalone" in window.navigator &&
    window.navigator.standalone) ||
  window.matchMedia("(display-mode: standalone)").matches ||
  document.referrer.includes("android-app://");

export const setThemeColor = (color?: string) => {
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute("content", color || "#efeff4");
  }
};
