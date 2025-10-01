import './AuthDropDown.css';

import { useEffect, useRef, useState } from 'react';

import { useAuthStore } from '../../src/store/useAuthStore';

export function AuthDropDown() {
  const agent = useAuthStore(store => store.agent);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!agent) return null;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getInitials = (firstName: string, lastName?: string) => {
    return `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`;
  };

  return (
    <div className="agent-dropdown" ref={dropdownRef}>
      <button className="agent-dropdown-button" onClick={toggleDropdown} aria-expanded={isOpen} aria-haspopup="true">
        <div className="agent-avatar">{getInitials(agent.first_name, agent.last_name)}</div>
        <div className="agent-info">
          <span className="agent-name">{agent.first_name}</span>
          <span className="agent-role">{agent.basic_role}</span>
        </div>
        <svg
          className={`chevron-icon ${isOpen ? 'chevron-up' : 'chevron-down'}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="agent-dropdown-menu">
          <div className="dropdown-header">
            <div className="agent-avatar-large">{getInitials(agent.first_name, agent.last_name)}</div>
            <div className="agent-details">
              <div className="agent-name-large">
                {agent.first_name} {agent.last_name}
              </div>
              <div className="agent-email">{agent.email}</div>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          <div className="dropdown-items">
            <a href="/preferences" className="dropdown-item">
              Preferences
            </a>

            <div className="dropdown-divider"></div>

            <a href="/logout" className="dropdown-item logout-item">
              Sign Out
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
