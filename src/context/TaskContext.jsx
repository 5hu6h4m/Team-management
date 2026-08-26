import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_TASKS, INITIAL_DEPARTMENTS } from '../mock/seedData';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { useAuth } from './AuthContext';
import { getDeadlineStatus } from '../utils/deadlineHelper';
import confetti from 'canvas-confetti';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { currentUser, users } = useAuth();
  const [tasks, setTasks] = useState(() => loadFromStorage('tasks', INITIAL_TASKS));
  const [departments, setDepartments] = useState(() => loadFromStorage('departments', INITIAL_DEPARTMENTS));

  useEffect(() => {
    saveToStorage('tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage('departments', departments);
  }, [departments]);

  // Helper to append to task's activity log
  const logActivity = (taskId, actionText, userId) => {
    const actorId = userId || (currentUser ? currentUser.id : 'u-president');
    const newLog = {
      id: `a-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      userId: actorId,
      action: actionText
    };
    return newLog;
  };

  // Create a new task
  const createTask = (taskData) => {
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

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  // Start working on task
  const startTask = (taskId) => {
    const actorName = currentUser ? currentUser.name : 'User';
    const actorId = currentUser ? currentUser.id : 'u-president';
    
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'IN_PROGRESS',
          activityLog: [
            ...t.activityLog,
            logActivity(taskId, `${actorName} started work (Status: In Progress)`, actorId)
          ]
        };
      }
      return t;
    }));
  };

  // Member submits task for review
  const submitTask = (taskId, { deliverableUrl, submissionNotes }) => {
    const actorName = currentUser ? currentUser.name : 'Member';
    const actorId = currentUser ? currentUser.id : 'u-anshu';

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'SUBMITTED',
          submittedAt: new Date().toISOString(),
          deliverableUrl: deliverableUrl || t.deliverableUrl,
          submissionNotes: submissionNotes || t.submissionNotes,
          activityLog: [
            ...t.activityLog,
            logActivity(taskId, `${actorName} submitted task for verification`, actorId)
          ]
        };
      }
      return t;
    }));
  };

  // Lead or President approves and completes task
  const verifyAndApproveTask = (taskId, feedback) => {
    const verifierName = currentUser ? currentUser.name : 'Verifier';
    const verifierId = currentUser ? currentUser.id : 'u-president';

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const feedbackText = feedback ? ` (Feedback: "${feedback}")` : '';
        return {
          ...t,
          status: 'COMPLETED',
          completedAt: new Date().toISOString(),
          activityLog: [
            ...t.activityLog,
            logActivity(taskId, `${verifierName} approved & marked as COMPLETED${feedbackText}`, verifierId)
          ]
        };
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
        return {
          ...t,
          status: 'IN_PROGRESS',
          activityLog: [
            ...t.activityLog,
            logActivity(taskId, `${verifierName} requested revision: "${feedback || 'Please update deliverables'}"`, verifierId)
          ]
        };
      }
      return t;
    }));
  };

  // Delegate / Reassign task
  const delegateTask = (taskId, newAssigneeId, note) => {
    const actorName = currentUser ? currentUser.name : 'User';
    const actorId = currentUser ? currentUser.id : 'u-gs';
    const newAssignee = users.find(u => u.id === newAssigneeId);
    const newAssigneeName = newAssignee ? newAssignee.name : 'Team Member';

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          assignedToId: newAssigneeId,
          activityLog: [
            ...t.activityLog,
            logActivity(taskId, `${actorName} delegated task to ${newAssigneeName}${note ? ` (Note: "${note}")` : ''}`, actorId)
          ]
        };
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
        return {
          ...t,
          subtasks: updatedSubtasks
        };
      }
      return t;
    }));
  };

  // Add subtask to existing task
  const addSubtask = (taskId, title) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newSubtask = {
          id: `st-${Date.now()}`,
          title,
          completed: false
        };
        return {
          ...t,
          subtasks: [...(t.subtasks || []), newSubtask]
        };
      }
      return t;
    }));
  };

  // Delete task
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Helper calculation for user workload
  const getUserActiveTaskCount = (userId) => {
    return tasks.filter(t => t.assignedToId === userId && t.status !== 'COMPLETED').length;
  };

  // Add Department
  const addDepartment = (dept) => {
    const newDept = {
      id: dept.name.toLowerCase().replace(/\s+/g, '-'),
      name: dept.name,
      icon: dept.icon || 'Layers',
      leadId: dept.leadId || '',
      color: dept.color || 'blue'
    };
    setDepartments(prev => [...prev, newDept]);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        departments,
        createTask,
        startTask,
        submitTask,
        verifyAndApproveTask,
        requestRevision,
        delegateTask,
        toggleSubtask,
        addSubtask,
        deleteTask,
        getUserActiveTaskCount,
        addDepartment
      }}
    >
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
