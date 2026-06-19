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
  const callAcceptedRef = useRef<boolean>(false);

  const clearMissedTimer = () => {
    if (missedCallTimerRef.current) {
      clearTimeout(missedCallTimerRef.current);
      missedCallTimerRef.current = null;
    }
  };

  const endCall = useCallback(() => {
    clearMissedTimer();

    peerConnection.current?.close();
    peerConnection.current = null;

    localStream?.getTracks().forEach((track) => track.stop());

    if (currentCallRef.current) {
      socket?.emit('call:end', {
        receiverId: currentCallRef.current.callerId,
      });
    }

    currentCallRef.current = null;
    callAcceptedRef.current = false;
    setCallState('idle');
    setIncomingCall(null);
    setLocalStream(null);
    setRemoteStream(null);
  }, [localStream, socket]);

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
      // ← Only set active when remote stream arrives
      setCallState('active');
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      // ← Only end call if it was actually accepted and connected before
      if (
        callAcceptedRef.current &&
        (pc.connectionState === 'failed' ||
          pc.connectionState === 'closed')
      ) {
        endCall();
      }
    };

    return pc;
  }, [socket, endCall]);

  const getMediaStream = async (callType: 'VOICE' | 'VIDEO') => {
    return navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callType === 'VIDEO',
    });
  };

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

      // ← Mark missed after 60 seconds if no answer
      missedCallTimerRef.current = setTimeout(() => {
        if (currentCallRef.current?.callId && !callAcceptedRef.current) {
          updateCallStatus({
            id: currentCallRef.current.callId,
            status: 'MISSED',
          });
          endCall();
        }
      }, 60000);

    } catch (error) {
      console.error('Error initiating call:', error);
      endCall();
    }
  };

  // ── Accept Call ───────────────────────────
  const acceptCall = async () => {
    if (!incomingCall) return;

    clearMissedTimer();
    callAcceptedRef.current = true;

    try {
      const stream = await getMediaStream(incomingCall.callType);
      setLocalStream(stream);

      currentCallRef.current = incomingCall;

      // ← Add tracks to existing peer connection
      if (peerConnection.current) {
        stream.getTracks().forEach((track) =>
          peerConnection.current!.addTrack(track, stream),
        );
      }

      socket?.emit('call:accept', {
        callerId: incomingCall.callerId,
        callId: incomingCall.callId,
      });

      // ← Do NOT set active here — wait for remote stream via ontrack

    } catch (error) {
      console.error('Error accepting call:', error);
      declineCall();
    }
  };

  // ── Decline Call ──────────────────────────
  const declineCall = () => {
    if (incomingCall) {
      socket?.emit('call:decline', { callerId: incomingCall.callerId });
      updateCallStatus({
        id: incomingCall.callId,
        status: 'DECLINED',
      });
    }
    clearMissedTimer();
    peerConnection.current?.close();
    peerConnection.current = null;
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

      // ← Create peer connection and set remote description
      // but do NOT get media yet — wait for user to accept
      const pc = createPeerConnection();
      peerConnection.current = pc;
      await pc.setRemoteDescription(
        new RTCSessionDescription(data.offer),
      );

      // ← Create answer ready but send only after accept
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Store answer to send when user accepts
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
      clearMissedTimer();
      callAcceptedRef.current = true;

      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer),
        );
        // ← active state set by ontrack when stream arrives
      }
    };

    const handleCallDeclined = () => {
      if (currentCallRef.current?.callId) {
        updateCallStatus({
          id: currentCallRef.current.callId,
          status: 'DECLINED',
        });
      }
      clearMissedTimer();
      endCall();
    };

    const handleCallEnded = () => {
      if (currentCallRef.current?.callId && callAcceptedRef.current) {
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
        try {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(data.candidate),
          );
        } catch (err) {
          console.error('ICE candidate error:', err);
        }
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
