"use client";

import { usePWAInstall } from "@/lib/pwa-install-handler/usePWAInstall";
import { Block, Button } from "konsta/react";
import { AlertCircle, CheckCircle, Download, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type InstallState = "checking" | "ready" | "installing" | "success" | "not-available" | "error";

export default function AutoInstall() {
    const [state, setState] = useState<InstallState>("checking");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const installPWA = usePWAInstall();
    const router = useRouter();

    useEffect(() => {
        // Wait a moment to check if install is available
        const checkTimer = setTimeout(() => {
            if (installPWA) {
                setState("ready");
                // Auto-trigger install after a short delay
                const installTimer = setTimeout(() => {
                    triggerInstall();
                }, 500);
                return () => clearTimeout(installTimer);
            } else {
                setState("not-available");
            }
        }, 500);

        return () => clearTimeout(checkTimer);
    }, [installPWA]);

    const triggerInstall = async () => {
        if (!installPWA) {
            setState("not-available");
            return;
        }

        setState("installing");
        try {
            const installed = await installPWA();
            if (installed) {
                setState("success");
                // Redirect to main page after successful install
                setTimeout(() => {
                    router.push("/?source=pwa");
                }, 2000);
            } else {
                setState("error");
                setErrorMessage("Installation was cancelled");
            }
        } catch (error) {
            setState("error");
            setErrorMessage(error instanceof Error ? error.message : "Installation failed");
        }
    };

    const renderContent = () => {
        switch (state) {
            case "checking":
                return (
                    <div className="flex flex-col items-center gap-4">
                        <Loader size={48} className="animate-spin text-gray-600" />
                        <p className="text-xl text-gray-600">Checking installation status...</p>
                    </div>
                );

            case "ready":
                return (
                    <div className="flex flex-col items-center gap-4">
                        <Loader size={48} className="animate-spin text-gray-600" />
                        <p className="text-xl text-gray-600">Preparing to install...</p>
                    </div>
                );

            case "installing":
                return (
                    <div className="flex flex-col items-center gap-4">
                        <Download size={48} className="animate-pulse text-gray-600" />
                        <p className="text-xl text-gray-600">Installing King of English...</p>
                        <p className="text-sm text-gray-600/70">Please follow the prompts</p>
                    </div>
                );

            case "success":
                return (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle size={48} className="text-green-400" />
                        <p className="text-xl text-gray-600">Installation Successful!</p>
                        <p className="text-sm text-gray-600/70">Redirecting you to the app...</p>
                    </div>
                );

            case "not-available":
                return (
                    <Block className="space-y-4 max-w-md w-full">
                        <div className="flex flex-col items-center gap-4">
                            <AlertCircle size={48} className="text-yellow-400" />
                            <p className="text-xl text-gray-600 text-center">Installation Not Available</p>
                            <p className="text-sm text-gray-600/70 text-center">
                                This app is already installed or your browser doesn't support installation.
                            </p>
                        </div>
                        <Button
                            large
                            onClick={() => router.push("/?source=pwa")}
                            className="w-full"
                        >
                            Go to App
                        </Button>
                    </Block>
                );

            case "error":
                return (
                    <Block className="space-y-4 max-w-md w-full">
                        <div className="flex flex-col items-center gap-4">
                            <AlertCircle size={48} className="text-red-400" />
                            <p className="text-xl text-gray-600 text-center">Installation Failed</p>
                            <p className="text-sm text-gray-600/70 text-center">{errorMessage}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                large
                                onClick={triggerInstall}
                                className="flex-1"
                            >
                                Try Again
                            </Button>
                            <Button
                                large
                                onClick={() => router.push("/?source=introduction")}
                                className="flex-1"
                                outline
                            >
                                Back
                            </Button>
                        </div>
                    </Block>
                );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
            {renderContent()}
        </div>
    );
}

