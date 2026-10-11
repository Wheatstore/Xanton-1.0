/* eslint-disable react-refresh/only-export-components */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../../src/App';
import Navbar from '../../src/components/navbar/navbar';
import { userSignOut } from '../../src/authenticationFunctions/signout';
import { resetSession, resolveSession, rejectSession, listenerCount } from './firebase';

// Run the real router, auth hook, navigation, and sign-out helper against a
// controllable SDK boundary. No Firebase account or backend requests are used.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const host = document.getElementById('fixture');
const report = document.getElementById('results');
const member = { uid: 'fixture-member', displayName: 'Returning reader' };
let root;
function assert(condition, message) { if (!condition) throw new Error(message); }
function text() { return host.textContent; }
async function mount(path, navigationOnly = false) {
  if (root) await act(async () => root.unmount());
  assert(listenerCount() === 0, 'Auth listeners should be cleaned up');
  resetSession();
  window.history.replaceState({}, '', path);
  root = createRoot(host);
  await act(async () => root.render(navigationOnly
    ? <MemoryRouter><Navbar /></MemoryRouter>
    : <HelmetProvider><App /></HelmetProvider>));
}
async function settle(callback) {
  await act(async () => { callback(); });
}
async function check(name, test) {
  const row = document.createElement('li');
  try { await test(); row.textContent = `PASS — ${name}`; }
  catch (error) { row.textContent = `FAIL — ${name}: ${error.message}`; }
  report.append(row);
}
await check('Homepage waits for delayed persisted session, then opens collection', async () => {
  await mount('/');
  assert(text().includes('Preparing your session'), 'Expected session loading view');
  assert(!text().includes('Log in'), 'Must not show logged-out homepage before auth resolves');
  await settle(() => resolveSession(member));
  assert(window.location.pathname === '/user', 'Expected automatic redirect to /user');
  // MemberRoutes mounts a fresh observer; Firebase emits its current user to it.
  await settle(() => resolveSession(member));
  assert(text().includes('Member collection fixture'), 'Expected protected collection');
});
await check('Signed-out homepage still renders the public design', async () => {
  await mount('/');
  await settle(() => resolveSession(null));
  assert(window.location.pathname === '/', 'Signed-out visitors should stay on homepage');
  assert(host.querySelector('.landing-page-container'), 'Expected public homepage');
  assert(text().includes('Log in'), 'Expected login control');
});
await check('Login URL restores an existing session without credential entry', async () => {
  await mount('/login');
  assert(!host.querySelector('input[type="password"]'), 'Login form should wait for auth');
  await settle(() => resolveSession(member));
  assert(window.location.pathname === '/user', 'Expected existing member redirect');
});
await check('Signed-out visitors can still open the login form', async () => {
  await mount('/login');
  await settle(() => resolveSession(null));
  assert(host.querySelector('input[type="password"]'), 'Expected login form');
});
await check('Protected routes wait for auth before redirecting signed-out visitors', async () => {
  await mount('/user');
  assert(window.location.pathname === '/user', 'Must wait before redirecting');
  await settle(() => resolveSession(null));
  assert(window.location.pathname === '/login', 'Expected login redirect');
});
await check('Public navigation waits, then updates on login and sign-out', async () => {
  await mount('/about', true);
  assert(!host.querySelector('a[href="/login"]'), 'No guest controls while restoring session');
  await settle(() => resolveSession(member));
  assert(text().includes('Returning reader'), 'Expected account menu');
  let completion;
  await act(async () => {
    completion = userSignOut();
    assert(completion && typeof completion.then === 'function', 'Sign-out helper must return Firebase promise');
    assert(text().includes('Returning reader'), 'Account remains until sign-out completes');
    await completion;
  });
  assert(host.querySelector('a[href="/login"]'), 'Expected guest navigation after sign-out');
});
await check('Session errors do not leave homepage loading forever', async () => {
  await mount('/');
  await settle(rejectSession);
  assert(host.querySelector('.landing-page-container'), 'Expected usable public page');
});
await act(async () => root.unmount());
assert(listenerCount() === 0, 'All observers cleaned up');
const failures = [...report.children].filter(row => row.textContent.startsWith('FAIL'));
document.getElementById('summary').textContent = `${report.children.length - failures.length}/${report.children.length} checks passed`;
