import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../common/Avatar';
import { Search } from 'lucide-react';

export function ConversationList() {
  const { users, currentUser } = useAuth();
  const { activeContactId, setActiveContactId, messages } = useChat();
  const [searchTerm, setSearchTerm] = useState('');

  const contacts = users.filter(u => u.id !== currentUser?.id && (
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  return (
    <div className="w-full md:w-72 bg-[#111111] border-r border-[#252525] flex flex-col h-full shrink-0">
      <div className="p-3.5 border-b border-[#252525]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">Team Communication</h3>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-[#1e1e1e]">
        {contacts.map(contact => {
          const isActive = contact.id === activeContactId;
          const thread = messages.filter(
            m => (m.senderId === currentUser?.id && m.receiverId === contact.id) ||
                 (m.senderId === contact.id && m.receiverId === currentUser?.id)
          ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          const lastMsg = thread[0];
          const hasUnread = thread.some(m => m.senderId === contact.id && !m.read);

          return (
            <button
              key={contact.id}
              onClick={() => setActiveContactId(contact.id)}
              className={`w-full flex items-center gap-3 p-3 text-left hover:bg-[#151515] transition-colors ${
                isActive ? 'bg-[#181818] border-l-2 border-[#D61F36]' : ''
              }`}
            >
              <div className="relative">
                <Avatar user={contact} size="xs" />
                {hasUnread && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-zinc-200 truncate">{contact.name}</p>
                  <span className="text-[10px] text-zinc-500 uppercase">{contact.role}</span>
                </div>
                <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                  {lastMsg ? lastMsg.message : `${contact.department} Department`}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
