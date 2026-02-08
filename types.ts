
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum TaskStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed'
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  category: string;
  createdAt: number;
  dueDate?: string;
}

export enum AppPhase {
  OVERVIEW = 'Overview',
  SPEC_WORKSPACE = 'Spec Workspace',
  TODO_APP = 'Todo App',
  CHATBOT = 'AI Chatbot',
  ARCHITECTURE = 'Architecture'
}

export interface SpecFile {
  name: string;
  path: string;
  content: string;
  type: 'constitution' | 'specify' | 'plan' | 'tasks';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  toolCalls?: any[];
}
