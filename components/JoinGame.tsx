"use client";
import { useTransitionRouter } from "@/lib/next-view-transitions";
import { getUsername } from "@/services/userService";
import { Button } from "konsta/react";
import { useState } from "react";

export default function JoinGame() {
  const [pin, setPin] = useState("");
  const router = useTransitionRouter();

  const handleSubmit = async () => {
    const rawPin = pin.replace(/\s/g, "");
    // Validate PIN is exactly 6 numbers
    if (rawPin.length === 6 && /^\d{6}$/.test(rawPin)) {
      const name = await getUsername();
      // Navigate to lobby - backend will determine if user is host
      const params = new URLSearchParams({
        pin: rawPin,
        name,
        isHost: "false",
      });
      router.push(`/lobby?${params.toString()}`);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and spaces
    const filtered = value.replace(/[^\d\s]/g, "");
    // Format PIN with space (e.g., "123 456")
    if (filtered.length <= 7) {
      setPin(filtered);
    }
  };

  // Check if PIN is valid (exactly 6 digits)
  const isValidPin = () => {
    const rawPin = pin.replace(/\s/g, "");
    return rawPin.length === 6 && /^\d{6}$/.test(rawPin);
  };

  return (
    <div className="p-6">
      <div className="bg-white/40 rounded-lg p-6 shadow-lg">
        <div className="text-center mb-4">
          <p className="text-gray-800 mb-4">Enter PIN:</p>
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="123 456"
            value={pin}
            onChange={handlePinChange}
            className="w-full px-4 py-3 text-center text-lg font-mono bg-white rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            maxLength={7}
          />
        </div>
        <Button large rounded onClick={handleSubmit} disabled={!isValidPin()}>
          Join Game
        </Button>
      </div>
    </div>
  );
}
