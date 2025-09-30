import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getCustomerTimeline } from '../services/customer-timeline';

export function CustomerTimelinePage() {
  const { customerId } = useParams();
  const [res, setRes] = useState(null);

  useEffect(() => {
    getCustomerTimeline(customerId).then(data => {
      console.log('Timeline data:', data);
      setRes(data);
    });
  }, [customerId]);

  return (
    <div>
      <h2>Customer Timeline {customerId}</h2>
      <pre>{res ? JSON.stringify(res, null, 2) : 'Loading...'}</pre>
    </div>
  );
}
