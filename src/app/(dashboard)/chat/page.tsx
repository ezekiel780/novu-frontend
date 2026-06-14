'use client';

import { MessageSquare } from 'lucide-react';
import BrandLogo from '@/components/shared/brand-logo';

export default function ChatPage() {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-white to-purple-50">
      <div className="text-center px-4">
        <BrandLogo size="sm" className="mb-3" />
        <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <MessageSquare size={24} className="text-purple-600" />
        </div>
        <h2 className="text-purple-900 text-lg font-semibold mb-1">
          Welcome to Novu
        </h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          Select a conversation from the left to start messaging
        </p>
      </div>
    </div>
  );
}
