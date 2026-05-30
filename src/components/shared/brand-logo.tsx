import WhatsAppLogo from './whatsapp-logo';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  size?: 'sm' | 'lg';
  showText?: boolean;
  compact?: boolean;
  className?: string;
}

export default function BrandLogo({
  size = 'lg',
  showText = true,
  compact = false,
  className,
}: BrandLogoProps) {
  const iconSize = size === 'lg' ? 40 : 32;
  const textClass = size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={cn('flex items-center justify-center gap-3', className)}>
      <WhatsAppLogo size={iconSize} />
      {showText && (
        <span
          className={cn(
            'font-bold text-purple-700',
            textClass,
            compact && 'hidden lg:inline',
          )}
        >
          Novu
        </span>
      )}
    </div>
  );
}
