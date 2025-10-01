import { register } from 'csp-plugin';

import { AuthDropDown } from './AuthDropDown';

const manifest = register({
  name: 'AgentDropDown',
  slots: {
    'shell-main-header-right': {
      component: AuthDropDown,
    },
  },
});

export default manifest;
