import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { Lock, Mail, ArrowRight, Shield, Briefcase, Users, UserCheck } from 'lucide-react';

export function LoginPage({ onLoginSuccess }) {
  const { users, login, setCurrentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email or select a profile below.');
      return;
    }

    const res = login(email.trim());
    if (res.success) {
      setError('');
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError(res.message);
    }
  };

  const handleQuickLogin = (user) => {
    setCurrentUser(user);
    if (onLoginSuccess) onLoginSuccess();
  };

  const presidents = users.filter(u => u.role === 'President');
  const gsList = users.filter(u => u.role === 'GS');
  const leads = users.filter(u => u.role === 'Lead');
  const members = users.filter(u => u.role === 'Member');

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-[#111111] border border-[#222226] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222226] pb-4">
          <div>
            <h2 className="text-sm font-black tracking-widest text-white uppercase">
              E-CELL MET <span className="text-red-500">/ TASKHUB</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Select any member profile for instant login</p>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
            {users.length} Accounts
          </span>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* 1-Click All Users Login Grid (Categorized) */}
        <div className="space-y-4">
          
          {/* Executive: President & GS */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-red-400" />
              Executive (President & GS)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[...presidents, ...gsList].map(u => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#151515] hover:bg-[#1a1a1a] border border-[#252525] hover:border-red-800/50 text-left transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar user={u} size="xs" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-red-400 truncate">{u.name}</p>
                      <p className="text-[10px] text-zinc-400">{u.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-zinc-800 text-red-400 border border-zinc-700 shrink-0">
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Department Leads */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3 h-3 text-zinc-400" />
              Department Leads
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {leads.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#151515] hover:bg-[#1a1a1a] border border-[#252525] hover:border-zinc-700 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar user={u} size="xs" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-white truncate">{u.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{u.department} Lead</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Members */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
              <Users className="w-3 h-3 text-zinc-400" />
              Team Members
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {members.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u)}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#151515] hover:bg-[#1a1a1a] border border-[#252525] hover:border-zinc-700 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar user={u} size="xs" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">{u.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{u.department}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Manual Login Collapse */}
        <details className="pt-2 border-t border-[#222226] text-xs text-zinc-400">
          <summary className="cursor-pointer font-semibold hover:text-white py-1">
            Or Sign in with Email / Password
          </summary>
          <form onSubmit={handleSubmit} className="space-y-3 mt-3">
            <input
              type="text"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
            />
            <button
              type="submit"
              className="w-full py-2 bg-[#B11226] hover:bg-[#D61F36] text-white rounded-lg text-xs font-bold"
            >
              Sign In
            </button>
          </form>
        </details>

      </div>
    </div>
  );
}
