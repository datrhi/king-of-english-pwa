import KonstaWrapper from "@/components/KonstaWrapper";
import QueryProvider from "@/providers/QueryProvider";
import { ViewTransitions } from "@/lib/next-view-transitions";
import type { Metadata, Viewport } from "next";
import { type ReactNode } from "react";
import "./globals.css";
import Head from "./head";

const APP_NAME = "King Of English";
const APP_DESCRIPTION =
  "Test your vocabulary skills with this engaging quiz app.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: "%s - King Of English",
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/images/icon.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "#0a305a",
    "apple-mobile-web-app-title": "King Of English",
    "theme-color": "#0a305a",
  },
};

export const viewport: Viewport = {
  // bg-ios-light-surface
  themeColor: "#efeff4",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "auto",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <KonstaWrapper>
      <ViewTransitions>
        <QueryProvider>
          <html lang="en" dir="ltr">
            <Head />
            <body data-mode="light">{children}</body>
          </html>
        </QueryProvider>
      </ViewTransitions>
    </KonstaWrapper>
  );
}
