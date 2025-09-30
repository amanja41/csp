import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Layout } from './Layout/Layout';
import { usePlugins } from './Plugin/usePlugins';

export function AppRouter() {
  const { plugins } = usePlugins();

  const routesArray = plugins?.map(p => p.routes) ?? [];
  const routes = Object.assign({}, ...routesArray);
  console.log('Routes:', routes);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {Object.entries(routes).map(([path, Component]) => {
            const RouteComponent = Component as React.ComponentType;
            return RouteComponent ? <Route key={path} path={path} element={<RouteComponent />} /> : null;
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
