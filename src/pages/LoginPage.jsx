import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export function LoginPage({ onLoginSuccess }) {
  const { users, login, setCurrentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email or select a demo profile.');
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

  const demoProfiles = [
    { role: 'President', user: users.find(u => u.role === 'President') || users[0], desc: 'Full operational control & Admin' },
    { role: 'GS', user: users.find(u => u.role === 'GS') || users[1], desc: 'Task delegation & tracking' },
    { role: 'Design Lead', user: users.find(u => u.role === 'Lead' && u.department === 'Design') || users[2], desc: 'Team review & workload' },
    { role: 'Member', user: users.find(u => u.role === 'Member' && u.name.includes('Anshu')) || users.find(u => u.role === 'Member'), desc: 'My Tasks & submissions' }
  ];

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111111] border border-[#252525] rounded-2xl p-8 space-y-6 shadow-2xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <h2 className="text-sm font-black tracking-widest text-white uppercase">
            E-CELL MET
          </h2>
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
            TASKHUB OPERATIONS
          </p>
          <p className="text-xs text-zinc-400 mt-2">
            Sign in to access your role-based dashboard
          </p>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="president@ecell.org or Shubham"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#B11226] hover:bg-[#D61F36] text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="pt-4 border-t border-[#252525] space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 text-center">
            Instant 1-Click Role Login:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {demoProfiles.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickLogin(p.user)}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#181818] hover:bg-[#202020] border border-[#252525] text-left transition-all group"
              >
                <Avatar user={p.user} size="xs" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-zinc-200 group-hover:text-white truncate">
                    {p.user?.name}
                  </p>
                  <p className="text-[9px] text-zinc-500 uppercase font-semibold">{p.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
