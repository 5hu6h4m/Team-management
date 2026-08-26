import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { NotificationProvider } from './context/NotificationContext';
import { ChatProvider, useChat } from './context/ChatContext';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

import { DashboardPage } from './pages/DashboardPage';
import { AllTasksPage } from './pages/AllTasksPage';
import { TeamDirectoryPage } from './pages/TeamDirectoryPage';
import { MessagesPage } from './pages/MessagesPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LoginPage } from './pages/LoginPage';

import { TaskCreateDrawer } from './components/tasks/TaskCreateDrawer';
import { TaskDetailDrawer } from './components/tasks/TaskDetailDrawer';
import { TaskSubmissionModal } from './components/tasks/TaskSubmissionModal';
import { MemberProfileModal } from './components/team/MemberProfileModal';
import { CommandCenterModal } from './components/common/CommandCenterModal';

function MainApp() {
  const { currentUser } = useAuth();
  const { setActiveContactId } = useChat();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Drawers and Modals state
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [activeDetailTaskId, setActiveDetailTaskId] = useState(null);
  const [submissionTask, setSubmissionTask] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);

  // Global keyboard shortcut: Ctrl+K / Cmd+K for Command Center
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandCenterOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!currentUser) {
    return <LoginPage onLoginSuccess={() => setActiveTab('dashboard')} />;
  }

  const handleOpenTaskDetail = (taskId) => {
    setActiveDetailTaskId(taskId);
  };

  const handleSubmitTaskClick = (task) => {
    setSubmissionTask(task);
  };

  const handleVerifyTaskClick = (task) => {
    setActiveDetailTaskId(task.id);
  };

  const handleSelectUser = (user) => {
    setSelectedMember(user);
  };

  const handleMessageUser = (userId) => {
    setActiveContactId(userId);
    setActiveTab('messages');
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f5] flex flex-col font-sans">
      {/* Top Clean Navbar */}
      <Navbar
        onOpenTaskDetail={handleOpenTaskDetail}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenCommandCenter={() => setIsCommandCenterOpen(true)}
      />

      {/* Main Layout */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* 240px Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenCreateTask={() => setIsCreateTaskOpen(true)}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-5 sm:p-7 min-w-0 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          {activeTab === 'dashboard' && (
            <DashboardPage
              onOpenCreateTask={() => setIsCreateTaskOpen(true)}
              onOpenTaskDetail={handleOpenTaskDetail}
              onSubmitClick={handleSubmitTaskClick}
              onVerifyClick={handleVerifyTaskClick}
              onSelectUser={handleSelectUser}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'tasks' && (
            <AllTasksPage
              onOpenCreateTask={() => setIsCreateTaskOpen(true)}
              onOpenTaskDetail={handleOpenTaskDetail}
              onSubmitClick={handleSubmitTaskClick}
              onVerifyClick={handleVerifyTaskClick}
            />
          )}

          {activeTab === 'team' && (
            <TeamDirectoryPage
              onSelectUser={handleSelectUser}
              onMessageUser={handleMessageUser}
              onOpenAdminAddMember={() => setActiveTab('admin')}
            />
          )}

          {activeTab === 'messages' && <MessagesPage />}

          {activeTab === 'admin' && (
            <AdminPanelPage
              onSelectUser={handleSelectUser}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsPage />}
        </main>
      </div>

      {/* Slide-over Drawers (Points 9 & 11) */}
      <TaskCreateDrawer
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
      />

      <TaskDetailDrawer
        taskId={activeDetailTaskId}
        isOpen={Boolean(activeDetailTaskId)}
        onClose={() => setActiveDetailTaskId(null)}
        onOpenSubmitModal={(task) => setSubmissionTask(task)}
      />

      {/* Modals */}
      <TaskSubmissionModal
        task={submissionTask}
        isOpen={Boolean(submissionTask)}
        onClose={() => setSubmissionTask(null)}
      />

      <MemberProfileModal
        user={selectedMember}
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        onMessageUser={handleMessageUser}
        onOpenTaskDetail={handleOpenTaskDetail}
      />

      <CommandCenterModal
        isOpen={isCommandCenterOpen}
        onClose={() => setIsCommandCenterOpen(false)}
        onAssignTask={() => setIsCreateTaskOpen(true)}
        onAddMember={() => setActiveTab('admin')}
        onNavigate={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <NotificationProvider>
          <ChatProvider>
            <MainApp />
          </ChatProvider>
        </NotificationProvider>
      </TaskProvider>
    </AuthProvider>
  );
}
