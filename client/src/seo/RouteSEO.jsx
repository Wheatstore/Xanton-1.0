import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { organization, pages, siteUrl, socialImage, website } from './pages';

export default function RouteSEO() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/$/, '') || '/';
  const isArticle = /^\/articles\/[^/]+$/.test(path);
  const page = pages[path] || { title: isArticle ? 'History Article | Echoes of History' : 'Echoes of History', description: 'Explore the lives and ideas that shaped our world with Echoes of History.' };
  const indexable = Boolean(pages[path]) || isArticle;
  return <Helmet>
    <title>{page.title}</title>
    <meta name="description" content={page.description} />
    <meta name="robots" content={indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow'} />
    <link rel="canonical" href={`${siteUrl}${path === '/' ? '/' : path}`} />
    <meta property="og:type" content={isArticle ? 'article' : 'website'} />
    <meta property="og:site_name" content="Echoes of History" />
    <meta property="og:title" content={page.title} />
    <meta property="og:description" content={page.description} />
    <meta property="og:url" content={`${siteUrl}${path === '/' ? '/' : path}`} />
    <meta property="og:image" content={socialImage} />
    <meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="A marble philosopher in a contemporary sunlit gallery — Echoes of History" />
    <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={page.title} /><meta name="twitter:description" content={page.description} /><meta name="twitter:image" content={socialImage} />
    <script type="application/ld+json">{JSON.stringify(organization)}</script>
    {path === '/' && <script type="application/ld+json">{JSON.stringify(website)}</script>}
  </Helmet>;
}
