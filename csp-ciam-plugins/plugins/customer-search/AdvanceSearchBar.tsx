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

  const [activeFilter, setActiveFilter] = useState<'all' | 'member' | 'fleet' | 'warehouse'>('all');
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
    if (!debouncedSearchQuery) return;

    const controller = new AbortController();

    searchCustomers(debouncedSearchQuery, controller.signal)
      .then(data => {
        setCustomers(data);
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedSearchQuery]);

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
        {showResults && (
          <div className="filter-buttons">
            <button
              className={`filter-button ${activeFilter === 'member' ? 'active' : ''}`}
              onClick={() => setActiveFilter('member')}
            >
              Customer Id
            </button>
            <button
              className={`filter-button ${activeFilter === 'fleet' ? 'active' : ''}`}
              onClick={() => setActiveFilter('fleet')}
            >
              Applictaion Id
            </button>
            <button
              className={`filter-button ${activeFilter === 'warehouse' ? 'active' : ''}`}
              onClick={() => setActiveFilter('warehouse')}
            >
              SSN
            </button>
            <button
              className={`filter-button ${activeFilter === 'warehouse' ? 'active' : ''}`}
              onClick={() => setActiveFilter('warehouse')}
            >
              SSN last 4
            </button>
            <button className="more-button">More ⌄</button>
          </div>
        )}

        {/* Search Results */}
        {showResults && (
          <div className="search-results">
            <div className="results-section">
              <div className="section-header">
                <span className="section-title">Search Results</span>
                <span className="section-count">{customers.length}</span>
              </div>
              <div className="results-list">
                {customers.map(customer => (
                  <CompactCustomerItem onSelect={selectCustomer} key={customer.basic_customer_id} customer={customer} />
                ))}
              </div>
            </div>
          </div>
        )}

        {showResults && (
          <div className="search-results">
            <div className="results-section">
              <div className="section-header">
                <span className="section-title">Recent Customers</span>
                <span className="section-count">0</span>
              </div>
              <div className="results-list">
                <div className="no-results">
                  <div className="no-results-text">No results found for "{searchQuery}"</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {showResults && <div className="search-overlay" onClick={() => setShowResults(false)} />}
    </div>
  );
}
