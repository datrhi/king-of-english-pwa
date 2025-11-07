"use client";

import { usePWAInstall } from "@/lib/pwa-install-handler/usePWAInstall";
import { isIos } from "@/utils/pwa";
import { Block, Button } from "konsta/react";
import { Download } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import InstallIntroductionIOS from "./InstallIntroductionIOS";

export default function InstallIntroduction() {
  const installPWA = usePWAInstall();
  const [isIosDevice, setIsIosDevice] = useState(false);

  useEffect(() => {
    setIsIosDevice(isIos());
  }, []);

  const handleInstall = async () => {
    if (installPWA) {
      try {
        const installed = await installPWA();
        if (installed) {
          console.log("App installed successfully");
        }
      } catch (error) {
        console.error("Installation failed:", error);
      }
    }
  };

  // Render iOS-specific component for iOS devices
  if (isIosDevice) {
    return <InstallIntroductionIOS />;
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 gap-8">
      <Block className="space-y-6 w-full max-w-md">
        <Image
          src="/images/icon.png"
          alt="Install Introduction"
          width={500}
          height={500}
          className="w-full h-full object-contain rounded-lg"
        />
        {/* Direct Install Button */}
        {
          <Button
            large
            onClick={handleInstall}
            className="w-full flex items-center justify-center gap-2"
            disabled={!installPWA}
          >
            <Download size={20} />
            <span>
              {installPWA ? "Install Now" : "App is already installed"}
            </span>
          </Button>
        }
      </Block>
    </div>
  );
}
