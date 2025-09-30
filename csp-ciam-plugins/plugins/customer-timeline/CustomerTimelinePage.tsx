import './CustomerTimelinePage.css';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getCustomerTimeline, TimelineEvent, TimelineResponse } from '../services/customer-timeline';

interface TimelineCardProps {
  event: TimelineEvent;
}

interface EmailEventData {
  delivery_status?: string;
  delivered?: boolean;
  bounced?: boolean;
  subject?: string;
  direction?: string;
}

interface ItemEventData {
  summary?: {
    applications?: {
      total?: number;
    };
  };
}

interface VersionEventData {
  profile_id?: number;
  version_uuid?: string;
  source?: string;
  review_type?: string | null;
  review_status?: string | null;
  identity_attributes?: {
    email?: string;
    phone_number?: string;
    identity_uuid?: string;
    ssn_last_4?: string;
    date_of_birth?: string;
    first_name?: string;
    last_name?: string;
    title?: string | null;
    preferred_first_name?: string | null;
    middle_initial?: string | null;
    suffix?: string | null;
    address_1?: string;
    address_2?: string | null;
    city?: string;
    state?: string;
    zip?: string;
    zip4?: string | null;
    bank_account_number_uuid?: string | null;
    bank_account_number_last_4?: string | null;
    bank_account_type?: string | null;
    bank_routing_number?: string | null;
    bank_bad_account?: boolean | null;
    employer_name?: string | null;
    employer_phone_number?: string | null;
    employer_phone_number_extension?: string | null;
  };
  changes?: {
    changed_fields?: string[];
    confirmed_fields?: string[];
  };
  has_details?: boolean;
}

function VersionEventCard({ versionData }: { versionData: VersionEventData }) {
  const identity = versionData.identity_attributes;
  if (!identity) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSSN = (ssn?: string) => {
    if (!ssn) return 'N/A';
    return `***-**-${ssn}`;
  };

  const formatUUID = (uuid?: string) => {
    if (!uuid) return 'N/A';
    return `${uuid.slice(0, 8)}...`;
  };

  return (
    <div className="version-event-content">
      <div className="version-summary">
        <div className="version-stat">
          <span className="stat-number">{versionData.changes?.changed_fields?.length || 0}</span>
          <span className="stat-label">Fields Updated</span>
        </div>
        <div className="version-stat">
          <span className="stat-number">{versionData.changes?.confirmed_fields?.length || 0}</span>
          <span className="stat-label">Fields Unchanged</span>
        </div>
        {versionData.profile_id && (
          <div className="version-stat">
            <span className="stat-number">{versionData.profile_id}</span>
            <span className="stat-label">Profile ID</span>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h4 className="section-title">Profile Information</h4>

        <div className="profile-subsection">
          <h5 className="subsection-title">PRIMARY IDENTIFIERS</h5>
          <div className="profile-grid">
            <div className="profile-field">
              <span className="field-label">Email</span>
              <span className="field-value primary">{identity.email || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Phone Number</span>
              <span className="field-value primary">{identity.phone_number || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="profile-subsection">
          <h5 className="subsection-title">PERSON</h5>
          <div className="profile-grid">
            <div className="profile-field">
              <span className="field-label">First Name</span>
              <span className="field-value">{identity.first_name || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Last Name</span>
              <span className="field-value">{identity.last_name || 'N/A'}</span>
            </div>
            {identity.preferred_first_name && (
              <div className="profile-field">
                <span className="field-label">Preferred First Name</span>
                <span className="field-value">{identity.preferred_first_name}</span>
              </div>
            )}
            {identity.middle_initial && (
              <div className="profile-field">
                <span className="field-label">Middle Initial</span>
                <span className="field-value">{identity.middle_initial}</span>
              </div>
            )}
          </div>
        </div>

        <div className="profile-subsection">
          <h5 className="subsection-title">ADDRESS</h5>
          <div className="profile-grid">
            <div className="profile-field full-width">
              <span className="field-label">Address Line 1</span>
              <span className="field-value">{identity.address_1 || 'N/A'}</span>
            </div>
            {identity.address_2 && (
              <div className="profile-field full-width">
                <span className="field-label">Address Line 2</span>
                <span className="field-value">{identity.address_2}</span>
              </div>
            )}
            <div className="profile-field">
              <span className="field-label">City</span>
              <span className="field-value">{identity.city || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">State</span>
              <span className="field-value">{identity.state || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">ZIP Code</span>
              <span className="field-value">{identity.zip || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="profile-subsection">
          <h5 className="subsection-title">IDENTITY</h5>
          <div className="profile-grid">
            <div className="profile-field">
              <span className="field-label">Identity UUID</span>
              <span className="field-value uuid">
                {formatUUID(identity.identity_uuid)}
                {identity.identity_uuid && (
                  <button className="show-btn" title="Show full UUID">
                    Show
                  </button>
                )}
              </span>
            </div>
            <div className="profile-field">
              <span className="field-label">SSN</span>
              <span className="field-value">{formatSSN(identity.ssn_last_4)}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Date of Birth</span>
              <span className="field-value">{formatDate(identity.date_of_birth)}</span>
            </div>
          </div>
        </div>

        {(identity.employer_name || identity.bank_account_type) && (
          <div className="profile-subsection">
            <h5 className="subsection-title">ADDITIONAL INFO</h5>
            <div className="profile-grid">
              {identity.employer_name && (
                <div className="profile-field">
                  <span className="field-label">Employer</span>
                  <span className="field-value">{identity.employer_name}</span>
                </div>
              )}
              {identity.bank_account_type && (
                <div className="profile-field">
                  <span className="field-label">Bank Account Type</span>
                  <span className="field-value">{identity.bank_account_type}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineCard({ event }: TimelineCardProps) {
  const getCardClassName = () => {
    const baseClass = 'timeline-card';
    const priorityClass = event.metadata.priority ? `priority-${event.metadata.priority}` : '';
    const typeClass = `type-${event.type.toLowerCase().replace(/\s+/g, '-')}`;
    return `${baseClass} ${priorityClass} ${typeClass}`.trim();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    const dateStr = date.toLocaleDateString('en-US', options);
    const timeStr = date.toLocaleTimeString('en-US', timeOptions);

    return { dateStr, timeStr };
  };

  const getIconForEventType = (type: string, subType?: string) => {
    const iconMap: Record<string, string> = {
      // Original event types
      account_creation: '👤',
      login: '�',
      logout: '�',
      password_change: '�',
      profile_update: '✏️',
      transaction: '�',
      verification: '✅',
      security_alert: '⚠️',
      support_ticket: '🎫',
      email_verification: '📧',
      phone_verification: '📱',

      // New event types from API
      version_event: '📝',
      item_event: '�',
      email_event: '✉️',

      // Sub-type specific icons
      'version_event.profile_update': '✏️',
      'item_event.account_activity': '�',
      'email_event.outbound_email': '📤',
      'email_event.inbound_email': '📥',

      default: '📄',
    };

    // Check for specific sub-type first
    const subTypeKey = subType ? `${type}.${subType}` : null;
    if (subTypeKey && iconMap[subTypeKey]) {
      return iconMap[subTypeKey];
    }

    return iconMap[type.toLowerCase()] || iconMap.default;
  };

  return (
    <div className="timeline-item">
      <div className="timeline-icon-container">
        <div className="timeline-icon">{getIconForEventType(event.type, event.sub_type)}</div>
        <div className="timeline-line"></div>
      </div>

      <div className={getCardClassName()}>
        <div className="timeline-card-header">
          <div className="timeline-card-title-section">
            <h3 className="timeline-card-title">{event.title}</h3>
            <div className="timeline-card-meta">
              <span className="timeline-card-type">{event.type}</span>
              {event.sub_type && <span className="timeline-card-subtype">• {event.sub_type}</span>}
            </div>
          </div>
          <div className="timeline-card-timestamp">
            {(() => {
              const { dateStr, timeStr } = formatTimestamp(event.timestamp);
              return (
                <>
                  <div className="timestamp-date">{dateStr}</div>
                  <div className="timestamp-time">{timeStr}</div>
                </>
              );
            })()}
          </div>
        </div>

        <div className="timeline-card-body">
          <p className="timeline-card-description">{event.description}</p>
          {event.type === 'version_event' && event.data && (
            <VersionEventCard versionData={event.data as VersionEventData} />
          )}
          {event.type !== 'version_event' && Object.keys(event.data).length > 0 && (
            <div className="timeline-card-data">
              <h4>Event Details</h4>
              <div className="timeline-card-data-grid">
                {event.type === 'email_event' &&
                  event.data &&
                  typeof event.data === 'object' &&
                  'delivery_status' in event.data && (
                    <div className="timeline-card-data-item priority">
                      <span className="data-key">Delivery Status:</span>
                      <span
                        className={`data-value ${(event.data as EmailEventData).delivered ? 'success' : 'warning'}`}
                      >
                        {String((event.data as EmailEventData).delivery_status)}
                        {(event.data as EmailEventData).delivered ? ' ✅' : ''}
                        {(event.data as EmailEventData).bounced ? ' ⚠️ Bounced' : ''}
                      </span>
                    </div>
                  )}
                {event.type === 'item_event' &&
                  event.data &&
                  typeof event.data === 'object' &&
                  'summary' in event.data &&
                  (event.data as ItemEventData).summary &&
                  (event.data as ItemEventData).summary?.applications && (
                    <div className="timeline-card-data-item priority">
                      <span className="data-key">Applications:</span>
                      <span className="data-value">
                        {(event.data as ItemEventData).summary?.applications?.total} total
                      </span>
                    </div>
                  )}
                {event.type === 'version_event' &&
                  event.data &&
                  typeof event.data === 'object' &&
                  'profile_id' in event.data && (
                    <div className="timeline-card-data-item priority">
                      <span className="data-key">Profile ID:</span>
                      <span className="data-value">{String((event.data as VersionEventData).profile_id)}</span>
                    </div>
                  )}
                {Object.entries(event.data)
                  .filter(
                    ([key]) => !['delivery_status', 'delivered', 'bounced', 'summary', 'profile_id'].includes(key)
                  )
                  .slice(0, 6)
                  .map(([key, value]) => (
                    <div key={key} className="timeline-card-data-item">
                      <span className="data-key">{key.replace(/_/g, ' ')}:</span>
                      <span className="data-value">
                        {typeof value === 'object' ? JSON.stringify(value).slice(0, 50) + '...' : String(value)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}{' '}
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
          <div className="timeline-container-inner">
            {timeline_data.events.map(event => (
              <TimelineCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
