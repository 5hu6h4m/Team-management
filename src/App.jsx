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
import { TeamHierarchyPage } from './pages/TeamHierarchyPage';
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
  const { currentUser, loading } = useAuth();
  const { setActiveContactId } = useChat();


  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Show loading spinner while fetching from MongoDB
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#B11226] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 text-xs font-medium tracking-wider uppercase">Connecting to server...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, render the clean login screen
  if (!currentUser) {
    return <LoginPage />;
  }


  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col antialiased selection:bg-red-500 selection:text-white">
      {/* Institutional Top Navbar */}
      <Navbar
        onOpenTaskDetail={handleOpenTaskDetail}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenCommandCenter={() => setIsCommandCenterOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
      />

      {/* Main Layout */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Responsive Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenCreateTask={() => setIsCreateTaskOpen(true)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-3 sm:p-5 lg:p-7 min-w-0 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
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

          {activeTab === 'team' && (
            <TeamDirectoryPage
              onSelectUser={handleSelectUser}
              onMessageUser={handleMessageUser}
              onOpenAdminAddMember={() => setActiveTab('admin')}
            />
          )}

          {activeTab === 'hierarchy' && (
            <TeamHierarchyPage
              onSelectUser={handleSelectUser}
              onOpenAdminAddMember={() => setActiveTab('admin')}
            />
          )}

          {activeTab === 'tasks' && (
            <AllTasksPage
              onOpenTaskDetail={handleOpenTaskDetail}
              onOpenCreateTask={() => setIsCreateTaskOpen(true)}
              onSubmitClick={handleSubmitTaskClick}
              onVerifyClick={handleVerifyTaskClick}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesPage />
          )}

          {activeTab === 'admin' && (
            <AdminPanelPage
              onSelectUser={handleSelectUser}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage />
          )}
        </main>
      </div>

      {/* Persistent Modals & Drawers */}
      <TaskCreateDrawer
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
      />

      <TaskDetailDrawer
        taskId={activeDetailTaskId}
        onClose={() => setActiveDetailTaskId(null)}
        onSubmitClick={handleSubmitTaskClick}
      />

      <TaskSubmissionModal
        task={submissionTask}
        isOpen={Boolean(submissionTask)}
        onClose={() => setSubmissionTask(null)}
      />

      <MemberProfileModal
        user={selectedMember}
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        onOpenTaskDetail={handleOpenTaskDetail}
        onMessageUser={handleMessageUser}
      />

      <CommandCenterModal
        isOpen={isCommandCenterOpen}
        onClose={() => setIsCommandCenterOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenCreateTask={() => setIsCreateTaskOpen(true)}
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
