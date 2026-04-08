import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Task, Priority } from '../../../domain/entities';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onSave: (taskId: string, patch: { title?: string; description?: string; priority?: Priority; dueDate?: string | null; tags?: string[] }) => void;
  onDelete: (taskId: string) => void;
  readOnly?: boolean;
}

export default function TaskDetailModal({ task, onClose, onSave, onDelete, readOnly }: TaskDetailModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [tagsText, setTagsText] = useState(task.tags.join(', '));

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    const tags = tagsText.split(',').map(t => t.trim()).filter(Boolean);
    onSave(task.id, { title, description, priority, tags });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{readOnly ? 'Task Details' : 'Edit Task'}</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal__body">
            <div className="modal__field">
              <label className="modal__label">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                readOnly={readOnly}
                style={readOnly ? { cursor: 'default' } : undefined}
              />
            </div>

            <div className="modal__field">
              <label className="modal__label">Description</label>
              <textarea
                className="modal__textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description…"
                readOnly={readOnly}
              />
            </div>

            <div className="modal__row">
              <div className="modal__field">
                <label className="modal__label">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  disabled={readOnly}
                  style={{ padding: '8px 12px' }}
                >
                  <option value="LOW">🟢 Low</option>
                  <option value="MEDIUM">🔵 Medium</option>
                  <option value="HIGH">🟡 High</option>
                  <option value="URGENT">🔴 Urgent</option>
                </select>
              </div>
              <div className="modal__field">
                <label className="modal__label">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="frontend, bug"
                  readOnly={readOnly}
                />
              </div>
            </div>

            <div className="modal__row" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {!readOnly && (
            <div className="modal__footer">
              <button
                type="button"
                className="btn btn--danger btn--sm"
                onClick={() => { onDelete(task.id); onClose(); }}
              >
                Delete
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn--primary btn--sm">
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
