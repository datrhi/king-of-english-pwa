"use client";

import { Block } from "konsta/react";
import { Home, Plus, Share } from "lucide-react";

export default function InstallIntroductionIOS() {
    return (
        <div className="flex flex-col items-center justify-center gap-8">
            <Block className="space-y-6 w-full max-w-md">
                {/* Manual Installation Instructions for iOS */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Home size={20} />
                        How to Install
                    </h3>

                    <div className="space-y-4">
                        {/* Step 1 */}
                        <div className="flex gap-3 items-center">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                                1
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-700 text-sm">
                                    Open this page in <strong>Safari, Edge or Chrome browser</strong>
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-3 items-center">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                                2
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-700 text-sm flex items-center gap-2">
                                    Tap the <Share size={16} className="inline" /> at the bottom
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-3 items-center">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                                3
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-700 text-sm flex items-center gap-2">
                                    Select <Plus size={16} className="inline" /> <strong>"Add to Home Screen"</strong>
                                </p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex gap-3 items-center">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                                4
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-700 text-sm">
                                    Tap <strong>"Add"</strong> to confirm
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-3 bg-white/60 rounded-lg">
                        <p className="text-xs text-gray-600 text-center">
                            💡 <strong>Note:</strong> Please use Safari, Edge or Chrome to install the app
                        </p>
                    </div>
                </div>

            </Block>
        </div>
    );
}

