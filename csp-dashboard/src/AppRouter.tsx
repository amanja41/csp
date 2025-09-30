import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { DashboardLayout } from './DashboardLayout';
import { usePlugins } from './plugins/usePlugins';

export function AppRouter() {
  const { plugins } = usePlugins();

  const routesArray = plugins?.map(p => p.routes) ?? [];
  const routes = Object.assign({}, ...routesArray);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          {Object.entries(routes).map(([path, Component]) => {
            const RouteComponent = Component as React.ComponentType;
            return RouteComponent ? <Route key={path} path={path} element={<RouteComponent />} /> : null;
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
