import './CustomerTimelinePage.css';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getCustomerTimeline, TimelineEvent, TimelineResponse } from '../services/customer-timeline';

interface TimelineCardProps {
  event: TimelineEvent;
}

function TimelineCard({ event }: TimelineCardProps) {
  const getCardClassName = () => {
    const baseClass = 'timeline-card';
    const priorityClass = event.metadata.priority ? `priority-${event.metadata.priority}` : '';
    const typeClass = `type-${event.type.toLowerCase().replace(/\s+/g, '-')}`;
    return `${baseClass} ${priorityClass} ${typeClass}`.trim();
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getIconForEventType = (type: string) => {
    const iconMap: Record<string, string> = {
      account_creation: '👤',
      login: '🔐',
      logout: '🚪',
      password_change: '🔑',
      profile_update: '✏️',
      transaction: '💳',
      verification: '✅',
      security_alert: '⚠️',
      support_ticket: '🎫',
      email_verification: '📧',
      phone_verification: '📱',
      default: '📄',
    };
    return iconMap[type.toLowerCase()] || iconMap.default;
  };

  return (
    <div className={getCardClassName()}>
      <div className="timeline-card-header">
        <div className="timeline-card-icon">{event.metadata.icon || getIconForEventType(event.type)}</div>
        <div className="timeline-card-title-section">
          <h3 className="timeline-card-title">{event.title}</h3>
          <span className="timeline-card-type">{event.type}</span>
          {event.sub_type && <span className="timeline-card-subtype">• {event.sub_type}</span>}
        </div>
        <div className="timeline-card-timestamp">{formatTimestamp(event.timestamp)}</div>
      </div>

      <div className="timeline-card-body">
        <p className="timeline-card-description">{event.description}</p>

        {Object.keys(event.data).length > 0 && (
          <div className="timeline-card-data">
            <h4>Event Details</h4>
            <div className="timeline-card-data-grid">
              {Object.entries(event.data).map(([key, value]) => (
                <div key={key} className="timeline-card-data-item">
                  <span className="data-key">{key.replace(/_/g, ' ')}:</span>
                  <span className="data-value">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {event.pins.count > 0 && (
          <div className="timeline-card-pins">
            <div className="pins-indicator">
              📌 {event.pins.count} pin{event.pins.count !== 1 ? 's' : ''}
              {event.pins.has_urgent && <span className="urgent-pin">⚡ Urgent</span>}
              {event.pins.has_assigned && <span className="assigned-pin">👤 Assigned</span>}
            </div>
          </div>
        )}
      </div>

      {event.metadata.source && (
        <div className="timeline-card-footer">
          <span className="timeline-card-source">Source: {event.metadata.source}</span>
        </div>
      )}
    </div>
  );
}

function CustomerSummary({ timelineData }: { timelineData: TimelineResponse['timeline_data'] }) {
  return (
    <div className="customer-summary">
      <h2>Customer Timeline - ID: {timelineData.customer_id}</h2>
      <div className="summary-stats">
        <div className="stat-item">
          <span className="stat-value">{timelineData.events.length}</span>
          <span className="stat-label">Total Events</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{timelineData.metadata.total_pins}</span>
          <span className="stat-label">Total Pins</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{timelineData.metadata.active_pins}</span>
          <span className="stat-label">Active Pins</span>
        </div>
      </div>
    </div>
  );
}

export function CustomerTimelinePage() {
  const { customerId } = useParams();
  const [timelineData, setTimelineData] = useState<TimelineResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customerId) {
      setLoading(true);
      setError(null);

      getCustomerTimeline(customerId)
        .then(data => {
          if (data) {
            setTimelineData(data);
          } else {
            setError('No data received');
          }
        })
        .catch(err => {
          setError(err.message || 'Failed to load timeline');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [customerId]);

  if (loading) {
    return (
      <div className="timeline-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading customer timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="timeline-container">
        <div className="error-state">
          <h2>Error Loading Timeline</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (!timelineData || !timelineData.timeline_data) {
    return (
      <div className="timeline-container">
        <div className="empty-state">
          <h2>No Timeline Data</h2>
          <p>No timeline events found for customer {customerId}</p>
        </div>
      </div>
    );
  }

  const { timeline_data } = timelineData;

  return (
    <div className="timeline-container">
      <CustomerSummary timelineData={timeline_data} />

      <div className="timeline-events">
        {timeline_data.events.length === 0 ? (
          <div className="no-events">
            <p>No timeline events found for this customer.</p>
          </div>
        ) : (
          timeline_data.events.map(event => <TimelineCard key={event.id} event={event} />)
        )}
      </div>
    </div>
  );
}
