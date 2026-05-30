import BrandLogo from '@/components/shared/brand-logo';
import { authCardClass } from './auth-ui';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-4">
        <BrandLogo size="sm" className="mb-2" />
        <h1 className="text-xl font-bold text-purple-900">{title}</h1>
        {subtitle && (
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        )}
      </div>
      <div className={authCardClass}>{children}</div>
    </div>
  );
}
