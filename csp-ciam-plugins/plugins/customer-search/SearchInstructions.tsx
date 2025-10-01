export function SearchInstructions() {
  return (
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
  );
}
