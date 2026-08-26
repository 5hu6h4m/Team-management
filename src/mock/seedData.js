export const INITIAL_DEPARTMENTS = [
  { id: 'tech', name: 'Tech', icon: 'Code', leadId: '', color: 'blue' },
  { id: 'design', name: 'Design', icon: 'Palette', leadId: '', color: 'purple' },
  { id: 'social', name: 'Social Media', icon: 'Share2', leadId: '', color: 'pink' },
  { id: 'content', name: 'Content', icon: 'FileText', leadId: '', color: 'amber' },
  { id: 'events', name: 'Events', icon: 'Calendar', leadId: '', color: 'emerald' },
  { id: 'pr', name: 'PR & Outreach', icon: 'Megaphone', leadId: '', color: 'cyan' },
  { id: 'marketing', name: 'Marketing', icon: 'TrendingUp', leadId: '', color: 'indigo' },
  { id: 'finance', name: 'Finance', icon: 'DollarSign', leadId: '', color: 'teal' },
  { id: 'operations', name: 'Operations', icon: 'Layers', leadId: '', color: 'slate' },
];

export const INITIAL_USERS = [
  {
    id: 'u-president',
    name: 'Shubham',
    email: 'president@ecell.org',
    role: 'President',
    department: 'Executive',
    branch: 'Computer Engineering',
    year: '4th Year (BE)',
    accessKey: 'shubham123',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    completionRate: 100,
    joinedDate: new Date().toISOString().split('T')[0]
  }
];

export const INITIAL_TASKS = [];
export const INITIAL_NOTIFICATIONS = [];
export const INITIAL_MESSAGES = [];
