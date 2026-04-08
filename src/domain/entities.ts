// ==========================================
// DOMAIN TYPES — Single source of truth
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  color: string;
  memberCount: number;
}

export interface Board {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  shareToken: string | null;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  boardId: string;
  title: string;
  position: number;
  taskIds: string[];
}

export interface Task {
  id: string;
  columnId: string;
  boardId: string;
  title: string;
  description: string;
  priority: Priority;
  assignee: User | null;
  dueDate: string | null;
  tags: string[];
  position: number;
  createdAt: string;
  updatedAt: string;
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface BoardSummary {
  id: string;
  title: string;
  description: string;
  columnCount: number;
  taskCount: number;
  updatedAt: string;
}

// ==========================================
// API TYPES
// ==========================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface CreateTaskRequest {
  boardId: string;
  columnId: string;
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
  tags?: string[];
}

export interface PatchTaskRequest {
  title?: string;
  description?: string;
  columnId?: string;
  position?: number;
  priority?: Priority;
  dueDate?: string | null;
  tags?: string[];
}

// ==========================================
// UI TYPES
// ==========================================

export interface ActivityItem {
  id: string;
  type: 'task_created' | 'task_moved' | 'task_updated';
  taskTitle: string;
  from?: string;
  to?: string;
  timestamp: string;
  user: string;
}
