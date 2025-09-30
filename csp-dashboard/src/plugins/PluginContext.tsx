import { createContext } from 'react';
import type { PluginContextType } from './PluginProvider';

export const PluginContext = createContext<PluginContextType | undefined>(undefined);
