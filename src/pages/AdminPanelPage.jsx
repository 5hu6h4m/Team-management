import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { Avatar } from '../components/common/Avatar';
import { HierarchyTree } from '../components/team/HierarchyTree';
import { Modal } from '../components/common/Modal';
import { 
  Users, 
  Layers, 
  UserPlus, 
  TreeDeciduous, 
  Key, 
  GraduationCap, 
  Shield, 
  Copy, 
  Check,
  Briefcase,
  KeyRound,
  RefreshCw
} from 'lucide-react';

export function AdminPanelPage({ onSelectUser }) {
  const { users, addUser, updateUser, toggleUserStatus } = useAuth();
  const { departments, addDepartment } = useTasks();

  const [activeTab, setActiveTab] = useState('members'); // 'members', 'hierarchy', 'departments'

  // Add Member Modal State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserDept, setNewUserDept] = useState('Design');
  const [newUserRole, setNewUserRole] = useState('Lead');
  const [newUserBranch, setNewUserBranch] = useState('Computer Engineering');
  const [newUserYear, setNewUserYear] = useState('3rd Year (TE)');
  const [newUserKey, setNewUserKey] = useState('');

  // Edit Role Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState('Lead');
  const [editDept, setEditDept] = useState('Design');
  const [editBranch, setEditBranch] = useState('Computer Engineering');
  const [editYear, setEditYear] = useState('3rd Year (TE)');
  const [editKey, setEditKey] = useState('');

  // Dedicated Password Reset Modal State
  const [resettingUser, setResettingUser] = useState(null);
  const [newResetPassword, setNewResetPassword] = useState('');

  // Add Department State
  const [newDeptName, setNewDeptName] = useState('');

  // Copied Key feedback
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyKey = (user) => {
    navigator.clipboard.writeText(user.accessKey || `${user.name.toLowerCase().split(' ')[0]}123`);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const generatedKey = newUserKey.trim() || `${newUserName.trim().toLowerCase().split(' ')[0]}@123`;

    addUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || '+91 98765 00000',
      department: newUserDept,
      role: newUserRole,
      branch: newUserBranch,
      year: newUserYear,
      accessKey: generatedKey
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserKey('');
    setIsAddUserOpen(false);
  };

  const handleEditUserSubmit = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, {
      role: editRole,
      department: editDept,
      branch: editBranch,
      year: editYear,
      accessKey: editKey.trim() || editingUser.accessKey
    });
    setEditingUser(null);
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!resettingUser || !newResetPassword.trim()) return;

    updateUser(resettingUser.id, {
      accessKey: newResetPassword.trim()
    });

    // Copy to clipboard
    navigator.clipboard.writeText(newResetPassword.trim());
    setCopiedId(resettingUser.id);
    setTimeout(() => setCopiedId(null), 2500);

    setResettingUser(null);
    setNewResetPassword('');
  };

  const handleAddDepartmentSubmit = (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    addDepartment({ name: newDeptName.trim() });
    setNewDeptName('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222226] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Admin & Member Management</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage members, department leads, roles, and reset login passwords
          </p>
        </div>

        <button
          onClick={() => {
            setNewUserKey(`${Math.random().toString(36).substring(2, 7)}@123`);
            setIsAddUserOpen(true);
          }}
          className="px-3.5 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ Add Member / Leader</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-xl border border-[#222226] w-fit">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'members' ? 'bg-[#222226] text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>All Accounts ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'hierarchy' ? 'bg-[#222226] text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <TreeDeciduous className="w-3.5 h-3.5" />
          <span>Hierarchy Tree</span>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'departments' ? 'bg-[#222226] text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Departments ({departments.length})</span>
        </button>
      </div>

      {/* Tab: Members Table with Keys, Branch & Year */}
      {activeTab === 'members' && (
        <div className="bg-[#141414] rounded-xl border border-[#222226] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111111] text-zinc-400 font-bold uppercase tracking-wider text-[10px] border-b border-[#222226]">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Role / Position</th>
                  <th className="py-3 px-4">Branch & Year</th>
                  <th className="py-3 px-4">Login Password</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f23]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[#181818] transition-colors">
                    
                    {/* Member */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar user={u} size="xs" />
                        <div>
                          <p className="font-bold text-white">{u.name}</p>
                          <p className="text-[10px] text-zinc-500">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role & Team */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                          u.role === 'President' ? 'bg-red-950/60 text-red-400 border-red-800/60' :
                          u.role === 'GS' ? 'bg-zinc-800 text-amber-300 border-amber-800/40' :
                          u.role === 'Treasurer' ? 'bg-zinc-800 text-emerald-300 border-emerald-800/40' :
                          u.role === 'Lead' ? 'bg-zinc-800 text-purple-300 border-purple-800/40' :
                          'bg-zinc-800 text-zinc-300 border-zinc-700'
                        }`}>
                          {u.role === 'GS' ? 'General Secretary' : u.role}
                        </span>
                        <p className="text-[11px] text-zinc-400">{u.department} Team</p>
                      </div>
                    </td>

                    {/* Branch & Year */}
                    <td className="py-3 px-4">
                      <p className="text-zinc-200 font-medium text-[11px]">{u.branch || 'Engineering'}</p>
                      <p className="text-[10px] text-zinc-500">{u.year || '3rd Year (TE)'}</p>
                    </td>

                    {/* Access Key / Password */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-[#181818] text-amber-300 font-mono text-[11px] rounded border border-zinc-800">
                          {u.accessKey || 'shubham8686@#'}
                        </span>
                        <button
                          onClick={() => handleCopyKey(u)}
                          className="p-1 text-zinc-400 hover:text-white"
                          title="Copy Password"
                        >
                          {copiedId === u.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.status === 'active' ? 'text-emerald-400 bg-emerald-950/20' : 'text-zinc-500 bg-zinc-900'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-600'}`}></span>
                        {u.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions: Reset Password & Edit */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setResettingUser(u);
                            setNewResetPassword(`${u.name.toLowerCase().split(' ')[0]}@${Math.floor(100 + Math.random() * 900)}`);
                          }}
                          className="px-2 py-1 bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 rounded text-[10px] font-semibold border border-amber-800/40 flex items-center gap-1"
                          title="Reset Login Password"
                        >
                          <KeyRound className="w-3 h-3" />
                          <span>Reset Pass</span>
                        </button>

                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setEditRole(u.role);
                            setEditDept(u.department);
                            setEditBranch(u.branch || 'Computer Engineering');
                            setEditYear(u.year || '3rd Year (TE)');
                            setEditKey(u.accessKey || '');
                          }}
                          className="px-2 py-1 bg-[#1e1e24] hover:bg-[#282830] text-zinc-300 rounded text-[10px] font-semibold"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Hierarchy Tree */}
      {activeTab === 'hierarchy' && (
        <div className="bg-[#141414] p-5 rounded-xl border border-[#222226]">
          <HierarchyTree onSelectUser={onSelectUser} />
        </div>
      )}

      {/* Tab: Departments */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <form onSubmit={handleAddDepartmentSubmit} className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="e.g. Media, Logistics, Sponsorship..."
              value={newDeptName}
              onChange={e => setNewDeptName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg shadow-sm"
            >
              + Add Department
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {departments.map(d => (
              <div key={d.id} className="p-3.5 bg-[#141414] rounded-xl border border-[#222226] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{d.name}</h4>
                  <p className="text-[10px] text-zinc-500">
                    {users.filter(u => u.department.toLowerCase() === d.name.toLowerCase()).length} Members
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD MEMBER / LEADER */}
      {isAddUserOpen && (
        <Modal
          isOpen={isAddUserOpen}
          onClose={() => setIsAddUserOpen(false)}
          title="Create New Member / Leadership Account"
          subtitle="Generate custom login credentials"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAddMemberSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Full Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Bhushan Bhusare"
                value={newUserName}
                onChange={e => setNewUserName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Gmail / Email *</label>
                <input
                  required
                  type="email"
                  placeholder="e.g. bhushan@gmail.com"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Phone (Optional)</label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={newUserPhone}
                  onChange={e => setNewUserPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Role / Position *</label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white font-semibold"
                >
                  <option value="GS">General Secretary (GS)</option>
                  <option value="Treasurer">Treasurer / Finance Head</option>
                  <option value="VP">Vice President (VP)</option>
                  <option value="Lead">Department Lead</option>
                  <option value="Member">Team Member</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Department *</label>
                <select
                  value={newUserDept}
                  onChange={e => setNewUserDept(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
                >
                  <option value="Executive">Executive Core</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name} Team</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Branch / Stream</label>
                <select
                  value={newUserBranch}
                  onChange={e => setNewUserBranch(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
                >
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="EXTC">EXTC</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Year</label>
                <select
                  value={newUserYear}
                  onChange={e => setNewUserYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
                >
                  <option value="1st Year (FE)">1st Year (FE)</option>
                  <option value="2nd Year (SE)">2nd Year (SE)</option>
                  <option value="3rd Year (TE)">3rd Year (TE)</option>
                  <option value="4th Year (BE)">4th Year (BE)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">
                Custom Login Password / Access Key *
              </label>
              <div className="flex gap-2">
                <input
                  required
                  type="text"
                  placeholder="e.g. bhushan@123"
                  value={newUserKey}
                  onChange={e => setNewUserKey(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-amber-300 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setNewUserKey(`${Math.random().toString(36).substring(2, 7)}@123`)}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generate</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#252525]">
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Create Account
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 2: RESET PASSWORD (PRESIDENT EXCLUSIVE) */}
      {resettingUser && (
        <Modal
          isOpen={Boolean(resettingUser)}
          onClose={() => setResettingUser(null)}
          title={`Reset Password: ${resettingUser.name}`}
          subtitle={`Set a new login password for ${resettingUser.email}`}
          maxWidth="max-w-sm"
        >
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1.5">
                New Login Password *
              </label>
              <div className="flex gap-2">
                <input
                  required
                  type="text"
                  value={newResetPassword}
                  onChange={e => setNewResetPassword(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setNewResetPassword(`${resettingUser.name.toLowerCase().split(' ')[0]}@${Math.floor(100 + Math.random() * 900)}`)}
                  className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Random</span>
                </button>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Password will automatically be copied to your clipboard on save.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#252525]">
              <button
                type="button"
                onClick={() => setResettingUser(null)}
                className="px-3 py-1.5 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Save & Copy Password</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: EDIT ROLE */}
      {editingUser && (
        <Modal
          isOpen={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
          title={`Edit Member: ${editingUser.name}`}
          subtitle="Update role, department, and branch/year"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleEditUserSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Role / Position</label>
                <select
                  value={editRole}
                  onChange={e => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white font-semibold"
                >
                  <option value="President">President</option>
                  <option value="GS">General Secretary (GS)</option>
                  <option value="Treasurer">Treasurer / Finance Head</option>
                  <option value="VP">Vice President (VP)</option>
                  <option value="Lead">Department Lead</option>
                  <option value="Member">Team Member</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Department</label>
                <select
                  value={editDept}
                  onChange={e => setEditDept(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
                >
                  <option value="Executive">Executive Core</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name} Team</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Branch</label>
                <input
                  type="text"
                  value={editBranch}
                  onChange={e => setEditBranch(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Year</label>
                <input
                  type="text"
                  value={editYear}
                  onChange={e => setEditYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Login Password</label>
              <input
                type="text"
                value={editKey}
                onChange={e => setEditKey(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-amber-300 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#252525]">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
