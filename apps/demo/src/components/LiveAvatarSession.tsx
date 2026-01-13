"use client";

import React, { useEffect, useRef } from "react";
import {
  LiveAvatarContextProvider,
  useSession,
  useVoiceChat,
} from "../liveavatar";
import { SessionState } from "@heygen/liveavatar-web-sdk";

const LiveAvatarSessionComponent: React.FC<{
  onSessionStopped: () => void;
}> = ({ onSessionStopped }) => {
  const {
    sessionState,
    isStreamReady,
    startSession,
    stopSession,
    attachElement,
  } = useSession();
  
  const {
    isMuted,
    isActive,
    start,
    mute,
    unmute,
  } = useVoiceChat();

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sessionState === SessionState.DISCONNECTED) {
      onSessionStopped();
    }
  }, [sessionState, onSessionStopped]);

  useEffect(() => {
    if (isStreamReady && videoRef.current) {
      attachElement(videoRef.current);
    }
  }, [attachElement, isStreamReady]);

  useEffect(() => {
    if (sessionState === SessionState.INACTIVE) {
      startSession();
    }
  }, [startSession, sessionState]);

  useEffect(() => {
    if (sessionState === SessionState.CONNECTED && !isActive) {
      start();
    }
  }, [sessionState, isActive, start]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden">
      {/* Full Screen Video Container */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover" // Ensures the video covers the whole screen
      />

      {/* Floating Bottom Controls */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-6 z-20">
        {/* Mic Toggle Button */}
        <button
          onClick={() => (isMuted ? unmute() : mute())}
          className={`min-w-[140px] px-8 py-3 rounded-full font-bold text-white transition-all shadow-xl text-lg ${
            isMuted 
              ? "bg-red-600 hover:bg-red-700 ring-2 ring-red-400" 
              : "bg-green-600 hover:bg-green-700 ring-2 ring-green-400"
          }`}
        >
          {isMuted ? "Mic Off" : "Mic On"}
        </button>

        {/* Active Cancel Button */}
        <button
          onClick={() => stopSession()}
          className="min-w-[140px] bg-zinc-800/80 hover:bg-zinc-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-xl border border-white/20 text-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export const LiveAvatarSession: React.FC<{
  mode: "FULL" | "CUSTOM";
  sessionAccessToken: string;
  onSessionStopped: () => void;
}> = ({ sessionAccessToken, onSessionStopped }) => {
  return (
    <LiveAvatarContextProvider sessionAccessToken={sessionAccessToken}>
      <LiveAvatarSessionComponent onSessionStopped={onSessionStopped} />
    </LiveAvatarContextProvider>
  );
};