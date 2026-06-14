'use client';

import {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { useWebRTC, CallState } from '@/hooks/useWebRTC';
import IncomingCallModal from '@/components/calls/incoming-call-modal';
import ActiveCall from '@/components/calls/active-call';

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

      {/* Active Call Screen */}
      {callState === 'active' && incomingCall && (
        <ActiveCall
          callerName={incomingCall.callerName}
          callerAvatar={incomingCall.callerAvatar}
          callType={incomingCall.callType}
          localStream={localStream}
          remoteStream={remoteStream}
          onEnd={endCall}
        />
      )}
    </WebRTCContext.Provider>
  );
}
