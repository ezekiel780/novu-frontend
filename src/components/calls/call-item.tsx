'use client';

import { Call } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import Avatar from '@/components/shared/avatar';
import { formatLastSeen, formatCallDuration, cn } from '@/lib/utils';
import {
  Phone,
  Video,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
} from 'lucide-react';
import { useInitiateCall } from '@/hooks/useCalls';

interface Props {
  call: Call;
}

export default function CallItem({ call }: Props) {
  const { user } = useAuthStore();
  const { mutate: initiateCall } = useInitiateCall();

  const isOutgoing = call.callerId === user?.id;
  const otherUser = isOutgoing ? call.receiver : call.caller;

  const StatusIcon = () => {
    if (call.status === 'MISSED')
      return <PhoneMissed size={14} className="text-red-400" />;
    if (isOutgoing)
      return <PhoneOutgoing size={14} className="text-green-400" />;
    return <PhoneIncoming size={14} className="text-blue-400" />;
  };

  const statusLabel = () => {
    if (call.status === 'MISSED') return 'Missed';
    if (call.status === 'DECLINED') return 'Declined';
    if (isOutgoing) return 'Outgoing';
    return 'Incoming';
  };

  const statusColor = () => {
    if (call.status === 'MISSED') return 'text-red-400';
    if (call.status === 'DECLINED') return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-900 transition group">
      {/* Avatar */}
      <Avatar
        src={otherUser?.avatarUrl}
        name={otherUser?.displayName ?? 'Unknown'}
        size="md"
      />

      {/* Info */}
      <div className="flex-1 overflow-hidden">
        <p className="text-white text-sm font-medium">
          {otherUser?.displayName ?? 'Unknown'}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <StatusIcon />
          <span className={cn('text-xs', statusColor())}>
            {statusLabel()}
          </span>
          {call.duration && (
            <span className="text-gray-500 text-xs">
              · {formatCallDuration(call.duration)}
            </span>
          )}
        </div>
      </div>

      {/* Time + Call Back */}
      <div className="flex flex-col items-end gap-2">
        <span className="text-gray-500 text-xs">
          {formatLastSeen(call.startedAt)}
        </span>
        <button
          onClick={() =>
            initiateCall({
              receiverId: otherUser?.id ?? '',
              type: call.type,
            })
          }
          className="opacity-0 group-hover:opacity-100 w-8 h-8 bg-green-600/20 hover:bg-green-600 rounded-full flex items-center justify-center transition"
        >
          {call.type === 'VIDEO' ? (
            <Video size={14} className="text-green-400 hover:text-white" />
          ) : (
            <Phone size={14} className="text-green-400 hover:text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
