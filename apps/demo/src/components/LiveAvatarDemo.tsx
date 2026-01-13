"use client";

import { useState } from "react";
import { LiveAvatarSession } from "./LiveAvatarSession";

export const LiveAvatarDemo = () => {
  const [sessionToken, setSessionToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    try {
      const res = await fetch("/api/start-session", {
        method: "POST",
      });
      if (!res.ok) {
        const error = await res.json();
        setError(error.error);
        return;
      }
      const { session_token } = await res.json();
      setSessionToken(session_token);
    } catch (error: unknown) {
      setError((error as Error).message);
    }
  };

  const onSessionStopped = () => {
    setSessionToken("");
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      {!sessionToken ? (
        <div className="z-10 flex flex-col items-center gap-6">
          {error && (
            <div className="bg-red-500/20 text-red-500 px-4 py-2 rounded-md border border-red-500">
              {"Error: " + error}
            </div>
          )}
          <div className="flex items-center gap-4">
            <button
              onClick={handleStart}
              className="min-w-[140px] bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-bold transition-all shadow-lg text-lg"
            >
              Start
            </button>
            <button
              disabled
              className="min-w-[140px] bg-gray-600/50 text-gray-400 px-8 py-3 rounded-full font-bold cursor-not-allowed border border-gray-500/30 text-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <LiveAvatarSession
          mode="FULL"
          sessionAccessToken={sessionToken}
          onSessionStopped={onSessionStopped}
        />
      )}
    </div>
  );
};