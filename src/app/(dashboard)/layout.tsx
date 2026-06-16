'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/shared/sidebar';
import ConversationList from '@/components/chat/conversation-list';
import SocketProvider from '@/providers/socket.provider';
import WebRTCProvider from '@/providers/webrtc.provider';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isInChat = pathname.startsWith('/chat/');
  const isHome = pathname === '/';

  return (
    <SocketProvider>
      <WebRTCProvider>
        <div className="flex h-screen bg-gray-950 overflow-hidden">

          {/* Sidebar — hidden on mobile when in chat */}
          <div className={cn(
            'hidden md:flex',
          )}>
            <Sidebar />
          </div>

          {/* Conversation List
              - Mobile: show when NOT in chat
              - Desktop: always show
          */}
          <div className={cn(
            'w-full md:w-80 shrink-0',
            isInChat ? 'hidden md:flex' : 'flex',
            'flex-col',
          )}>
            <ConversationList />
          </div>

          {/* Main Content
              - Mobile: show only when in chat
              - Desktop: always show
          */}
          <main className={cn(
            'flex-1 overflow-hidden',
            isInChat ? 'flex' : 'hidden md:flex',
          )}>
            {children}
          </main>
        </div>
      </WebRTCProvider>
    </SocketProvider>
  );
}
