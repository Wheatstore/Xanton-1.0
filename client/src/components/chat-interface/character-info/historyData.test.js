import test from 'node:test';
import assert from 'node:assert/strict';
import { historicalDate, orderedEvents, clean, excerpt, sourceHref } from './historyData.js';

test('orders BCE and signed years without flipping them into CE', () => {
  const events = orderedEvents({ timeline: [
    { title: 'CE', dateDisplay: '44 CE' },
    { title: 'Later BCE', startDate: '-0044-03-15' },
    { title: 'Earlier BCE', dateDisplay: '490 BCE' },
  ] });
  assert.deepEqual(events.map(event => event.title), ['Earlier BCE', 'Later BCE', 'CE']);
});
test('extracts the year rather than the day in written dates', () => {
  assert.equal(historicalDate('12 February 1809').order, 18090212);
  assert.equal(historicalDate('February 12, 1809').order, 18090212);
  assert.equal(historicalDate('1809-02-12').order, 18090212);
  assert.equal(historicalDate('c. 1831').year, 1831);
  assert.equal(historicalDate('1831–1836').year, 1831);
  assert.equal(historicalDate('500–400 BCE').year, -500);
});
test('retains tied and unknown events in record order and supports keyMoments', () => {
  const events = orderedEvents({ keyMoments: [
    { title: 'Undated 1' }, { title: 'Same year 1', dateDisplay: '1900' },
    { title: 'Same year 2', dateDisplay: '1900' }, { title: 'Undated 2', dateDisplay: 'Unknown' },
  ] });
  assert.deepEqual(events.map(event => event.title), ['Same year 1', 'Same year 2', 'Undated 1', 'Undated 2']);
  assert.equal(historicalDate('Date uncertain'), null);
  assert.deepEqual(orderedEvents({}), []);
});
test('preserves content in heterogeneous record fields and bounds excerpts', () => {
  assert.equal(clean(['One', { summary: 'Two' }]), 'One\n\nTwo');
  assert.equal(clean(0), '0');
  assert.equal(excerpt('Short text'), 'Short text');
  const long = 'A'.repeat(350);
  assert.equal(excerpt(long).length, 291);
});
test('only offers navigable HTTP(S) source links', () => {
  assert.equal(sourceHref('https://example.com/archive'), 'https://example.com/archive');
  assert.equal(sourceHref('javascript:alert(1)'), undefined);
  assert.equal(sourceHref('not a url'), undefined);
  assert.equal(sourceHref(undefined), undefined);
});
