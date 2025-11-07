"use client";
import ScreenWithBackground from "@/components/ScreenWithBackground";
import { Block, Button } from "konsta/react";
import { WifiOff } from "lucide-react";

export default function Page() {
  const handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <ScreenWithBackground
      headerProps={{
        title: "No Connection",
      }}
      view="scrollable"
      contentPosition="center"
    >
      <Block className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-6 rounded-full bg-gray-100 dark:bg-gray-800">
            <WifiOff size={64} className="text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            No Connection
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please check your network to experience this application
          </p>
        </div>

        <Button large rounded className="w-full mt-8" onClick={handleRetry}>
          Retry
        </Button>
      </Block>
    </ScreenWithBackground>
  );
}
