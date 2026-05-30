'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  Phone,
  Bell,
  User,
  Settings,
  LogOut,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useUnreadCount } from '@/hooks/useNotifications';
import { useLogout } from '@/hooks/useAuth';
import Avatar from './avatar';
import BrandLogo from './brand-logo';

const navItems = [
  { icon: MessageSquare, label: 'Chats', href: '/' },
  { icon: Phone, label: 'Calls', href: '/calls' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.count ?? 0;

  return (
    <aside className="w-16 lg:w-64 h-screen bg-white border-r border-purple-100 flex flex-col shrink-0">
      <div className="p-4 border-b border-purple-100">
        <BrandLogo size="sm" compact className="justify-center lg:justify-start" />
      </div>

      <div className="p-3 border-b border-purple-100 hidden lg:block">
        <div className="flex items-center gap-2 bg-purple-50 rounded-xl px-3 py-2 border border-purple-100">
          <Search size={18} className="text-purple-400 shrink-0" />
          <input
            placeholder="Search..."
            className="bg-transparent text-base text-gray-900 placeholder-gray-400 focus:outline-none w-full"
          />
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          const showBadge = href === '/notifications' && unreadCount > 0;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition group relative',
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-500 hover:bg-purple-50 hover:text-purple-700',
              )}
            >
              <div className="relative">
                <Icon size={22} className="shrink-0" />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-base font-medium hidden lg:block">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-purple-100 space-y-1">
        <button
          onClick={() => logout()}
          disabled={isPending}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition"
        >
          <LogOut size={22} className="shrink-0" />
          <span className="text-base font-medium hidden lg:block">
            {isPending ? 'Signing out...' : 'Sign Out'}
          </span>
        </button>

        {user && (
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 transition"
          >
            <Avatar
              src={user.avatarUrl}
              name={user.displayName}
              size="sm"
              isOnline={true}
            />
            <div className="hidden lg:block overflow-hidden">
              <p className="text-purple-900 text-base font-medium truncate">
                {user.displayName}
              </p>
              <p className="text-gray-500 text-sm truncate">{user.email}</p>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}
