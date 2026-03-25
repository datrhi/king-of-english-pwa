"use client";

import { NavigationContainer } from "@/lib/navigation";
import { screens, screenOptions } from "@/screens";

export default function MobilePWA() {
  return (
    <NavigationContainer
      screens={screens}
      initialRouteName="Home"
      screenOptions={screenOptions}
    />
  );
}
