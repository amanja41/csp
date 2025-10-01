import { Customer } from '../../models/customer';
import { request } from './request';

const API_BASE_URL = 'http://localhost:9292';

export type SearchType = 'application_id' | 'customer_id' | 'ssn' | 'email' | 'phone' | 'name';

export async function searchCustomers(query: string, signal?: AbortSignal, searchType?: SearchType) {
  // Determine search type based on query if not specified
  const determinedSearchType = searchType || determineSearchType(query);

  const payload = {
    type: determinedSearchType,
    value: query,
    include_deleted: false,
    include_all_matches: true,
  };

  const response = await request({
    url: `${API_BASE_URL}/csp/search`,
    body: payload,
    method: 'POST',
    signal,
  });

  const customers = response.data.customers as Customer[];
  console.log('Fetched customers:', customers);

  // Add matched fields based on search type and query
  return customers.map(customer => ({
    ...customer,
    matched_fields: determineMatchedFields(customer, query),
  }));
}

function determineSearchType(query: string): SearchType {
  // Remove spaces and special characters for analysis
  const cleanQuery = query.trim().toLowerCase();

  // Check if it's a numeric ID
  if (/^\d+$/.test(cleanQuery)) {
    if (cleanQuery.length <= 6) {
      return 'customer_id';
    } else {
      return 'application_id';
    }
  }

  // Check if it's SSN last 4
  if (/^\d{4}$/.test(cleanQuery)) {
    return 'ssn';
  }

  // Check if it's an email
  if (cleanQuery.includes('@')) {
    return 'email';
  }

  // Check if it's a phone number
  if (/[\d\-() ]{10,}/.test(cleanQuery)) {
    return 'phone';
  }

  // Default to name search
  return 'name';
}

function determineMatchedFields(customer: Customer, query: string): string[] {
  const matchedFields: string[] = [];
  const queryLower = query.toLowerCase();

  // Check each field for matches
  if (customer.basic_customer_id.toString().includes(queryLower)) {
    matchedFields.push('basic_customer_id');
  }

  if (customer.full_name.toLowerCase().includes(queryLower)) {
    matchedFields.push('full_name');
  }

  if (customer.email.toLowerCase().includes(queryLower)) {
    matchedFields.push('email');
  }

  if (customer.phone_number?.toLowerCase().includes(queryLower)) {
    matchedFields.push('phone_number');
  }

  if (customer.ssn_last_4.includes(queryLower)) {
    matchedFields.push('ssn_last_4');
  }

  if (customer.company?.toLowerCase().includes(queryLower)) {
    matchedFields.push('company');
  }

  // Check application IDs
  if (customer.basic_orig_ids.some(id => id.toString().includes(queryLower))) {
    matchedFields.push('basic_orig_ids');
  }

  // Check loan IDs
  if (customer.basic_serv_loan_ids.some(id => id.toString().includes(queryLower))) {
    matchedFields.push('basic_serv_loan_ids');
  }

  // Check card IDs
  if (customer.basic_serv_card_ids.some(id => id.toString().includes(queryLower))) {
    matchedFields.push('basic_serv_card_ids');
  }

  return matchedFields;
}
