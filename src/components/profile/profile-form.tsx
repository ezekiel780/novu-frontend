'use client';

import { useForm } from '@tanstack/react-form';
import { useUpdateProfile } from '@/hooks/useProfile';
import { User } from '@/types';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';

interface Props {
  user: User;
}

export default function ProfileForm({ user }: Props) {
  const [saved, setSaved] = useState(false);
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();

  const form = useForm({
    defaultValues: {
      displayName: user.displayName ?? '',
      bio: user.bio ?? '',
      status: user.status ?? '',
      phoneNumber: user.phoneNumber ?? '',
    },
    onSubmit: ({ value }) => {
      updateProfile(value, {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-5"
    >
      {/* Success */}
      {saved && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
          <p className="text-green-400 text-sm text-center">
             Profile updated successfully
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <p className="text-red-400 text-sm text-center">
            {(error as any)?.response?.data?.message ?? 'Update failed'}
          </p>
        </div>
      )}

      {/* Display Name */}
      <form.Field name="displayName">
        {(field) => (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">
              Display Name
            </label>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Your name"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm"
            />
          </div>
        )}
      </form.Field>

      {/* Bio */}
      <form.Field name="bio">
        {(field) => (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">
              Bio
            </label>
            <textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Tell people about yourself"
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm resize-none"
            />
          </div>
        )}
      </form.Field>

      {/* Status */}
      <form.Field name="status">
        {(field) => (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">
              Status
            </label>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Hey there! I am using Novu"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm"
            />
          </div>
        )}
      </form.Field>

      {/* Phone Number */}
      <form.Field name="phoneNumber">
        {(field) => (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">
              Phone Number
              <span className="text-gray-500 font-normal ml-2">
                (for WhatsApp)
              </span>
            </label>
            <input
              type="tel"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="2348012345678"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm"
            />
          </div>
        )}
      </form.Field>

      {/* Save Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-900 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
      >
        {isPending ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Save size={18} />
        )}
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
