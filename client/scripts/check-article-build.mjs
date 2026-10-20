import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { validateCollection } from './article-validation.mjs';
const articles = JSON.parse(await readFile('src/content/articles.json', 'utf8'));
validateCollection(articles);
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const listing = await readFile('dist/articles/index.html', 'utf8');
for (const article of articles) {
  const path = `/articles/${article.slug}`;
  const html = await readFile(`dist${path}/index.html`, 'utf8');
  assert(sitemap.includes(`https://echoesofhistoryai.org${path}</loc>`), `Missing sitemap entry: ${path}`);
  assert(listing.includes(`href="${path}"`), `Missing crawlable index link: ${path}`);
  assert(html.includes(`rel="canonical" href="https://echoesofhistoryai.org${path}"`), `Wrong canonical: ${path}`);
  assert(html.includes('"@type":"Article"'), `Missing Article schema: ${path}`);
  for (const section of article.sections) assert(html.includes(`id="${section.id}"`), `Missing prerendered section: ${section.id}`);
  for (const source of article.sources) assert(html.includes(`id="source-${source.id}"`), 'Missing source');
  assert(html.includes('CONTINUE THE CONVERSATION'), 'Missing figure CTA');
  assert(!html.includes('Preparing the article'), 'Prerender contains a loading placeholder');
}
console.log(`Verified full HTML, metadata, source anchors, CTAs and sitemap for ${articles.length} articles.`);
