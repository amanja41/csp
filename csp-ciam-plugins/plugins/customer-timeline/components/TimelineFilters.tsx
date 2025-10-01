import { TapestryButton } from '@avantfinco/tapestry';
import { TimelineResponse } from '../../services/ciam/customer-timeline';

export interface FilterState {
  eventTypes: Set<string>;
  subtype: string;
  dateRange: string;
  pins: string;
}

interface TimelineFiltersProps {
  timelineData: TimelineResponse['timeline_data'];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  filteredEventsCount: number;
}

export function TimelineFilters({ timelineData, filters, onFiltersChange, filteredEventsCount }: TimelineFiltersProps) {
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
    <div className="timeline-filters">
      <div className="filters-header">
        <h2 className="filters-title">Timeline Filters</h2>
        <div className="filters-meta">
          <span className="event-count">
            {filteredEventsCount} of {timelineData.events.length} events
          </span>
          <TapestryButton label="Reset all" variant="text" size="small" onClick={resetFilters} />
        </div>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">Event Types</label>
          <div className="event-type-pills">
            {Object.entries(eventTypeCounts).map(([type, count]) => (
              <button
                key={type}
                className={`event-type-pill ${getEventTypeColor(type)} ${filters.eventTypes.has(type) ? 'active' : ''}`}
                onClick={() => toggleEventType(type)}
              >
                <span className="pill-label">{getEventTypeDisplayName(type)}</span>
                <span className="pill-count">{count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Subtype</label>
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

        <div className="filter-group">
          <label className="filter-label">Date Range</label>
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

        <div className="filter-group">
          <label className="filter-label">Pin Status</label>
          <select
            className="filter-select"
            value={filters.pins}
            onChange={e => onFiltersChange({ ...filters, pins: e.target.value })}
          >
            <option value="all">All Events</option>
            <option value="pinned">Pinned Only</option>
            <option value="unpinned">Unpinned Only</option>
          </select>
        </div>
      </div>
    </div>
  );
}
