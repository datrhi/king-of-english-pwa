"use client";
import { useDialog } from "@/providers/DialogProvider";
import {
  Button,
  Card,
  Link,
  List,
  ListItem,
  Popover,
  Toast,
} from "konsta/react";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import ScreenWithBackground from "./ScreenWithBackground";

interface LobbyUser {
  id: string;
  name: string;
  avatar?: string;
  isHost?: boolean;
}

interface Props {
  pinCode: string;
  users: LobbyUser[];
  exerciseName: string;
  image?: string;
  maxPlayers?: number;
  onStartGame?: () => void;
  onExitLobby?: () => void;
  onEditCharacter?: () => void;
  onShare?: () => void;
  isHost: boolean;
}

export default function Lobby({
  pinCode,
  users,
  exerciseName,
  image,
  maxPlayers = 300,
  onStartGame,
  onExitLobby,
  onEditCharacter,
  onShare,
  isHost,
}: Props) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [toastOpened, setToastOpened] = useState(false);
  const popoverTargetRef = useRef(null);
  const { showAlert, showConfirm } = useDialog();
  const pin = useMemo(
    () => pinCode.replace(/(\d{3})(\d{3})/, "$1 $2"),
    [pinCode]
  );

  const openPopover = () => {
    setPopoverOpened(true);
  };

  const copyPinCode = async () => {
    try {
      await navigator.clipboard.writeText(pinCode);
      setToastOpened(true);
      setTimeout(() => setToastOpened(false), 3000);
    } catch (err) {
      console.error("Failed to copy PIN code:", err);
      showAlert({
        content: "Failed to copy PIN code to clipboard. Please try again.",
        title: "Error",
      });
    }
  };

  const handleMenuAction = (action: string) => {
    setPopoverOpened(false);
    switch (action) {
      case "start":
        if (users.length < 1) {
          showAlert({
            content: "You need at least 1 players to start the game.",
            title: "Cannot Start Game",
          });
        } else {
          onStartGame?.();
        }
        break;
      case "exit":
        showConfirm({
          content: "Are you sure you want to exit the lobby?",
          title: "Exit Lobby",
          onConfirm: () => onExitLobby?.(),
        });
        break;
      case "edit":
        onEditCharacter?.();
        break;
      case "share":
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
          <Link ref={popoverTargetRef} iconOnly onClick={openPopover}>
            <MoreVertical size={20} />
          </Link>
        ),
      }}
      view="scrollable"
      contentPosition="start"
    >
      <div className="space-y-4 w-full">
        {/* PIN Code Card */}
        <Card className="overflow-hidden backdrop-blur-xl bg-white/30 shadow-xl border border-white/40">
          <div className="p-6 text-center">
            {image && (
              <div className="flex items-center justify-center mb-4">
                <div className="w-32 h-32 rounded-lg overflow-hidden relative shadow-lg border-2 border-white/60">
                  <Image
                    src={image}
                    alt={exerciseName}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className="text-2xl font-bold text-gray-600 tracking-wide">
                {exerciseName}
              </p>
            </div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-3">
              PIN Code
            </p>
            <div className="inline-block mb-4">
              <div
                onClick={copyPinCode}
                className="text-5xl font-bold text-primary tracking-widest cursor-pointer hover:scale-105 transition-transform"
              >
                {pin}
              </div>
            </div>
          </div>
        </Card>

        {/* Players Card */}
        <Card className="overflow-hidden backdrop-blur-xl bg-white/30 shadow-xl border border-white/40">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-700 uppercase tracking-wide">
                Players
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`relative rounded-2xl p-4 transition-all duration-300 backdrop-blur-md ${
                    user.isHost
                      ? "bg-amber-100/80 border border-amber-300/50 shadow-lg"
                      : "bg-white/50 border border-white/60 shadow-md hover:shadow-lg hover:bg-white/60"
                  }`}
                >
                  {user.isHost && (
                    <div className="absolute -top-2 -right-2 backdrop-blur-md bg-amber-100/90 rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white">
                      <span className="text-base">👑</span>
                    </div>
                  )}
                  <div className="flex flex-col items-center space-y-2.5">
                    {user.avatar ? (
                      <div className="relative w-14 h-14">
                        <div className="absolute inset-0 bg-blue-500/30 blur-md rounded-full"></div>
                        <Image
                          alt={`${user.name} avatar`}
                          className="relative rounded-full border-2 border-white/80 shadow-lg"
                          src={user.avatar}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="absolute inset-0 bg-orange-400/40 blur-md rounded-full"></div>
                        <div className="relative w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white/80 shadow-lg">
                          <span className="text-white font-bold text-xl drop-shadow">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <p
                        className={`font-semibold text-sm leading-tight ${
                          user.isHost ? "text-amber-900" : "text-gray-800"
                        }`}
                      >
                        {user.name}
                      </p>
                      {user.isHost && (
                        <p className="text-xs text-amber-700 font-medium mt-0.5 uppercase tracking-wide">
                          Host
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {users.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-block bg-white/50 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/60">
                  <p className="text-base text-gray-600 font-medium">
                    Waiting for players to join...
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Popover Menu */}
      <Popover
        opened={popoverOpened}
        target={popoverTargetRef.current}
        onBackdropClick={() => setPopoverOpened(false)}
      >
        <List nested>
          {isHost && (
            <ListItem
              title="Start Game"
              link
              onClick={() => handleMenuAction("start")}
            />
          )}
          <ListItem
            title="Edit Character"
            link
            onClick={() => handleMenuAction("edit")}
          />
          <ListItem
            title="Share"
            link
            onClick={() => handleMenuAction("share")}
          />
          <ListItem
            title="Exit"
            link
            onClick={() => handleMenuAction("exit")}
            className="text-red-600"
          />
        </List>
      </Popover>

      {/* Toast Notification */}
      <Toast
        position="center"
        opened={toastOpened}
        button={
          <Button
            rounded
            clear
            small
            inline
            onClick={() => setToastOpened(false)}
          >
            Close
          </Button>
        }
      >
        <div className="shrink">PIN code copied to clipboard!</div>
      </Toast>
    </ScreenWithBackground>
  );
}
