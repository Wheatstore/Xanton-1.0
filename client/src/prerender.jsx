import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import LandingPage from './pages/landing/landing';
import { Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ArticlesListPage from './pages/articles/ArticlesListPage';
import ArticlePage from './pages/articles/ArticlePage';
export { articles, articleSchema } from './content/articles';

export function renderArticles(path) {
  return renderToString(<HelmetProvider context={{}}><StaticRouter location={path}><Routes>
    <Route path="/articles" element={<ArticlesListPage/>}/>
    <Route path="/articles/:slug" element={<ArticlePage/>}/>
  </Routes></StaticRouter></HelmetProvider>);
}

// The public homepage intentionally has no Firebase or browser-only dependencies.
export function renderHome() {
  return renderToString(<StaticRouter location="/"><LandingPage /></StaticRouter>);
}
