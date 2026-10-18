import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DEPARTMENTS } from '../mock/seedData';
import { useAuth } from './AuthContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { currentUser, users } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [tasksLoading, setTasksLoading] = useState(true);

  // Load tasks from MongoDB on mount
  useEffect(() => {
    api.getTasks().then(data => {
      if (data && Array.isArray(data)) {
        setTasks(data);
      }
    }).catch(() => {}).finally(() => setTasksLoading(false));
  }, []);

  // Load departments from MongoDB on mount
  useEffect(() => {
    api.getDepartments().then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        setDepartments(data);
      }
    }).catch(() => {});
  }, []);

  // Helper to append to task's activity log
  const logActivity = (taskId, actionText, userId) => {
    const actorId = userId || (currentUser ? currentUser.id : 'u-president');
    return {
      id: `a-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      userId: actorId,
      action: actionText
    };
  };

  // Create a new task — save to MongoDB immediately
  const createTask = async (taskData) => {
    const creatorId = currentUser ? currentUser.id : 'u-president';
    const creatorName = currentUser ? currentUser.name : 'President';
    const assignee = users.find(u => u.id === taskData.assignedToId);
    const assigneeName = assignee ? assignee.name : 'Team Member';

    const newTask = {
      id: `t-${Date.now()}`,
      title: taskData.title,
      description: taskData.description || '',
      assignedById: creatorId,
      assignedToId: taskData.assignedToId,
      department: taskData.department,
      priority: taskData.priority || 'Medium',
      status: 'PENDING',
      deadline: taskData.deadline,
      createdAt: new Date().toISOString(),
      subtasks: taskData.subtasks || [],
      attachments: taskData.attachments || [],
      activityLog: [
        {
          id: `a-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: creatorId,
          action: `Created task and assigned to ${assigneeName}`
        }
      ]
    };

    // Optimistic update (show immediately in UI)
    setTasks(prev => [newTask, ...prev]);

    // Save to MongoDB backend
    const saved = await api.createTask(newTask).catch(() => null);
    if (saved && saved.id) {
      // Replace optimistic entry with server response if different
      setTasks(prev => prev.map(t => t.id === newTask.id ? saved : t));
    }

    return newTask;
  };

  // Helper: update task in state + backend
  const updateTaskInBackend = async (taskId, updatedTask) => {
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    await api.updateTask(taskId, updatedTask).catch(() => {});
  };

  // Helper to send notifications to President, GS and Assignor
  const notifyLeadership = (task, title, message, type = 'assigned') => {
    const leadershipUserIds = new Set();
    
    // Add all President and GS users
    users.forEach(u => {
      if (u.role === 'President' || u.role === 'GS' || u.role === 'General Secretary') {
        leadershipUserIds.add(u.id);
      }
    });

    // Add assignor
    if (task.assignedById) leadershipUserIds.add(task.assignedById);

    // Don't send notification to current actor
    if (currentUser?.id) leadershipUserIds.delete(currentUser.id);

    leadershipUserIds.forEach(targetUserId => {
      if (!targetUserId) return;
      const notif = {
        id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        userId: targetUserId,
        type,
        title,
        message,
        timestamp: new Date().toISOString(),
        read: false,
        taskId: task.id
      };
      api.createNotification(notif).catch(() => {});
    });
  };

  // Start working on task
  const startTask = (taskId) => {
    const actorName = currentUser ? currentUser.name : 'Team Member';
    const actorId = currentUser ? currentUser.id : 'u-member';
    
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = {
          ...t,
          status: 'IN_PROGRESS',
          startedAt: t.startedAt || new Date().toISOString(),
          startedById: actorId,
          startedByName: actorName,
          activityLog: [
            ...(t.activityLog || []), 
            logActivity(taskId, `${actorName} started work (Status: In Progress)`, actorId)
          ]
        };

        api.updateTask(taskId, updated).catch(() => {});
        
        // Instant alert to GS and President
        notifyLeadership(
          updated,
          `⚡ Work Started: "${t.title}"`,
          `${actorName} has started actively working on "${t.title}" (${t.department} Team).`,
          'assigned'
        );

        return updated;
      }
      return t;
    }));
  };

  // Direct 1-Click Complete Task
  const completeTask = (taskId) => {
    const actorName = currentUser ? currentUser.name : 'Member';
    const actorId = currentUser ? currentUser.id : 'u-member';
    try { confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } }); } catch (e) {}

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = {
          ...t,
          status: 'COMPLETED',
          completedAt: new Date().toISOString(),
          completedById: actorId,
          completedByName: actorName,
          activityLog: [
            ...(t.activityLog || []), 
            logActivity(taskId, `${actorName} completed this task`, actorId)
          ]
        };

        api.updateTask(taskId, updated).catch(() => {});
        
        // Notify leadership of task completion
        notifyLeadership(
          updated,
          `🎉 Task Completed: "${t.title}"`,
          `${actorName} has finalized and completed "${t.title}" (${t.department} Team).`,
          'completed'
        );

        return updated;
      }
      return t;
    }));
  };

  // Member submits task for review
  const submitTask = (taskId, { deliverableUrl, submissionNotes }) => {
    const actorName = currentUser ? currentUser.name : 'Member';
    const actorId = currentUser ? currentUser.id : 'u-member';

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = {
          ...t,
          status: 'SUBMITTED',
          submittedAt: new Date().toISOString(),
          deliverableUrl: deliverableUrl || t.deliverableUrl,
          submissionNotes: submissionNotes || t.submissionNotes,
          activityLog: [
            ...(t.activityLog || []), 
            logActivity(taskId, `${actorName} submitted deliverable for review`, actorId)
          ]
        };

        api.updateTask(taskId, updated).catch(() => {});

        // Notify leadership for review
        notifyLeadership(
          updated,
          `📥 Deliverable Submitted: "${t.title}"`,
          `${actorName} submitted "${t.title}" for verification.`,
          'reminder'
        );

        return updated;
      }
      return t;
    }));
  };

  // Lead or President approves and completes task
  const verifyAndApproveTask = (taskId, feedback) => {
    const verifierName = currentUser ? currentUser.name : 'Verifier';
    const verifierId = currentUser ? currentUser.id : 'u-president';
    try { confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } }); } catch (e) {}

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const feedbackText = feedback ? ` (Feedback: "${feedback}")` : '';
        const updated = {
          ...t,
          status: 'COMPLETED',
          completedAt: new Date().toISOString(),
          activityLog: [...(t.activityLog || []), logActivity(taskId, `${verifierName} approved & marked as COMPLETED${feedbackText}`, verifierId)]
        };
        api.updateTask(taskId, updated).catch(() => {});
        return updated;
      }
      return t;
    }));
  };

  // Lead or President requests revision
  const requestRevision = (taskId, feedback) => {
    const verifierName = currentUser ? currentUser.name : 'Reviewer';
    const verifierId = currentUser ? currentUser.id : 'u-president';

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = {
          ...t,
          status: 'IN_PROGRESS',
          activityLog: [...(t.activityLog || []), logActivity(taskId, `${verifierName} requested revision: "${feedback || 'Please update deliverables'}"`, verifierId)]
        };
        api.updateTask(taskId, updated).catch(() => {});
        return updated;
      }
      return t;
    }));
  };

  // Delegate / Reassign task
  const delegateTask = (taskId, targetSelection, note) => {
    const actorName = currentUser ? currentUser.name : 'GS';
    const actorId = currentUser ? currentUser.id : 'u-gs';

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        let newDepartment = t.department;
        let newAssigneeId = targetSelection;
        let targetLabel = '';

        if (targetSelection.startsWith('dept:')) {
          newDepartment = targetSelection.replace('dept:', '');
          const existingLead = users.find(u => u.role === 'Lead' && u.department.toLowerCase() === newDepartment.toLowerCase());
          newAssigneeId = existingLead ? existingLead.id : `team-${newDepartment.toLowerCase()}`;
          targetLabel = `${newDepartment} Team`;
        } else {
          const newAssignee = users.find(u => u.id === targetSelection);
          if (newAssignee) {
            newAssigneeId = newAssignee.id;
            newDepartment = newAssignee.department || t.department;
            targetLabel = `${newAssignee.name} (${newDepartment})`;
          }
        }

        const updated = {
          ...t,
          assignedById: actorId,
          assignedToId: newAssigneeId,
          department: newDepartment,
          status: 'PENDING',
          activityLog: [...(t.activityLog || []), logActivity(taskId, `${actorName} delegated task to ${targetLabel}${note ? ` (Note: "${note}")` : ''}`, actorId)]
        };
        api.updateTask(taskId, updated).catch(() => {});
        return updated;
      }
      return t;
    }));
  };

  // Toggle subtask checklist item
  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = t.subtasks.map(st =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const updated = { ...t, subtasks: updatedSubtasks };
        api.updateTask(taskId, updated).catch(() => {});
        return updated;
      }
      return t;
    }));
  };

  // Add subtask to existing task
  const addSubtask = (taskId, title) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newSubtask = { id: `st-${Date.now()}`, title: title.trim(), completed: false };
        const updated = { ...t, subtasks: [...(t.subtasks || []), newSubtask] };
        api.updateTask(taskId, updated).catch(() => {});
        return updated;
      }
      return t;
    }));
  };

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    api.deleteTask(taskId).catch(() => {});
  };

  // Refresh tasks from backend
  const refreshTasks = async () => {
    const data = await api.getTasks().catch(() => null);
    if (data && Array.isArray(data)) setTasks(data);
  };

  // Helper to count active tasks for a given user
  const getUserActiveTaskCount = (userId) => {
    return tasks.filter(t => t.assignedToId === userId && t.status !== 'COMPLETED').length;
  };

  // Helper to count active tasks for a given department
  const getDepartmentActiveTaskCount = (departmentName) => {
    return tasks.filter(t => t.department === departmentName && t.status !== 'COMPLETED').length;
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      departments,
      tasksLoading,
      createTask,
      startTask,
      completeTask,
      submitTask,
      verifyAndApproveTask,
      requestRevision,
      delegateTask,
      toggleSubtask,
      addSubtask,
      deleteTask,
      refreshTasks,
      getUserActiveTaskCount,
      getDepartmentActiveTaskCount
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
