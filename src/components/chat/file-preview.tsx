'use client';

import { Media } from '@/types';
import { formatFileSize } from '@/lib/utils';
import { FileText, Music, Download, X } from 'lucide-react';

interface Props {
  media: Media;
  onRemove?: () => void;
  showRemove?: boolean;
}

export default function FilePreview({ media, onRemove, showRemove }: Props) {
  const isImage = media.fileType.startsWith('image/');
  const isVideo = media.fileType.startsWith('video/');
  const isAudio = media.fileType.startsWith('audio/');

  if (isImage) {
    return (
      <div className="relative group">
        <img
          src={media.fileUrl}
          alt={media.fileName ?? 'Image'}
          className="max-w-xs max-h-48 rounded-xl object-cover"
        />
        {showRemove && onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
          >
            <X size={12} className="text-white" />
          </button>
        )}
        <a href={media.fileUrl} download={media.fileName ?? 'image'} target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <Download size={14} className="text-white" />
        </a>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="relative group max-w-xs">
        <video src={media.fileUrl} controls className="rounded-xl max-w-full max-h-48" />
        {showRemove && onRemove && (
          <button onClick={onRemove} className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center">
            <X size={12} className="text-white" />
          </button>
        )}
      </div>
    );
  }

  if (isAudio) {
    return (
      <div className="flex items-center gap-3 bg-gray-800 rounded-xl p-3 max-w-xs">
        <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center shrink-0">
          <Music size={18} className="text-purple-400" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-white text-xs font-medium truncate">{media.fileName ?? 'Audio'}</p>
          <audio src={media.fileUrl} controls className="w-full mt-1 h-8" />
        </div>
        {showRemove && onRemove && (
          <button onClick={onRemove}>
            <X size={14} className="text-gray-400 hover:text-white" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-gray-800 rounded-xl p-3 max-w-xs group">
      <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center shrink-0">
        <FileText size={18} className="text-blue-400" />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-white text-xs font-medium truncate">{media.fileName ?? 'File'}</p>
        <p className="text-gray-400 text-xs">{formatFileSize(media.fileSize)}</p>
      </div>
      <div className="flex items-center gap-2">
        <a href={media.fileUrl} download={media.fileName ?? 'file'} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
          <Download size={16} />
        </a>
        {showRemove && onRemove && (
          <button onClick={onRemove} className="text-gray-400 hover:text-red-400 transition">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
