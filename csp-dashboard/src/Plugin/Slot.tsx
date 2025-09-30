import { usePlugins } from './usePlugins';

export function Slot({ name }: { name: string }) {
  const { plugins } = usePlugins();

  const slots = plugins.flatMap(plugin =>
    Object.entries(plugin.slots).map(([slotName, components]) => ({ pluginName: plugin.name, slotName, components }))
  );

  const components = slots
    .filter(item => item.slotName === name)
    .map(item => item.components)
    .flat();

  return (
    <>
      {components.map((Component, index) => (
        <Component.component key={`${name}-component-${index}`} />
      ))}
    </>
    // <div>Test Slot {name}</div>
  );
}
