'use client';

import { useState } from 'react';
import { useConversations } from '@/hooks/useConversations';
import ConversationItem from './conversation-item';
import NewConversationModal from './new-conversation-modal';
import { Plus, Loader2, MessageSquare } from 'lucide-react';

export default function ConversationList() {
  const [showModal, setShowModal] = useState(false);
  const { data: conversations, isLoading, error } = useConversations();

  return (
    <div className="w-80 h-full bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-white font-semibold text-lg">Messages</h2>
        <button
          onClick={() => setShowModal(true)}
          className="w-8 h-8 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center transition"
        >
          <Plus size={18} className="text-white" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <Loader2 size={24} className="animate-spin text-gray-400" />
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 text-sm">Failed to load conversations</p>
          </div>
        )}

        {!isLoading && conversations?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <MessageSquare size={28} className="text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm font-medium">No conversations yet</p>
            <p className="text-gray-500 text-xs mt-1">
              Click the + button to start a new chat
            </p>
          </div>
        )}

        {conversations?.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
          />
        ))}
      </div>

      {/* New Conversation Modal */}
      {showModal && (
        <NewConversationModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
