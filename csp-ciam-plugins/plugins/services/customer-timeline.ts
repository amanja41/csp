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

export interface ActivityEventData {
  item_id: number;
  item_data: {
    'basic.orig.installment': unknown[];
    'basic.orig.refinance': unknown[];
    'basic.orig.credit_card': unknown[];
    'basic.serv.loan': unknown[];
    'basic.serv.credit_card_account': unknown[];
  };
  item_changes: Array<{
    change_type: string;
    uuid: string;
    item: {
      id: number;
      uuid: string;
      status: string;
      type: string;
      product_type: string;
      partner_name: string;
      partner_uuid: string;
      source: string;
      customer: {
        id: number;
        uuid: string;
        email: string;
        status: string;
      };
      product: {
        id: number;
        uuid: string;
        status: string;
        type: string;
        product_type: string;
      };
    };
    scope: string;
  }>;
  summary: {
    applications: {
      total: number;
      changes: number;
      status_changes: unknown[];
      added_items: Array<{
        id: number;
        uuid: string;
        status: string;
        product_type: string;
        scope: string;
        product: {
          id: number;
          uuid: string;
          status: string;
          type: string;
          product_type: string;
        };
      }>;
      removed_items: unknown[];
      unchanged_items: unknown[];
    };
    funded_items: {
      total: number;
      changes: number;
      loans: unknown[];
      credit_cards: unknown[];
    };
    total_changes: number;
    change_details: Array<{
      type: string;
      scope: string;
      uuid: string;
      item: unknown;
      before_status: string | null;
      after_status: string | null;
    }>;
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
