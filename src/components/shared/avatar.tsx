import { getInitials, cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

export default function Avatar({
  src,
  name,
  size = 'md',
  isOnline,
  className,
}: AvatarProps) {
  return (
    <div className={cn('relative shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            'rounded-full object-cover',
            sizes[size],
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-purple-600 flex items-center justify-center font-semibold text-white',
            sizes[size],
          )}
        >
          {getInitials(name)}
        </div>
      )}

      {/* Online indicator */}
      {isOnline !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            isOnline ? 'bg-green-500' : 'bg-gray-500',
            size === 'sm' ? 'w-2 h-2' : 'w-3 h-3',
          )}
        />
      )}
    </div>
  );
}
