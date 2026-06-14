'use client';

import { useState } from 'react';
import {
  Bell,
  Lock,
  Palette,
  Shield,
  Smartphone,
  ChevronRight,
  Check,
  Moon,
  Volume2,
  MessageSquare,
  Phone,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

// ── Types ─────────────────────────────────
interface SettingToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (val: boolean) => void;
}

interface SettingItemProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick?: () => void;
  value?: string;
  iconColor?: string;
}

// ── Toggle Component ──────────────────────
function SettingToggle({
  label,
  description,
  value,
  onChange,
}: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 pr-4">
        <p className="text-white text-sm font-medium">{label}</p>
        {description && (
          <p className="text-gray-400 text-xs mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          'w-12 h-6 rounded-full transition-colors relative shrink-0',
          value ? 'bg-green-600' : 'bg-gray-700',
        )}
      >
        <span
          className={cn(
            'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm',
            value ? 'translate-x-7' : 'translate-x-1',
          )}
        />
      </button>
    </div>
  );
}

// ── Setting Item Component ────────────────
function SettingItem({
  icon: Icon,
  label,
  description,
  onClick,
  value,
  iconColor = 'text-gray-400',
}: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 hover:bg-gray-800/50 rounded-xl px-2 -mx-2 transition group"
    >
      <div
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
          'bg-gray-800 group-hover:bg-gray-700 transition',
        )}
      >
        <Icon size={18} className={iconColor} />
      </div>
      <div className="flex-1 text-left overflow-hidden">
        <p className="text-white text-sm font-medium">{label}</p>
        {description && (
          <p className="text-gray-400 text-xs mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {value && (
          <span className="text-gray-400 text-xs">{value}</span>
        )}
        <ChevronRight
          size={16}
          className="text-gray-600 group-hover:text-gray-400 transition"
        />
      </div>
    </button>
  );
}

// ── Section Component ─────────────────────
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
      <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
        {title}
      </h2>
      <div className="divide-y divide-gray-800">{children}</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────
export default function SettingsPage() {
  const { user } = useAuthStore();

  // Notification settings
  const [notifications, setNotifications] = useState({
    messages: true,
    calls: true,
    groups: true,
    sounds: true,
    vibration: true,
    preview: true,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    readReceipts: true,
    onlineStatus: true,
    typingIndicator: true,
  });

  const updateNotification = (
    key: keyof typeof notifications,
    val: boolean,
  ) => {
    setNotifications((prev) => ({ ...prev, [key]: val }));
  };

  const updatePrivacy = (key: keyof typeof privacy, val: boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-950">
      <div className="max-w-xl mx-auto p-6 space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-white text-2xl font-bold">Settings</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your preferences
          </p>
        </div>

        {/* Account Section */}
        <Section title="Account">
          <SettingItem
            icon={Shield}
            label="Email Address"
            description={user?.email}
            iconColor="text-green-400"
            onClick={() => {}}
          />
          <SettingItem
            icon={Lock}
            label="Change Password"
            description="Update your account password"
            iconColor="text-blue-400"
            onClick={() => {}}
          />
          <SettingItem
            icon={Smartphone}
            label="Linked Devices"
            description="Manage devices connected to your account"
            iconColor="text-purple-400"
            onClick={() => {}}
          />
        </Section>

        {/* Notifications Section */}
        <Section title="Notifications">
          <div className="py-1">
            <SettingToggle
              label="Message Notifications"
              description="Get notified for new messages"
              value={notifications.messages}
              onChange={(val) => updateNotification('messages', val)}
            />
          </div>
          <div className="py-1">
            <SettingToggle
              label="Call Notifications"
              description="Get notified for incoming calls"
              value={notifications.calls}
              onChange={(val) => updateNotification('calls', val)}
            />
          </div>
          <div className="py-1">
            <SettingToggle
              label="Group Notifications"
              description="Get notified for group activity"
              value={notifications.groups}
              onChange={(val) => updateNotification('groups', val)}
            />
          </div>
          <div className="py-1">
            <SettingToggle
              label="Notification Sounds"
              description="Play sound for notifications"
              value={notifications.sounds}
              onChange={(val) => updateNotification('sounds', val)}
            />
          </div>
          <div className="py-1">
            <SettingToggle
              label="Message Preview"
              description="Show message content in notifications"
              value={notifications.preview}
              onChange={(val) => updateNotification('preview', val)}
            />
          </div>
        </Section>

        {/* Privacy Section */}
        <Section title="Privacy">
          <div className="py-1">
            <SettingToggle
              label="Read Receipts"
              description="Let others know when you have read their messages"
              value={privacy.readReceipts}
              onChange={(val) => updatePrivacy('readReceipts', val)}
            />
          </div>
          <div className="py-1">
            <SettingToggle
              label="Online Status"
              description="Show when you are online"
              value={privacy.onlineStatus}
              onChange={(val) => updatePrivacy('onlineStatus', val)}
            />
          </div>
          <div className="py-1">
            <SettingToggle
              label="Typing Indicator"
              description="Show when you are typing"
              value={privacy.typingIndicator}
              onChange={(val) => updatePrivacy('typingIndicator', val)}
            />
          </div>
          <SettingItem
            icon={Lock}
            label="Blocked Contacts"
            description="Manage blocked users"
            iconColor="text-red-400"
            onClick={() => {}}
          />
        </Section>

        {/* Appearance Section */}
        <Section title="Appearance">
          <SettingItem
            icon={Moon}
            label="Theme"
            description="Dark mode only"
            value="Dark"
            iconColor="text-indigo-400"
            onClick={() => {}}
          />
          <SettingItem
            icon={MessageSquare}
            label="Chat Wallpaper"
            description="Customize your chat background"
            iconColor="text-pink-400"
            onClick={() => {}}
          />
          <SettingItem
            icon={Palette}
            label="Font Size"
            description="Adjust message text size"
            value="Medium"
            iconColor="text-yellow-400"
            onClick={() => {}}
          />
        </Section>

        {/* Storage Section */}
        <Section title="Storage & Data">
          <SettingItem
            icon={Smartphone}
            label="Storage Usage"
            description="Manage downloaded media"
            iconColor="text-orange-400"
            onClick={() => {}}
          />
          <SettingItem
            icon={Volume2}
            label="Auto-Download Media"
            description="Images, videos and documents"
            value="Wi-Fi only"
            iconColor="text-cyan-400"
            onClick={() => {}}
          />
        </Section>

        {/* About Section */}
        <Section title="About">
          <SettingItem
            icon={Shield}
            label="Privacy Policy"
            iconColor="text-gray-400"
            onClick={() => {}}
          />
          <SettingItem
            icon={Shield}
            label="Terms of Service"
            iconColor="text-gray-400"
            onClick={() => {}}
          />
          <div className="py-3 text-center">
            <p className="text-gray-500 text-xs">Novu v1.0.0</p>
            <p className="text-gray-600 text-xs mt-0.5">
              Built by Balogun Ezekiel
            </p>
          </div>
        </Section>

      </div>
    </div>
  );
}
