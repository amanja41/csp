import { Customer } from '../models/customer';

const API_BASE_URL = 'http://localhost:9292';

export async function searchCustomers(query: string, signal?: AbortSignal) {
  const payload = { type: 'application_id', value: query, include_deleted: false, include_all_matches: true };

  const response = await fetch(`${API_BASE_URL}/csp/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const jsonResponse = await response.json();
  return jsonResponse.data.customers as Customer[];
}
