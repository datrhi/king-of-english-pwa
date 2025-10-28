"use client";
import Lobby from '@/components/Lobby';
import { useTransitionRouter } from '@/lib/next-view-transitions';

export default function LobbyPage() {
    const router = useTransitionRouter();
    const mockUsers = [
        {
            id: '1',
            name: 'Doctor Hieu',
            isHost: true,
        },
        {
            id: '2',
            name: 'Player 2',
        },
        // Add more mock users as needed
    ];

    const handleStartGame = () => {
        console.log('Starting game...');
        // Navigate to game screen
    };

    const handleExitLobby = () => {
        console.log('Exiting lobby...');
        router.back();
        // Navigate back to home screen
    };

    const handleEditCharacter = () => {
        console.log('Editing character...');
        // Open character editor
    };

    const handleShare = () => {
        console.log('Sharing lobby...');
        // Share lobby PIN code
    };

    return (
        <Lobby
            pinCode="934 086"
            users={mockUsers}
            category="Guess the logo"
            maxPlayers={300}
            onStartGame={handleStartGame}
            onExitLobby={handleExitLobby}
            onEditCharacter={handleEditCharacter}
            onShare={handleShare}
        />
    );
}