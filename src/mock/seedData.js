export const INITIAL_DEPARTMENTS = [
  { id: 'tech', name: 'Tech', icon: 'Code', leadId: 'u-tech-lead', color: 'blue' },
  { id: 'design', name: 'Design', icon: 'Palette', leadId: 'u-design-lead', color: 'purple' },
  { id: 'social', name: 'Social Media', icon: 'Share2', leadId: 'u-social-lead', color: 'pink' },
  { id: 'content', name: 'Content', icon: 'FileText', leadId: 'u-content-lead', color: 'amber' },
  { id: 'events', name: 'Events', icon: 'Calendar', leadId: 'u-events-lead', color: 'emerald' },
  { id: 'pr', name: 'PR & Outreach', icon: 'Megaphone', leadId: 'u-pr-lead', color: 'cyan' },
  { id: 'marketing', name: 'Marketing', icon: 'TrendingUp', leadId: 'u-marketing-lead', color: 'indigo' },
  { id: 'finance', name: 'Finance', icon: 'DollarSign', leadId: 'u-finance-lead', color: 'teal' },
  { id: 'operations', name: 'Operations', icon: 'Layers', leadId: 'u-ops-lead', color: 'slate' },
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
    completionRate: 98,
    joinedDate: '2024-08-01'
  },
  {
    id: 'u-gs',
    name: 'Aarav Mehta',
    email: 'gs@ecell.org',
    role: 'GS',
    department: 'Executive',
    branch: 'Information Technology',
    year: '3rd Year (TE)',
    accessKey: 'gs123',
    phone: '+91 98765 43211',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    completionRate: 94,
    joinedDate: '2024-08-01'
  },
  {
    id: 'u-design-lead',
    name: 'Devanshi Shah',
    email: 'design.lead@ecell.org',
    role: 'Lead',
    department: 'Design',
    branch: 'AI & Data Science',
    year: '3rd Year (TE)',
    accessKey: 'design123',
    phone: '+91 98765 43212',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    completionRate: 91,
    joinedDate: '2024-09-10'
  },
  {
    id: 'u-tech-lead',
    name: 'Shivam Verma',
    email: 'tech.lead@ecell.org',
    role: 'Lead',
    department: 'Tech',
    branch: 'Computer Engineering',
    year: '3rd Year (TE)',
    accessKey: 'tech123',
    phone: '+91 98765 43213',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    completionRate: 96,
    joinedDate: '2024-09-10'
  },
  {
    id: 'u-social-lead',
    name: 'Rohan Kapoor',
    email: 'social.lead@ecell.org',
    role: 'Lead',
    department: 'Social Media',
    branch: 'Information Technology',
    year: '3rd Year (TE)',
    accessKey: 'social123',
    phone: '+91 98765 43214',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    completionRate: 88,
    joinedDate: '2024-09-10'
  },
  {
    id: 'u-content-lead',
    name: 'Priya Sharma',
    email: 'content.lead@ecell.org',
    role: 'Lead',
    department: 'Content',
    branch: 'Computer Engineering',
    year: '3rd Year (TE)',
    accessKey: 'content123',
    phone: '+91 98765 43215',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    completionRate: 92,
    joinedDate: '2024-09-10'
  },
  {
    id: 'u-events-lead',
    name: 'Kunal Joshi',
    email: 'events.lead@ecell.org',
    role: 'Lead',
    department: 'Events',
    branch: 'EXTC Engineering',
    year: '3rd Year (TE)',
    accessKey: 'events123',
    phone: '+91 98765 43216',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    completionRate: 90,
    joinedDate: '2024-09-10'
  },
  {
    id: 'u-anshu',
    name: 'Anshu Patel',
    email: 'anshu@ecell.org',
    role: 'Member',
    department: 'Design',
    branch: 'Information Technology',
    year: '2nd Year (SE)',
    accessKey: 'anshu123',
    phone: '+91 98765 43220',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    completionRate: 95,
    joinedDate: '2025-01-15'
  },
  {
    id: 'u-sneha',
    name: 'Sneha Iyer',
    email: 'sneha@ecell.org',
    role: 'Member',
    department: 'Design',
    branch: 'Computer Engineering',
    year: '2nd Year (SE)',
    accessKey: 'sneha123',
    phone: '+91 98765 43221',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    completionRate: 90,
    joinedDate: '2025-01-15'
  },
  {
    id: 'u-ayush',
    name: 'Ayush Gupta',
    email: 'ayush@ecell.org',
    role: 'Member',
    department: 'Tech',
    branch: 'Computer Engineering',
    year: '2nd Year (SE)',
    accessKey: 'ayush123',
    phone: '+91 98765 43222',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    completionRate: 92,
    joinedDate: '2025-01-15'
  },
  {
    id: 'u-tanvi',
    name: 'Tanvi Nair',
    email: 'tanvi@ecell.org',
    role: 'Member',
    department: 'Social Media',
    branch: 'AI & Data Science',
    year: '1st Year (FE)',
    accessKey: 'tanvi123',
    phone: '+91 98765 43223',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    completionRate: 85,
    joinedDate: '2025-01-15'
  },
  {
    id: 'u-varun',
    name: 'Varun Reddy',
    email: 'varun@ecell.org',
    role: 'Member',
    department: 'Content',
    branch: 'Computer Engineering',
    year: '2nd Year (SE)',
    accessKey: 'varun123',
    phone: '+91 98765 43224',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    completionRate: 89,
    joinedDate: '2025-01-15'
  },
  {
    id: 'u-simran',
    name: 'Simran Kaur',
    email: 'simran@ecell.org',
    role: 'Member',
    department: 'Events',
    branch: 'Mechanical Engineering',
    year: '2nd Year (SE)',
    accessKey: 'simran123',
    phone: '+91 98765 43225',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    completionRate: 100,
    joinedDate: '2025-01-15'
  }
];

export const INITIAL_TASKS = [
  {
    id: 't-1',
    title: 'Eureka 2026 Instagram Creatives & Posters',
    description: 'Design official launch posters and Instagram carousel creatives for Eureka B-Plan competition.',
    assignedById: 'u-president',
    assignedToId: 'u-anshu',
    department: 'Design',
    priority: 'High',
    status: 'SUBMITTED',
    deadline: '2026-08-28T18:00:00',
    createdAt: '2026-08-22T10:00:00',
    submittedAt: '2026-08-26T11:30:00',
    deliverableUrl: 'https://figma.com/file/eureka-2026-posters',
    submissionNotes: 'All 3 square posters and 2 story templates are ready in the Figma link.',
    subtasks: [
      { id: 'st-1', title: 'Content & copy finalized with Content Team', completed: true },
      { id: 'st-2', title: 'Poster dimensions & layout guidelines decided', completed: true },
      { id: 'st-3', title: 'Create 3 Instagram Carousel slides', completed: true },
      { id: 'st-4', title: 'Submit for Design Lead & President verification', completed: true },
    ],
    attachments: [],
    activityLog: [
      { id: 'a-1', timestamp: '2026-08-22T10:00:00', userId: 'u-president', action: 'Created task and assigned to GS Aarav Mehta' },
      { id: 'a-2', timestamp: '2026-08-22T11:15:00', userId: 'u-gs', action: 'Delegated task to Design Lead Devanshi Shah' },
      { id: 'a-3', timestamp: '2026-08-22T14:30:00', userId: 'u-design-lead', action: 'Assigned execution to Anshu Patel' },
      { id: 'a-4', timestamp: '2026-08-23T09:00:00', userId: 'u-anshu', action: 'Started work & updated status to In Progress' },
      { id: 'a-5', timestamp: '2026-08-26T11:30:00', userId: 'u-anshu', action: 'Submitted task for verification with Figma deliverables' }
    ]
  },
  {
    id: 't-2',
    title: 'NEC Annual Audit & Progress Report',
    description: 'Compile the National Entrepreneurship Challenge track report for submission.',
    assignedById: 'u-president',
    assignedToId: 'u-gs',
    department: 'Executive',
    priority: 'Urgent',
    status: 'IN_PROGRESS',
    deadline: '2026-08-27T23:59:00',
    createdAt: '2026-08-20T14:00:00',
    subtasks: [
      { id: 'st-21', title: 'Collect attendance numbers from Events team', completed: true },
      { id: 'st-22', title: 'Compile budget utilization sheets from Finance', completed: true },
      { id: 'st-23', title: 'Draft Executive Summary & President foreword', completed: false }
    ],
    attachments: [],
    activityLog: [
      { id: 'a-21', timestamp: '2026-08-20T14:00:00', userId: 'u-president', action: 'Assigned high-priority NEC task to GS Aarav Mehta' },
      { id: 'a-22', timestamp: '2026-08-21T10:00:00', userId: 'u-gs', action: 'Accepted task and began drafting sections' }
    ]
  },
  {
    id: 't-3',
    title: 'E-Cell Portal & Announcement Engine Update',
    description: 'Deploy new student registration portal with dynamic OTP authentication.',
    assignedById: 'u-president',
    assignedToId: 'u-tech-lead',
    department: 'Tech',
    priority: 'Medium',
    status: 'COMPLETED',
    deadline: '2026-08-25T18:00:00',
    createdAt: '2026-08-15T09:00:00',
    completedAt: '2026-08-25T16:45:00',
    subtasks: [
      { id: 'st-31', title: 'Build React frontend components', completed: true },
      { id: 'st-32', title: 'Integrate backend API', completed: true }
    ],
    attachments: [],
    activityLog: [
      { id: 'a-31', timestamp: '2026-08-15T09:00:00', userId: 'u-president', action: 'Created task for Tech Department' },
      { id: 'a-34', timestamp: '2026-08-25T16:45:00', userId: 'u-president', action: 'Verified & Marked as Completed' }
    ]
  },
  {
    id: 't-4',
    title: 'September Instagram Content Calendar & Reels Script',
    description: 'Plan 12 educational reels and 8 founder spotlight carousels for September.',
    assignedById: 'u-gs',
    assignedToId: 'u-social-lead',
    department: 'Social Media',
    priority: 'Medium',
    status: 'IN_PROGRESS',
    deadline: '2026-08-29T20:00:00',
    createdAt: '2026-08-23T11:00:00',
    subtasks: [
      { id: 'st-41', title: 'Brainstorm 12 reel concepts', completed: true }
    ],
    attachments: [],
    activityLog: [
      { id: 'a-41', timestamp: '2026-08-23T11:00:00', userId: 'u-gs', action: 'Assigned to Rohan Kapoor' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'n-1',
    userId: 'u-president',
    type: 'submission',
    title: 'Task Submitted for Review',
    message: 'Anshu Patel submitted "Eureka 2026 Instagram Creatives & Posters" for verification.',
    timestamp: '2026-08-26T11:30:00',
    read: false,
    taskId: 't-1'
  },
  {
    id: 'n-2',
    userId: 'u-design-lead',
    type: 'submission',
    title: 'Deliverables Submitted',
    message: 'Anshu Patel uploaded Figma link for Eureka Posters.',
    timestamp: '2026-08-26T11:30:00',
    read: false,
    taskId: 't-1'
  },
  {
    id: 'n-3',
    userId: 'u-gs',
    type: 'reminder',
    title: 'Deadline Approaching',
    message: '"NEC Annual Audit & Progress Report" is due tomorrow.',
    timestamp: '2026-08-26T09:00:00',
    read: false,
    taskId: 't-2'
  }
];

export const INITIAL_MESSAGES = [
  {
    id: 'm-1',
    senderId: 'u-president',
    receiverId: 'u-design-lead',
    message: 'Hey Devanshi, please make sure the Eureka creatives follow the high-contrast neon theme.',
    timestamp: '2026-08-24T14:20:00',
    read: true
  },
  {
    id: 'm-2',
    senderId: 'u-design-lead',
    receiverId: 'u-president',
    message: 'Yes Shubham! Anshu is finishing the carousel slides today.',
    timestamp: '2026-08-24T14:22:00',
    read: true
  }
];
