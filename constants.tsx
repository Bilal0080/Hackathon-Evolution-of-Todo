
import React from 'react';
import { AppPhase, Priority, TaskStatus, Todo, SpecFile } from './types';

export const HACKATHON_PHASES = [
  { id: 1, name: 'Phase I', title: 'In-Memory Python Console App', status: 'completed' },
  { id: 2, name: 'Phase II', title: 'Full-Stack Web Application', status: 'current' },
  { id: 3, name: 'Phase III', title: 'AI-Powered Todo Chatbot', status: 'pending' },
  { id: 4, name: 'Phase IV', title: 'Local K8s Deployment', status: 'pending' },
  { id: 5, name: 'Phase V', title: 'Advanced Cloud Deployment', status: 'pending' },
];

export const INITIAL_TODOS: Todo[] = [
  {
    id: '1',
    title: 'Setup WSL 2 Environment',
    description: 'Ensure Ubuntu-22.04 is installed and default version is set to 2.',
    priority: Priority.HIGH,
    status: TaskStatus.COMPLETED,
    category: 'Setup',
    createdAt: Date.now() - 86400000,
  },
  {
    id: '2',
    title: 'Configure Neon Database',
    description: 'Create a new project on Neon and get the connection string for FastAPI.',
    priority: Priority.MEDIUM,
    status: TaskStatus.PENDING,
    category: 'Backend',
    createdAt: Date.now() - 43200000,
  },
  {
    id: '3',
    title: 'Implement Better Auth',
    description: 'Integrate Better Auth with Next.js frontend and secure FastAPI endpoints with JWT.',
    priority: Priority.HIGH,
    status: TaskStatus.PENDING,
    category: 'Auth',
    createdAt: Date.now(),
  }
];

export const INITIAL_SPECS: SpecFile[] = [
  {
    name: 'speckit.constitution',
    path: 'root/',
    type: 'constitution',
    content: `# Project Constitution
1. No agent is allowed to write code until the specification is complete.
2. Every code file must link back to a Task ID.
3. Use FastAPI, Next.js, and SQLModel.
4. Security first: Always use JWT for API communication.`
  },
  {
    name: 'speckit.specify',
    path: 'root/specs/',
    type: 'specify',
    content: `# Feature: Task CRUD Operations
- Users can create, view, update, and delete tasks.
- Only show tasks belonging to the authenticated user.
- Tasks must have a title, priority, and completion status.`
  }
];
