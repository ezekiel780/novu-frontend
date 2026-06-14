'use client';
import { useState } from 'react';

export type CallState = 'idle' | 'calling' | 'incoming' | 'active';

export interface IncomingCallData {
  callerName: string;
  callerAvatar?: string;
  callType: 'VOICE' | 'VIDEO';
  callId: string;
  callerId: string;
}

export const useWebRTC = () => {
  const [callState, setCallState] = useState<CallState>('idle');
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const initiateCall = async (
    receiverId: string,
    receiverName: string,
    callType: 'VOICE' | 'VIDEO',
    callId: string,
  ) => {
    setCallState('calling');
  };

  const acceptCall = () => {
    setCallState('active');
  };

  const declineCall = () => {
    setCallState('idle');
    setIncomingCall(null);
  };

  const endCall = () => {
    setCallState('idle');
    setIncomingCall(null);
    setLocalStream(null);
    setRemoteStream(null);
  };

  return {
    callState,
    localStream,
    remoteStream,
    incomingCall,
    initiateCall,
    acceptCall,
    declineCall,
    endCall,
  };
};
