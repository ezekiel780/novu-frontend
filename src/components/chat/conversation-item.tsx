'use client';

import { Conversation } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import Avatar from '@/components/shared/avatar';
import { formatMessageTime, truncate, cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';

interface Props {
  conversation: Conversation;
}

export default function ConversationItem({ conversation }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isActive = pathname === `/chat/${conversation.id}`;
  const lastMessage = conversation.messages?.[0];

  // Get the other user in DM
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

  return (
    <button
      onClick={() => router.push(`/chat/${conversation.id}`)}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl transition text-left',
        isActive
          ? 'bg-green-600/20 border border-green-600/20'
          : 'hover:bg-gray-800',
      )}
    >
      <Avatar
        src={avatar}
        name={name}
        size="md"
        isOnline={isOnline}
      />
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="text-white text-sm font-medium truncate">{name}</p>
          {lastMessage && (
            <span className="text-gray-500 text-xs shrink-0 ml-2">
              {formatMessageTime(lastMessage.createdAt)}
            </span>
          )}
        </div>
        <p className="text-gray-400 text-xs truncate mt-0.5">
          {lastMessage
            ? lastMessage.messageType === 'TEXT'
              ? truncate(lastMessage.content ?? '', 40)
              : `📎 ${lastMessage.messageType.toLowerCase()}`
            : 'No messages yet'}
        </p>
      </div>
    </button>
  );
}
