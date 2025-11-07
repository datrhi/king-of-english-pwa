"use client";

import QR from "@/components/QR";
import ScreenWithBackground from "@/components/ScreenWithBackground";

export default function QRPage() {
  return (
    <ScreenWithBackground
      headerProps={{
        title: "Sharing",
      }}
      view="scrollable"
      contentPosition="center"
    >
      <QR />
    </ScreenWithBackground>
  );
}
