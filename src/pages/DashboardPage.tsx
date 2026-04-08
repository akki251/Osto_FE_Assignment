import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBoardsController } from '../features/board/controllers/useBoardController';
import { useWorkspaceStore } from '../features/workspace/store/workspaceStore';
import AppLayout from './AppLayout';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace);
  const { boards, isLoading } = useBoardsController(workspaceId ?? activeWorkspaceId ?? null);

  // Sync workspace from URL params
  useEffect(() => {
    if (workspaceId && workspaceId !== activeWorkspaceId) {
      setActiveWorkspace(workspaceId);
    }
    // If no workspace is set, default to first
    if (!activeWorkspaceId && !workspaceId) {
      setActiveWorkspace('ws1');
    }
  }, [workspaceId, activeWorkspaceId, setActiveWorkspace]);

  return (
    <AppLayout>
      <div className="dashboard">
        <h1 className="dashboard__title">Your Boards</h1>
        <p className="dashboard__subtitle">Select a board to manage your tasks</p>

        {isLoading && (
          <div className="board-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="board-card" style={{ pointerEvents: 'none' }}>
                <div className="skeleton skeleton--title" />
                <div className="skeleton skeleton--text" />
                <div className="skeleton skeleton--text" style={{ width: '40%' }} />
              </div>
            ))}
          </div>
        )}

        {boards && boards.length > 0 && (
          <div className="board-grid">
            {boards.map((board) => (
              <div
                key={board.id}
                className="board-card"
                onClick={() => navigate(`/workspace/${activeWorkspaceId}/board/${board.id}`)}
              >
                <h3 className="board-card__title">{board.title}</h3>
                <p className="board-card__desc">{board.description}</p>
                <div className="board-card__meta">
                  <span>{board.taskCount} tasks</span>
                  <span style={{ margin: '0 8px' }}>•</span>
                  <span>{board.columnCount} columns</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {boards && boards.length === 0 && (
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <h3 className="empty-state__title">No boards yet</h3>
            <p className="empty-state__desc">
              Create your first board to start organizing tasks
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
