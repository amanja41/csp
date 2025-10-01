import './AdvanceSearchBar.css';

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Customer } from '../models/customer';
import { searchCustomers, SearchType } from '../services/ciam/customer-search';
import { FilterButtons } from './FilterButtons';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { SearchTypeButtons } from './SearchTypeButtons';
import { useDebounce } from './useDebounce';

export function AdvanceSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>('customer_id');

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

  const selectCustomer = (customer: Customer) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(`/customer-timeline/${customer.basic_customer_id}`);
  };

  return (
    <div className="customer-search-page">
      <div className="search-container">
        {/* Search Bar */}
        <SearchInput
          ref={searchInputRef}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearchFocused={isSearchFocused}
          onFocus={handleSearchFocus}
          searchType={searchType}
        />

        {/* Search Type Buttons */}
        {showResults && (
          <SearchTypeButtons
            searchType={searchType}
            setSearchType={setSearchType}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* Filter Buttons */}
        {showResults && debouncedSearchQuery && (
          <FilterButtons activeFilter={activeFilter} setActiveFilter={setActiveFilter} customers={customers} />
        )}

        {/* Search Results */}
        <SearchResults
          showResults={showResults}
          debouncedSearchQuery={debouncedSearchQuery}
          activeFilter={activeFilter}
          filteredCustomers={filteredCustomers}
          customers={customers}
          isLoading={isLoading}
          onSelectCustomer={selectCustomer}
        />
      </div>

      {/* Overlay */}
      {showResults && <div className="search-overlay" onClick={() => setShowResults(false)} />}
    </div>
  );
}
