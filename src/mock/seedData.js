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
    description: 'Design official launch posters and Instagram carousel creatives for Eureka B-Plan competition. Maintain the official neon-futuristic theme and include QR code for registration.',
    assignedById: 'u-president',
    assignedToId: 'u-anshu',
    department: 'Design',
    priority: 'High',
    status: 'SUBMITTED', // Pending, In Progress, Submitted, Completed
    deadline: '2026-08-28T18:00:00',
    createdAt: '2026-08-22T10:00:00',
    submittedAt: '2026-08-26T11:30:00',
    deliverableUrl: 'https://figma.com/file/eureka-2026-posters',
    submissionNotes: 'All 3 square posters and 2 story templates are ready in the Figma link above. Checked color contrast and QR readability.',
    subtasks: [
      { id: 'st-1', title: 'Content & copy finalized with Content Team', completed: true },
      { id: 'st-2', title: 'Poster dimensions & layout guidelines decided', completed: true },
      { id: 'st-3', title: 'Create 3 Instagram Carousel slides', completed: true },
      { id: 'st-4', title: 'Submit for Design Lead & President verification', completed: true },
    ],
    attachments: [
      { name: 'Brand_Guidelines_v3.pdf', size: '2.4 MB', url: '#' },
      { name: 'Eureka_Logo_Pack.zip', size: '14.1 MB', url: '#' }
    ],
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
    description: 'Compile the National Entrepreneurship Challenge (NEC) track report for submission. Include metrics for workshop participation, bootcamps conducted, and startup funding facilitated.',
    assignedById: 'u-president',
    assignedToId: 'u-gs',
    department: 'Executive',
    priority: 'Urgent',
    status: 'IN_PROGRESS',
    deadline: '2026-08-27T23:59:00', // Tomorrow -> Due Soon
    createdAt: '2026-08-20T14:00:00',
    subtasks: [
      { id: 'st-21', title: 'Collect attendance numbers from Events team', completed: true },
      { id: 'st-22', title: 'Compile budget utilization sheets from Finance', completed: true },
      { id: 'st-23', title: 'Draft Executive Summary & President foreword', completed: false },
      { id: 'st-24', title: 'Final proofread and PDF export', completed: false }
    ],
    attachments: [
      { name: 'NEC_Rubric_2026.pdf', size: '1.8 MB', url: '#' }
    ],
    activityLog: [
      { id: 'a-21', timestamp: '2026-08-20T14:00:00', userId: 'u-president', action: 'Assigned high-priority NEC task to GS Aarav Mehta' },
      { id: 'a-22', timestamp: '2026-08-21T10:00:00', userId: 'u-gs', action: 'Accepted task and began drafting sections' }
    ]
  },
  {
    id: 't-3',
    title: 'E-Cell Portal & Announcement Engine Update',
    description: 'Deploy new student registration portal with dynamic OTP authentication, QR ticket generator, and live leaderboard.',
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
      { id: 'st-32', title: 'Integrate backend MongoDB & Auth API', completed: true },
      { id: 'st-33', title: 'Staging test & security scan', completed: true },
      { id: 'st-34', title: 'Production deployment to Vercel & AWS', completed: true }
    ],
    attachments: [
      { name: 'Architecture_Diagram.png', size: '820 KB', url: '#' }
    ],
    activityLog: [
      { id: 'a-31', timestamp: '2026-08-15T09:00:00', userId: 'u-president', action: 'Created task for Tech Department' },
      { id: 'a-32', timestamp: '2026-08-15T11:00:00', userId: 'u-tech-lead', action: 'Assigned subcomponents to Ayush' },
      { id: 'a-33', timestamp: '2026-08-24T18:00:00', userId: 'u-tech-lead', action: 'Submitted code for verification' },
      { id: 'a-34', timestamp: '2026-08-25T16:45:00', userId: 'u-president', action: 'Verified & Marked as Completed' }
    ]
  },
  {
    id: 't-4',
    title: 'September Instagram Content Calendar & Reels Script',
    description: 'Plan 12 educational reels and 8 founder spotlight carousels for the month of September. Align with upcoming E-Summit 2026 announcements.',
    assignedById: 'u-gs',
    assignedToId: 'u-social-lead',
    department: 'Social Media',
    priority: 'Medium',
    status: 'IN_PROGRESS',
    deadline: '2026-08-29T20:00:00',
    createdAt: '2026-08-23T11:00:00',
    subtasks: [
      { id: 'st-41', title: 'Brainstorm 12 reel concepts', completed: true },
      { id: 'st-42', title: 'Write script drafts with Content Team', completed: false },
      { id: 'st-43', title: 'Schedule shoot dates with speakers', completed: false }
    ],
    attachments: [],
    activityLog: [
      { id: 'a-41', timestamp: '2026-08-23T11:00:00', userId: 'u-gs', action: 'Assigned to Rohan Kapoor' },
      { id: 'a-42', timestamp: '2026-08-24T09:30:00', userId: 'u-social-lead', action: 'Status moved to In Progress' }
    ]
  },
  {
    id: 't-5',
    title: 'E-Summit Corporate Sponsorship Deck 2026',
    description: 'Prepare the 18-page sponsorship proposal deck with tier breakdown (Title, Powered By, Associate, Tech Partner) and historical reach statistics.',
    assignedById: 'u-president',
    assignedToId: 'u-president',
    department: 'Finance',
    priority: 'High',
    status: 'IN_PROGRESS',
    deadline: '2026-08-30T17:00:00',
    createdAt: '2026-08-21T16:00:00',
    subtasks: [
      { id: 'st-51', title: 'Update demographic and footfall data from 2025', completed: true },
      { id: 'st-52', title: 'Re-align tier pricing structure', completed: true },
      { id: 'st-53', title: 'Get graphics finalized with Design Team', completed: false }
    ],
    attachments: [
      { name: 'Sponsorship_Tiers_Draft.xlsx', size: '450 KB', url: '#' }
    ],
    activityLog: [
      { id: 'a-51', timestamp: '2026-08-21T16:00:00', userId: 'u-president', action: 'Created task' }
    ]
  },
  {
    id: 't-6',
    title: 'Founder Series Article: Bootstrapping in 2026',
    description: 'Interview alumni founder of Zepto-backed startup and write a 1200-word Medium publication article.',
    assignedById: 'u-content-lead',
    assignedToId: 'u-varun',
    department: 'Content',
    priority: 'Low',
    status: 'PENDING',
    deadline: '2026-08-31T18:00:00',
    createdAt: '2026-08-25T14:00:00',
    subtasks: [
      { id: 'st-61', title: 'Send questionnaire to founder', completed: false },
      { id: 'st-62', title: 'Draft first copy', completed: false },
      { id: 'st-63', title: 'Review with Priya Sharma', completed: false }
    ],
    attachments: [],
    activityLog: [
      { id: 'a-61', timestamp: '2026-08-25T14:00:00', userId: 'u-content-lead', action: 'Assigned to Varun Reddy' }
    ]
  },
  {
    id: 't-7',
    title: 'Stage & Audio Equipment Vendor Quotations',
    description: 'Procure minimum 3 vendor quotations for Main Auditorium lighting, line-array speakers, and LED wall rental for E-Summit.',
    assignedById: 'u-events-lead',
    assignedToId: 'u-simran',
    department: 'Events',
    priority: 'Urgent',
    status: 'IN_PROGRESS',
    deadline: '2026-08-24T12:00:00', // Past deadline -> Overdue
    createdAt: '2026-08-18T10:00:00',
    subtasks: [
      { id: 'st-71', title: 'Contact Vendor A & B for initial specs', completed: true },
      { id: 'st-72', title: 'Collect comparative quotation sheet', completed: false }
    ],
    attachments: [],
    activityLog: [
      { id: 'a-71', timestamp: '2026-08-18T10:00:00', userId: 'u-events-lead', action: 'Assigned to Simran Kaur' }
    ]
  },
  {
    id: 't-8',
    title: 'E-Cell Official T-shirt & Swag Design',
    description: 'Design official team polo t-shirts, lanyard cards, and laptop stickers for the upcoming induction batch.',
    assignedById: 'u-design-lead',
    assignedToId: 'u-sneha',
    department: 'Design',
    priority: 'Medium',
    status: 'COMPLETED',
    deadline: '2026-08-24T18:00:00',
    createdAt: '2026-08-16T12:00:00',
    completedAt: '2026-08-24T15:00:00',
    subtasks: [
      { id: 'st-81', title: 'Design mockup in Illustrator', completed: true },
      { id: 'st-82', title: 'Select fabric specs with vendor', completed: true },
      { id: 'st-83', title: 'Sample approval from President', completed: true }
    ],
    attachments: [],
    activityLog: [
      { id: 'a-81', timestamp: '2026-08-16T12:00:00', userId: 'u-design-lead', action: 'Assigned to Sneha Iyer' },
      { id: 'a-82', timestamp: '2026-08-24T15:00:00', userId: 'u-president', action: 'Approved and Completed' }
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
    message: '"NEC Annual Audit & Progress Report" is due tomorrow at 11:59 PM.',
    timestamp: '2026-08-26T09:00:00',
    read: false,
    taskId: 't-2'
  },
  {
    id: 'n-4',
    userId: 'u-anshu',
    type: 'assigned',
    title: 'New Task Assigned',
    message: 'Devanshi Shah assigned you "Eureka 2026 Instagram Creatives & Posters".',
    timestamp: '2026-08-22T14:30:00',
    read: true,
    taskId: 't-1'
  },
  {
    id: 'n-5',
    userId: 'u-president',
    type: 'overdue',
    title: 'Overdue Alert',
    message: '"Stage & Audio Equipment Vendor Quotations" is overdue by 2 days.',
    timestamp: '2026-08-25T00:00:00',
    read: false,
    taskId: 't-7'
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
    message: 'Yes Shubham! Anshu is finishing the carousel slides today. We will submit by afternoon.',
    timestamp: '2026-08-24T14:22:00',
    read: true
  },
  {
    id: 'm-3',
    senderId: 'u-design-lead',
    receiverId: 'u-anshu',
    message: 'Anshu, remember to add the registration QR code on the final slide of the carousel.',
    timestamp: '2026-08-25T11:00:00',
    read: true
  },
  {
    id: 'm-4',
    senderId: 'u-anshu',
    receiverId: 'u-design-lead',
    message: 'Got it Devanshi! Just submitted the Figma link for review.',
    timestamp: '2026-08-26T11:32:00',
    read: false
  },
  {
    id: 'm-5',
    senderId: 'u-president',
    receiverId: 'u-gs',
    message: 'Aarav, let me know when the NEC audit draft is ready for initial review.',
    timestamp: '2026-08-26T10:00:00',
    read: true
  }
];
