import { register } from 'csp-plugin';

import { ApplicationDetailsPage } from './ApplicationDetailsPage';

const manifest = register({
  name: 'application-details',
  routes: {
    'application-details': ApplicationDetailsPage,
  },
  slots: {},
});

export default manifest;
