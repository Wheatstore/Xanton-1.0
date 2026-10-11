# Authentication regression checks

The `f4c6099` redesign removed the existing root-route auth check and redirect to
`/user`. The redesigned landing navigation always displayed guest controls. This
made a persisted Firebase session appear lost on the homepage. Firebase's
persistence configuration itself was not changed.

`ReturningMemberRoute` now waits for the Firebase auth observer before rendering
`/` or `/login`, then redirects existing members to `/user`. The public landing
page remains independent of Firebase for prerendering. Shared navigation also
waits for auth before rendering guest controls. The sign-out helper returns its
promise so navigation waits for completion.

Separately, backend commit `a822bf39234610e15fcab25fb397056fe2678b24` added verified
Firebase identity to API mutations. Account creation, feedback, and figure
proposals now use `postAuthenticated`, which waits for auth restoration and gets
an ID token for each request. Account creation sends only profile fields instead
of serializing the Firebase User object. The concurrent chat token-header edit
was preserved.

Run from `client`:

```sh
node --test tests/session/api.test.mjs
node tests/session/serve.mjs
```

Open `http://127.0.0.1:5174` for the seven browser checks. The browser harness
bundles the real App router, auth hook, navbar and sign-out helper against a
controlled Firebase boundary. The collection is a placeholder so it cannot read
or write real account data. These substitutions exist only in this test build.

Verified on 2026-10-11:

- Seven browser session checks passed: delayed restoration, guest homepage,
  existing-session login redirect, guest login form, protected-route loading,
  navigation/sign-out, and observer error recovery.
- Five Node API checks passed: restoration wait, current token per request,
  signed-out rejection, token-refresh failure, and external-URL rejection.
- ESLint passed for changed JS/JSX files; production build and homepage
  prerendering passed.
- The live backend's OPTIONS response for the frontend origin returned 200 and
  allowed `authorization,content-type`. No real API mutation was submitted.

Limits: browser session checks use simulated SDK callbacks, not a live account
or actual IndexedDB persistence. No deployment was performed. The build retains
a pre-existing browser compatibility warning from `unique-username-generator`
importing Node `crypto`; full account registration was not verified here.
