'use client';

import { Phone, PhoneOff, Video } from 'lucide-react';
import Avatar from '@/components/shared/avatar';

interface Props {
  callerName: string;
  callerAvatar?: string;
  callType: 'VOICE' | 'VIDEO';
  onAccept: () => void;
  onDecline: () => void;
}

export default function IncomingCallModal({
  callerName,
  callerAvatar,
  callType,
  onAccept,
  onDecline,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-3xl border border-gray-800 w-full max-w-sm p-8 text-center shadow-2xl">

        {/* Pulse Animation */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-green-600/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-green-600/10 animate-ping animation-delay-150" />
          <div className="relative">
            <Avatar
              src={callerAvatar}
              name={callerName}
              size="xl"
            />
          </div>
        </div>

        {/* Caller Info */}
        <p className="text-gray-400 text-sm mb-1">Incoming {callType.toLowerCase()} call</p>
        <h2 className="text-white text-2xl font-bold mb-8">{callerName}</h2>

        {/* Actions */}
        <div className="flex items-center justify-center gap-8">
          {/* Decline */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onDecline}
              className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition shadow-lg"
            >
              <PhoneOff size={24} className="text-white" />
            </button>
            <span className="text-gray-400 text-xs">Decline</span>
          </div>

          {/* Accept */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onAccept}
              className="w-16 h-16 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center transition shadow-lg"
            >
              {callType === 'VIDEO' ? (
                <Video size={24} className="text-white" />
              ) : (
                <Phone size={24} className="text-white" />
              )}
            </button>
            <span className="text-gray-400 text-xs">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
}
