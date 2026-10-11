// Run: node tests/session/serve.mjs, then open http://127.0.0.1:5174.
// Bundles the actual app with isolated auth and collection fixtures. The
// substitutions exist only in this test build, never in the Vite app build.
import { build } from 'esbuild';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const client = fileURLToPath(new URL('../../', import.meta.url));
const fakeFirebase = resolve(client, 'tests/session/firebase.js');
const realFirebaseAuth = resolve(client, 'node_modules/firebase/auth/dist/esm/index.esm.js');
const bundle = await build({
  absWorkingDir: client,
  entryPoints: ['tests/session/check.jsx'],
  bundle: true,
  write: false,
  format: 'esm',
  jsx: 'automatic',
  outfile: 'check.js',
  loader: { '.css': 'empty' },
  define: { 'process.env.NODE_ENV': '"development"', 'import.meta.env': '{}' },
  plugins: [{ name: 'isolated-session-fixtures', setup(builder) {
    // Match Vite's browser externalization of this unused Node-only import.
    builder.onResolve({ filter: /^crypto$/ }, () => ({ path: 'crypto', namespace: 'browser-external' }));
    builder.onLoad({ filter: /.*/, namespace: 'browser-external' }, () => ({ contents: 'export default {};' }));
    builder.onResolve({ filter: /^firebase\/auth$/ }, () => ({ path: 'firebase-auth-fixture', namespace: 'session-test' }));
    builder.onLoad({ filter: /.*/, namespace: 'session-test' }, () => ({
      contents: `export * from ${JSON.stringify(realFirebaseAuth)};
        export function onAuthStateChanged(auth, next, error) { return auth.subscribe(next, error); }
        export function signOut(auth) { return auth.signOut(); }`,
      resolveDir: client,
    }));
    builder.onLoad({ filter: /\/src\/firebase\.js$/ }, () => ({ contents: `export * from ${JSON.stringify(fakeFirebase)};`, resolveDir: client }));
    builder.onLoad({ filter: /\/pages\/authenticated\/authenticated\.jsx$/ }, () => ({
      contents: 'export default function Collection() { return "Member collection fixture"; }',
    }));
  } }],
});
const html = '<!doctype html><html><head><title>Session regression checks</title></head><body><h1 id="summary">Running session checks…</h1><ul id="results"></ul><div id="fixture"></div><script type="module" src="/check.js"></script></body></html>';
createServer((request, response) => {
  response.setHeader('Content-Type', request.url === '/check.js' ? 'text/javascript' : 'text/html');
  response.end(request.url === '/check.js' ? bundle.outputFiles[0].text : html);
}).listen(5174, '127.0.0.1', () => console.log('Session checks: http://127.0.0.1:5174'));
