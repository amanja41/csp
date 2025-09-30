import { useContext } from 'react';

import { PluginContext } from './PluginContext';

export function usePlugins() {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePlugins must be used within a PluginProvider');
  }
  return context;
}
