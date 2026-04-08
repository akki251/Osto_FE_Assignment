import { useMemo, useState, memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column as ColumnType, Task } from '../../../domain/entities';
import { TaskCard } from './TaskCard';
import AddTaskForm from './AddTaskForm';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (columnId: string, title: string, priority: string) => void;
  readOnly?: boolean;
}

function BoardColumnComponent({
  column, tasks, onEditTask, onDeleteTask, onAddTask, readOnly
}: ColumnProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', column },
  });

  const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  return (
    <div className="column">
      <div className="column__header">
        <div className="column__title-group">
          <span className="column__title">{column.title}</span>
          <span className="column__count">{tasks.length}</span>
        </div>
        {!readOnly && (
          <button
            className="column__add-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            title="Add task"
          >
            +
          </button>
        )}
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`column__tasks ${isOver ? 'column__tasks--drop-target' : ''}`}
        >
          {tasks.length === 0 && !showAddForm && (
            <div className="column__empty">
              Drop tasks here
            </div>
          )}
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              readOnly={readOnly}
            />
          ))}
        </div>
      </SortableContext>

      {showAddForm && !readOnly && (
        <AddTaskForm
          onSubmit={(title, priority) => {
            onAddTask(column.id, title, priority);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

export default memo(BoardColumnComponent, (prev, next) => {
  if (prev.column.id !== next.column.id) return false;
  if (prev.column.title !== next.column.title) return false;
  if (prev.readOnly !== next.readOnly) return false;
  if (prev.tasks.length !== next.tasks.length) return false;
  for (let i = 0; i < prev.tasks.length; i++) {
    if (prev.tasks[i] !== next.tasks[i]) return false;
  }
  return true;
});
