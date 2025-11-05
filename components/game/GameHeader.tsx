import { Button } from 'konsta/react';
import { Pause, Play, Settings } from 'lucide-react';

interface GameHeaderProps {
    pin: string;
    score: number;
    currentQuestion: number;
    totalQuestions: number;
    isPaused: boolean;
    onPause: () => void;
    onSettings: () => void;
}

export function GameHeader({
    pin,
    score,
    currentQuestion,
    totalQuestions,
    isPaused,
    onPause,
    onSettings,
}: GameHeaderProps) {
    return (
        <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-white/40 backdrop-blur-xl border-b border-white/60 shadow-md">
            <div className="flex items-center gap-2">
                <span className="text-gray-800 font-bold text-base">PIN {pin}</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="backdrop-blur-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-3 py-1.5 rounded-full border border-white/40">
                    <span className="text-indigo-700 font-bold text-sm">{score} pts</span>
                </div>
                <span className="text-gray-800 font-bold text-base">
                    {currentQuestion}/{totalQuestions}
                </span>
                <Button onClick={onPause} rounded clear className="text-gray-700" inline small>
                    {isPaused ? <Play size={20} /> : <Pause size={20} />}
                </Button>
                <Button onClick={onSettings} rounded clear className="text-gray-700" inline small>
                    <Settings size={20} />
                </Button>
            </div>
        </div>
    );
}

