import { ActivityEventData } from '../../services/ciam/customer-timeline';

interface ActivityEventCardProps {
  activityData: ActivityEventData;
}

export function ActivityEventCard({ activityData }: ActivityEventCardProps) {
  const formatProductType = (productType: string) => {
    return productType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status: string) => {
    if (status.includes('approved')) return 'success';
    if (status.includes('open')) return 'primary';
    if (status.includes('pending')) return 'warning';
    if (status.includes('rejected') || status.includes('declined')) return 'error';
    return 'neutral';
  };

  return (
    <div className="event-details">
      <div className="activity-summary">
        <h4 className="section-title">Account Activity Summary</h4>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-value">{activityData.summary.applications.total}</span>
            <span className="stat-label">Applications</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{activityData.summary.applications.changes}</span>
            <span className="stat-label">Changes</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{activityData.summary.total_changes}</span>
            <span className="stat-label">Total Changes</span>
          </div>
        </div>
      </div>

      <div className="details-section">
        <h4 className="section-title">Applications</h4>

        <div className="activity-metrics">
          <div className="metric-item">
            <span className="metric-label">Status Changes</span>
            <span className="metric-value">{activityData.summary.applications.status_changes?.length || 0}</span>
          </div>
          <div className="metric-item success">
            <span className="metric-label">Items Added</span>
            <span className="metric-value">{activityData.summary.applications.added_items.length}</span>
          </div>
        </div>

        {activityData.summary.applications.added_items.length > 0 && (
          <div className="added-items">
            <h5 className="subsection-title">Added Items ({activityData.summary.applications.added_items.length})</h5>
            <div className="items-list">
              {activityData.summary.applications.added_items.map(item => (
                <div key={item.uuid} className="item-row">
                  <div className="item-info">
                    <span className="item-id">{item.id}</span>
                    <span className="item-type">{formatProductType(item.product_type)}</span>
                  </div>
                  <span className={`status-badge status-${getStatusColor(item.status)}`}>
                    {item.status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {activityData.summary.change_details.length > 0 && (
        <div className="details-section">
          <h4 className="section-title">Change Details</h4>
          <div className="changes-list">
            {activityData.summary.change_details.map((change, index) => (
              <div key={`${change.uuid}-${index}`} className="change-item">
                <div className="change-header">
                  <span className="change-type">{change.type.replace(/_/g, ' ')}</span>
                  <span className="change-scope">{change.scope}</span>
                </div>
                <div className="change-uuid">{change.uuid}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
