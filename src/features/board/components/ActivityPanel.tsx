import { useActivityController } from '../controllers/useBoardController';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityPanel() {
  const { activities, isLoading } = useActivityController();

  return (
    <div className="activity-panel">
      <div className="activity-panel__header">
        <span className="header__poll-indicator" />
        Recent Activity
      </div>
      <div className="activity-panel__list">
        {isLoading && (
          <>
            {[1, 2, 3].map(i => (
              <div key={i} className="activity-item">
                <div className="skeleton skeleton--text" />
                <div className="skeleton skeleton--text" style={{ width: '50%' }} />
              </div>
            ))}
          </>
        )}
        {activities?.map((item) => (
          <div key={item.id} className="activity-item">
            <span className="activity-item__user">{item.user} </span>
            {item.type === 'task_created' && (
              <span className="activity-item__action">
                created <span className="activity-item__task">{item.taskTitle}</span>
              </span>
            )}
            {item.type === 'task_moved' && (
              <span className="activity-item__action">
                moved <span className="activity-item__task">{item.taskTitle}</span>
                <span className="activity-item__arrow"> → </span>
                {item.from} → {item.to}
              </span>
            )}
            {item.type === 'task_updated' && (
              <span className="activity-item__action">
                updated <span className="activity-item__task">{item.taskTitle}</span>
              </span>
            )}
            <span className="activity-item__time">
              {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
            </span>
          </div>
        ))}
        {activities?.length === 0 && !isLoading && (
          <div style={{ padding: 16, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'center' }}>
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
}
