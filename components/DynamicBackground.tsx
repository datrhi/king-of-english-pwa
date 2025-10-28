'use client';

import { useEffect, useState } from 'react';

interface FallingIcon {
    id: number;
    emoji: string;
    x: number;
    animationDuration: number;
    delay: number;
    size: number;
    opacity: number;
}

// Nhóm icon theo gợi ý với tỷ lệ phù hợp
const ICON_GROUPS = {
    // 👑 A. Biểu tượng "Vua – Game show" (30%)
    royal: ['👑', '🏆', '🎯', '⚡', '💎', '🌟'],

    // 📘 B. Biểu tượng "Ngôn ngữ – Học tiếng Anh" (40%)  
    language: ['🔤', '📚', '💬', '✏️', '🧠', '🔠', '📝', '📖'],

    // 🧩 C. Biểu tượng "Quiz – Ghép từ" (20%)
    quiz: ['❓', '🧩', '🎲', '🕹️', '🗯️'],

    // 💡 D. Biểu tượng "Niềm vui – Năng lượng" (10%)
    joy: ['🌈', '💫', '✨', '🎈', '🎉']
};

const getRandomIcon = (): string => {
    const rand = Math.random();
    let iconPool: string[] = [];

    if (rand < 0.4) {
        // 40% - Language icons
        iconPool = ICON_GROUPS.language;
    } else if (rand < 0.7) {
        // 30% - Royal icons  
        iconPool = ICON_GROUPS.royal;
    } else if (rand < 0.9) {
        // 20% - Quiz icons
        iconPool = ICON_GROUPS.quiz;
    } else {
        // 10% - Joy icons
        iconPool = ICON_GROUPS.joy;
    }

    return iconPool[Math.floor(Math.random() * iconPool.length)];
};

export default function DynamicBackground() {
    const [icons, setIcons] = useState<FallingIcon[]>([]);

    useEffect(() => {
        let iconId = 0;

        const createIcon = (): FallingIcon => ({
            id: iconId++,
            emoji: getRandomIcon(),
            x: Math.random() * 90 + 5, // Position từ 5-95% để tránh icon bị cắt ở edge
            animationDuration: 4 + Math.random() * 3, // 4-7 giây
            delay: Math.random() * 2, // Delay 0-2 giây
            size: 16 + Math.random() * 16, // Size 16-32px (nhỏ hơn để không làm rối)
            opacity: 0.08 + Math.random() * 0.12, // Opacity 0.08-0.2 (nhẹ nhàng hơn)
        });

        // Tạo icon ban đầu với delay tăng dần
        const initialIcons = Array.from({ length: 12 }, (_, i) => ({
            ...createIcon(),
            delay: i * 0.3, // Stagger initial icons
        }));
        setIcons(initialIcons);

        // Tạo icon mới liên tục
        const interval = setInterval(() => {
            setIcons(prevIcons => {
                // Xóa icon cũ (sau khi animation kết thúc) và thêm icon mới
                const now = Date.now();
                const filteredIcons = prevIcons.slice(-15); // Giữ tối đa 15 icon để performance tốt hơn
                return [...filteredIcons, createIcon()];
            });
        }, 1200); // Tăng interval để ít làm phiền hơn

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 h-screen overflow-hidden pointer-events-none z-0">
            {icons.map((icon) => (
                <div
                    key={icon.id}
                    className="absolute animate-fall"
                    style={{
                        left: `${icon.x}%`,
                        fontSize: `${icon.size}px`,
                        opacity: icon.opacity,
                        animationDuration: `${icon.animationDuration}s`,
                        animationDelay: `${icon.delay}s`,
                        animationIterationCount: 'infinite',
                        animationTimingFunction: 'linear',
                        transform: 'translateX(-50%)',
                    }}
                >
                    {icon.emoji}
                </div>
            ))}
        </div>
    );
}