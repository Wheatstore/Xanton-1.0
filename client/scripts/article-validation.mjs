import assert from 'node:assert/strict';
export function validateArticle(article) {
  const text = (value, label) => assert(typeof value === 'string' && value.trim().length > 0 && !/[<>]/.test(value), `Invalid ${label}`);
  for (const key of ['slug','title','author','date','category','readTime','excerpt','figure','editorialNote']) text(article[key], key);
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug), 'Invalid slug');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(article.date) && new Date(article.date).toISOString().slice(0,10) === article.date, 'Invalid date');
  assert(!('coverImage' in article), 'Articles use a text-only layout');
  assert(article.sections?.length >= 3 && article.sections.length <= 12, 'Expected 3–12 sections');
  assert(article.sources?.length >= 2 && article.sources.length <= 10, 'Expected 2–10 sources');
  assert(new Set(article.sources.map(s => s.id)).size === article.sources.length, 'Duplicate source IDs');
  for (const source of article.sources) {
    assert(Number.isInteger(source.id) && source.id > 0, 'Invalid source ID');
    text(source.title, 'source title'); text(source.note, 'source note');
    const url = new URL(source.url);
    assert(url.protocol === 'https:' && !url.username && !url.password, 'Sources must use HTTPS');
  }
  const refs = ids => assert(Array.isArray(ids) && ids.length > 0 && ids.every(id => article.sources.some(s => s.id === id)), 'Missing or invalid citations');
  const sectionIds = new Set();
  for (const section of article.sections) {
    assert(/^[a-z][a-z0-9-]*$/.test(section.id) && !section.id.startsWith('source-') && !sectionIds.has(section.id), 'Invalid section ID');
    sectionIds.add(section.id); text(section.heading, 'heading');
    assert(section.paragraphs?.length > 0, 'Empty section');
    section.paragraphs.forEach(p => text(p, 'paragraph')); refs(section.sources);
  }
  assert(article.timeline?.length >= 2, 'Timeline missing');
  for (const event of article.timeline) { text(event.date, 'timeline date'); text(event.event, 'timeline event'); refs(event.sources); }
  assert(article.questions?.length === 3, 'Expected three conversation questions');
  article.questions.forEach(q => text(q, 'question'));
  const words = article.sections.flatMap(s => s.paragraphs).join(' ').split(/\s+/).length;
  assert(words >= 400 && words <= 1800, 'Expected 400–1800 words');
  return article;
}
export function validateCollection(articles) {
  assert(new Set(articles.map(a => a.slug)).size === articles.length, 'Duplicate article slug');
  assert(new Set(articles.map(a => a.title.toLowerCase())).size === articles.length, 'Duplicate article title');
  articles.forEach(validateArticle);
}
