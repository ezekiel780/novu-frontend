'use client';

import { useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import Avatar from '@/components/shared/avatar';
import { useUploadAvatar } from '@/hooks/useProfile';
import { User } from '@/types';

interface Props {
  user: User;
}

export default function AvatarUpload({ user }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadAvatar, isPending } = useUploadAvatar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAvatar(file);
  };

  return (
    <div className="relative w-fit mx-auto">
      <Avatar
        src={user.avatarUrl}
        name={user.displayName}
        size="xl"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="absolute bottom-0 right-0 w-8 h-8 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900 transition"
      >
        {isPending ? (
          <Loader2 size={14} className="animate-spin text-white" />
        ) : (
          <Camera size={14} className="text-white" />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
