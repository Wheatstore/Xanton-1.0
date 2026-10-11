import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import LandingPage from './pages/landing/landing';

// The public homepage intentionally has no Firebase or browser-only dependencies.
export function renderHome() {
  return renderToString(<StaticRouter location="/"><LandingPage /></StaticRouter>);
}
