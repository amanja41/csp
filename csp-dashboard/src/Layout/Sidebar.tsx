import { Logo } from '@avantfinco/tapestry/icons';
import { Support } from '@plugins';
export function Sidebar() {
  return (
    <aside id="shell-sidebar" className="shell-sidebar">
      <header id="shell-sidebar-header">
        <Logo width={200} />
      </header>
      <main id="shell-sidebar-content"></main>
      <footer id="shell-sidebar-footer">
        <Support />
      </footer>
    </aside>
  );
}
