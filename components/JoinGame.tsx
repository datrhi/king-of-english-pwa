"use client";
import { Button } from "konsta/react";
import { useState } from "react";

export default function JoinGame() {
  const [pin, setPin] = useState("");

  const handleSubmit = () => {
    if (pin.trim()) {
      console.log("Joining game with PIN:", pin);
      // TODO: Implement join game logic
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Format PIN with space (e.g., "123 456")
    if (value.length < 7) {
      setPin(value);
    }
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
        <Button large rounded onClick={handleSubmit}>
          Join Game
        </Button>
      </div>
    </div>
  );
}
