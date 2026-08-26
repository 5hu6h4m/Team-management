# 🚀 E-Cell TaskHub — Complete Operational & User Guide

**E-Cell TaskHub** is a role-based operational management system engineered specifically for Entrepreneurship Cells (E-Cell). It solves the core communication breakdown (*"Who is doing what, by when, and what is the current status?"*) through structured hierarchical delegation, anti-fake verification workflows, live workload balancing, and institutional dark aesthetics.

---

## 📑 Table of Contents
1. [System Architecture & Roles Overview](#1-system-architecture--roles-overview)
2. [How to Login & Switch Roles](#2-how-to-login--switch-roles)
3. [President Interface & Admin Panel Access](#3-president-interface--admin-panel-access)
4. [General Secretary (GS) Interface](#4-general-secretary-gs-interface)
5. [Department Lead Interface](#5-department-lead-interface)
6. [Member Interface & Deliverable Submission](#6-member-interface--deliverable-submission)
7. [Task Verification & Anti-Fake Completion Workflow](#7-task-verification--anti-fake-completion-workflow)
8. [Workload Balancer & Deadline System](#8-workload-balancer--deadline-system)
9. [Command Center & Team Messaging](#9-command-center--team-messaging)
10. [Database & Backend Overview](#10-database--backend-overview)

---

## 1. System Architecture & Roles Overview

TaskHub operates on a 4-tier hierarchy:

```
                    ┌─────────────────────────┐
                    │    PRESIDENT (Shubham)  │
                    │   Full Operational Ctrl │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  GENERAL SECRETARY (GS) │
                    │ Initiative Distribution │
                    └────────────┬────────────┘
                                 │
      ┌──────────────────────────┼──────────────────────────┐
      ▼                          ▼                          ▼
┌─────────────┐            ┌─────────────┐            ┌─────────────┐
│  TECH LEAD  │            │ DESIGN LEAD │            │ SOCIAL LEAD │
│ Team Roster │            │ Team Roster │            │ Team Roster │
└──────┬──────┘            └──────┬──────┘            └──────┬──────┘
       │                          │                          │
  ┌────┴────┐                ┌────┴────┐                ┌────┴────┐
  ▼         ▼                ▼         ▼                ▼         ▼
Member    Member           Member    Member           Member    Member
(Ayush)                    (Anshu)   (Sneha)          (Tanvi)
```

---

## 2. How to Login & Switch Roles

### Method A: Top Navbar Quick Switcher (Fastest for Testing)
1. In the top navbar, click the **`Role: [Name] ▾`** pill button.
2. A dropdown will appear listing all team members across all roles.
3. Click any person (e.g. **Shubham - President**, **Aarav - GS**, **Devanshi - Design Lead**, or **Anshu - Member**).
4. The dashboard, sidebar permissions, and action buttons will instantly transform to that specific role.

### Method B: Login Portal (1-Click Demo Profiles)
1. Click your profile avatar on the top right ➔ click **"Sign Out"**.
2. On the Login Screen, you will see the **Instant 1-Click Role Login** buttons:
   - 👑 **President** (`Shubham` - `president@ecell.org`)
   - 📋 **GS** (`Aarav Mehta` - `gs@ecell.org`)
   - 🎨 **Design Lead** (`Devanshi Shah` - `design.lead@ecell.org`)
   - 👤 **Member** (`Anshu Patel` - `anshu@ecell.org`)
3. Click any profile to log in with a single click (or type their email with password `password123`).

---

## 3. President Interface & Admin Panel Access

The President has full operational visibility across all departments and exclusive access to the Admin Panel.

### A. President Dashboard Elements:
1. **Header**: `Good afternoon, Shubham.` / `Here's what's happening across E-Cell today.`
2. **Metric Counters**:
   - `52 MEMBERS` | `31 ACTIVE` | `18 COMPLETED` | `04 OVERDUE` (Overdue highlighted in red).
3. **"Needs Your Attention" Section**:
   - `🔴 4 overdue tasks` (Click to jump to overdue tasks)
   - `🟡 3 tasks awaiting verification` (Click to jump to review queue)
   - `🟡 2 overloaded members` (Click to inspect overloaded members)
4. **Main 2-Column Split**:
   - **Left Column (65%)**: Active Operational Tasks + Chronological Activity Timeline Feed.
   - **Right Column (35%)**: Department Performance completion rates + Team Availability breakdown (🟢 Available, 🟡 Normal, 🟠 Busy, 🔴 Overloaded).

### B. Accessing & Using the Admin Panel:
1. In the left sidebar, under **`MANAGEMENT`**, click **`⚙ Admin Panel`** (Only visible when logged in as President).
2. Inside the Admin Panel, you have 3 sub-tabs:
   - **`Members Management`**:
     - View all members with roles, contact info, and active/inactive status.
     - Click **`Edit Role`** to promote/demote (e.g., Member ➔ Lead ➔ GS) or change their department.
     - Click **`Deactivate / Reactivate`** to safely toggle member status without breaking historical task audit trails.
     - Click **`+ Add Member`** button on top right to invite a new team member.
   - **`Hierarchy Tree`**:
     - Interactive visual organizational chart connecting President ➔ GS ➔ Department Leads ➔ Members with dark institutional cards.
   - **`Departments`**:
     - Manage existing departments (Tech, Design, Social Media, Content, Events, Finance, etc.) and add new departments.

### C. Assigning a New Task:
1. Click the red **`+ Assign Task`** button in the sidebar or top header.
2. A sleek right-side **Slide-over Drawer** will open.
3. Select title, department, priority, deadline, and subtask milestones.
4. **Signature Assignee Inspector**: When choosing an assignee, TaskHub displays their live active task count, completion rate (94%), and triggers a red alert (`⚠️ Consider another member (7+ active tasks)`) if the member is overloaded.

---

## 4. General Secretary (GS) Interface

The GS acts as the central coordinator between the President's vision and department execution.

### Key GS Features:
- **President Initiatives Tracking**:
  - High-level initiative cards with live progress bars (e.g., *Eureka 2026: 82%*, *NEC Campaign: 61%*, *Website Revamp: 100%*).
- **Task Delegation**:
  - Receive macro initiatives from President and break them down into department assignments for Leads.
- **Cross-Department Performance**:
  - Department completion comparison and member workload overview.

---

## 5. Department Lead Interface

(e.g., **Devanshi Shah** - Design Lead, **Shivam Verma** - Tech Lead)

Leads focus on their specific department's active team roster and deliverable verification.

### Key Lead Features:
1. **Department Overview**:
   - `DESIGN TEAM` header showing member count, active tasks, and pending review queue.
2. **Pending Reviews Queue (Top Priority)**:
   - When a department member submits a deliverable (e.g., Anshu uploaded Eureka posters Figma link), it appears prominently in the **Pending Reviews Queue**.
   - Lead clicks **"Review"** to inspect deliverable links and approve or request revisions.
3. **Team Workload Roster**:
   - List of department members with live workload badges (● Available, ● Normal, ● Busy, ● Overloaded) to ensure work is evenly distributed.

---

## 6. Member Interface & Deliverable Submission

(e.g., **Anshu Patel** - Design Member, **Sneha**, **Ayush**)

Members get a clean, distraction-free **"MY WORK"** workspace.

### Key Member Features:
1. **Focused View**:
   - `MY WORK` header with summary (`2 Active Tasks | 1 Due Today | 4 Completed`).
2. **Task Actions**:
   - For `PENDING` tasks: Click **`Start Working`** (Moves status to `IN_PROGRESS` and logs activity).
   - For `IN_PROGRESS` tasks: Click **`Submit for Verification`**.
3. **Submitting Deliverables**:
   - A modal opens asking for:
     - **Deliverable Link** (Figma file, Google Drive folder, GitHub PR, Doc URL)
     - **Submission Notes** (Details of work done, dimensions, variations)
   - Once submitted, the task transitions to `SUBMITTED (Review)` and alerts the Lead and President.

---

## 7. Task Verification & Anti-Fake Completion Workflow

To eliminate false completion ("Bhai maine kar diya tha"):

```
1. Member clicks "Submit for Verification" ➔ Enters Figma/Drive link
                          │
                          ▼
2. Task status becomes "SUBMITTED (Review)"
                          │
                          ▼
3. Notification sent to Department Lead & President
                          │
                          ▼
4. Lead/President inspects deliverable in Task Details Drawer:
      ├── [ Approve & Complete ] ➔ Task turns 🟢 COMPLETED (Confetti 🎉)
      └── [ Request Revision ]   ➔ Task goes back to 🟡 IN_PROGRESS with feedback note
```

Every action is permanently recorded in the **Vertical Activity Timeline** on the task drawer.

---

## 8. Workload Balancer & Deadline System

### Workload Indicators:
- 🟢 **Available** (0 active tasks) — Ready for immediate assignment
- 🟡 **Normal** (1–3 active tasks) — Standard healthy workload
- 🟠 **Busy** (4–5 active tasks) — Approaching capacity
- 🔴 **Overloaded** (6+ active tasks) — Flagged with warning banner

### Automated Deadline Health:
- 🟢 **On Track** — Deadline is more than 24 hours away
- 🟡 **Due Soon** — Deadline is under 24 hours away
- 🔴 **Overdue** — Deadline has passed and task is incomplete

---

## 9. Command Center & Team Messaging

### A. `⌘ Quick Actions` Command Center:
- Press **`Ctrl + K`** or click **`Quick Actions`** in the top navbar.
- Instantly launch common workflows:
  - `+ Assign New Task`
  - `+ Add Team Member`
  - `◌ Send Direct Message`
  - `⌁ View Overdue Tasks`
  - `◎ View Available Members`

### B. Team Direct Messaging:
- Navigate to **`Messages`** in the sidebar.
- 1-on-1 direct chat with President, GS, Leads, and Members.
- **"Attach Task" Feature**: Click the paperclip icon to reference an operational task directly into the message.

---

## 10. Database & Backend Overview

- **Frontend**: React + Vite + Tailwind CSS + Lucide Icons.
- **Backend**: Node.js + Express.js API (`server/index.js` on port `5000`).
- **Database**: MongoDB Mongoose Models (`User`, `Task`, `Department`, `Notification`, `Message`).
- **Connection URI**: Configured in `.env` (`MONGODB_URI`).
- **Automatic Fallback**: Optimistic client persistence ensures the app is fast and resilient.

---

## 🚀 Quick Launch Commands

```bash
# Run Frontend (Vite)
npm run dev

# Run MongoDB Backend Server
npm run server

# Run Both Together Concurrently
npm run dev:all
```
