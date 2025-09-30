import React from "react";
import { usePlugins } from "./usePlugins";
import type { SlotProps } from "./types";

export function Slot({ name, props = {} }: SlotProps) {
  const { getSlotComponents } = usePlugins();

  const components = getSlotComponents(name);

  if (components.length === 0) {
    return null;
  }

  return React.createElement(
    React.Fragment,
    null,
    ...components.map((Component, index) =>
      React.createElement(Component, { key: `${name}-${index}`, ...props })
    )
  );
}
