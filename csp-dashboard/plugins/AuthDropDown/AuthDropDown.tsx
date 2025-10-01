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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 2C6 1.44772 6.44772 1 7 1H14C14.5523 1 15 1.44772 15 2V14C15 14.5523 14.5523 15 14 15H7C6.44772 15 6 14.5523 6 14V12C6 11.4477 6.44772 11 7 11C7.55228 11 8 11.4477 8 12V13H13V3H8V4C8 4.55228 7.55228 5 7 5C6.44772 5 6 4.55228 6 4V2Z"
                  fill="currentColor"
                />
                <path
                  d="M1.29289 7.29289C0.902369 7.68342 0.902369 8.31658 1.29289 8.70711L4.29289 11.7071C4.68342 12.0976 5.31658 12.0976 5.70711 11.7071C6.09763 11.3166 6.09763 10.6834 5.70711 10.2929L4.41421 9H10C10.5523 9 11 8.55228 11 8C11 7.44772 10.5523 7 10 7H4.41421L5.70711 5.70711C6.09763 5.31658 6.09763 4.68342 5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289L1.29289 7.29289Z"
                  fill="currentColor"
                />
              </svg>
              Sign Out
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
