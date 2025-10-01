import { Customer } from '../models/customer';
import { CompactCustomerItem } from './CompactCustomerItem';

interface SearchResultsListProps {
  debouncedSearchQuery: string;
  activeFilter: 'all' | 'customer_id' | 'application_id' | 'ssn' | 'ssn_last_4';
  filteredCustomers: Customer[];
  customers: Customer[];
  isLoading: boolean;
  onSelectCustomer: (customer: Customer) => void;
}

export function SearchResultsList({
  debouncedSearchQuery,
  activeFilter,
  filteredCustomers,
  customers,
  isLoading,
  onSelectCustomer,
}: SearchResultsListProps) {
  if (!debouncedSearchQuery) {
    return null;
  }

  return (
    <div className="results-section">
      <div className="section-header">
        <span className="section-title">
          {activeFilter === 'all' ? 'Search Results' : `Filtered by ${activeFilter.replace('_', ' ')}`}
        </span>
        <span className="section-count">{filteredCustomers.length}</span>
      </div>
      <div className="results-list">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <div className="loading-text">Searching customers...</div>
          </div>
        ) : filteredCustomers.length > 0 ? (
          filteredCustomers.map(customer => (
            <CompactCustomerItem onSelect={onSelectCustomer} key={customer.basic_customer_id} customer={customer} />
          ))
        ) : customers.length > 0 ? (
          <div className="no-results">
            <div className="no-results-text">No customers match the selected filter "{activeFilter}"</div>
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-text">No customers found for "{debouncedSearchQuery}"</div>
          </div>
        )}
      </div>
    </div>
  );
}
