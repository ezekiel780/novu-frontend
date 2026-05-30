import Sidebar from '@/components/shared/sidebar';
import ConversationList from '@/components/chat/conversation-list';
import SocketProvider from '@/providers/socket.provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <div className="flex h-screen bg-gray-950 overflow-hidden">
        <Sidebar />
        <ConversationList />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </SocketProvider>
  );
}
