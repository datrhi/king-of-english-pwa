"use client";

import QR from "@/components/QR";
import ScreenWithBackground from "@/components/ScreenWithBackground";

export default function QRScreen() {
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
