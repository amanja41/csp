import './Layout.css';

import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { Slot } from '../Plugin/Slot';
import { getPreferences } from '../services/ciam/getPreferences';
import { useAuthStore } from '../store/useAuthStore';
import { Sidebar } from './Sidebar';

export function Layout() {
  const { login } = useAuthStore();

  useEffect(() => {
    const controller = new AbortController();
    getPreferences(controller.signal).then(data => {
      if (data?.success) {
        login(data.agent);
      }
    });

    return () => {
      controller.abort();
    };
  }, [login]);

  return (
    <div id="shell" className="shell">
      <Sidebar />
      <section id="shell-main">
        <header id="shell-main-header">
          <div id="shell-main-header-left">
            <Slot name="shell-main-header-left" />
          </div>
          <div id="shell-main-header-right">
            <Slot name="shell-main-header-right" />
          </div>
        </header>
        <main id="shell-main-content">
          <Outlet />
        </main>
      </section>
    </div>
  );
}
