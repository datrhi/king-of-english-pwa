import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TextDisplayProps {
    text: string;
    isKeyboardOpen?: boolean;
    shouldRun?: boolean;
}

export function TextDisplay({
    text,
    isKeyboardOpen = false,
    shouldRun = false,
}: TextDisplayProps) {
    const [visibleParts, setVisibleParts] = useState<boolean[]>(
        new Array(16).fill(false)
    );
    const [rotation, setRotation] = useState<number>(0);
    const [textColor, setTextColor] = useState<string>("#1f2937");
    const [backgroundColor, setBackgroundColor] = useState<string>("transparent");

    useEffect(() => {
        // Generate random rotation between -45 and 45 degrees
        const randomRotation = Math.floor(Math.random() * 91) - 45;
        setRotation(randomRotation);

        // Generate random colors
        const colors = [
            "#ef4444", "#f97316", "#eab308", "#84cc16",
            "#10b981", "#06b6d4",];

        const randomTextColor = colors[Math.floor(Math.random() * colors.length)];
        const randomBgColor = colors[Math.floor(Math.random() * colors.length)];

        // Make sure text and background colors are different
        let finalBgColor = randomBgColor;
        while (finalBgColor === randomTextColor) {
            finalBgColor = colors[Math.floor(Math.random() * colors.length)];
        }

        setTextColor(randomTextColor);
        setBackgroundColor(finalBgColor);

        // Only start animation if shouldRun is true
        if (!shouldRun) {
            return;
        }

        // Create array of indices [0, 1, 2, ..., 15]
        const indices = Array.from({ length: 16 }, (_, i) => i);

        // Shuffle the indices randomly
        const shuffledIndices = indices.sort(() => Math.random() - 0.5);

        // Clear any existing timeouts
        const timeouts: NodeJS.Timeout[] = [];

        // Schedule each part to appear at random times over 30 seconds
        shuffledIndices.forEach((index, i) => {
            const delay = (i / 15) * 30000; // Spread evenly over 30 seconds
            const timeout = setTimeout(() => {
                setVisibleParts((prev) => {
                    const newParts = [...prev];
                    newParts[index] = true;
                    return newParts;
                });
            }, delay);
            timeouts.push(timeout);
        });

        // Cleanup function
        return () => {
            timeouts.forEach((timeout) => clearTimeout(timeout));
            setVisibleParts(new Array(16).fill(false));
        };
    }, [text, shouldRun]);

    return (
        <div
            className={`w-full px-2 transition-all duration-300 ${isKeyboardOpen ? "max-w-[200px] sm:max-w-[250px]" : "max-w-md"
                }`}
        >
            <div className="relative w-full aspect-square backdrop-blur-xl bg-white/40 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/60">
                {/* Text Background */}
                <div
                    className="absolute inset-0 flex items-center justify-center p-4"
                    style={{
                        backgroundColor: backgroundColor,
                    }}
                >
                    <p
                        className={`font-bold text-center break-words ${isKeyboardOpen
                            ? "text-2xl sm:text-3xl"
                            : "text-4xl sm:text-5xl md:text-6xl"
                            }`}
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            color: textColor,
                        }}
                    >
                        {text}
                    </p>
                </div>

                {/* Animated Grid Overlay - covers the text and reveals it part by part */}
                <div className="absolute inset-0 w-full h-full grid grid-cols-4 grid-rows-4 pointer-events-none">
                    {Array.from({ length: 16 }).map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 1 }}
                            animate={{
                                opacity: visibleParts[index] ? 0 : 1,
                            }}
                            transition={{
                                duration: 0.5,
                                ease: "easeOut",
                            }}
                            className="relative w-full h-full bg-[#0a305a] backdrop-blur-xl border border-white/20"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

