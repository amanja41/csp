import { register } from 'csp-plugin';

import { AgentDropDown } from './AgentDropDown';

const manifest = register({
  name: 'AgentDropDown',
  slots: {
    'shell-main-header-right': {
      component: AgentDropDown,
    },
  },
});

export default manifest;
