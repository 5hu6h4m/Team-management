import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  KeyRound,
  Sparkles
} from 'lucide-react';

export function LoginPage({ onLoginSuccess }) {
  const { users, login, setCurrentUser } = useAuth();

  const [email, setEmail] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const presidentUser = users.find(u => u.role === 'President') || users[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your registered Gmail or Email address.');
      return;
    }

    if (!accessKey.trim()) {
      setError('Please enter your President-issued Access Password / Key.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(email.trim(), accessKey.trim());
      setLoading(false);

      if (res.success) {
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError(res.message);
      }
    }, 200);
  };

  const handlePresidentFastLogin = () => {
    if (presidentUser) {
      setCurrentUser(presidentUser);
      if (onLoginSuccess) onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-[#111111] border border-[#222226] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5 border-b border-[#222226] pb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1c1213] border border-[#3b171a] text-red-400 text-[10px] font-bold uppercase tracking-widest mb-1">
            <ShieldCheck className="w-3 h-3" />
            E-Cell MET Internal OS
          </div>
          
          <h1 className="text-xl font-bold text-white tracking-tight">
            TASKHUB PORTAL
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in with your registered Gmail & President Access Key
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-medium leading-relaxed">
            {error}
          </div>
        )}

        {/* Professional Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Gmail / Email Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              Gmail / Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#161616] border border-[#262626] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
          </div>

          {/* Access Key / Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                Access Password / Key
              </label>
              <span className="text-[10px] text-zinc-500">Issued by President</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Enter your security access key"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#161616] border border-[#262626] rounded-xl text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#B11226] hover:bg-[#D61F36] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </form>

        {/* President Instant Access Card */}
        {presidentUser && (
          <div className="pt-4 border-t border-[#222226] space-y-2">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
              <span>Admin Account</span>
              <span className="text-emerald-400">1-Click Authorized</span>
            </div>

            <button
              type="button"
              onClick={handlePresidentFastLogin}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#161616] hover:bg-[#1c1c1c] border border-[#282828] hover:border-red-800/60 transition-all text-left group"
            >
              <div className="flex items-center gap-2.5">
                <Avatar user={presidentUser} size="sm" />
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                    {presidentUser.name}
                  </p>
                  <p className="text-[10px] text-zinc-400">President • {presidentUser.email}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-red-950/60 text-red-400 border border-red-800/60 rounded-lg">
                Enter as President →
              </span>
            </button>
          </div>
        )}

        {/* Footer info note */}
        <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
          New to E-Cell TaskHub? Contact President <strong className="text-zinc-400">Shubham</strong> to add your profile to the roster and receive your access key.
        </p>

      </div>
    </div>
  );
}
