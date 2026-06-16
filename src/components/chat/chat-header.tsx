'use client';

import { Conversation } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import Avatar from '@/components/shared/avatar';
import { Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { formatLastSeen } from '@/lib/utils';
import { useWebRTCContext } from '@/providers/webrtc.provider';
import { useInitiateCall } from '@/hooks/useCalls';
import { useRouter } from 'next/navigation';

interface Props {
  conversation: Conversation;
  isTyping?: boolean;
  typingUser?: string;
}

export default function ChatHeader({
  conversation,
  isTyping,
  typingUser,
}: Props) {
  const { user } = useAuthStore();
  const { initiateCall } = useWebRTCContext();
  const { mutate: createCall } = useInitiateCall();
  const router = useRouter();

  const otherMember = conversation.members?.find(
    (m) => m.userId !== user?.id,
  );

  const name =
    conversation.type === 'DM'
      ? otherMember?.user?.displayName ?? 'Unknown'
      : conversation.name ?? 'Group Chat';

  const avatar =
    conversation.type === 'DM'
      ? otherMember?.user?.avatarUrl
      : conversation.avatarUrl;

  const isOnline =
    conversation.type === 'DM'
      ? otherMember?.user?.isOnline
      : undefined;

  const subtitle = isTyping
    ? `${typingUser} is typing...`
    : conversation.type === 'DM'
    ? isOnline
      ? 'Online'
      : otherMember?.user?.lastSeen
      ? `Last seen ${formatLastSeen(otherMember.user.lastSeen)}`
      : 'Offline'
    : `${conversation.members?.length ?? 0} members`;

  const handleCall = (type: 'VOICE' | 'VIDEO') => {
    if (!otherMember) return;
    createCall(
      { receiverId: otherMember.userId, type },
      {
        onSuccess: (call) => {
          initiateCall(
            otherMember.userId,
            otherMember.user.displayName,
            type,
            call.id,
          );
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-between px-3 md:px-5 py-3 border-b border-gray-800 bg-gray-900">
      <div className="flex items-center gap-2 md:gap-3">

        {/* Back button — mobile only */}
        <button
          onClick={() => router.push('/')}
          className="md:hidden text-gray-400 hover:text-white transition p-1"
        >
          <ArrowLeft size={20} />
        </button>

        <Avatar src={avatar} name={name} size="md" isOnline={isOnline} />
        <div>
          <p className="text-white font-semibold text-sm">{name}</p>
          <p className={isTyping ? 'text-green-400 text-xs' : 'text-gray-400 text-xs'}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Actions — DM only */}
      {conversation.type === 'DM' && (
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => handleCall('VOICE')}
            className="w-9 h-9 rounded-full hover:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition"
          >
            <Phone size={18} />
          </button>
          <button
            onClick={() => handleCall('VIDEO')}
            className="w-9 h-9 rounded-full hover:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition"
          >
            <Video size={18} />
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition">
            <MoreVertical size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
