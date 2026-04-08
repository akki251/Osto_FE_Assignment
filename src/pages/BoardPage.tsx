import { useState, useCallback, useMemo, useEffect } from 'react';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { useParams, useNavigate } from 'react-router-dom';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useBoardController } from '../features/board/controllers/useBoardController';
import { useWorkspaceStore } from '../features/workspace/store/workspaceStore';
import AppLayout from './AppLayout';
import BoardColumn from '../features/board/components/BoardColumn';
import TaskDetailModal from '../features/board/components/TaskDetailModal';
import type { Task, Priority } from '../domain/entities';

export default function BoardPage() {
  const { workspaceId, boardId } = useParams();
  const navigate = useNavigate();
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace);
  
  // Entire generic mock API is replaced by orchestrator Controller
  const { board, isLoading, isError, createTask, updateTask, deleteTask, handleTaskDrop } = useBoardController(boardId);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (workspaceId) setActiveWorkspace(workspaceId);
  }, [workspaceId, setActiveWorkspace]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const columnTasks = useMemo(() => {
    if (!board) return {};
    const map: Record<string, Task[]> = {};
    board.columns.forEach((col) => {
      map[col.id] = col.taskIds
        .map((tid) => board.tasks[tid])
        .filter(Boolean)
        .sort((a, b) => a.position - b.position);
    });
    return map;
  }, [board]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    setActiveTask(task || null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (!over || !board) return;

      const activeTaskData = active.data.current?.task as Task | undefined;
      if (!activeTaskData) return;

      let destColumnId: string;
      const overData = over.data.current;

      if (overData?.type === 'column') destColumnId = over.id as string;
      else if (overData?.type === 'task') destColumnId = (overData.task as Task).columnId;
      else destColumnId = over.id as string;

      const destTasks = columnTasks[destColumnId] || [];
      const overTaskId = overData?.type === 'task' ? (overData.task as Task).id : null;
      
      if (overData?.type === 'task' && active.id === over.id) return;

      // DELGATION: Component is now "dumb". The Controller orchestrates the logic via the UseCase.
      handleTaskDrop(activeTaskData.id, destColumnId, destTasks, overTaskId);
    },
    [board, columnTasks, handleTaskDrop]
  );

  const handleAddTask = useCallback((columnId: string, title: string, priority: string) => {
    if (!boardId) return;
    createTask({ boardId, columnId, title, priority: priority as Priority });
  }, [boardId, createTask]);

  const handleSaveTask = useCallback((taskId: string, patch: any) => {
    updateTask({ taskId, patch });
  }, [updateTask]);

  const handleDeleteTask = useCallback((taskId: string) => {
    deleteTask(taskId);
  }, [deleteTask]);

  const handleCopyShareLink = useCallback(() => {
    if (!board?.shareToken) return;
    const url = `${window.location.origin}/public/board/${board.shareToken}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [board]);

  const handleCloseModal = useCallback(() => {
    setEditingTask(null);
  }, []);

  // ---- Loading / Error ----
  if (isLoading) {
    return (
      <AppLayout showActivity>
        <div className="board-view">
          <div className="board-view__header">
            <div className="board-view__info">
              <div className="skeleton skeleton--title" style={{ width: 200 }} />
              <div className="skeleton skeleton--text" style={{ width: 300 }} />
            </div>
          </div>
          <div className="board-columns">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="column">
                <div className="column__header"><div className="skeleton skeleton--text" style={{ width: 80 }} /></div>
                <div className="column__tasks">{[1, 2, 3].map((j) => <div key={j} className="skeleton skeleton--card" />)}</div>
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (isError || !board) {
    return (
      <AppLayout>
        <div className="empty-state">
          <div className="empty-state__icon">⚠️</div>
          <h3 className="empty-state__title">Board not found</h3>
          <p className="empty-state__desc">This board may have been deleted or you don't have access.</p>
          <button className="btn btn--primary" style={{ marginTop: 16 }} onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showActivity>
      <div className="board-view">
        <div className="board-view__header">
          <div className="board-view__info">
            <div className="board-view__title">{board.title}</div>
            <div className="board-view__desc">{board.description}</div>
          </div>
          <div className="board-view__actions">
            <span className="header__poll-indicator" title="Live polling active" />
            {board.shareToken && (<button className="header__share-btn" onClick={() => setShareModalOpen(true)}>🔗 Share</button>)}
          </div>
        </div>

        <ErrorBoundary>
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={() => {}} onDragEnd={handleDragEnd}>
            <div className="board-columns">
              {board.columns.sort((a, b) => a.position - b.position).map((col) => (
                <BoardColumn key={col.id} column={col} tasks={columnTasks[col.id] || []} onEditTask={setEditingTask} onDeleteTask={handleDeleteTask} onAddTask={handleAddTask} />
              ))}
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="task-card task-card--overlay">
                  <div className={`task-card__priority task-card__priority--${activeTask.priority}`} />
                  <div className="task-card__title" style={{ paddingLeft: 8 }}>{activeTask.title}</div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </ErrorBoundary>
      </div>

      {editingTask && (<TaskDetailModal task={editingTask} onClose={handleCloseModal} onSave={handleSaveTask} onDelete={handleDeleteTask} />)}

      {shareModalOpen && board.shareToken && (
        <div className="modal-overlay" onClick={() => setShareModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: 440 }}>
            <div className="modal__header">
              <h2 className="modal__title">Share Board</h2>
              <button className="modal__close" onClick={() => setShareModalOpen(false)}>✕</button>
            </div>
            <div className="modal__body">
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 12 }}>Anyone with this link can view the board (read-only):</p>
              <div className="share-link">
                <input className="share-link__input" readOnly value={`${window.location.origin}/public/board/${board.shareToken}`} />
                <button className="btn btn--primary btn--sm" onClick={handleCopyShareLink}>{copied ? '✓ Copied' : 'Copy'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
