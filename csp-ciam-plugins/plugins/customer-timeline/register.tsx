import { register } from 'csp-plugin';

import { CustomerTimelinePage } from './CustomerTimelinePage';

const manifest = register({
  name: 'customer-timeline',
  routes: {
    'customer-timeline': CustomerTimelinePage,
  },
  slots: {},
});

export default manifest;
