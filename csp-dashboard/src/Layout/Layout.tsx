import './Layout.css';

import { Outlet } from 'react-router-dom';

import { Slot } from '../Plugin/Slot';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div id="shell" className="shell">
      <Sidebar />
      <section id="shell-main">
        <header id="shell-main-header">
          <Slot name="shell-main-header" />
        </header>
        <main id="shell-main-content">
          <Outlet />
        </main>
      </section>
    </div>
  );
}
