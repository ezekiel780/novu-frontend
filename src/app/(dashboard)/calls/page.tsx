'use client';

import { useState } from 'react';
import { useCalls } from '@/hooks/useCalls';
import CallItem from '@/components/calls/call-item';
import { Phone, Video, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'missed';

export default function CallsPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCalls();

  const allCalls = data?.pages.flatMap((page: { calls: any[]; nextCursor: string | null }) => page.calls) ?? [];

  const filteredCalls =
    filter === 'missed'
      ? allCalls.filter((c) => c.status === 'MISSED')
      : allCalls;

  return (
    <div className="h-full flex flex-col bg-gray-950">

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-white" />
            <h1 className="text-white font-semibold text-lg">Calls</h1>
          </div>

          {/* New Call Buttons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm font-medium px-3 py-2 rounded-xl transition">
              <Phone size={16} />
              <span className="hidden sm:block">Voice</span>
            </button>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-3 py-2 rounded-xl transition">
              <Video size={16} />
              <span className="hidden sm:block">Video</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'missed'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition capitalize',
                filter === f
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white',
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2">

        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <Loader2 size={24} className="animate-spin text-gray-400" />
          </div>
        )}

        {!isLoading && filteredCalls.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone size={36} className="text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">
              {filter === 'missed' ? 'No missed calls' : 'No call history'}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {filter === 'missed'
                ? 'You have not missed any calls'
                : 'Make your first call'}
            </p>
          </div>
        )}

        {filteredCalls.map((call) => (
          <CallItem key={call.id} call={call} />
        ))}

        {/* Load More */}
        {hasNextPage && (
          <div className="flex justify-center py-4">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-green-400 hover:text-green-300 text-sm flex items-center gap-2"
            >
              {isFetchingNextPage && (
                <Loader2 size={14} className="animate-spin" />
              )}
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
