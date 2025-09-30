import { Outlet } from 'react-router-dom';

export function DashboardLayout() {
  return (
    <div>
      <aside></aside>
      <section>
        <header>header</header>
        <main>
          <Outlet />
        </main>
      </section>
    </div>
  );
}
