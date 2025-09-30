import { ComponentType } from "react";

export interface Plugin {
  name: string;
  routes: Record<string, ComponentType>;
  slots: Record<string, ComponentType[]>;
}

export interface PluginContextType {
  plugins: Record<string, Plugin>;
  registerPlugin: (plugin: Plugin) => void;
  getSlotComponents: (slotName: string) => ComponentType[];
  getRouteComponent: (routeName: string) => ComponentType | undefined;
}

export interface SlotProps {
  name: string;
  props?: Record<string, unknown>;
}

export {};

declare global {
  interface Window {
    plugins?: Record<string, Plugin>;
  }
}
