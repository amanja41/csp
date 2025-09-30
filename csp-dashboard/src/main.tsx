import './index.css';
import '@avantfinco/tapestry/styles';
import '@avantfinco/tapestry/variables';
import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.tsx';
import { loadRemotesPlugins } from './Plugin/index.tsx';
import { PluginProvider } from './Plugin/PluginProvider.tsx';

await loadRemotesPlugins();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PluginProvider initialPlugins={[]}>
      <App />
    </PluginProvider>
  </StrictMode>
);
