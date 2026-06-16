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
import { useLogout } from '@/hooks/useAuth';
import Avatar from './avatar';
import { useUnreadCount } from '@/hooks/useNotifications';

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

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-16 lg:w-64 h-screen bg-gray-900 border-r border-gray-800 flex-col shrink-0">

        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-white font-bold text-xl hidden lg:block">
              Novu
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-800 hidden lg:block">
          <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              placeholder="Search..."
              className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = isActive(href);
            const showBadge = href === '/notifications' && unreadCount > 0;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition group',
                  active
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                )}
              >
                <div className="relative">
                  <Icon size={20} className="shrink-0" />
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium hidden lg:block">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-gray-800 space-y-1">
          <button
            onClick={() => logout()}
            disabled={isPending}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <LogOut size={20} className="shrink-0" />
            <span className="text-sm font-medium hidden lg:block">
              {isPending ? 'Signing out...' : 'Sign Out'}
            </span>
          </button>

          {user && (
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800 transition"
            >
              <Avatar
                src={user.avatarUrl}
                name={user.displayName}
                size="sm"
                isOnline={true}
              />
              <div className="hidden lg:block overflow-hidden">
                <p className="text-white text-sm font-medium truncate">
                  {user.displayName}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {user.email}
                </p>
              </div>
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40 px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = isActive(href);
            const showBadge = href === '/notifications' && unreadCount > 0;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition',
                  active ? 'text-green-400' : 'text-gray-500',
                )}
              >
                <div className="relative">
                  <Icon size={22} />
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
