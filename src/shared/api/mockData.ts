import type { User, Workspace, Board, Task, Column, ActivityItem } from '../../domain/entities';
import { v4 as uuid } from 'uuid';

// ==========================================
// SEED DATA — Rich realistic mock data
// ==========================================

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Akshansh Shrivastava', email: 'akshansh@demo.com', avatarUrl: '' },
  { id: 'u2', name: 'Priya Sharma', email: 'priya@demo.com', avatarUrl: '' },
  { id: 'u3', name: 'Rahul Verma', email: 'rahul@demo.com', avatarUrl: '' },
  { id: 'u4', name: 'Sarah Chen', email: 'sarah@demo.com', avatarUrl: '' },
  { id: 'u5', name: 'Mark Wilson', email: 'mark@demo.com', avatarUrl: '' },
];

export const MOCK_WORKSPACES: Workspace[] = [
  { id: 'ws1', name: 'Acme Engineering', slug: 'acme-eng', color: '#7C5CFF', memberCount: 12 },
  { id: 'ws2', name: 'Mobile App Core', slug: 'mobile-core', color: '#FF6B6B', memberCount: 8 },
  { id: 'ws3', name: 'SaaS Infrastructure', slug: 'saas-infra', color: '#00C9A7', memberCount: 5 },
];

function makeTasks(boardId: string, columnId: string, tasks: Partial<Task>[]): Task[] {
  return tasks.map((t, i) => ({
    id: t.id || uuid(),
    columnId,
    boardId,
    title: t.title || 'Untitled',
    description: t.description || '',
    priority: t.priority || 'MEDIUM',
    assignee: t.assignee || MOCK_USERS[i % MOCK_USERS.length],
    dueDate: t.dueDate || new Date(Date.now() + 86400000 * 7).toISOString(), // + 7 days
    tags: t.tags || [],
    position: (i + 1) * 1000,
    createdAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

// ---- Board 1: Frontend Platform ----
const b1Backlog = makeTasks('b1', 'col-b1-1', [
  { id: 't1', title: 'Implement infinite scroll for feed', description: 'Ensure smooth pagination and intersection observer logic', priority: 'HIGH', tags: ['frontend', 'ux'] },
  { id: 't2', title: 'Fix flickering in Task Detail Modal', description: 'Address layout shift during image loading', priority: 'MEDIUM', tags: ['bug', 'ui'] },
  { id: 't3', title: 'Audit accessibility for Screen Readers', description: 'Review ARIA labels across navigation components', priority: 'LOW', tags: ['a11y'] },
]);
const b1Todo = makeTasks('b1', 'col-b1-2', [
  { id: 't4', title: 'Optimize bundle size using code splitting', description: 'Target 15% reduction in initial JS payload', priority: 'HIGH', tags: ['performance'] },
  { id: 't5', title: 'Improve Lighthouse score (Mobile)', description: 'Optimize image formats and LCP timestamps', priority: 'MEDIUM', tags: ['performance'] },
]);
const b1InProgress = makeTasks('b1', 'col-b1-3', [
  { id: 't6', title: 'Transition from React 17 to React 18', description: 'Enable concurrent rendering and update Suspense logic', priority: 'URGENT', tags: ['refactor', 'frontend'] },
  { id: 't7', title: 'Integrated Zod for Runtime Validation', description: 'Secure the UCCR boundary points', priority: 'HIGH', tags: ['safety', 'architecture'] },
]);
const b1Review = makeTasks('b1', 'col-b1-4', [
  { id: 't8', title: 'Set up husky pre-commit hooks', description: 'Enforce linting and formatting on every commit', priority: 'MEDIUM', tags: ['dx'] },
]);
const b1QA = makeTasks('b1', 'col-b1-5', [
  { id: 't9', title: 'Refactor search bar debounce logic', description: 'Reduce unnecessary re-renders in heavy task lists', priority: 'LOW', tags: ['performance'] },
]);
const b1Done = makeTasks('b1', 'col-b1-6', [
  { id: 't10', title: 'Project scaffolding (Vite + TS)', description: 'Initialize repository with module aliasing and ESLint base', priority: 'HIGH', tags: ['setup'] },
]);

// ---- Board 2: Mobile App Revamp ----
const b2Ideation = makeTasks('b2', 'col-b2-1', [
  { id: 't11', title: 'Evaluate Expo SDK 50 upgrade', description: 'Review breaking changes in camera and filesystem modules', priority: 'MEDIUM', tags: ['research'] },
]);
const b2Todo = makeTasks('b2', 'col-b2-2', [
  { id: 't12', title: 'Implement biometric auth (FaceID)', description: 'Support local authentication fallback for Android', priority: 'HIGH', tags: ['security', 'mobile'] },
  { id: 't13', title: 'Offline sync for task creation', description: 'Use SQLite for local caching and background re-sync', priority: 'URGENT', tags: ['feature', 'mobile'] },
]);
const b2InProgress = makeTasks('b2', 'col-b2-3', [
  { id: 't14', title: 'New Onboarding Flow UX', description: 'Interactive multi-step walkthrough for new users', priority: 'HIGH', tags: ['design', 'mobile'] },
  { id: 't15', title: 'Push Notification Provider migration', description: 'Switch from OneSignal to Firebase Cloud Messaging (FCM)', priority: 'MEDIUM', tags: ['infra', 'mobile'] },
  { id: 't16', title: 'Deep Linking support for board IDs', description: 'Enable redirecting from emails directly to specific boards', priority: 'MEDIUM', tags: ['ux'] },
]);
const b2Review = makeTasks('b2', 'col-b2-4', [
  { id: 't17', title: 'Dark mode color audit', description: 'Ensure WCAG compliance in high-contrast dark theme', priority: 'LOW', tags: ['design'] },
]);
const b2Finalized = makeTasks('b2', 'col-b2-5', [
  { id: 't18', title: 'App Store submission materials', description: 'Generate high-res screenshots and privacy manifest', priority: 'URGENT', tags: ['release'] },
]);

// ---- Board 3: Backend Infra Scaling ----
const b3Backlog = makeTasks('b3', 'col-b3-1', [
  { id: 't19', title: 'Redis cluster integration', description: 'Scale caching layer for session management', priority: 'HIGH', tags: ['infra', 'backend'] },
  { id: 't20', title: 'API rate limiter refactor', description: 'Implement sliding window algorithm for better burst handling', priority: 'MEDIUM', tags: ['backend', 'security'] },
]);
const b3Blocked = makeTasks('b3', 'col-b3-2', []); // Empty column edge case
const b3Todo = makeTasks('b3', 'col-b3-3', [
  { id: 't21', title: 'Migrate PostgreSQL to RDS cluster', description: 'Zero-downtime migration using logical replication', priority: 'URGENT', tags: ['infra', 'db'] },
]);
const b3Doing = makeTasks('b3', 'col-b3-4', [
  { id: 't22', title: 'Set up Datadog monitoring for API', description: 'Real-time dashboard for latency and error rates (P99)', priority: 'HIGH', tags: ['infra', 'monitoring'] },
  { id: 't23', title: 'GRPC bridge for auth microservice', description: 'Establish high-speed internal communication', priority: 'MEDIUM', tags: ['backend', 'architecture'] },
]);
const b3Done = makeTasks('b3', 'col-b3-5', [
  { id: 't24', title: 'CI/CD pipeline with GitHub Actions', description: 'Automatic deployments to staging upon PR approval', priority: 'HIGH', tags: ['devops', 'infra'] },
]);

const ALL_TASKS_MAP: Record<string, Task> = {};
[
  ...b1Backlog, ...b1Todo, ...b1InProgress, ...b1Review, ...b1QA, ...b1Done,
  ...b2Ideation, ...b2Todo, ...b2InProgress, ...b2Review, ...b2Finalized,
  ...b3Backlog, ...b3Blocked, ...b3Todo, ...b3Doing, ...b3Done,
].forEach(t => { ALL_TASKS_MAP[t.id] = t; });

function makeCol(id: string, boardId: string, title: string, position: number, tasks: Task[]): Column {
  return { id, boardId, title, position, taskIds: tasks.map(t => t.id) };
}

export const MOCK_BOARDS: Board[] = [
  {
    id: 'b1', workspaceId: 'ws1', title: 'Frontend Platform',
    description: 'Modernizing the core web architecture and performance',
    shareToken: 'share-b1-public',
    columns: [
      makeCol('col-b1-1', 'b1', 'Backlog', 1000, b1Backlog),
      makeCol('col-b1-2', 'b1', 'Todo', 2000, b1Todo),
      makeCol('col-b1-3', 'b1', 'In Progress', 3000, b1InProgress),
      makeCol('col-b1-4', 'b1', 'In Review', 4000, b1Review),
      makeCol('col-b1-5', 'b1', 'QA / Testing', 5000, b1QA),
      makeCol('col-b1-6', 'b1', 'Done', 6000, b1Done),
    ],
    createdAt: '2026-03-01T10:00:00Z', updatedAt: new Date().toISOString(),
  },
  {
    id: 'b2', workspaceId: 'ws2', title: 'Mobile App Revamp',
    description: 'Transitioning to Expo 50 and enhancing UX',
    shareToken: 'share-b2-public',
    columns: [
      makeCol('col-b2-1', 'b2', 'Ideation', 1000, b2Ideation),
      makeCol('col-b2-2', 'b2', 'Todo', 2000, b2Todo),
      makeCol('col-b2-3', 'b2', 'In Progress', 3000, b2InProgress),
      makeCol('col-b2-4', 'b2', 'Design Review', 4000, b2Review),
      makeCol('col-b2-5', 'b2', 'Finalized', 5000, b2Finalized),
    ],
    createdAt: '2026-03-10T10:00:00Z', updatedAt: new Date().toISOString(),
  },
  {
    id: 'b3', workspaceId: 'ws3', title: 'Infra Scaling',
    description: 'Scaling the backend architecture for 1M users',
    shareToken: null,
    columns: [
      makeCol('col-b3-1', 'b3', 'Backlog', 1000, b3Backlog),
      makeCol('col-b3-2', 'b3', 'Blocked', 2000, b3Blocked),
      makeCol('col-b3-3', 'b3', 'Todo', 3000, b3Todo),
      makeCol('col-b3-4', 'b3', 'Doing', 4000, b3Doing),
      makeCol('col-b3-5', 'b3', 'Done', 5000, b3Done),
    ],
    createdAt: '2026-04-01T10:00:00Z', updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_ACTIVITY: ActivityItem[] = [
  { id: 'a1', type: 'task_moved', taskTitle: 'Implement infinite scroll', from: 'Todo', to: 'In Progress', timestamp: new Date(Date.now() - 120000).toISOString(), user: 'Akshansh' },
  { id: 'a2', type: 'task_created', taskTitle: 'Redis cluster integration', timestamp: new Date(Date.now() - 300000).toISOString(), user: 'Mark' },
  { id: 'a3', type: 'task_updated', taskTitle: 'Transition to React 18', timestamp: new Date(Date.now() - 600000).toISOString(), user: 'Priya' },
];

// ==========================================
// Mutable store for mock API with persistence
// ==========================================

const STORAGE_KEYS = {
  TASKS: 'osto_tasks_store',
  BOARDS: 'osto_boards_store',
  ACTIVITY: 'osto_activity_store',
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error(`Failed to load ${key} from storage`, e);
    return defaultValue;
  }
}

export function persistStores() {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasksStore));
  localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boardsStore));
  localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activityStore));
}

export let tasksStore: Record<string, Task> = loadFromStorage(STORAGE_KEYS.TASKS, { ...ALL_TASKS_MAP });
export let boardsStore: Board[] = loadFromStorage(STORAGE_KEYS.BOARDS, JSON.parse(JSON.stringify(MOCK_BOARDS)));
export let activityStore: ActivityItem[] = loadFromStorage(STORAGE_KEYS.ACTIVITY, [...INITIAL_ACTIVITY]);

export function resetMockData() {
  tasksStore = { ...ALL_TASKS_MAP };
  boardsStore = JSON.parse(JSON.stringify(MOCK_BOARDS));
  activityStore = [...INITIAL_ACTIVITY];
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.BOARDS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVITY);
}
