'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSocketContext } from '@/providers/socket.provider';
import { useAuthStore } from '@/store/auth.store';
import { useUpdateCallStatus } from '@/hooks/useCalls';

export type CallState = 'idle' | 'calling' | 'incoming' | 'active';

export interface IncomingCallData {
  callerName: string;
  callerAvatar?: string;
  callType: 'VOICE' | 'VIDEO';
  callId: string;
  callerId: string;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.relay.metered.ca:80' },
    {
      urls: 'turn:global.relay.metered.ca:80',
      username: process.env.NEXT_PUBLIC_TURN_USERNAME,
      credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
    },
    {
      urls: 'turn:global.relay.metered.ca:80?transport=tcp',
      username: process.env.NEXT_PUBLIC_TURN_USERNAME,
      credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
    },
    {
      urls: 'turn:global.relay.metered.ca:443',
      username: process.env.NEXT_PUBLIC_TURN_USERNAME,
      credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
    },
    {
      urls: 'turns:global.relay.metered.ca:443?transport=tcp',
      username: process.env.NEXT_PUBLIC_TURN_USERNAME,
      credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
    },
  ],
};

export const useWebRTC = () => {
  const { socket } = useSocketContext();
  const { user } = useAuthStore();
  const { mutate: updateCallStatus } = useUpdateCallStatus();

  const [callState, setCallState] = useState<CallState>('idle');
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const currentCallRef = useRef<IncomingCallData | null>(null);
  const missedCallTimerRef = useRef<NodeJS.Timeout | null>(null);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate && currentCallRef.current) {
        socket?.emit('call:ice-candidate', {
          targetId: currentCallRef.current.callerId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      if (
        pc.connectionState === 'disconnected' ||
        pc.connectionState === 'failed' ||
        pc.connectionState === 'closed'
      ) {
        endCall();
      }
    };

    return pc;
  }, [socket]);

  const getMediaStream = async (callType: 'VOICE' | 'VIDEO') => {
    return navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callType === 'VIDEO',
    });
  };

  const endCall = useCallback(() => {
    // Clear missed call timer
    if (missedCallTimerRef.current) {
      clearTimeout(missedCallTimerRef.current);
      missedCallTimerRef.current = null;
    }

    peerConnection.current?.close();
    peerConnection.current = null;

    localStream?.getTracks().forEach((track) => track.stop());

    if (currentCallRef.current) {
      socket?.emit('call:end', {
        receiverId: currentCallRef.current.callerId,
      });
    }

    currentCallRef.current = null;
    setCallState('idle');
    setIncomingCall(null);
    setLocalStream(null);
    setRemoteStream(null);
  }, [localStream, socket]);

  // ── Initiate Call ─────────────────────────
  const initiateCall = async (
    receiverId: string,
    receiverName: string,
    callType: 'VOICE' | 'VIDEO',
    callId: string,
    receiverAvatar?: string,
  ) => {
    try {
      const stream = await getMediaStream(callType);
      setLocalStream(stream);

      const pc = createPeerConnection();
      peerConnection.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const callData: IncomingCallData = {
        callerName: receiverName,
        callerAvatar: receiverAvatar,
        callType,
        callId,
        callerId: receiverId,
      };

      currentCallRef.current = callData;

      // ← Show receiver info immediately
      setIncomingCall(callData);
      setCallState('calling');

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket?.emit('call:invite', {
        receiverId,
        type: callType,
        offer,
        callId,
        callerName: user?.displayName,
        callerAvatar: user?.avatarUrl,
      });

      // ← Mark as missed after 30 seconds if no answer
      missedCallTimerRef.current = setTimeout(() => {
        if (currentCallRef.current?.callId) {
          updateCallStatus({
            id: currentCallRef.current.callId,
            status: 'MISSED',
          });
        }
        endCall();
      }, 30000);

    } catch (error) {
      console.error('Error initiating call:', error);
      endCall();
    }
  };

  // ── Accept Call ───────────────────────────
  const acceptCall = async () => {
    if (!incomingCall) return;

    // Clear missed timer when accepted
    if (missedCallTimerRef.current) {
      clearTimeout(missedCallTimerRef.current);
      missedCallTimerRef.current = null;
    }

    try {
      const stream = await getMediaStream(incomingCall.callType);
      setLocalStream(stream);

      const pc = createPeerConnection();
      peerConnection.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      currentCallRef.current = incomingCall;

      socket?.emit('call:accept', {
        callerId: incomingCall.callerId,
        callId: incomingCall.callId,
      });

      setCallState('active');
    } catch (error) {
      console.error('Error accepting call:', error);
      declineCall();
    }
  };

  // ── Decline Call ──────────────────────────
  const declineCall = () => {
    if (incomingCall) {
      socket?.emit('call:decline', { callerId: incomingCall.callerId });

      // ← Mark as declined in DB
      updateCallStatus({
        id: incomingCall.callId,
        status: 'DECLINED',
      });
    }

    if (missedCallTimerRef.current) {
      clearTimeout(missedCallTimerRef.current);
      missedCallTimerRef.current = null;
    }

    setCallState('idle');
    setIncomingCall(null);
  };

  // ── Socket Events ─────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = async (data: {
      callerId: string;
      callerName?: string;
      callerAvatar?: string;
      type: 'VOICE' | 'VIDEO';
      offer: RTCSessionDescriptionInit;
      callId: string;
    }) => {
      setIncomingCall({
        callerName: data.callerName ?? 'Unknown',
        callerAvatar: data.callerAvatar,
        callType: data.type,
        callId: data.callId,
        callerId: data.callerId,
      });
      setCallState('incoming');

      const pc = createPeerConnection();
      peerConnection.current = pc;
      await pc.setRemoteDescription(
        new RTCSessionDescription(data.offer),
      );

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('call:accept', {
        callerId: data.callerId,
        answer,
        callId: data.callId,
      });
    };

    const handleCallAccepted = async (data: {
      userId: string;
      answer: RTCSessionDescriptionInit;
    }) => {
      // Clear missed timer — call was answered
      if (missedCallTimerRef.current) {
        clearTimeout(missedCallTimerRef.current);
        missedCallTimerRef.current = null;
      }

      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer),
        );
        setCallState('active');
      }
    };

    const handleCallDeclined = () => {
      // Mark as declined
      if (currentCallRef.current?.callId) {
        updateCallStatus({
          id: currentCallRef.current.callId,
          status: 'DECLINED',
        });
      }
      endCall();
    };

    const handleCallEnded = () => {
      // Mark as completed
      if (currentCallRef.current?.callId) {
        updateCallStatus({
          id: currentCallRef.current.callId,
          status: 'COMPLETED',
        });
      }
      endCall();
    };

    const handleIceCandidate = async (data: {
      userId: string;
      candidate: RTCIceCandidateInit;
    }) => {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(data.candidate),
        );
      }
    };

    socket.on('call:incoming', handleIncomingCall);
    socket.on('call:accepted', handleCallAccepted);
    socket.on('call:declined', handleCallDeclined);
    socket.on('call:ended', handleCallEnded);
    socket.on('call:ice-candidate', handleIceCandidate);

    return () => {
      socket.off('call:incoming', handleIncomingCall);
      socket.off('call:accepted', handleCallAccepted);
      socket.off('call:declined', handleCallDeclined);
      socket.off('call:ended', handleCallEnded);
      socket.off('call:ice-candidate', handleIceCandidate);
    };
  }, [socket, createPeerConnection, endCall, updateCallStatus]);

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
