import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { renderHome, renderArticles, articles, articleSchema } from '../.prerender/prerender.js';
import { organization, pages, siteUrl, socialImage, website } from '../src/seo/pages.js';

const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const shell = await readFile('dist/index.html', 'utf8');
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'));
function articleStyles(path) {
  if (!path.startsWith('/articles')) return '';
  const seen = new Set();
  const styles = new Set();
  function visit(key) {
    if (seen.has(key)) return;
    seen.add(key);
    const entry = manifest[key];
    for (const css of entry?.css || []) styles.add(css);
    for (const dependency of entry?.imports || []) visit(dependency);
  }
  visit(path === '/articles' ? 'src/pages/articles/ArticlesListPage.jsx' : 'src/pages/articles/ArticlePage.jsx');
  return [...styles].filter(css => !shell.includes(`/${css}`)).map(css => `<link rel="stylesheet" href="/${escape(css)}" />`).join('\n');
}
function metadata(path, page, index = true) {
  const url = `${siteUrl}${path}`;
  const meta = (name, content, property = false) => `<meta ${property ? 'property' : 'name'}="${name}" content="${escape(content)}" data-rh="true" />`;
  const schema = [organization, ...(page.article ? [articleSchema(page.article)] : []), ...(path === '/' ? [website] : [])].map(value => `<script type="application/ld+json" data-rh="true">${JSON.stringify(value).replaceAll('<', '\\u003c')}</script>`).join('\n');
  return `<title>${escape(page.title)}</title>\n${[
    meta('description', page.description), meta('robots', index ? 'index, follow, max-image-preview:large' : 'noindex, follow'),
    `<link rel="canonical" href="${escape(url)}" data-rh="true" />`,
    meta('og:type', page.article ? 'article' : 'website', true), meta('og:site_name', 'Echoes of History', true),
    meta('og:title', page.title, true), meta('og:description', page.description, true), meta('og:url', url, true),
    meta('og:image', socialImage, true), meta('og:image:width', '1200', true), meta('og:image:height', '630', true),
    meta('og:image:alt', 'A marble philosopher in a contemporary sunlit gallery — Echoes of History', true),
    meta('twitter:card', 'summary_large_image'), meta('twitter:title', page.title), meta('twitter:description', page.description), meta('twitter:image', socialImage), schema,
  ].join('\n')}`;
}
function htmlFor(path, page, content = '', index = true) {
  return shell.replace(/<!--seo-start-->[\s\S]*?<!--seo-end-->/, metadata(path, page, index)).replace('</head>', `${articleStyles(path)}</head>`).replace('<div id="root"></div>', `<div id="root">${content}</div>`);
}
// Keep unknown and dynamic routes free of the homepage's canonical and HTML.
await writeFile('dist/spa.html', shell);
const publicPages = { ...pages, ...Object.fromEntries(articles.map(article => [`/articles/${article.slug}`, { title: `${article.title} | Echoes of History`, description: article.excerpt, article }])) };
for (const [path, page] of Object.entries(publicPages)) {
  const directory = path === '/' ? 'dist' : `dist${path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, htmlFor(path, page, path === '/' ? renderHome() : path.startsWith('/articles') ? renderArticles(path) : ''));
}
for (const path of ['/login', '/signup', '/feedback']) {
  await mkdir(`dist${path}`, { recursive: true });
  const label = { '/login': 'Log in', '/signup': 'Create an account', '/feedback': 'Get in touch' }[path];
  await writeFile(`dist${path}/index.html`, htmlFor(path, { title: `${label} | Echoes of History`, description: 'Continue your journey through history with Echoes of History.' }, '', false));
}
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.entries(publicPages).map(([path, page]) => `  <url><loc>${siteUrl}${path}</loc>${page.article ? `<lastmod>${page.article.date}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`);
await rm('.prerender', { recursive: true, force: true });
console.log(`Prerendered homepage, reading room and ${articles.length} articles; metadata for ${Object.keys(publicPages).length} public routes.`);
