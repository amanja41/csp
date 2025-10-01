import { Customer } from '../models/customer';

interface FilterButtonsProps {
  activeFilter: 'all' | 'customer_id' | 'application_id' | 'ssn' | 'ssn_last_4';
  setActiveFilter: (filter: 'all' | 'customer_id' | 'application_id' | 'ssn' | 'ssn_last_4') => void;
  customers: Customer[];
}

export function FilterButtons({ activeFilter, setActiveFilter, customers }: FilterButtonsProps) {
  return (
    <div className="filter-buttons">
      <button
        className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
        onClick={() => setActiveFilter('all')}
      >
        All Results ({customers.length})
      </button>
      <button
        className={`filter-button ${activeFilter === 'customer_id' ? 'active' : ''}`}
        onClick={() => setActiveFilter('customer_id')}
      >
        Customer ID
      </button>
      <button
        className={`filter-button ${activeFilter === 'application_id' ? 'active' : ''}`}
        onClick={() => setActiveFilter('application_id')}
      >
        Application ID
      </button>
      <button
        className={`filter-button ${activeFilter === 'ssn_last_4' ? 'active' : ''}`}
        onClick={() => setActiveFilter('ssn_last_4')}
      >
        SSN Last 4
      </button>
    </div>
  );
}
