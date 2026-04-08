import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBoardsController } from '../features/board/controllers/useBoardController';
import { useWorkspaceStore } from '../features/workspace/store/workspaceStore';
import { useAuthStore } from '../features/auth/store/authStore';
import { useWorkspaceController } from '../features/workspace/controllers/useWorkspaceController';
import WorkspaceSwitcher from '../features/workspace/components/WorkspaceSwitcher';
import ActivityPanel from '../features/board/components/ActivityPanel';

interface AppLayoutProps {
  children: React.ReactNode;
  showActivity?: boolean;
}

export default function AppLayout({ children, showActivity = false }: AppLayoutProps) {
  const navigate = useNavigate();
  const params = useParams();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { activeWorkspaceId, setActiveWorkspace } = useWorkspaceStore();
  const { workspaces } = useWorkspaceController();
  const { boards } = useBoardsController(activeWorkspaceId);

  const handleWorkspaceChange = useCallback((wsId: string) => {
    setActiveWorkspace(wsId);
    navigate(`/workspace/${wsId}`);
  }, [setActiveWorkspace, navigate]);

  const handleBoardClick = (boardId: string) => {
    navigate(`/workspace/${activeWorkspaceId}/board/${boardId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">T</div>
          <span className="sidebar__logo-text">TaskBoard</span>
        </div>

        <WorkspaceSwitcher
          workspaces={workspaces || []}
          activeId={activeWorkspaceId}
          onSwitch={handleWorkspaceChange}
        />

        <div className="sidebar__section">
          <div className="sidebar__section-title">Boards</div>
        </div>

        <nav className="sidebar__nav">
          {boards?.map((board) => (
            <div
              key={board.id}
              className={`sidebar__link ${params.boardId === board.id ? 'sidebar__link--active' : ''}`}
              onClick={() => handleBoardClick(board.id)}
            >
              <span className="sidebar__link-dot" style={{ background: 'var(--accent-primary)' }} />
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {board.title}
              </span>
              <span className="sidebar__link-count">{board.taskCount}</span>
            </div>
          ))}
          {boards?.length === 0 && (
            <div style={{ padding: '12px 12px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              No boards in this workspace
            </div>
          )}
          {!boards && (
            <>
              <div className="skeleton skeleton--text" />
              <div className="skeleton skeleton--text" style={{ width: '60%' }} />
            </>
          )}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user" onClick={handleLogout} title="Click to logout">
            <div className="sidebar__avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="sidebar__user-name">{user?.name || 'User'}</div>
              <div className="sidebar__user-email">{user?.email || ''}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {children}
      </div>

      {/* Activity Panel — conditionally shown on board views */}
      {showActivity && <ActivityPanel />}
    </div>
  );
}
