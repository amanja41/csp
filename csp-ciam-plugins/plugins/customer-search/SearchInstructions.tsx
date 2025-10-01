export function SearchInstructions() {
  return (
    <div className="results-section">
      <div className="section-header">
        <span className="section-title">Start typing to search customers</span>
      </div>
      <div className="search-instructions">
        <div className="instruction-item">
          <span>Choose a search type above, then start typing to search</span>
        </div>
        <div className="instruction-item">
          <span>Search by: Name, Customer ID, Application ID, Email, Phone, or SSN</span>
        </div>
        <div className="instruction-item">
          <span>Use filters to narrow down your results after searching</span>
        </div>
        <div className="instruction-item">
          <span>
            Press <kbd>Cmd+K</kbd> to quickly access search
          </span>
        </div>
      </div>
    </div>
  );
}
