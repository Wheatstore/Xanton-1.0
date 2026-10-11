// Test-only Firebase boundary. Never imported by production code.
const listeners = new Set();
let ready;
let markReady;
export const auth = {
  currentUser: null,
  authStateReady() { return ready; },
  subscribe(next, error) {
    const listener = { next, error };
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  signOut() {
    return new Promise(resolve => setTimeout(() => { resolveSession(null); resolve(); }, 30));
  },
};
export const db = null;
export const app = null;
export const analytics = null;
export function resetSession() {
  auth.currentUser = null;
  ready = new Promise(resolve => { markReady = resolve; });
}
export function resolveSession(user) {
  auth.currentUser = user;
  markReady();
  for (const listener of listeners) listener.next(user);
}
export function rejectSession() {
  for (const listener of listeners) listener.error(new Error('Fixture session error'));
}
export function listenerCount() { return listeners.size; }
