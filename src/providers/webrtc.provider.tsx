'use client';

import {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { useWebRTC, CallState } from '@/hooks/useWebRTC';
import IncomingCallModal from '@/components/calls/incoming-call-modal';
import ActiveCall from '@/components/calls/active-call';
import { PhoneOff } from 'lucide-react';

interface WebRTCContextType {
  callState: CallState;
  initiateCall: (
    receiverId: string,
    receiverName: string,
    callType: 'VOICE' | 'VIDEO',
    callId: string,
  ) => Promise<void>;
  endCall: () => void;
}

const WebRTCContext = createContext<WebRTCContextType>({
  callState: 'idle',
  initiateCall: async () => {},
  endCall: () => {},
});

export const useWebRTCContext = () => useContext(WebRTCContext);

export default function WebRTCProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    callState,
    localStream,
    remoteStream,
    incomingCall,
    initiateCall,
    acceptCall,
    declineCall,
    endCall,
  } = useWebRTC();

  return (
    <WebRTCContext.Provider
      value={{ callState, initiateCall, endCall }}
    >
      {children}

      {/* Incoming Call Modal */}
      {callState === 'incoming' && incomingCall && (
        <IncomingCallModal
          callerName={incomingCall.callerName}
          callerAvatar={incomingCall.callerAvatar}
          callType={incomingCall.callType}
          onAccept={acceptCall}
          onDecline={declineCall}
        />
      )}

      {/* Calling Screen */}
      {callState === 'calling' && (
        <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-green-600/20 animate-pulse mb-6 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-600/40 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-green-600" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-2">Calling...</p>
          <h2 className="text-white text-2xl font-bold mb-12">
            {incomingCall?.callerName ?? 'Unknown'}
          </h2>
          <button
            onClick={endCall}
            className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition"
          >
            <PhoneOff size={24} className="text-white" />
          </button>
          <span className="text-gray-400 text-xs mt-2">Cancel</span>
        </div>
      )}

      {/* Active Call Screen */}
      {callState === 'active' && (
        <ActiveCall
          callerName={incomingCall?.callerName ?? 'Unknown'}
          callerAvatar={incomingCall?.callerAvatar}
          callType={incomingCall?.callType ?? 'VOICE'}
          localStream={localStream}
          remoteStream={remoteStream}
          onEnd={endCall}
        />
      )}
    </WebRTCContext.Provider>
  );
}