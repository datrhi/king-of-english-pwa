"use client";
import {
    Card,
    Chip,
    Link,
    List,
    ListItem,
    Popover
} from 'konsta/react';
import { MoreVertical, UserPlus } from 'lucide-react';
import { useRef, useState } from 'react';
import ScreenWithBackground from './ScreenWithBackground';

interface LobbyUser {
    id: string;
    name: string;
    avatar?: string;
    isHost?: boolean;
}

interface Props {
    pinCode: string;
    users: LobbyUser[];
    category: string;
    maxPlayers?: number;
    onStartGame?: () => void;
    onExitLobby?: () => void;
    onEditCharacter?: () => void;
    onShare?: () => void;
}

export default function Lobby({
    pinCode,
    users,
    category,
    maxPlayers = 300,
    onStartGame,
    onExitLobby,
    onEditCharacter,
    onShare,
}: Props) {
    const [popoverOpened, setPopoverOpened] = useState(false);
    const popoverTargetRef = useRef(null);

    const openPopover = () => {
        setPopoverOpened(true);
    };

    const handleMenuAction = (action: string) => {
        setPopoverOpened(false);
        switch (action) {
            case 'start':
                onStartGame?.();
                break;
            case 'exit':
                onExitLobby?.();
                break;
            case 'edit':
                onEditCharacter?.();
                break;
            case 'share':
                onShare?.();
                break;
        }
    };

    return (
        <ScreenWithBackground
            backgroundType="dynamic"
            headerProps={{
                title: "Lobby",
                left: null,
                right: (
                    <Link
                        ref={popoverTargetRef}
                        iconOnly
                        onClick={openPopover}
                    >
                        <MoreVertical size={20} />
                    </Link>
                ),
            }}
            view='scrollable'
        >
            <div className="space-y-6 w-full">
                {/* PIN Code Card */}
                <Card className="text-center bg-white/40 shadow-lg">
                    <div className="py-6">
                        <h2 className="text-lg font-medium text-gray-700 mb-2">PIN code:</h2>
                        <div className="text-4xl font-bold text-green-600 mb-4 tracking-wider">
                            {pinCode}
                        </div>
                    </div>
                </Card>

                {/* Players Card */}
                <Card className="bg-white/40 shadow-lg">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-800">
                                {users.length} of {maxPlayers} players:
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {users.map((user) => (
                                <Chip
                                    key={user.id}
                                    className="m-0.5 relative"
                                    colors={{
                                        fillBgIos: user.isHost ? 'bg-yellow-100' : 'bg-blue-50',
                                        fillBgMaterial: user.isHost ? 'bg-yellow-100' : 'bg-blue-50',
                                        fillTextIos: user.isHost ? 'text-yellow-800' : 'text-blue-800',
                                        fillTextMaterial: user.isHost ? 'text-yellow-800' : 'text-blue-800'
                                    }}
                                    media={
                                        user.avatar ? (
                                            <img
                                                alt={`${user.name} avatar`}
                                                className="ios:h-7 material:h-6 rounded-full"
                                                src={user.avatar}
                                            />
                                        ) : (
                                            <div className="ios:h-7 material:h-6 w-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )
                                    }
                                >
                                    {user.name}
                                    {user.isHost && (
                                        <span className="ml-1">👑</span>
                                    )}
                                </Chip>
                            ))}

                            {/* Add empty slots visualization */}
                            {users.length < maxPlayers && (
                                <Chip
                                    className="m-0.5 opacity-50"
                                    outline
                                    colors={{
                                        outlineBorderIos: 'border-gray-300',
                                        outlineBorderMaterial: 'border-gray-300',
                                        outlineTextIos: 'text-gray-500',
                                        outlineTextMaterial: 'text-gray-500'
                                    }}
                                    media={
                                        <div className="ios:h-7 material:h-6 w-7 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                                            <UserPlus size={12} className="text-gray-400" />
                                        </div>
                                    }
                                >
                                    Join game
                                </Chip>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Category Card */}
                {/* <Card className="bg-white/90 backdrop-blur-sm">
                    <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Category:</h3>
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                            <h4 className="font-bold text-lg">{category}</h4>
                        </div>
                    </div>
                </Card> */}

            </div>

            {/* Popover Menu */}
            <Popover
                opened={popoverOpened}
                target={popoverTargetRef.current}
                onBackdropClick={() => setPopoverOpened(false)}
            >
                <List nested>
                    <ListItem
                        title="Start Game"
                        link
                        onClick={() => handleMenuAction('start')}
                    />
                    <ListItem
                        title="Edit Character"
                        link
                        onClick={() => handleMenuAction('edit')}
                    />
                    <ListItem
                        title="Share"
                        link
                        onClick={() => handleMenuAction('share')}
                    />
                    <ListItem
                        title="Exit"
                        link
                        onClick={() => handleMenuAction('exit')}
                        className="text-red-600"
                    />
                </List>
            </Popover>
        </ScreenWithBackground>
    );
}