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
  UserCog, 
  CheckCircle, 
  XCircle,
  Shield,
  Activity
} from 'lucide-react';

export function AdminPanelPage({ onSelectUser }) {
  const { users, addUser, updateUserRole, toggleUserStatus } = useAuth();
  const { departments, addDepartment, tasks } = useTasks();

  const [activeTab, setActiveTab] = useState('members'); // 'members', 'hierarchy', 'departments'

  // Add Member Modal State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserDept, setNewUserDept] = useState('Design');
  const [newUserRole, setNewUserRole] = useState('Member');

  // Edit Role Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState('Member');
  const [editDept, setEditDept] = useState('Tech');

  // Add Department State
  const [newDeptName, setNewDeptName] = useState('');

  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    addUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || '+91 98765 00000',
      department: newUserDept,
      role: newUserRole
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setIsAddUserOpen(false);
  };

  const handleEditRoleSubmit = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUserRole(editingUser.id, editRole, editDept);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252525] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-red-950/40 text-red-400 border border-red-800/40 rounded">
              President Control
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Admin & Hierarchy Control</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage organizational roster, departmental leadership, and role permissions
          </p>
        </div>

        <button
          onClick={() => setIsAddUserOpen(true)}
          className="px-3.5 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ Add Member</span>
        </button>
      </div>

      {/* Tabs Bar (Point 16) */}
      <div className="flex items-center gap-1 bg-[#151515] p-1 rounded-lg border border-[#252525] w-fit">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'members' ? 'bg-zinc-800 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Members ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'hierarchy' ? 'bg-zinc-800 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <TreeDeciduous className="w-3.5 h-3.5" />
          <span>Hierarchy Tree</span>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'departments' ? 'bg-zinc-800 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Departments ({departments.length})</span>
        </button>
      </div>

      {/* Tab: Members Table */}
      {activeTab === 'members' && (
        <div className="bg-[#151515] rounded-xl border border-[#252525] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111111] text-zinc-400 font-bold uppercase tracking-wider text-[10px] border-b border-[#252525]">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222226]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[#181818] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar user={u} size="xs" />
                        <div>
                          <p className="font-bold text-zinc-100">{u.name}</p>
                          <p className="text-[10px] text-zinc-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-zinc-850 text-zinc-300 border border-zinc-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-300 font-medium">
                      {u.department}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.status === 'active' ? 'text-emerald-400 bg-emerald-950/20' : 'text-zinc-500 bg-zinc-900'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-600'}`}></span>
                        {u.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setEditRole(u.role);
                            setEditDept(u.department);
                          }}
                          className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] font-semibold"
                        >
                          Edit Role
                        </button>
                        
                        {/* Deactivate / Reactivate flow (Point 17) */}
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
          }}
        />
      )}

      {/* Tab: Departments */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <form onSubmit={handleAddDepartmentSubmit} className="flex gap-2 max-w-md bg-[#151515] p-3 rounded-xl border border-[#252525]">
            <input
              type="text"
              placeholder="New department name..."
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
                <div key={dept.id} className="bg-[#151515] p-4 rounded-xl border border-[#252525]">
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

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Add New Member"
        subtitle="Create member profile in designated department"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddMemberSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Full Name</label>
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
            <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="rahul@ecell.org"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Department</label>
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
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Role</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white font-semibold"
              >
                <option value="Member">Member</option>
                <option value="Lead">Lead</option>
                <option value="GS">GS</option>
                <option value="President">President</option>
              </select>
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
              className="px-4 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg"
            >
              Add Member
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Role Modal */}
      {editingUser && (
        <Modal
          isOpen={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
          title={`Modify Role: ${editingUser.name}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleEditRoleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Role</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white font-bold"
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
                className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
                <option value="Executive">Executive</option>
              </select>
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
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
