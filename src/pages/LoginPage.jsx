import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { 
  Key, 
  User, 
  Shield, 
  Briefcase, 
  Users, 
  ArrowRight, 
  GraduationCap, 
  Layers, 
  Lock,
  ChevronDown
} from 'lucide-react';

export function LoginPage({ onLoginSuccess }) {
  const { users, login, setCurrentUser } = useAuth();

  // Tab: 'form' (Name/Key Login) or 'quick' (1-Click Grid)
  const [loginMode, setLoginMode] = useState('form');

  // Form State
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [enteredNameOrEmail, setEnteredNameOrEmail] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');

  const filteredRoleUsers = users.filter(u => {
    if (selectedRole === 'ALL') return true;
    return u.role === selectedRole;
  });

  const selectedMemberData = users.find(u => u.id === selectedUserId);

  const handleFormLogin = (e) => {
    e.preventDefault();
    setError('');

    const identifier = selectedUserId 
      ? (selectedMemberData?.email || selectedMemberData?.name)
      : enteredNameOrEmail;

    if (!identifier) {
      setError('Please select your member profile or enter your name/email.');
      return;
    }

    const res = login(identifier, accessKey);
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError(res.message);
    }
  };

  const handleQuickLogin = (user) => {
    setCurrentUser(user);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-[#111111] border border-[#252525] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222226] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-[#B11226] text-white rounded">
                Official Access Portal
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              E-Cell MET <span className="text-zinc-500 font-normal">/ TaskHub</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Sign in with your assigned team profile & access key
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#181818] p-1 rounded-lg border border-[#252525] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => { setLoginMode('form'); setError(''); }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                loginMode === 'form' ? 'bg-[#252525] text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Key Login
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('quick'); setError(''); }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                loginMode === 'quick' ? 'bg-[#252525] text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              1-Click Roster ({users.length})
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-medium">
            {error}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE A: NAME + POSITION + ACCESS KEY LOGIN FORM */}
        {/* ---------------------------------------------------- */}
        {loginMode === 'form' && (
          <form onSubmit={handleFormLogin} className="space-y-4">
            
            {/* Rank / Role Filter Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  1. Filter by Rank / Role
                </label>
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      setSelectedUserId('');
                    }}
                    className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white font-semibold focus:outline-none focus:border-zinc-500"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="President">President</option>
                    <option value="GS">General Secretary (GS)</option>
                    <option value="Lead">Department Lead</option>
                    <option value="Member">Team Member</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  2. Select Member Profile
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => {
                    setSelectedUserId(e.target.value);
                    const found = users.find(u => u.id === e.target.value);
                    if (found) {
                      setAccessKey(found.accessKey || '');
                    }
                  }}
                  className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-zinc-500"
                >
                  <option value="">-- Choose Member --</option>
                  {filteredRoleUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role} - {u.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Member Details Live Preview (Branch, Year, Team, Position) */}
            {selectedMemberData && (
              <div className="p-3.5 bg-[#161616] rounded-xl border border-[#282828] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar user={selectedMemberData} size="md" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{selectedMemberData.name}</p>
                    <p className="text-[11px] text-zinc-400">
                      <strong>{selectedMemberData.role}</strong> • {selectedMemberData.department} Team
                    </p>
                    <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                      <GraduationCap className="w-3 h-3 text-red-400" />
                      <span>{selectedMemberData.branch || 'Engineering'} ({selectedMemberData.year || 'SE'})</span>
                    </p>
                  </div>
                </div>

                <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-[10px] font-mono rounded border border-zinc-700">
                  Key: {selectedMemberData.accessKey}
                </span>
              </div>
            )}

            {/* Manual Email fallback if not choosing from dropdown */}
            {!selectedUserId && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Or Type Name / Email
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Shubham, president@ecell.org or Anshu"
                    value={enteredNameOrEmail}
                    onChange={(e) => setEnteredNameOrEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
            )}

            {/* Access Key / Password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Access Key / Password
              </label>
              <div className="relative">
                <Key className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter assigned key (e.g. shubham123, anshu123)"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#B11226] hover:bg-[#D61F36] text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>Access TaskHub Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* ---------------------------------------------------- */}
        {/* MODE B: 1-CLICK ROSTER WITH BRANCH & YEAR BADGES */}
        {/* ---------------------------------------------------- */}
        {loginMode === 'quick' && (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            
            {/* Executive */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-red-400" />
                Executive
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {users.filter(u => u.role === 'President' || u.role === 'GS').map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className="p-2.5 rounded-xl bg-[#151515] hover:bg-[#1a1a1a] border border-[#252525] hover:border-red-800/50 text-left transition-all flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar user={u} size="xs" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white group-hover:text-red-400 truncate">{u.name}</p>
                        <p className="text-[10px] text-zinc-400">{u.branch} • {u.year}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-zinc-800 text-red-400 rounded shrink-0">
                      {u.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Leads */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3 h-3 text-zinc-400" />
                Department Leads
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {users.filter(u => u.role === 'Lead').map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className="p-2.5 rounded-xl bg-[#151515] hover:bg-[#1a1a1a] border border-[#252525] hover:border-zinc-700 text-left transition-all flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar user={u} size="xs" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white group-hover:text-white truncate">{u.name}</p>
                        <p className="text-[10px] text-zinc-400">{u.department} Lead • {u.branch}</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {users.filter(u => u.role === 'Member').map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className="p-2.5 rounded-xl bg-[#151515] hover:bg-[#1a1a1a] border border-[#252525] hover:border-zinc-700 text-left transition-all flex items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar user={u} size="xs" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">{u.name}</p>
                        <p className="text-[10px] text-zinc-400">{u.department} • {u.year}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
