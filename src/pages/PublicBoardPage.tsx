import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { usePublicBoardController } from '../features/board/controllers/useBoardController';
import BoardColumn from '../features/board/components/BoardColumn';
import type { Task } from '../domain/entities';

export default function PublicBoardPage() {
  const { shareToken } = useParams();
  const { board: boardData, isLoading, isError } = usePublicBoardController(shareToken);

  const columnTasks = useMemo(() => {
    if (!boardData) return {};
    const map: Record<string, Task[]> = {};
    boardData.columns.forEach((col) => {
      map[col.id] = col.taskIds
        .map((tid) => boardData.tasks[tid])
        .filter(Boolean)
        .sort((a, b) => a.position - b.position);
    });
    return map;
  }, [boardData]);

  if (isLoading) {
    return (
      <div className="public-layout">
        <div className="public-header">
          <div className="public-header__logo">
            <span style={{ fontSize: 20 }}>📋</span>
            TaskBoard
          </div>
          <span className="public-header__badge">Public View</span>
        </div>
        <div className="board-view" style={{ flex: 1 }}>
          <div className="board-columns" style={{ padding: 20 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="column">
                <div className="column__header">
                  <div className="skeleton skeleton--text" style={{ width: 80 }} />
                </div>
                <div className="column__tasks">
                  {[1, 2].map((j) => <div key={j} className="skeleton skeleton--card" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !boardData) {
    return (
      <div className="public-layout">
        <div className="public-header">
          <div className="public-header__logo">
            <span style={{ fontSize: 20 }}>📋</span>
            TaskBoard
          </div>
        </div>
        <div className="empty-state" style={{ flex: 1 }}>
          <div className="empty-state__icon">🔒</div>
          <h3 className="empty-state__title">Board not available</h3>
          <p className="empty-state__desc">This link may be invalid or the board is no longer shared.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="public-layout">
      {/* SEO metadata is handled by react-helmet or document.title */}
      <title>{boardData.title} | TaskBoard - Shared View</title>
      <meta name="description" content={boardData.description} />

      <div className="public-header">
        <div className="public-header__logo">
          <span style={{ fontSize: 20 }}>📋</span>
          TaskBoard
          <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 'var(--text-sm)', marginLeft: 4 }}>
            / {boardData.title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="header__poll-indicator" title="Auto-refreshing" />
          <span className="public-header__badge">Read-Only</span>
        </div>
      </div>

      <div className="board-view" style={{ flex: 1 }}>
        <div className="board-columns" style={{ padding: 20 }}>
          {boardData.columns
            .sort((a, b) => a.position - b.position)
            .map((col) => (
              <BoardColumn
                key={col.id}
                column={col}
                tasks={columnTasks[col.id] || []}
                onEditTask={() => {}}
                onDeleteTask={() => {}}
                onAddTask={() => {}}
                readOnly
              />
            ))}
        </div>
      </div>
    </div>
  );
}
