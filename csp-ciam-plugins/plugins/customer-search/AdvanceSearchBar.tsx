import './AdvanceSearchBar.css';

import { Search } from '@avantfinco/tapestry/icons';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Customer } from '../models/customer';
import { searchCustomers } from '../services/customer-search';
import { CompactCustomerItem } from './CompactCustomerItem';
import { useDebounce } from './useDebounce';

export function AdvanceSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [activeFilter, setActiveFilter] = useState<'all' | 'customer_id' | 'application_id' | 'ssn' | 'ssn_last_4'>(
    'all'
  );
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowResults(true);
      }
      if (e.key === 'Escape') {
        setShowResults(false);
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setCustomers([]);
      setFilteredCustomers([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    searchCustomers(debouncedSearchQuery, controller.signal)
      .then(data => {
        setCustomers(data);
        setIsLoading(false);
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Error fetching search results:', error);
        }
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedSearchQuery]);

  // Filter customers based on active filter
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(customer => {
      switch (activeFilter) {
        case 'customer_id':
          return customer.matched_fields?.includes('basic_customer_id');
        case 'application_id':
          return customer.matched_fields?.includes('basic_orig_ids');
        case 'ssn':
          return customer.matched_fields?.includes('ssn_last_4');
        case 'ssn_last_4':
          return customer.matched_fields?.includes('ssn_last_4');
        default:
          return true;
      }
    });

    setFilteredCustomers(filtered);
  }, [customers, activeFilter]);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShowResults(true);
  };

  const selectCustomer = (customer: Customer) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(`/customer-timeline/${customer.basic_customer_id}`);
  };

  return (
    <div className="customer-search-page">
      <div className="search-container">
        {/* Search Bar */}
        <div className={`search-bar ${isSearchFocused ? 'focused' : ''}`}>
          <div className="search-icon">
            <Search width={16} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
            // onBlur={handleSearchBlur}
            className="search-input"
          />
          <div className="search-shortcuts">
            <span className="shortcut-text">Navigate</span>
            <div className="shortcut-keys">
              <kbd>↑</kbd>
              <kbd>↓</kbd>
            </div>
            <span className="close-text">Close</span>
            <kbd className="close-key">esc</kbd>
          </div>
        </div>

        {/* Filter Buttons */}
        {showResults && debouncedSearchQuery && (
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
        )}

        {/* Search Results */}
        {showResults && (
          <div className="search-results">
            {debouncedSearchQuery ? (
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
                      <CompactCustomerItem
                        onSelect={selectCustomer}
                        key={customer.basic_customer_id}
                        customer={customer}
                      />
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
            ) : (
              <div className="results-section">
                <div className="section-header">
                  <span className="section-title">Start typing to search customers</span>
                </div>
                <div className="search-instructions">
                  <div className="instruction-item">
                    <span className="instruction-icon">🔍</span>
                    <span>Search by name, email, customer ID, or application ID</span>
                  </div>
                  <div className="instruction-item">
                    <span className="instruction-icon">📱</span>
                    <span>Use filters to narrow down results</span>
                  </div>
                  <div className="instruction-item">
                    <span className="instruction-icon">⌨️</span>
                    <span>
                      Press <kbd>Cmd+K</kbd> to quickly access search
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay */}
      {showResults && <div className="search-overlay" onClick={() => setShowResults(false)} />}
    </div>
  );
}
