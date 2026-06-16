'use client';

import { X, FileText, Music, Film, Image } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

interface Props {
  file: File;
  onRemove: () => void;
  isUploading?: boolean;
}

export default function UploadPreview({ file, onRemove, isUploading }: Props) {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isAudio = file.type.startsWith('audio/');
  const previewUrl = isImage || isVideo ? URL.createObjectURL(file) : null;

  const Icon = isVideo ? Film : isAudio ? Music : FileText;

  return (
    <div className="relative group w-20 h-20 shrink-0">
      {isImage && previewUrl ? (
        <img
          src={previewUrl}
          alt={file.name}
          className="w-full h-full object-cover rounded-xl"
        />
      ) : (
        <div className="w-full h-full bg-gray-800 rounded-xl flex flex-col items-center justify-center gap-1">
          <Icon size={20} className="text-gray-400" />
          <span className="text-gray-500 text-[10px] text-center px-1 truncate w-full text-center">
            {formatFileSize(file.size)}
          </span>
        </div>
      )}

      {/* Uploading overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Remove button */}
      {!isUploading && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          <X size={10} className="text-white" />
        </button>
      )}
    </div>
  );
}
