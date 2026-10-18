import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export function LoginPage({ onLoginSuccess }) {
  const { login, users } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const usersReady = users && users.length > 0;

  const doLogin = (e_or_null, emailVal, passVal) => {
    if (e_or_null) e_or_null.preventDefault();
    const em = (emailVal || email).trim();
    const pw = (passVal || password).trim();
    setError('');

    if (!em) { setError('Please enter your email.'); return; }
    if (!pw) { setError('Please enter your password.'); return; }
    if (!usersReady) { setError('Server still loading... please wait a moment.'); return; }

    setLoading(true);
    setTimeout(() => {
      const res = login(em, pw);
      setLoading(false);
      if (res.success) {
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError(res.message);
      }
    }, 150);
  };

  // One-click login directly
  const handleQuickLogin = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
    doLogin(null, userEmail, userPass);
  };


  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-[#111111] border border-[#222226] rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-1 border-b border-[#222226] pb-4">
          <h1 className="text-lg font-bold text-white tracking-tight uppercase">
            E-CELL MET <span className="text-red-500">TASKHUB</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={doLogin} className="space-y-3.5">
          
          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
              Email / Gmail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. mohitborse@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#161616] border border-[#262626] rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#161616] border border-[#262626] rounded-lg text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !usersReady}
            className="w-full py-2 bg-[#B11226] hover:bg-[#D61F36] disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-1"
          >
            <span>{loading ? 'Signing in...' : !usersReady ? 'Loading accounts...' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="pt-3 border-t border-[#222226] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block text-center">
            Quick Fill Accounts
          </span>

          <div className="grid grid-cols-1 gap-1.5 text-xs">
            <button
              type="button"
              disabled={!usersReady || loading}
              onClick={() => handleQuickLogin('shubhamja9863@gmail.com', 'shubham8686@#')}
              className="p-2 rounded-lg bg-[#161616] hover:bg-[#202020] disabled:opacity-40 border border-[#262626] text-left flex items-center justify-between transition-colors"
            >
              <div>
                <p className="font-bold text-white text-[11px]">👑 Shubham (President)</p>
                <p className="text-[10px] text-zinc-500 font-mono">shubhamja9863@gmail.com</p>
              </div>
              <span className="text-[10px] text-red-400 font-mono">1-click login →</span>
            </button>

            <button
              type="button"
              disabled={!usersReady || loading}
              onClick={() => handleQuickLogin('bhushanbhusare@gmail.com', 'bhushan@123')}
              className="p-2 rounded-lg bg-[#161616] hover:bg-[#202020] disabled:opacity-40 border border-[#262626] text-left flex items-center justify-between transition-colors"
            >
              <div>
                <p className="font-bold text-white text-[11px]">⚡ Bhushan (General Secretary)</p>
                <p className="text-[10px] text-zinc-500 font-mono">bhushanbhusare@gmail.com</p>
              </div>
              <span className="text-[10px] text-amber-300 font-mono">1-click login →</span>
            </button>

            <button
              type="button"
              disabled={!usersReady || loading}
              onClick={() => handleQuickLogin('mohitborse@gmail.com', 'mohit@123')}
              className="p-2 rounded-lg bg-[#161616] hover:bg-[#202020] disabled:opacity-40 border border-[#262626] text-left flex items-center justify-between transition-colors"
            >
              <div>
                <p className="font-bold text-white text-[11px]">🎨 Mohit Borse (Design Lead)</p>
                <p className="text-[10px] text-zinc-500 font-mono">mohitborse@gmail.com</p>
              </div>
              <span className="text-[10px] text-purple-300 font-mono">1-click login →</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
