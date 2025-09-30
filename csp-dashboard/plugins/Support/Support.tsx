import './Support.css';

import { TapestryButton } from '@avantfinco/tapestry';

export function Support() {
  const url = 'https://avantinc.atlassian.net/servicedesk/customer/portal/43/group/155/create/580';
  const handleClick = () => {
    window.open(url, '_blank');
  };
  return (
    <div className="Support">
      <h6>Customer Specialist Resources</h6>
      <p>Access support documentation, customer tools, and resources to help customers succeed.</p>
      <TapestryButton label="Create Single Customer Incident Ticket" onClick={handleClick} />
    </div>
  );
}
