'use client';

import { useState, useEffect, useRef } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
} from 'lucide-react';
import Avatar from '@/components/shared/avatar';
import { formatCallDuration } from '@/lib/utils';

interface Props {
  callerName: string;
  callerAvatar?: string;
  callType: 'VOICE' | 'VIDEO';
  localStream?: MediaStream | null;
  remoteStream?: MediaStream | null;
  onEnd: () => void;
}

export default function ActiveCall({
  callerName,
  callerAvatar,
  callType,
  localStream,
  remoteStream,
  onEnd,
}: Props) {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Attach streams
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff;
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  return (
    <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col">

      {/* Remote Video / Avatar */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-900">
        {callType === 'VIDEO' && remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-green-600/10 animate-pulse" />
              <Avatar
                src={callerAvatar}
                name={callerName}
                size="xl"
                className="w-32 h-32 text-3xl"
              />
            </div>
            <h2 className="text-white text-2xl font-bold">{callerName}</h2>
            <p className="text-gray-400 mt-2 text-lg font-mono">
              {formatCallDuration(duration)}
            </p>
          </div>
        )}

        {/* Local Video (pip) */}
        {callType === 'VIDEO' && localStream && (
          <div className="absolute top-4 right-4 w-28 h-40 rounded-2xl overflow-hidden border-2 border-gray-700 shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Duration for video */}
        {callType === 'VIDEO' && (
          <div className="absolute top-4 left-4 bg-black/50 rounded-full px-3 py-1.5">
            <span className="text-white text-sm font-mono">
              {formatCallDuration(duration)}
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 border-t border-gray-800 px-8 py-6">
        <div className="flex items-center justify-center gap-6">

          {/* Mute */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={toggleMute}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                isMuted
                  ? 'bg-red-600 hover:bg-red-500'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {isMuted ? (
                <MicOff size={22} className="text-white" />
              ) : (
                <Mic size={22} className="text-white" />
              )}
            </button>
            <span className="text-gray-400 text-xs">
              {isMuted ? 'Unmute' : 'Mute'}
            </span>
          </div>

          {/* End Call */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onEnd}
              className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition shadow-lg"
            >
              <PhoneOff size={26} className="text-white" />
            </button>
            <span className="text-gray-400 text-xs">End</span>
          </div>

          {/* Video Toggle */}
          {callType === 'VIDEO' && (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                  isVideoOff
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {isVideoOff ? (
                  <VideoOff size={22} className="text-white" />
                ) : (
                  <Video size={22} className="text-white" />
                )}
              </button>
              <span className="text-gray-400 text-xs">
                {isVideoOff ? 'Show Video' : 'Hide Video'}
              </span>
            </div>
          )}

          {/* Speaker */}
          <div className="flex flex-col items-center gap-2">
            <button className="w-14 h-14 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition">
              <Volume2 size={22} className="text-white" />
            </button>
            <span className="text-gray-400 text-xs">Speaker</span>
          </div>
        </div>
      </div>
    </div>
  );
}
