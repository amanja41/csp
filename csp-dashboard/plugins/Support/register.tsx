import { register } from 'csp-plugin';

import { Support } from './Support';

const manifest = register({
  name: 'Support',
  slots: {
    'shell-sidebar-footer': {
      component: Support,
    },
  },
});

export default manifest;
