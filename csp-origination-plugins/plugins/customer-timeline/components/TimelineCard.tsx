import { ActivityEventData, TimelineEvent } from '../../services/ciam/customer-timeline';
import { ActivityEventCard } from './ActivityEventCard';
import { EmailEventCard } from './EmailEventCard';
import { VersionEventCard } from './VersionEventCard';

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

interface ItemEventData {
  summary?: {
    applications?: {
      total?: number;
    };
  };
}

export function TimelineCard({ event }: TimelineCardProps) {
  const copyEventLink = async () => {
    const eventAnchor = `#event-${event.id}`;
    const fullUrl = `${window.location.origin}${window.location.pathname}${eventAnchor}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      console.log('Event link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const dateOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    const dateStr = date.toLocaleDateString('en-US', dateOptions);
    const timeStr = date.toLocaleTimeString('en-US', timeOptions);

    return { dateStr, timeStr };
  };

  const getIconForEventType = (type: string, subType?: string) => {
    const iconMap: Record<string, string> = {
      version_event: '📝',
      item_event: '📊',
      email_event: '✉️',
      'version_event.profile_update': '✏️',
      'item_event.account_activity': '📊',
      'email_event.outbound_email': '📤',
      'email_event.inbound_email': '📥',
      default: '📄',
    };

    const subTypeKey = subType ? `${type}.${subType}` : null;
    if (subTypeKey && iconMap[subTypeKey]) {
      return iconMap[subTypeKey];
    }

    return iconMap[type.toLowerCase()] || iconMap.default;
  };

  const renderEventContent = () => {
    if (event.type === 'email_event' && event.data) {
      return <EmailEventCard emailData={event.data as EmailEventData} />;
    }

    if (event.type === 'version_event' && event.data) {
      return <VersionEventCard versionData={event.data as VersionEventData} />;
    }

    if (event.type === 'item_event' && event.sub_type === 'account_activity' && event.data) {
      return <ActivityEventCard activityData={event.data as unknown as ActivityEventData} />;
    }

    // Generic event data display
    if (Object.keys(event.data).length > 0) {
      return (
        <div className="event-details">
          <h4 className="section-title">Event Details</h4>
          <div className="details-grid">
            {event.type === 'item_event' &&
              event.data &&
              typeof event.data === 'object' &&
              'summary' in event.data &&
              (event.data as ItemEventData).summary &&
              (event.data as ItemEventData).summary?.applications && (
                <div className="detail-item priority">
                  <span className="detail-label">Applications</span>
                  <span className="detail-value">
                    {(event.data as ItemEventData).summary?.applications?.total} total
                  </span>
                </div>
              )}
            {event.type === 'version_event' &&
              event.data &&
              typeof event.data === 'object' &&
              'profile_id' in event.data && (
                <div className="detail-item priority">
                  <span className="detail-label">Profile ID</span>
                  <span className="detail-value">{String((event.data as VersionEventData).profile_id)}</span>
                </div>
              )}
            {Object.entries(event.data)
              .filter(([key]) => !['delivery_status', 'delivered', 'bounced', 'summary', 'profile_id'].includes(key))
              .slice(0, 6)
              .map(([key, value]) => (
                <div key={key} className="detail-item">
                  <span className="detail-label">{key.replace(/_/g, ' ')}</span>
                  <span className="detail-value">
                    {typeof value === 'object' ? JSON.stringify(value).slice(0, 50) + '...' : String(value)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      );
    }

    return null;
  };

  const { dateStr, timeStr } = formatTimestamp(event.timestamp);

  return (
    <div className="timeline-item" id={`event-${event.id}`}>
      <div className="timeline-connector">
        <div className="timeline-icon">
          <span className="icon-content">{getIconForEventType(event.type, event.sub_type)}</span>
        </div>
        <div className="timeline-line"></div>
      </div>

      <div className="timeline-card">
        <div className="card-header">
          <div className="header-content">
            <div className="title-section">
              <h3 className="event-title">{event.title}</h3>
              <div className="event-meta">
                <span className="event-type">{event.type}</span>
                {event.sub_type && <span className="event-subtype">• {event.sub_type}</span>}
              </div>
            </div>
            <div className="timestamp-section">
              <div className="event-date">{dateStr}</div>
              <div className="event-time">{timeStr}</div>
            </div>
          </div>
          <div className="card-actions">
            <button
              className="action-btn copy-link"
              onClick={copyEventLink}
              title="Copy link to this event"
              aria-label="Copy link to this event"
            >
              🔗
            </button>
          </div>
        </div>

        <div className="card-body">
          <p className="event-description">{event.description}</p>

          {renderEventContent()}

          {event.pins.count > 0 && (
            <div className="event-pins">
              <div className="pins-info">
                📌 {event.pins.count} pin{event.pins.count !== 1 ? 's' : ''}
                {event.pins.has_urgent && <span className="pin-urgent">⚡ Urgent</span>}
                {event.pins.has_assigned && <span className="pin-assigned">👤 Assigned</span>}
              </div>
            </div>
          )}
        </div>

        {event.metadata.source && (
          <div className="card-footer">
            <span className="event-source">Source: {event.metadata.source}</span>
          </div>
        )}
      </div>
    </div>
  );
}
