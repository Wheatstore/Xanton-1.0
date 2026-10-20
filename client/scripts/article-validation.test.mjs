import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateArticle, validateCollection } from './article-validation.mjs';
const articles = JSON.parse(readFileSync(new URL('../src/content/articles.json', import.meta.url)));
test('published content has valid structure and citations', () => validateCollection(articles));
test('rejects broken citation references', () => {
  const article = structuredClone(articles[0]); article.sections[0].sources = [999];
  assert.throws(() => validateArticle(article), /citations/);
});
test('rejects duplicate routes before a build can overwrite them', () => assert.throws(() => validateCollection([...articles, articles[0]]), /Duplicate/));
test('rejects unsafe source links', () => {
  const article = structuredClone(articles[0]); article.sources[0].url = 'javascript:alert(1)';
  assert.throws(() => validateArticle(article), /HTTPS/);
});
test('rejects missing content and empty timelines', () => {
  const article = structuredClone(articles[0]); article.timeline = [];
  assert.throws(() => validateArticle(article), /Timeline/);
});
