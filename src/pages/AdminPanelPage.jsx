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
  Briefcase
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
  const [newUserRole, setNewUserRole] = useState('Member');
  const [newUserBranch, setNewUserBranch] = useState('Computer Engineering');
  const [newUserYear, setNewUserYear] = useState('2nd Year (SE)');
  const [newUserKey, setNewUserKey] = useState('');

  // Edit Role Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState('Member');
  const [editDept, setEditDept] = useState('Tech');
  const [editBranch, setEditBranch] = useState('Computer Engineering');
  const [editYear, setEditYear] = useState('2nd Year (SE)');
  const [editKey, setEditKey] = useState('');

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

    const generatedKey = newUserKey.trim() || `${newUserName.trim().toLowerCase().split(' ')[0]}123`;

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
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-[#B11226] text-white rounded">
              President Admin Room
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Member Roster & Access Keys</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Create team accounts, assign departments/branches, and issue access login keys
          </p>
        </div>

        <button
          onClick={() => {
            setNewUserKey(`key-${Math.floor(1000 + Math.random() * 9000)}`);
            setIsAddUserOpen(true);
          }}
          className="px-3.5 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ Add New Member</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-xl border border-[#222226] w-fit">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'members' ? 'bg-[#222226] text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Members & Keys ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'hierarchy' ? 'bg-[#222226] text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <TreeDeciduous className="w-3.5 h-3.5" />
          <span>Hierarchy Tree</span>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'departments' ? 'bg-[#222226] text-white' : 'text-zinc-400 hover:text-zinc-200'
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
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Role & Team</th>
                  <th className="py-3 px-4">Branch & Year</th>
                  <th className="py-3 px-4">Access Key</th>
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
                        <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                          {u.role}
                        </span>
                        <p className="text-[11px] text-zinc-300">{u.department} Team</p>
                      </div>
                    </td>

                    {/* Branch & Year */}
                    <td className="py-3 px-4">
                      <p className="text-zinc-200 font-medium text-[11px]">{u.branch || 'Engineering'}</p>
                      <p className="text-[10px] text-zinc-500">{u.year || '2nd Year (SE)'}</p>
                    </td>

                    {/* Access Key */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-[#181818] text-amber-300 font-mono text-[11px] rounded border border-zinc-800">
                          {u.accessKey || `${u.name.toLowerCase().split(' ')[0]}123`}
                        </span>
                        <button
                          onClick={() => handleCopyKey(u)}
                          className="p-1 text-zinc-400 hover:text-white"
                          title="Copy Key to Share"
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

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setEditRole(u.role);
                            setEditDept(u.department);
                            setEditBranch(u.branch || 'Computer Engineering');
                            setEditYear(u.year || '2nd Year (SE)');
                            setEditKey(u.accessKey || '');
                          }}
                          className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] font-semibold"
                        >
                          Edit
                        </button>
                        {u.role !== 'President' && (
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                              u.status === 'active' 
                                ? 'border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-800' 
                                : 'border-emerald-800 text-emerald-400 bg-emerald-950/30'
                            }`}
                          >
                            {u.status === 'active' ? 'Deactivate' : 'Reactivate'}
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Hierarchy */}
      {activeTab === 'hierarchy' && (
        <HierarchyTree
          onSelectUser={onSelectUser}
          onManageUserRole={(u) => {
            setEditingUser(u);
            setEditRole(u.role);
            setEditDept(u.department);
            setEditBranch(u.branch || 'Computer Engineering');
            setEditYear(u.year || '2nd Year (SE)');
            setEditKey(u.accessKey || '');
          }}
        />
      )}

      {/* Tab: Departments */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <form onSubmit={handleAddDepartmentSubmit} className="flex gap-2 max-w-md bg-[#141414] p-3 rounded-xl border border-[#222226]">
            <input
              type="text"
              placeholder="New department name (e.g. Sponsorship)..."
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white rounded-lg text-xs font-bold"
            >
              + Add
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {departments.map(dept => {
              const lead = users.find(u => u.role === 'Lead' && u.department === dept.name);
              const count = users.filter(u => u.department === dept.name).length;
              return (
                <div key={dept.id} className="bg-[#141414] p-4 rounded-xl border border-[#222226]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white uppercase">{dept.name}</span>
                    <span className="text-[11px] font-mono text-zinc-500">{count} members</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Lead: <strong className="text-zinc-200">{lead ? lead.name : 'Unassigned'}</strong>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Member Modal (Full Branch, Year, Key fields) */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Add New E-Cell Member"
        subtitle="Create member profile and generate login access key"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleAddMemberSubmit} className="space-y-3.5">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Email *</label>
              <input
                type="email"
                required
                placeholder="rahul@ecell.org"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Department / Team</label>
              <select
                value={newUserDept}
                onChange={(e) => setNewUserDept(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Position / Role</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white font-semibold"
              >
                <option value="Member">Team Member</option>
                <option value="Lead">Department Lead</option>
                <option value="GS">General Secretary (GS)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Branch</label>
              <select
                value={newUserBranch}
                onChange={(e) => setNewUserBranch(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
              >
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="EXTC Engineering">EXTC Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Academic Year</label>
              <select
                value={newUserYear}
                onChange={(e) => setNewUserYear(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
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
              Access Key / Login Password
            </label>
            <input
              type="text"
              placeholder="e.g. rahul123 or key-9481"
              value={newUserKey}
              onChange={(e) => setNewUserKey(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-amber-300 font-mono"
            />
            <p className="text-[10px] text-zinc-500 mt-1">
              Give this key to the member. They will use this key to log in to the TaskHub portal.
            </p>
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
              className="px-4 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg"
            >
              Save Member & Key
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Member Modal */}
      {editingUser && (
        <Modal
          isOpen={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
          title={`Edit Profile: ${editingUser.name}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleEditUserSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white font-bold"
                >
                  <option value="Member">Member</option>
                  <option value="Lead">Lead</option>
                  <option value="GS">GS</option>
                  <option value="President">President</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Department</label>
                <select
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                  <option value="Executive">Executive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Branch</label>
                <select
                  value={editBranch}
                  onChange={(e) => setEditBranch(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
                >
                  <option value="Computer Engineering">Computer</option>
                  <option value="Information Technology">IT</option>
                  <option value="AI & Data Science">AI-DS</option>
                  <option value="EXTC Engineering">EXTC</option>
                  <option value="Mechanical Engineering">Mechanical</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Year</label>
                <select
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
                >
                  <option value="1st Year (FE)">1st Year (FE)</option>
                  <option value="2nd Year (SE)">2nd Year (SE)</option>
                  <option value="3rd Year (TE)">3rd Year (TE)</option>
                  <option value="4th Year (BE)">4th Year (BE)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Access Key</label>
              <input
                type="text"
                value={editKey}
                onChange={(e) => setEditKey(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-amber-300 font-mono"
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
                className="px-4 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg"
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
