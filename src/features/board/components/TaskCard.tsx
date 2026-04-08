import { memo } from 'react';
import type { Task } from '../../../domain/entities';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isOverlay?: boolean;
  readOnly?: boolean;
}

function TaskCardComponent({ task, onEdit, onDelete, isOverlay, readOnly }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'task', task },
    disabled: readOnly,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card ${isDragging ? 'task-card--dragging' : ''} ${isOverlay ? 'task-card--overlay' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        if (!isDragging && !readOnly) onEdit(task);
      }}
    >
      <div className={`task-card__priority task-card__priority--${task.priority}`} />
      <div className="task-card__title">{task.title}</div>

      {task.tags.length > 0 && (
        <div className="task-card__meta">
          <div className="task-card__tags">
            {task.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="task-card__tag">{tag}</span>
            ))}
          </div>
          {task.assignee && (
            <div className="task-card__assignee" title={task.assignee.name}>
              {task.assignee.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {task.dueDate && (
        <div className="task-card__due">
          📅 {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      )}

      {!readOnly && !isDragging && (
        <div className="task-card__actions">
          <button
            className="task-card__action-btn"
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="task-card__action-btn task-card__action-btn--danger"
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            title="Delete"
          >
            🗑
          </button>
        </div>
      )}
    </div>
  );
}

export const TaskCard = memo(TaskCardComponent, (prev, next) =>
  prev.task.id === next.task.id &&
  prev.task.updatedAt === next.task.updatedAt &&
  prev.task.columnId === next.task.columnId &&
  prev.task.position === next.task.position &&
  prev.isOverlay === next.isOverlay
);
