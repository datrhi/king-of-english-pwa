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
      install-description="Cài đặt ứng dụng Lịch Vạn Niên để có trải nghiệm tốt hơn!"
      name="Lịch Vạn Niên"
      description="Xem lịch âm dương, ngày tốt xấu, giờ hoàng đạo mỗi ngày."
      icon="/images/icon.png"
      manifest-url="/manifest.json"
    />
  );
}
