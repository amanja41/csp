import './AdvanceSearchBar.css';

import { Search } from '@avantfinco/tapestry/icons';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Customer } from '../models/customer';
import { searchCustomers, SearchType } from '../services/customer-search';
import { CompactCustomerItem } from './CompactCustomerItem';
import { useDebounce } from './useDebounce';

export function AdvanceSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>('name'); // Default to name search

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

    searchCustomers(debouncedSearchQuery, controller.signal, searchType)
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
  }, [debouncedSearchQuery, searchType]);

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

  const getPlaceholderText = () => {
    switch (searchType) {
      case 'customer_id':
        return 'Search by Customer ID...';
      case 'application_id':
        return 'Search by Application ID...';
      case 'email':
        return 'Search by Email...';
      case 'phone':
        return 'Search by Phone Number...';
      case 'ssn':
        return 'Search by SSN Last 4...';
      case 'name':
      default:
        return 'Search by Customer Name...';
    }
  };

  const getSearchTypeLabel = (type: SearchType) => {
    switch (type) {
      case 'customer_id':
        return 'Customer ID';
      case 'application_id':
        return 'Application ID';
      case 'email':
        return 'Email';
      case 'phone':
        return 'Phone';
      case 'ssn':
        return 'SSN Last 4';
      case 'name':
      default:
        return 'Name';
    }
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
            placeholder={getPlaceholderText()}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
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

        {/* Search Type Buttons */}
        {showResults && (
          <div className="search-type-buttons">
            <div className="search-type-label">Search by:</div>
            {(['name', 'customer_id', 'application_id', 'email', 'phone', 'ssn'] as SearchType[]).map(type => (
              <button
                key={type}
                className={`search-type-button ${searchType === type ? 'active' : ''}`}
                onClick={() => {
                  setSearchType(type);
                  // Clear search when changing type to avoid confusion
                  if (searchQuery) {
                    setSearchQuery('');
                  }
                }}
              >
                {getSearchTypeLabel(type)}
              </button>
            ))}
          </div>
        )}

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
                    <span>Choose a search type above, then start typing to search</span>
                  </div>
                  <div className="instruction-item">
                    <span className="instruction-icon">🎯</span>
                    <span>Search by: Name, Customer ID, Application ID, Email, Phone, or SSN</span>
                  </div>
                  <div className="instruction-item">
                    <span className="instruction-icon">⚡</span>
                    <span>Use filters to narrow down your results after searching</span>
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
