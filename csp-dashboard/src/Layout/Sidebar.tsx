import { Logo } from '@avantfinco/tapestry/icons';

import { Slot } from '../Plugin/Slot';

export function Sidebar() {
  return (
    <aside id="shell-sidebar" className="shell-sidebar">
      <header id="shell-sidebar-header">
        <Logo width={200} />
      </header>
      <main id="shell-sidebar-content"></main>
      <footer id="shell-sidebar-footer">
        <Slot name="shell-sidebar-footer" />
      </footer>
    </aside>
  );
}
