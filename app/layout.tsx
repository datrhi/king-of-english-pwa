import KonstaWrapper from "@/components/KonstaWrapper";
import { DialogProvider } from "@/providers/DialogProvider";
import QueryProvider from "@/providers/QueryProvider";
import { Provider } from "jotai";
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
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "King Of English",
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
    <Provider>
      <KonstaWrapper>
        <QueryProvider>
          <DialogProvider>
            <html lang="en" dir="ltr">
              <Head />
              <body data-mode="light">{children}</body>
            </html>
          </DialogProvider>
        </QueryProvider>
      </KonstaWrapper>
    </Provider>
  );
}
