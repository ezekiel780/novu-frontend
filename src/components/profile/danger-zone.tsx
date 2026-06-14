'use client';

import { useState } from 'react';
import { useDeleteAccount } from '@/hooks/useProfile';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';

export default function DangerZone() {
  const [confirm, setConfirm] = useState(false);
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  return (
    <div className="border border-red-500/20 rounded-xl p-5 bg-red-500/5">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={18} className="text-red-400" />
        <h3 className="text-red-400 font-semibold text-sm">Danger Zone</h3>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        Deleting your account is permanent and cannot be undone. All your
        messages, conversations, and data will be removed.
      </p>

      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          className="flex items-center gap-2 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2.5 rounded-xl transition"
        >
          <Trash2 size={16} />
          Delete Account
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-red-400 text-sm font-medium">
            Are you absolutely sure? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => deleteAccount()}
              disabled={isPending}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-red-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
            >
              {isPending && (
                <Loader2 size={14} className="animate-spin" />
              )}
              {isPending ? 'Deleting...' : 'Yes, delete my account'}
            </button>
            <button
              onClick={() => setConfirm(false)}
              className="text-gray-400 hover:text-white text-sm px-4 py-2.5 rounded-xl hover:bg-gray-800 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
