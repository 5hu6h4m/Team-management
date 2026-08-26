import React from 'react';
import { ConversationList } from '../components/chat/ConversationList';
import { ChatWindow } from '../components/chat/ChatWindow';

export function MessagesPage() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[calc(100vh-8rem)]">
      <ConversationList />
      <ChatWindow />
    </div>
  );
}
