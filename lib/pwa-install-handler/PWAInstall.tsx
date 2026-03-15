"use client";

import { useEffect, useState } from "react";

export default function PWAInstallWrapper() {
  const [mounted, setMounted] = useState(false);
  let pwaInstallElement: any = null;

  useEffect(() => {
    // Only import on client side after mount
    import("@khmyznikov/pwa-install").then(() => {
      setMounted(true);
    });
  }, []);

  // Force show is just for demo purpose, due stackblitz adds to many abstration layers
  // Check the readme for all supported params and methods https://github.com/khmyznikov/pwa-install?tab=readme-ov-file

  if (!mounted) return null;

  return (
    <pwa-install
      ref={(el: any) => {
        pwaInstallElement = el;
      }}
      install-description="Install the King of English app to have a better experience!"
      name="King of English"
      description="Test your vocabulary skills with this engaging quiz app. Learn, compete, and become the king!"
      icon="/images/icon.png"
      manifest-url="/manifest.json"
    />
  );
}
