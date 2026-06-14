'use client';

import { useProfile } from '@/hooks/useProfile';
import AvatarUpload from '@/components/profile/avatar-upload';
import ProfileForm from '@/components/profile/profile-form';
import DangerZone from '@/components/profile/danger-zone';
import { Loader2, Mail, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { data: user, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-full overflow-y-auto bg-gray-950">
      <div className="max-w-xl mx-auto p-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-white text-2xl font-bold">Profile</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your personal information
          </p>
        </div>

        {/* Avatar Card */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 text-center">
          <AvatarUpload user={user} />
          <h2 className="text-white font-semibold text-lg mt-4">
            {user.displayName}
          </h2>
          <p className="text-gray-400 text-sm mt-1">{user.status}</p>

          {/* Info Pills */}
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-gray-800 rounded-full px-3 py-1.5">
              <Mail size={12} className="text-gray-400" />
              <span className="text-gray-300 text-xs">{user.email}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-800 rounded-full px-3 py-1.5">
              <Shield size={12} className="text-green-400" />
              <span className="text-green-400 text-xs capitalize">
              {user?.role?.toLowerCase() ?? 'user'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="text-white font-semibold mb-5">
            Edit Information
          </h2>
          <ProfileForm user={user} />
        </div>

        {/* Danger Zone */}
        <DangerZone />
      </div>
    </div>
  );
}
