import { type Plugin } from 'csp-plugin';
import { type ComponentType, useCallback, useMemo, useState } from 'react';

import { PluginContext } from './PluginContext';

export type PluginContextType = {
  plugins: Plugin[];
  getSlotComponents: (slotName: string) => React.ComponentType[];
  getRouteComponent: (routeName: string) => React.ComponentType | undefined;
};

type PluginProviderProps = {
  children: React.ReactNode;
  initialPlugins?: Record<string, Plugin>;
};

export function PluginProvider({ children, initialPlugins = {} }: PluginProviderProps) {
  const [plugins] = useState<Record<string, Plugin>>(() => {
    // Merge initial plugins with any plugins already registered on window
    const windowPlugins = typeof window !== 'undefined' ? window.plugins || {} : {};
    Object.assign(windowPlugins, initialPlugins);
    return { ...windowPlugins };
  });

  const getSlotComponents = useCallback(
    (slotName: string) => {
      const components: ComponentType[] = [];

      Object.values(plugins).forEach(plugin => {
        const slotComponents = plugin.slots[slotName];
        if (slotComponents && Array.isArray(slotComponents)) {
          components.push(...slotComponents);
        }
      });

      return components;
    },
    [plugins]
  );

  const getRouteComponent = useCallback(
    (routeName: string) => {
      for (const plugin of Object.values(plugins)) {
        const component = plugin.routes[routeName];
        if (component) {
          return component;
        }
      }
      return undefined;
    },
    [plugins]
  );

  const contextValue = useMemo(
    () => ({
      plugins: Object.values(plugins),
      getSlotComponents,
      getRouteComponent,
    }),
    [plugins, getSlotComponents, getRouteComponent]
  );

  return <PluginContext.Provider value={contextValue}>{children}</PluginContext.Provider>;
}
