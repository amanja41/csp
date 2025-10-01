import './CustomerTimelinePage.css';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  ActivityEventData,
  getCustomerTimeline,
  TimelineEvent,
  TimelineResponse,
} from '../services/ciam/customer-timeline';

interface FilterState {
  eventTypes: Set<string>;
  subtype: string;
  dateRange: string;
  pins: string;
}

interface TimelineCardProps {
  event: TimelineEvent;
}

interface EmailEventData {
  uuid?: string;
  delivery_status?: string;
  delivered?: boolean;
  bounced?: boolean;
  subject?: string;
  direction?: string;
  email_uri?: string;
  bounced_at?: string | null;
  meta?: {
    email?: string;
    mailer_class?: string;
    mailer_template?: string;
    customer_application_uuid?: string;
    product_type?: string;
    product_uuid?: string;
  };
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

function EmailEventCard({ emailData }: { emailData: EmailEventData }) {
  const getStatusColor = (status?: string, delivered?: boolean) => {
    if (delivered) return 'success';
    if (status === 'Bounced') return 'error';
    return 'neutral';
  };

  const getDirectionLabel = (direction?: string) => {
    return direction === 'outbound' ? 'Sent' : direction === 'inbound' ? 'Received' : direction || 'Unknown';
  };

  return (
    <div className="email-event-content">
      <div className="email-sections">
        <div className="email-section">
          <h4 className="email-section-title">Email Details</h4>
          <div className="email-details-grid">
            <div className="email-detail-item">
              <span className="detail-label">Subject:</span>
              <span className="detail-value primary">{emailData.subject || 'N/A'}</span>
            </div>
            <div className="email-detail-item">
              <span className="detail-label">Direction:</span>
              <span className={`detail-value status-badge ${emailData.direction}`}>
                {getDirectionLabel(emailData.direction)}
              </span>
            </div>
            <div className="email-detail-item">
              <span className="detail-label">Status:</span>
              <span
                className={`detail-value status-badge ${getStatusColor(emailData.delivery_status, emailData.delivered)}`}
              >
                {emailData.delivery_status || 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        <div className="email-section">
          <h4 className="email-section-title">Status Flags</h4>
          <div className="status-flags">
            <div className="status-flag">
              <span className="flag-icon">{emailData.delivered ? '✅' : '❌'}</span>
              <span className="flag-label">{emailData.delivered ? 'Delivered' : 'Not Delivered'}</span>
            </div>
            {emailData.bounced && (
              <div className="status-flag error">
                <span className="flag-icon">⚠️</span>
                <span className="flag-label">Bounced</span>
              </div>
            )}
          </div>
        </div>

        {emailData.meta && (
          <div className="email-section">
            <h4 className="email-section-title">Additional Information</h4>
            <div className="email-meta-grid">
              {emailData.meta.email && (
                <div className="meta-item">
                  <span className="meta-label">Email</span>
                  <span className="meta-value">{emailData.meta.email}</span>
                </div>
              )}
              {emailData.meta.mailer_class && (
                <div className="meta-item">
                  <span className="meta-label">Mailer Class</span>
                  <span className="meta-value">{emailData.meta.mailer_class}</span>
                </div>
              )}
              {emailData.meta.mailer_template && (
                <div className="meta-item">
                  <span className="meta-label">Mailer Template</span>
                  <span className="meta-value">{emailData.meta.mailer_template}</span>
                </div>
              )}
              {emailData.meta.customer_application_uuid && (
                <div className="meta-item">
                  <span className="meta-label">Customer Application Uuid</span>
                  <span className="meta-value uuid">{emailData.meta.customer_application_uuid.slice(0, 8)}...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityEventCard({ activityData }: { activityData: ActivityEventData }) {
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
    <div className="activity-event-content">
      {/* Activity Header */}
      <div className="activity-header">
        <div className="activity-title-row">
          <span className="activity-title">Account Activity</span>
          {activityData.summary.total_changes > 0 && (
            <span className="changes-badge">{activityData.summary.total_changes} total changes</span>
          )}
        </div>
      </div>

      <div className="activity-sections">
        {/* Applications Section */}
        <div className="activity-section">
          <div className="section-header">
            <h4 className="activity-section-title">Applications</h4>
            <span className="section-count">
              ({activityData.summary.applications.total} items • {activityData.summary.applications.changes} changes)
            </span>
          </div>

          {/* Summary Stats */}
          <div className="activity-stats">
            <div className="stat-item">
              <span className="stat-number">{activityData.summary.applications.status_changes?.length || 0}</span>
              <span className="stat-label">Status Changes</span>
            </div>
            <div className="stat-item success">
              <span className="stat-number">{activityData.summary.applications.added_items.length}</span>
              <span className="stat-label">Items Added</span>
            </div>
          </div>

          {/* Added Items */}
          {activityData.summary.applications.added_items.length > 0 && (
            <div className="added-items-section">
              <div className="added-items-header">
                <span className="added-icon">➕</span>
                <span className="added-title">ADDED ( {activityData.summary.applications.added_items.length} )</span>
              </div>

              <div className="added-items-list">
                {activityData.summary.applications.added_items.map(item => (
                  <div key={item.uuid} className="added-item">
                    <div className="item-info">
                      <span className="item-id">{item.id}</span>
                      <span className="item-type">{formatProductType(item.product_type)}</span>
                    </div>
                    <span className={`item-status-badge ${getStatusColor(item.status)}`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Change Details Section */}
        {activityData.summary.change_details.length > 0 && (
          <div className="activity-section">
            <h4 className="activity-section-title">Change Details</h4>
            <div className="change-details-list">
              {activityData.summary.change_details.map((change, index) => (
                <div key={`${change.uuid}-${index}`} className="change-detail-item">
                  <div className="change-info">
                    <span className="change-type-badge">{change.type.replace(/_/g, ' ')}</span>
                    <span className="change-scope">{change.scope}</span>
                  </div>
                  <div className="change-meta">
                    <span className="change-uuid">{change.uuid}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
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
  const copyEventLink = async () => {
    const eventAnchor = `#event-${event.id}`;
    const fullUrl = `${window.location.origin}${window.location.pathname}${eventAnchor}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      // You can add a toast notification here if needed
      console.log('Event link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

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
    <div className="timeline-item" id={`event-${event.id}`}>
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
          <div className="timeline-card-actions">
            <button
              className="copy-link-btn"
              onClick={copyEventLink}
              title="Copy link to this event"
              aria-label="Copy link to this event"
            >
              🔗
            </button>
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
        </div>

        <div className="timeline-card-body">
          <p className="timeline-card-description">{event.description}</p>
          {event.type === 'email_event' && event.data && <EmailEventCard emailData={event.data as EmailEventData} />}
          {event.type === 'version_event' && event.data && (
            <VersionEventCard versionData={event.data as VersionEventData} />
          )}
          {event.type === 'item_event' && event.sub_type === 'account_activity' && event.data && (
            <ActivityEventCard activityData={event.data as unknown as ActivityEventData} />
          )}
          {event.type !== 'version_event' &&
            event.type !== 'email_event' &&
            !(event.type === 'item_event' && event.sub_type === 'account_activity') &&
            Object.keys(event.data).length > 0 && (
              <div className="timeline-card-data">
                <h4>Event Details</h4>
                <div className="timeline-card-data-grid">
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

function FiltersHeader({
  timelineData,
  filters,
  onFiltersChange,
  filteredEventsCount,
}: {
  timelineData: TimelineResponse['timeline_data'];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  filteredEventsCount: number;
}) {
  const getEventTypeCounts = () => {
    const counts: Record<string, number> = {};
    timelineData.events.forEach(event => {
      const type = event.type;
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  };

  const eventTypeCounts = getEventTypeCounts();

  const toggleEventType = (eventType: string) => {
    const newEventTypes = new Set(filters.eventTypes);
    if (newEventTypes.has(eventType)) {
      newEventTypes.delete(eventType);
    } else {
      newEventTypes.add(eventType);
    }
    onFiltersChange({ ...filters, eventTypes: newEventTypes });
  };

  const resetFilters = () => {
    onFiltersChange({
      eventTypes: new Set(),
      subtype: 'all',
      dateRange: 'all',
      pins: 'all',
    });
  };

  const getEventTypeDisplayName = (type: string) => {
    const typeMap: Record<string, string> = {
      item_event: 'Account',
      version_event: 'Profile',
      note_event: 'Notes',
      email_event: 'Emails',
    };
    return typeMap[type] || type;
  };

  const getEventTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      item_event: 'account',
      version_event: 'profile',
      note_event: 'notes',
      email_event: 'emails',
    };
    return colorMap[type] || 'default';
  };

  return (
    <div className="filters-header">
      <div className="filters-title-row">
        <h2 className="filters-title">Filters</h2>
        <div className="filters-meta">
          <span className="event-count">
            {filteredEventsCount}/{timelineData.events.length} events
          </span>
          <button className="reset-btn" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      <div className="filters-controls">
        <div className="filter-section">
          <label className="filter-label">Event Types</label>
          <div className="event-type-pills">
            {Object.entries(eventTypeCounts).map(([type, count]) => (
              <button
                key={type}
                className={`event-type-pill ${getEventTypeColor(type)} ${filters.eventTypes.has(type) ? 'active' : ''}`}
                onClick={() => toggleEventType(type)}
              >
                <span className="pill-dot"></span>
                <span className="pill-label">{getEventTypeDisplayName(type)}</span>
                <span className="pill-count">{count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-label">Subtypes</label>
          <select
            className="filter-select"
            value={filters.subtype}
            onChange={e => onFiltersChange({ ...filters, subtype: e.target.value })}
          >
            <option value="all">All Subtypes</option>
            <option value="account_activity">Account Activity</option>
            <option value="profile_update">Profile Update</option>
            <option value="outbound_email">Outbound Email</option>
          </select>
        </div>

        <div className="filter-section">
          <label className="filter-label">Date</label>
          <select
            className="filter-select"
            value={filters.dateRange}
            onChange={e => onFiltersChange({ ...filters, dateRange: e.target.value })}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="filter-section">
          <label className="filter-label">Pins</label>
          <select
            className="filter-select"
            value={filters.pins}
            onChange={e => onFiltersChange({ ...filters, pins: e.target.value })}
          >
            <option value="all">All</option>
            <option value="pinned">Pinned Only</option>
            <option value="unpinned">Unpinned Only</option>
          </select>
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
  const [filters, setFilters] = useState<FilterState>({
    eventTypes: new Set(),
    subtype: 'all',
    dateRange: 'all',
    pins: 'all',
  });

  const filterEvents = (events: TimelineEvent[]) => {
    return events.filter(event => {
      // Event type filter
      if (filters.eventTypes.size > 0 && !filters.eventTypes.has(event.type)) {
        return false;
      }

      // Subtype filter
      if (filters.subtype !== 'all' && event.sub_type !== filters.subtype) {
        return false;
      }

      // Date filter
      if (filters.dateRange !== 'all') {
        const eventDate = new Date(event.timestamp);
        const now = new Date();

        switch (filters.dateRange) {
          case 'today': {
            if (eventDate.toDateString() !== now.toDateString()) {
              return false;
            }
            break;
          }
          case 'week': {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (eventDate < weekAgo) {
              return false;
            }
            break;
          }
          case 'month': {
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            if (eventDate < monthAgo) {
              return false;
            }
            break;
          }
        }
      }

      // Pins filter
      if (filters.pins !== 'all') {
        const isPinned = event.pins.is_pinned;
        if (filters.pins === 'pinned' && !isPinned) {
          return false;
        }
        if (filters.pins === 'unpinned' && isPinned) {
          return false;
        }
      }

      return true;
    });
  };

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
  const filteredEvents = filterEvents(timeline_data.events);

  return (
    <div className="timeline-container">
      <FiltersHeader
        timelineData={timeline_data}
        filters={filters}
        onFiltersChange={setFilters}
        filteredEventsCount={filteredEvents.length}
      />

      <div className="timeline-events">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <p>No timeline events match the current filters.</p>
          </div>
        ) : (
          <div className="timeline-container-inner">
            {filteredEvents.map(event => (
              <TimelineCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
