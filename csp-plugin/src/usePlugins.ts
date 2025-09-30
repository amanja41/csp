import { useContext } from "react";
import { PluginContext } from "./PluginProvider";
import type { PluginContextType } from "./types";

export function usePlugins(): PluginContextType {
  const context = useContext(PluginContext);

  if (context === undefined) {
    throw new Error("usePlugins must be used within a PluginProvider");
  }

  return context;
}
