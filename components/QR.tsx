"use client";

import { Block } from "konsta/react";
import { QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function QR() {
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
              value={
                process.env.NEXT_PUBLIC_APP_URL || "https://koe.091200.xyz"
              }
              size={200}
              level="H"
              marginSize={4}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            Scan this QR code to install the app
          </p>
        </div>
      </Block>
    </div>
  );
}
