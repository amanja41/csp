import { register } from 'csp-plugin';

import { AdvanceSearchBar } from './AdvanceSearchBar';

const manifest = register({
  name: 'customer-search',
  // routes: {
  //   'customer-search': CustomerSearchPage,
  // },
  slots: {
    'shell-main-header': {
      component: AdvanceSearchBar,
    },
  },
});

export default manifest;
