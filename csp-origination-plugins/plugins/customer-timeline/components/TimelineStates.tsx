export function LoadingState() {
  return (
    <div className="timeline-state loading-state">
      <div className="state-icon">
        <div className="loading-spinner"></div>
      </div>
      <div className="state-content">
        <h2 className="state-title">Loading Timeline</h2>
        <p className="state-message">Retrieving customer timeline events...</p>
      </div>
    </div>
  );
}

export function ErrorState({ error }: { error: string }) {
  return (
    <div className="timeline-state error-state">
      <div className="state-icon">
        <span className="error-icon">⚠</span>
      </div>
      <div className="state-content">
        <h2 className="state-title">Error Loading Timeline</h2>
        <p className="state-message">{error}</p>
        <button className="state-action" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ customerId }: { customerId?: string }) {
  return (
    <div className="timeline-state empty-state">
      <div className="state-icon">
        <span className="empty-icon">📄</span>
      </div>
      <div className="state-content">
        <h2 className="state-title">No Timeline Data</h2>
        <p className="state-message">No timeline events found for customer {customerId}</p>
      </div>
    </div>
  );
}

export function NoResultsState() {
  return (
    <div className="timeline-state no-results-state">
      <div className="state-icon">
        <span className="filter-icon">🔍</span>
      </div>
      <div className="state-content">
        <h2 className="state-title">No Matching Events</h2>
        <p className="state-message">No timeline events match the current filter criteria.</p>
      </div>
    </div>
  );
}
