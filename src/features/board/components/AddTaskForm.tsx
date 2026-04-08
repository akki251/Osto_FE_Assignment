import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Priority } from '../../../domain/entities';

interface AddTaskFormProps {
  onSubmit: (title: string, priority: string) => void;
  onCancel: () => void;
}

export default function AddTaskForm({ onSubmit, onCancel }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), priority);
    setTitle('');
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="add-task-form__input"
        placeholder="Task title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && onCancel()}
      />
      <div className="add-task-form__actions">
        <select
          className="add-task-form__priority-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
        <button type="submit" className="btn btn--primary btn--sm" disabled={!title.trim()}>
          Add
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
