import './index.css';
import '@avantfinco/tapestry/styles';
import '@avantfinco/tapestry/variables';
import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.tsx';
import { loadRemotesPlugins } from './PluginRegistry/plugin.tsx';
import { PluginProvider } from './PluginRegistry/PluginProvider.tsx';

const plugins = await loadRemotesPlugins();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PluginProvider initialPlugins={plugins}>
      <App />
    </PluginProvider>
  </StrictMode>
);
