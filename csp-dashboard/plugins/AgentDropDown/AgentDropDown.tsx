import './AgentDropDown.css';

import { TapestryButton } from '@avantfinco/tapestry';

import { useAuthStore } from '../../src/store/useAuthStore';

export function AgentDropDown() {
  const agent = useAuthStore(store => store.agent);
  if (!agent) return null;

  return (
    <div className="dropdown">
      <TapestryButton label={`${agent?.first_name} `} variant="text" />
      <div className="dropdown-content">
        <a href="/logout">Logout</a>
      </div>
    </div>
  );
}
