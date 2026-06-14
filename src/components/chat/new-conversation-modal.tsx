'use client';

import { useState } from 'react';
import { useCreateConversation } from '@/hooks/useConversations';
import { useContacts, useSearchUsers, useAddContact, useRemoveContact } from '@/hooks/useContacts';
import { useRouter } from 'next/navigation';
import { X, Search, Plus, Loader2, Users, User, UserPlus, UserMinus, MessageSquare } from 'lucide-react';
import Avatar from '@/components/shared/avatar';
import { User as UserType } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  onClose: () => void;
}

export default function NewConversationModal({ onClose }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<'contacts' | 'add'>('contacts');
  const [query, setQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [type, setType] = useState<'DM' | 'GROUP'>('DM');
  const [groupName, setGroupName] = useState('');

  const { data: contacts, isLoading: contactsLoading } = useContacts();
  const { data: searchResults, isLoading: searchLoading } = useSearchUsers(query);
  const { mutate: createConversation, isPending } = useCreateConversation();
  const { mutate: addContact, isPending: addingContact } = useAddContact();
  const { mutate: removeContact } = useRemoveContact();

  const toggleUser = (user: any) => {
    setSelectedUsers((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user],
    );
  };

  const handleCreate = () => {
    if (selectedUsers.length === 0) return;
    createConversation(
      {
        type,
        memberIds: selectedUsers.map((u) => u.id),
        name: type === 'GROUP' ? groupName : undefined,
      },
      {
        onSuccess: (conversation) => {
          router.push(`/chat/${conversation.id}`);
          onClose();
        },
      },
    );
  };

  const isContact = (userId: string) =>
    contacts?.some((c) => c.id === userId) ?? false;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-white font-semibold text-lg">New Conversation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Tab Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setTab('contacts')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition',
                tab === 'contacts' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white',
              )}
            >
              <User size={16} />
              My Contacts
            </button>
            <button
              onClick={() => setTab('add')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition',
                tab === 'add' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white',
              )}
            >
              <UserPlus size={16} />
              Add Contact
            </button>
          </div>

          {/* CONTACTS TAB */}
          {tab === 'contacts' && (
            <>
              {/* Type Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setType('DM')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition',
                    type === 'DM' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white',
                  )}
                >
                  <User size={14} /> Direct Message
                </button>
                <button
                  onClick={() => setType('GROUP')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition',
                    type === 'GROUP' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white',
                  )}
                >
                  <Users size={14} /> Group Chat
                </button>
              </div>

              {/* Group Name */}
              {type === 'GROUP' && (
                <input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Group name"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition text-sm"
                />
              )}

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-1.5 bg-green-600/20 border border-green-600/30 rounded-full px-3 py-1">
                      <span className="text-green-400 text-xs font-medium">{user.displayName}</span>
                      <button onClick={() => toggleUser(user)} className="text-green-400 hover:text-white">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Contacts List */}
              <div className="max-h-48 overflow-y-auto space-y-1">
                {contactsLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 size={20} className="animate-spin text-gray-400" />
                  </div>
                )}
                {!contactsLoading && (!contacts || contacts.length === 0) && (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No contacts yet. Add some from the "Add Contact" tab!
                  </p>
                )}
                {contacts?.map((contact) => {
                  const isSelected = selectedUsers.some((u) => u.id === contact.id);
                  return (
                    <button
                      key={contact.id}
                      onClick={() => toggleUser(contact)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-xl transition text-left',
                        isSelected ? 'bg-green-600/20 border border-green-600/30' : 'hover:bg-gray-800',
                      )}
                    >
                      <Avatar src={contact.avatarUrl} name={contact.displayName} size="sm" isOnline={contact.isOnline} />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-white text-sm font-medium truncate">{contact.displayName}</p>
                        <p className="text-gray-400 text-xs truncate">{contact.email}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ADD CONTACT TAB */}
          {tab === 'add' && (
            <>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition text-sm"
                />
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1">
                {searchLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 size={20} className="animate-spin text-gray-400" />
                  </div>
                )}
                {!searchLoading && query.length > 0 && (!searchResults || searchResults.length === 0) && (
                  <p className="text-gray-500 text-sm text-center py-4">No users found</p>
                )}
                {query.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">Type a name or email to search</p>
                )}
                {searchResults?.map((user) => {
                  const alreadyContact = isContact(user.id);
                  return (
                    <div key={user.id} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800">
                      <Avatar src={user.avatarUrl} name={user.displayName} size="sm" isOnline={user.isOnline} />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-white text-sm font-medium truncate">{user.displayName}</p>
                        <p className="text-gray-400 text-xs truncate">{user.email}</p>
                      </div>
                      {alreadyContact ? (
                        <button
                          onClick={() => removeContact(user.id)}
                          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-400/10 px-3 py-1.5 rounded-lg transition"
                        >
                          <UserMinus size={14} />
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => addContact(user.id)}
                          disabled={addingContact}
                          className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 bg-green-400/10 px-3 py-1.5 rounded-lg transition"
                        >
                          <UserPlus size={14} />
                          Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer — only show on contacts tab */}
        {tab === 'contacts' && (
          <div className="p-5 border-t border-gray-800">
            <button
              onClick={handleCreate}
              disabled={isPending || selectedUsers.length === 0 || (type === 'GROUP' && !groupName.trim())}
              className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-900 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 size={18} className="animate-spin" />}
              <MessageSquare size={18} />
              {isPending ? 'Creating...' : type === 'DM' ? 'Start Chat' : 'Create Group'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
