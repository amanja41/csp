import './Layout.css';

import { Outlet } from 'react-router-dom';

import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div id="shell" className="shell">
      <Sidebar />
      <section id="shell-main">
        <header id="shell-main-header">header</header>
        <main id="shell-main-content">
          <Outlet />
        </main>
      </section>
    </div>
  );
}
