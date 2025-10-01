import type { Plugin } from "./types";

export function register(plugin: Plugin): Plugin {
  if (typeof window !== "undefined") {
    window.plugins = window.plugins || {};
    window.plugins[plugin.name] = plugin;
  }

  return plugin;
}

export type { Plugin };
