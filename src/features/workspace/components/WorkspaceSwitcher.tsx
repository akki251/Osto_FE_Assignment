import { useState, memo } from 'react';
import type { Workspace } from '../../../domain/entities';

interface WorkspaceSwitcherProps {
  workspaces: Workspace[];
  activeId: string | null;
  onSwitch: (id: string) => void;
}

function WorkspaceSwitcherComponent({ workspaces, activeId, onSwitch }: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const active = workspaces.find((w) => w.id === activeId);

  return (
    <div className="ws-switcher">
      <div className="ws-switcher__current" onClick={() => setIsOpen(!isOpen)}>
        <div
          className="ws-switcher__icon"
          style={{ background: active?.color || 'var(--accent-primary)' }}
        >
          {active?.name?.charAt(0) || 'W'}
        </div>
        <span className="ws-switcher__name">
          {active?.name || 'Select Workspace'}
        </span>
        <span className={`ws-switcher__chevron ${isOpen ? 'ws-switcher__chevron--open' : ''}`}>
          ▾
        </span>
      </div>

      {isOpen && (
        <div className="ws-switcher__dropdown">
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              className={`ws-switcher__option ${ws.id === activeId ? 'ws-switcher__option--active' : ''}`}
              onClick={() => {
                onSwitch(ws.id);
                setIsOpen(false);
              }}
            >
              <div
                className="ws-switcher__icon"
                style={{ background: ws.color, width: 22, height: 22, fontSize: 'var(--text-xs)' }}
              >
                {ws.name.charAt(0)}
              </div>
              <span>{ws.name}</span>
              <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                {ws.memberCount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(WorkspaceSwitcherComponent);
