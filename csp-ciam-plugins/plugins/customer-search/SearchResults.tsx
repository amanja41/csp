import { Customer } from '../models/customer';
import { SearchInstructions } from './SearchInstructions';
import { SearchResultsList } from './SearchResultsList';

interface SearchResultsProps {
  showResults: boolean;
  debouncedSearchQuery: string;
  activeFilter: 'all' | 'customer_id' | 'application_id' | 'ssn' | 'ssn_last_4';
  filteredCustomers: Customer[];
  customers: Customer[];
  isLoading: boolean;
  onSelectCustomer: (customer: Customer) => void;
}

export function SearchResults({
  showResults,
  debouncedSearchQuery,
  activeFilter,
  filteredCustomers,
  customers,
  isLoading,
  onSelectCustomer,
}: SearchResultsProps) {
  if (!showResults) {
    return null;
  }

  return (
    <div className="search-results">
      {debouncedSearchQuery ? (
        <SearchResultsList
          debouncedSearchQuery={debouncedSearchQuery}
          activeFilter={activeFilter}
          filteredCustomers={filteredCustomers}
          customers={customers}
          isLoading={isLoading}
          onSelectCustomer={onSelectCustomer}
        />
      ) : (
        <SearchInstructions />
      )}
    </div>
  );
}
