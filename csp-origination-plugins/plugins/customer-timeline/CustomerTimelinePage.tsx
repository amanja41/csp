import './CustomerTimelinePage.css';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getCustomerTimeline, TimelineEvent, TimelineResponse } from '../services/ciam/customer-timeline';
import {
  EmptyState,
  ErrorState,
  FilterState,
  LoadingState,
  NoResultsState,
  TimelineCard,
  TimelineFilters,
} from './components';

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
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="timeline-container">
        <ErrorState error={error} />
      </div>
    );
  }

  if (!timelineData || !timelineData.timeline_data) {
    return (
      <div className="timeline-container">
        <EmptyState customerId={customerId} />
      </div>
    );
  }

  const { timeline_data } = timelineData;
  const filteredEvents = filterEvents(timeline_data.events);

  return (
    <div className="timeline-container">
      <TimelineFilters
        timelineData={timeline_data}
        filters={filters}
        onFiltersChange={setFilters}
        filteredEventsCount={filteredEvents.length}
      />

      <div className="timeline-content">
        {filteredEvents.length === 0 ? (
          <NoResultsState />
        ) : (
          <div className="timeline-events">
            {filteredEvents.map(event => (
              <TimelineCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
