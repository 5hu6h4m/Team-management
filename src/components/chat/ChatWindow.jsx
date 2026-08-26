import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import { Avatar } from '../common/Avatar';
import { formatTimeAgo } from '../../utils/deadlineHelper';
import { Send, Paperclip, CheckCheck, X } from 'lucide-react';

export function ChatWindow() {
  const { currentUser, users } = useAuth();
  const { activeContactId, getConversation, sendMessage } = useChat();
  const { tasks } = useTasks();
  const { addNotification } = useNotifications();

  const [inputMessage, setInputMessage] = useState('');
  const [attachedTaskId, setAttachedTaskId] = useState('');
  const [showTaskPicker, setShowTaskPicker] = useState(false);

  const messagesEndRef = useRef(null);

  const activeContact = users.find(u => u.id === activeContactId);
  const conversation = getConversation(activeContactId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && !attachedTaskId) return;

    let finalMessage = inputMessage.trim();
    if (attachedTaskId) {
      const task = tasks.find(t => t.id === attachedTaskId);
      if (task) {
        finalMessage = finalMessage 
          ? `[Task: "${task.title}"] ${finalMessage}` 
          : `[Task: "${task.title}"] Attached for your review.`;
      }
    }

    sendMessage(activeContactId, finalMessage);

    addNotification({
      userId: activeContactId,
      type: 'message',
      title: `Message from ${currentUser?.name}`,
      message: finalMessage
    });

    setInputMessage('');
    setAttachedTaskId('');
    setShowTaskPicker(false);
  };

  if (!activeContact) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0c0c0e] text-zinc-500 text-xs">
        Select a team member to open internal messages
      </div>
    );
  }

  const selectedAttachedTask = tasks.find(t => t.id === attachedTaskId);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0c0e]">
      
      {/* Contact Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#111111] border-b border-[#252525]">
        <div className="flex items-center gap-3">
          <Avatar user={activeContact} size="sm" />
          <div>
            <h4 className="text-xs font-bold text-white leading-tight">{activeContact.name}</h4>
            <p className="text-[10px] text-zinc-400 font-medium">
              {activeContact.role} • {activeContact.department}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Connected
        </span>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {conversation.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-xs">
            No message history with {activeContact.name}. Start a conversation below.
          </div>
        ) : (
          conversation.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && <Avatar user={activeContact} size="xs" />}
                
                <div
                  className={`max-w-md px-3.5 py-2 rounded-xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-[#B11226] text-white rounded-br-xs'
                      : 'bg-[#181818] text-zinc-200 border border-[#252525] rounded-bl-xs'
                  }`}
                >
                  <p>{msg.message}</p>
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                      isMe ? 'text-red-200' : 'text-zinc-500'
                    }`}
                  >
                    <span>{formatTimeAgo(msg.timestamp)}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-red-200" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Task Attachment Pill if selected */}
      {selectedAttachedTask && (
        <div className="px-4 py-1.5 bg-[#151515] border-t border-[#252525] flex items-center justify-between text-xs text-zinc-300">
          <span className="flex items-center gap-1.5 truncate">
            <Paperclip className="w-3 h-3 text-red-400" />
            <span>Attached Task: <strong>{selectedAttachedTask.title}</strong></span>
          </span>
          <button onClick={() => setAttachedTaskId('')} className="text-zinc-500 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Task Picker Popover */}
      {showTaskPicker && (
        <div className="p-3 bg-[#151515] border-t border-[#252525] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-300">Select Task to Reference</span>
            <button onClick={() => setShowTaskPicker(false)} className="text-zinc-500 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {tasks.slice(0, 6).map(t => (
              <button
                key={t.id}
                onClick={() => { setAttachedTaskId(t.id); setShowTaskPicker(false); }}
                className="w-full text-left p-1.5 rounded hover:bg-[#202020] text-xs text-zinc-200 truncate flex justify-between"
              >
                <span>{t.title}</span>
                <span className="text-[10px] text-zinc-500">{t.department}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-[#111111] border-t border-[#252525] flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowTaskPicker(!showTaskPicker)}
          className={`p-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
            attachedTaskId ? 'text-red-400 bg-red-950/40 border border-red-800/40' : 'text-zinc-400 hover:text-white bg-[#181818] border border-[#252525]'
          }`}
          title="Attach Task"
        >
          <Paperclip className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Attach Task</span>
        </button>

        <input
          type="text"
          placeholder={`Message ${activeContact.name}... (e.g. "Can you update the Eureka banner?")`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 px-3.5 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() && !attachedTaskId}
          className="px-3.5 py-2 bg-[#B11226] hover:bg-[#D61F36] disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>

    </div>
  );
}
