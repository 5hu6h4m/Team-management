import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound
} from 'lucide-react';

export function LoginPage({ onLoginSuccess }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your registered Email address.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(email.trim(), password.trim());
      setLoading(false);

      if (res.success) {
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError(res.message);
      }
    }, 200);
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
            Sign in to access your E-Cell workspace
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-medium leading-relaxed">
            {error}
          </div>
        )}

        {/* Standard Email + Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="president@ecell.org or member@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#161616] border border-[#262626] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

        {/* Footer info */}
        <div className="pt-2 border-t border-[#1f1f23]">
          <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
            Need an account? Contact President <strong className="text-zinc-400">Shubham</strong> to get your credentials registered.
          </p>
        </div>

      </div>
    </div>
  );
}
