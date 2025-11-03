"use client";

import { usePWAInstall } from "@/lib/pwa-install-handler/usePWAInstall";
import { isIos } from "@/utils/pwa";
import { Block, Button } from "konsta/react";
import { Download, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
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
                {/* QR Code Section */}
                <div className="bg-white p-6 rounded-2xl flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-800">
                        <QrCode size={24} />
                        <span className="font-semibold text-lg">Scan to Install</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <QRCodeSVG
                            value={`${process.env.NEXT_PUBLIC_APP_URL}/?source=install`}
                            size={200}
                            level="H"
                            marginSize={4}
                        />
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                        Scan this QR code with your mobile device to install the app
                    </p>
                </div>

                {/* Direct Install Button */}
                {installPWA && (
                    <Button
                        large
                        onClick={handleInstall}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <Download size={20} />
                        <span>Install Now</span>
                    </Button>
                )}

                {!installPWA && (
                    <div className="p-4 rounded-lg text-center">
                        <p className="text-gray-600 text-sm">
                            Installation is unavailable on this browser. Please use Chrome to install the app.
                        </p>
                    </div>
                )}
            </Block>

        </div>
    );
}

