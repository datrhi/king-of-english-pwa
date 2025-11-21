import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

interface ScrambleInputProps {
    scrambled: string;
    answer: string;
    onAnswerChange: (value: string) => void;
    onSubmit: () => void;
    isCorrect: boolean;
    isKeyboardOpen?: boolean;
}

interface CharacterTile {
    char: string;
    originalIndex: number;
    isUsed: boolean;
}

export function ScrambleInput({
    scrambled,
    answer,
    onAnswerChange,
    onSubmit,
    isCorrect,
}: ScrambleInputProps) {
    const [tiles, setTiles] = useState<CharacterTile[]>([]);
    const [selectedChars, setSelectedChars] = useState<(CharacterTile | null)[]>([]);

    // Initialize tiles and answer slots when scrambled word changes
    useEffect(() => {
        const chars = scrambled.split("").map((char, index) => ({
            char,
            originalIndex: index,
            isUsed: false,
        }));
        setTiles(chars);
        setSelectedChars(new Array(scrambled.length).fill(null));
        onAnswerChange("");
    }, [scrambled]);

    // Update answer when selectedChars changes
    useEffect(() => {
        const currentAnswer = selectedChars
            .map((tile) => tile?.char || "")
            .join("");
        onAnswerChange(currentAnswer);
    }, [selectedChars, isCorrect]);

    const handleTileClick = (tile: CharacterTile) => {
        if (isCorrect || tile.isUsed) return;

        setSelectedChars((prev) => {
            const emptyIndex = prev.findIndex((slot) => slot === null);
            if (emptyIndex === -1) return prev;
            const newSelectedChars = [...prev];
            newSelectedChars[emptyIndex] = tile;
            setTiles((prevTiles) =>
                prevTiles.map((t) =>
                    t.originalIndex === tile.originalIndex ? { ...t, isUsed: true } : t
                )
            );
            return newSelectedChars;
        });

    };

    const handleHoleClick = (index: number) => {
        if (isCorrect) return;

        const tile = selectedChars[index];
        if (!tile) return;

        // Remove from selected chars
        const newSelectedChars = [...selectedChars];
        newSelectedChars[index] = null;
        setSelectedChars(newSelectedChars);

        // Mark tile as unused
        setTiles((prevTiles) =>
            prevTiles.map((t) =>
                t.originalIndex === tile.originalIndex ? { ...t, isUsed: false } : t
            )
        );
    };

    const tileSize = "w-12 h-12 text-lg sm:w-14 sm:h-14 sm:text-xl";
    const gapSize = "gap-2 sm:gap-3";

    return (
        <div className={`w-full max-w-2xl px-2 space-y-4 sm:space-y-6`}>
            {/* Answer Holes */}
            <div
                className={`backdrop-blur-xl bg-white/30 rounded-2xl px-4 sm:px-6 py-4 sm:py-6 border border-white/40 shadow-lg transition-all duration-300`}
            >
                <div className={`flex flex-wrap justify-center ${gapSize} min-h-[48px] sm:min-h-[56px]`}>
                    {selectedChars.map((tile, index) => (
                        <motion.button
                            key={index}
                            onClick={() => handleHoleClick(index)}
                            className={`${tileSize} rounded-xl backdrop-blur-xl border-2 font-bold shadow-md transition-all duration-200 flex items-center justify-center relative overflow-hidden`}
                            style={{
                                backgroundColor: tile
                                    ? isCorrect
                                        ? "rgba(34, 197, 94, 0.9)"
                                        : "rgba(255, 255, 255, 0.9)"
                                    : "rgba(255, 255, 255, 0.4)",
                                borderColor: tile
                                    ? isCorrect
                                        ? "rgba(34, 197, 94, 1)"
                                        : "rgba(99, 102, 241, 0.6)"
                                    : "rgba(255, 255, 255, 0.6)",
                                color: tile
                                    ? isCorrect
                                        ? "#ffffff"
                                        : "#1f2937"
                                    : "#9ca3af",
                                cursor: tile && !isCorrect ? "pointer" : "default",
                            }}
                            whileHover={
                                tile && !isCorrect
                                    ? { scale: 1.05 }
                                    : {}
                            }
                            whileTap={
                                tile && !isCorrect
                                    ? { scale: 0.95 }
                                    : {}
                            }
                            disabled={isCorrect}
                        >
                            <AnimatePresence mode="wait">
                                {tile ? (
                                    <motion.span
                                        key={`char-${index}`}
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0, rotate: 180 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                        {tile.char}
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key={`empty-${index}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        _
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Correct/Wrong Indicator */}
                            {isCorrect && tile && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute inset-0 flex items-center justify-center bg-green-500"
                                >
                                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </motion.div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Character Tiles */}
            <div
                className={`backdrop-blur-xl bg-white/20 rounded-2xl px-4 sm:px-6 py-4 sm:py-6 border border-white/40 shadow-lg transition-all duration-300`}
            >
                <div className={`flex flex-wrap justify-center ${gapSize}`}>
                    {tiles.map((tile) => (
                        <motion.button
                            key={tile.originalIndex}
                            onClick={() => handleTileClick(tile)}
                            className={`${tileSize} rounded-xl font-bold shadow-lg transition-all duration-200 flex items-center justify-center`}
                            style={{
                                backgroundColor: tile.isUsed
                                    ? "rgba(209, 213, 219, 0.5)"
                                    : "rgba(139, 92, 246, 0.9)",
                                borderWidth: 2,
                                borderColor: tile.isUsed
                                    ? "rgba(156, 163, 175, 0.6)"
                                    : "rgba(124, 58, 237, 1)",
                                color: tile.isUsed ? "#9ca3af" : "#ffffff",
                                cursor: tile.isUsed || isCorrect ? "not-allowed" : "pointer",
                                opacity: tile.isUsed ? 0.5 : 1,
                            }}
                            whileHover={
                                !tile.isUsed && !isCorrect
                                    ? { scale: 1.1, rotate: 5 }
                                    : {}
                            }
                            whileTap={
                                !tile.isUsed && !isCorrect
                                    ? { scale: 0.9 }
                                    : {}
                            }
                            disabled={tile.isUsed || isCorrect}
                            animate={{
                                scale: tile.isUsed ? 0.9 : 1,
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            {tile.char}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}

