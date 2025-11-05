import { motion } from 'framer-motion';

interface ProgressBarProps {
    progress: number; // 0-1000
}

export function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="w-full max-w-md px-2">
            <div className="backdrop-blur-xl bg-white/30 rounded-full p-2 border border-white/40 shadow-lg">
                <div className="relative h-6 backdrop-blur-sm bg-white/40 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full"
                        animate={{
                            width: `${(progress / 1000) * 100}%`,
                            backgroundColor:
                                progress > 500
                                    ? '#22c55e'
                                    : progress > 250
                                        ? '#f59e0b'
                                        : '#ef4444',
                        }}
                        transition={{
                            duration: 0.1,
                            ease: 'linear',
                        }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="relative z-10 text-xs font-bold text-white drop-shadow-md">
                            {Math.round(progress)} pts
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

