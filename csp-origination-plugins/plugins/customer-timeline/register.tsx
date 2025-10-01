import { register } from 'csp-plugin';

import { CustomerTimelinePage } from './CustomerTimelinePage';

const manifest = register({
  name: 'customer-timeline',
  routes: {
    'customer-timeline/:customerId': CustomerTimelinePage,
  },
  slots: {},
});

export default manifest;
