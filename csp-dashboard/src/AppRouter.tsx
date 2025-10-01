import { TapestryContentBlock } from '@avantfinco/tapestry';
import { Danger } from '@avantfinco/tapestry/illustrations';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Layout } from './Layout/Layout';
import { AuthCallback } from './pages/AuthCallback';
import { LoginPage } from './pages/Login/LoginPage';
import { usePlugins } from './Plugin/usePlugins';

function NotFound() {
  return <TapestryContentBlock body="The page you are looking for does not exist." image={Danger} title="Not Found" />;
}

export function AppRouter() {
  const { plugins } = usePlugins();

  const routesArray = plugins?.map(p => p.routes) ?? [];
  const routes = Object.assign({}, ...routesArray);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/404" element={<NotFound />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<Layout />}>
          {Object.entries(routes).map(([path, Component]) => {
            const RouteComponent = Component as React.ComponentType;
            return RouteComponent ? <Route key={path} path={path} element={<RouteComponent />} /> : null;
          })}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
