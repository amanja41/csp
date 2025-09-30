import { register } from 'csp-plugin';

import { CustomerSearchPage } from './CustomerSearchPage';

const manifest = register({
  name: 'customer-search',
  // routes: {
  //   'customer-search': CustomerSearchPage,
  // },
  slots: {
    'shell-main-header': {
      component: CustomerSearchPage,
    },
  },
});

export default manifest;
