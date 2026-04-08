# Multi-Workspace Task Board SaaS

A production-grade React task board application engineered for scale, fulfilling focus on Clean Architecture (UCCR), type safety, and resilient error handling.

## 🚀 Quick Start

1. **Install Dependencies**
   Ensure you have Node.js 18+ installed.
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Login Details**
   The mock authentication accepts any properly formatted email. 
   - **Default**: `demo@demo.com` / `demo`

---

## ✨ Key Features

- **Multi-Workspace Environment**: Seamlessly switch between different team workspaces (e.g., Engineering, Design, Side Projects).
- **Interactive Kanban Board**: High-performance drag-and-drop interface powered by `@dnd-kit` with fractional indexing for $O(1)$ reordering.
- **Robust Task Management**: Full CRUD operations for tasks including priorities (Low, Medium, High, Urgent), tags, and detailed descriptions.
- **Real-time Activity Feed**: Live polling mechanism to sync and display team actions across the workspace.
- **Public Board Sharing**: Generate unique, read-only share links for external stakeholders without requiring authentication.
- **Optimistic UI**: Instant UI feedback on all mutations with automatic background synchronization and error rollback.
- **Resilient Error Architecture**: Integrated React Error Boundaries to prevent application-wide crashes and provide localized recovery.
- **Runtime Type Safety**: Strict data validation at the domain boundary using Zod schemas.

---

## 🏗️ Architectural Overview (UCCR)

The application follows a strict **Use Case – Controller – Repository (UCCR)** pattern to maximize testability and separation of concerns.

### Data Flow Pattern
`UI Component` → `Controller (Hook)` → `Use Case (Function)` → `Repository (API)`

1. **Repository Layer**: The unique source of truth for data fetching ($GET, POST, PATCH, DELETE$). It handles raw API/Mock interactions and enforces defensive Zod validation on incoming payloads.
2. **Use Case Layer**: Pure functional business logic. It orchestrates repository calls, performs data transformations, and executes strict Zod schema validation before mutations.
3. **Controller Layer**: React hooks (`useBoardController`, etc.) that manage UI state using TanStack Query. They are completely decoupled from repositories and only execute bound use cases.
4. **UI Layer**: "Dumb" presentational components that consume controller state and emit events.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **State Management**: 
  - **Server State**: [TanStack Query v5](https://tanstack.com/query/latest) (Caching, Optimistic Updates, Polling)
  - **Client State**: [Zustand](https://docs.pmnd.rs/zustand/) (Auth, Workspace Context)
- **Validation**: [Zod](https://zod.dev/) (Runtime schema enforcement)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Styling**: Vanilla CSS (Modern HSL variables, Flexbox/Grid, Dark-mode ready)
- **Error Handling**: [React Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---

## 📂 Project Structure

```bash
src/
├── domain/            # Core entities and TypeScript interfaces
├── features/          # Vertical Slices (Vertical Cohesion)
│   ├── auth/          # Login, Registration, Session logic
│   ├── workspace/     # Workspace switching and management
│   └── board/         # Kanban, Tasks, Columns, Activity
│       ├── components/    # Dumb components
│       ├── controllers/   # React hooks (UCCR Layer)
│       ├── use-cases/     # Business logic (UCCR Layer)
│       └── repositories/  # Data access (UCCR Layer)
├── shared/            # Common utilities, components, and global state
│   ├── api/           # Mock data and Simulated API
│   ├── components/    # Generic UI (ErrorBoundaries, Modals)
│   └── schemas/       # Global Zod validation schemas
└── pages/             # Page-level smart containers
```

---

## 🧠 Engineering Decisions & Trade-offs

### 1. Fractional Indexing for DnD
Instead of simple array index remapping, we use fractional indexing (`(before + after) / 2`). This allows us to reorder tasks with a single `PATCH` request to the database without needing to update every other task in the column.

### 2. Normalized Server State
Tasks are stored in a normalized `Record<string, Task>` map. This avoids expensive nested object cloning and simplifies updates across different columns or boards.

### 3. Bifurcated State Management
By keeping server-state (React Query) and client-state (Zustand) separate, we avoid "Store Bloat" and ensure that UI re-renders are only triggered by the specific data slices that actually changed.

---

## 🛡️ Resilience & Validation
The application is designed to be "self-healing":
- **Zod Boundaries**: If a mock API returns corrupted data, the Repository layer catches it via `.parse()` before it even reaches the UI.
- **Error Boundaries**: If a component crashes during a complex drag-and-drop calculation, the Error Boundary catches the exception and offers a "Try Again" recovery path, keeping the rest of the application functional.
