"use client";
import Lobby from '@/components/Lobby';
import { useTransitionRouter } from '@/lib/next-view-transitions';
import { useDialog } from '@/providers/DialogProvider';
import {
    disconnectRoomSocket,
    joinRoom,
    leaveRoom,
    offRoomClosed,
    offUserJoined,
    offUserLeft,
    onRoomClosed,
    onUserJoined,
    onUserLeft,
    RoomUser
} from '@/services/socketService';
import { Preloader } from 'konsta/react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function LobbyContent() {
    const router = useTransitionRouter();
    const searchParams = useSearchParams();
    const { showAlert } = useDialog();

    // Get params from URL
    const pin = searchParams.get('pin') || '000000';
    const userName = searchParams.get('name') || 'Guest';
    const userAvatar = searchParams.get('avatar') || '';

    // State
    const [users, setUsers] = useState<RoomUser[]>([]);
    const [roomData, setRoomData] = useState<{
        exerciseName: string;
        exerciseId: string;
        image?: string;
    }>({
        exerciseName: 'Unknown Exercise',
        exerciseId: '',
        image: '',
    });
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [isHost, setIsHost] = useState(false);
    const [loading, setLoading] = useState(true);

    // Join room on mount
    useEffect(() => {
        const rawPin = pin.replace(/\s/g, '');

        const initRoom = async () => {
            try {
                const result = await joinRoom(rawPin, userName, userAvatar);

                if (result.success && result.data) {
                    setUsers(result.data.users);
                    setRoomData({
                        exerciseName: result.data.room.exercise?.name || 'Unknown Exercise',
                        exerciseId: result.data.room.exerciseId,
                        image: result.data.room.image,
                    });
                    setCurrentUserId(result.data.user.id);
                    setIsHost(result.data.isHost);

                    setLoading(false);
                } else {
                    showAlert({
                        content: result.error || 'Failed to join room',
                        onConfirm: () => router.back(),
                        title: 'Room Error',
                        disableBackdropClick: true,
                    });
                }
            } catch (err) {
                console.error('Error joining room:', err);
                showAlert({
                    content: 'Failed to join room. Please try again.',
                    onConfirm: () => router.back(),
                    title: 'Connection Error',
                    disableBackdropClick: true,
                });
            }
        };

        void initRoom();

        // Listen for real-time user updates
        onUserJoined((data) => {
            console.log('User joined:', data);
            setUsers((prev) => {
                // Check if user already exists
                if (prev.some((u) => u.id === data.user.id)) {
                    return prev;
                }
                return [...prev, data.user];
            });
        });

        onUserLeft((data) => {
            console.log('User left:', data);
            setUsers((prev) => prev.filter((u) => u.id !== data.user.id));
        });

        // Listen for room closed event (when host leaves)
        onRoomClosed((data) => {
            console.log('Room closed:', data);
            // Show message and redirect
            showAlert({
                content: data.message,
                onConfirm: () => router.reset('/?source=pwa'),
                title: 'Room Closed',
                disableBackdropClick: true,
            });
            disconnectRoomSocket();
            // Redirect after a short delay
            setTimeout(() => {
                router.push('/');
            }, 2000);
        });

        // Cleanup
        return () => {
            offUserJoined();
            offUserLeft();
            offRoomClosed();
            leaveRoom(rawPin);
        };
    }, [pin, userName, userAvatar]);

    const handleStartGame = () => {
        console.log('Starting game...');
        // Navigate to game screen with necessary params
        const rawPin = pin.replace(/\s/g, '');
        const params = new URLSearchParams({
            pin: rawPin,
            exerciseId: roomData.exerciseId,
            exerciseName: roomData.exerciseName,
        });
        const gameUrl = `/game?${params.toString()}`;
        router.push(gameUrl);
    };

    const handleExitLobby = () => {
        console.log('Exiting lobby...');

        const rawPin = pin.replace(/\s/g, '');

        // Leave room via socket (backend will auto-delete if host)
        leaveRoom(rawPin);

        // Disconnect from WebSocket
        disconnectRoomSocket();

        // Navigate back to home screen
        router.back();
    };

    const handleEditCharacter = () => {
        console.log('Editing character...');
        // TODO: Open character editor
    };

    const handleShare = async () => {
        console.log('Sharing lobby...');
        try {
            await navigator.share({
                title: 'Join my game!',
                text: `Join my ${roomData.exerciseName} game with PIN: ${pin}`,
                url: window.location.href,
            });
        } catch (err) {
            console.log('Share not supported or cancelled:', err);
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(
                    `Join my ${roomData.exerciseName} game with PIN: ${pin}\n${window.location.href}`
                );
                showAlert({
                    content: 'Lobby link copied to clipboard!',
                    title: 'Shared',
                });
            } catch (clipboardErr) {
                showAlert({
                    content: 'Failed to share or copy link. Please try again.',
                    title: 'Share Failed',
                });
            }
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Preloader />
            </div>
        );
    }

    // Map users to include isHost property
    const usersWithHostInfo = users.map((user) => ({
        ...user,
        isHost: isHost && user.id === currentUserId,
    }));

    // Format pin with space
    const formattedPin = pin.replace(/\s/g, '').replace(/(\d{3})(\d{3})/, '$1 $2');

    return (
        <Lobby
            pinCode={formattedPin}
            users={usersWithHostInfo}
            exerciseName={roomData.exerciseName}
            image={roomData.image}
            maxPlayers={300}
            onStartGame={handleStartGame}
            onExitLobby={handleExitLobby}
            onEditCharacter={handleEditCharacter}
            onShare={handleShare}
        />
    );
}

export default function LobbyPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <LobbyContent />
        </Suspense>
    );
}