import { Search } from '@avantfinco/tapestry/icons';
import { forwardRef } from 'react';

import { SearchType } from '../services/customer-search';

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchFocused: boolean;
  onFocus: () => void;
  searchType: SearchType;
}

const getPlaceholderText = (searchType: SearchType) => {
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

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ searchQuery, setSearchQuery, isSearchFocused, onFocus, searchType }, ref) => {
    return (
      <div className={`search-bar ${isSearchFocused ? 'focused' : ''}`}>
        <div className="search-icon">
          <Search width={16} />
        </div>
        <input
          ref={ref}
          type="text"
          placeholder={getPlaceholderText(searchType)}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onFocus={onFocus}
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
    );
  }
);

SearchInput.displayName = 'SearchInput';
