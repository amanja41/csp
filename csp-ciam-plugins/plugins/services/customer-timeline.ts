const API_BASE_URL = 'http://localhost:9292';

export interface TimelineResponse {
  success: boolean;
  timeline_data: {
    customer_id: number;
    events: TimelineEvent[];
    metadata: {
      total_events: number;
      generated_at: string;
      identity_attributes: Record<string, unknown>;
      storage_groups: Record<string, unknown>;
      pins_enabled: boolean;
      total_pins: number;
      active_pins: number;
    };
  };
  pin_data: {
    summary: Record<string, unknown>;
    recent_pins: unknown[];
    assigned_to_me: unknown[];
    needs_attention: unknown[];
  };
}

export interface TimelineEvent {
  id: string;
  type: string;
  sub_type?: string;
  timestamp: string;
  title: string;
  description: string;
  data: Record<string, unknown>;
  metadata: {
    icon?: string;
    color?: string;
    priority?: 'low' | 'medium' | 'high';
    source?: string;
  };
  pins: {
    count: number;
    is_pinned: boolean;
    pin_details: unknown[];
    highest_priority: string | null;
    has_urgent: boolean;
    has_assigned: boolean;
  };
}

export async function getCustomerTimeline(customerId: string | undefined): Promise<TimelineResponse | null> {
  if (!customerId) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/csp/${customerId}/timeline_events`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching customer timeline:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch customer timeline');
  }
}
