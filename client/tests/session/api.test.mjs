import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

// Test the production API helper with an isolated Firebase boundary and an
// Axios adapter. No credentials, Firebase project, or network calls are used.
const client = fileURLToPath(new URL('../../', import.meta.url));
const fixture = resolve(client, 'tests/session/firebase.js');
const bundled = await build({
  stdin: {
    contents: `export { postAuthenticated } from './src/authenticationFunctions/api.js';
      export { auth, resetSession, resolveSession } from './tests/session/firebase.js';
      export { default as axios } from 'axios';`,
    resolveDir: client,
  },
  bundle: true, write: false, format: 'esm', platform: 'node',
  define: { 'import.meta.env': '{}' },
  plugins: [{ name: 'test-boundaries', setup(builder) {
    builder.onResolve({ filter: /^axios$/ }, () => ({ path: pathToFileURL(resolve(client, 'node_modules/axios/index.js')).href, external: true }));
    builder.onLoad({ filter: /\/src\/firebase\.js$/ }, () => ({ contents: `export * from ${JSON.stringify(fixture)};`, resolveDir: client }));
  } }],
});
const { postAuthenticated, auth, resetSession, resolveSession, axios } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
let requests;
axios.defaults.adapter = async config => {
  requests.push(config);
  return { status: 200, data: { success: true }, headers: {}, config };
};
test.beforeEach(() => { requests = []; resetSession(); });

test('waits for restored auth, then sends the ID token to the application backend', async () => {
  const pending = postAuthenticated('/api/feedback', { title: 'Fixture' });
  await Promise.resolve();
  assert.equal(requests.length, 0);
  resolveSession({ getIdToken: async () => 'fixture-token' });
  await pending;
  assert.equal(requests[0].headers.get('Authorization'), 'Bearer fixture-token');
  assert.equal(requests[0].url, 'https://historia-backend-ycj7.onrender.com/api/feedback');
  assert.deepEqual(JSON.parse(requests[0].data), { title: 'Fixture' });
});
test('obtains a current token for every write instead of caching one', async () => {
  let number = 0;
  resolveSession({ getIdToken: async () => `fixture-${++number}` });
  for (const path of ['/api/create/user', '/api/create-new-bot', '/api/chat/fixture/figure/name']) await postAuthenticated(path, {});
  assert.deepEqual(requests.map(request => request.headers.get('Authorization')), ['Bearer fixture-1', 'Bearer fixture-2', 'Bearer fixture-3']);
});
test('signed-out sessions cannot send an API write', async () => {
  resolveSession(null);
  await assert.rejects(postAuthenticated('/api/feedback', {}), /log in/);
  assert.equal(requests.length, 0);
});
test('token refresh failure prevents a write and reaches the caller', async () => {
  resolveSession({ getIdToken: async () => { throw new Error('Fixture refresh failed'); } });
  await assert.rejects(postAuthenticated('/api/feedback', {}), /refresh failed/);
  assert.equal(requests.length, 0);
});
test('rejects external URLs before requesting a token', async () => {
  let called = false;
  resolveSession({ getIdToken: async () => { called = true; return 'fixture'; } });
  await assert.rejects(postAuthenticated('https://example.invalid/api/feedback', {}), /relative API path/);
  assert.equal(called, false);
  assert.equal(requests.length, 0);
  assert.ok(auth.currentUser);
});
