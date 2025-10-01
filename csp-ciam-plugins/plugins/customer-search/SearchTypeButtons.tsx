import { SearchType } from '../services/customer-search';

interface SearchTypeButtonsProps {
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

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

export function SearchTypeButtons({ searchType, setSearchType, searchQuery, setSearchQuery }: SearchTypeButtonsProps) {
  const searchTypes: SearchType[] = ['name', 'customer_id', 'application_id', 'email', 'phone', 'ssn'];

  return (
    <div className="search-type-buttons">
      <div className="search-type-label">Search by:</div>
      {searchTypes.map(type => (
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
  );
}
