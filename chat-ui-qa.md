# Character conversations and figure selection redesign

UI verification: passed. Live authenticated service verification: not completed.

The supplied screenshots and the earlier page design set the context. This is an intentional simplification, not a pixel-for-pixel copy of the old workspace.

## Changes

- Default to Conversation, with one readable message stream and a persistent composer.
- Keep all ten available historical chapters under Explore history. Chapters appear only when the record has content.
- Replace the competing research panel, activity dashboard, progress meter, duplicate exploration strips, and oversized portrait with a compact identity header and a single history surface.
- Use a focused drawer for recent conversations, profile settings, and sign out. Keyboard focus stays in the drawer; Escape closes it and returns to the trigger. Background regions are inert while it is open.
- Share the simpler portrait cards between public and member collection pages. Remove the older card's nonfunctional info button and repeated archive badges.
- Preserve search, category filtering, alphabetical sorting, historical sources, document interactions, timeline selection, biographies, portrayal framing, limitations, and context-to-conversation prompts.
- Support flat and structured profile records in collection search and card text.
- Preserve the existing authenticated message collection, service endpoint, and subscription mechanism. A failed send restores the draft and attempts to end its pending state rather than leaving a perpetual reply indicator.
- Add original built-in imagegen artwork, optimized as `client/public/images/chat-writing-room.webp`. Prompt and source provenance: `client/design/chat-art-prompt.md`.

## Verified

Production build (Vite, SSR build, homepage prerender and public-route metadata) passed. Focused ESLint across all changed JS/JSX files passed with zero warnings. `git diff --check` passed.

Browser checks used production UI components in `client/design/conversation-preview.html`, with explicit development fixtures. This preview is not included in the production build and does not bypass authentication, call the chat API, or write to Firebase.

- Desktop 1280×900, tablet 768×1024, mobile 390×844, and narrow mobile 320×640.
- No horizontal page overflow at the tested conversation sizes; composer remains within the viewport.
- Opening questions fill and focus the composer.
- Shift+Enter inserts a newline; Enter submits through the local fixture handler.
- Conversation draft persists when switching between the two primary views.
- Failed local send restores draft and displays an alert. Loading, pending-reply, and load-error states remain legible; unavailable composer is disabled.
- All ten historical chapter controls render their corresponding content.
- Timeline selection and next-moment navigation work. Mobile uses a compact moment picker.
- Ask-about-this returns to Conversation, fills the draft, and focuses the textarea.
- Source references retain their external link targets.
- Portrayal framing and limitations are available in an expandable disclosure.
- Conversation drawer focus loops forward/backward; Escape returns focus. Mobile icon has an explicit accessible label.
- Gallery search matches structured profile records; alphabetical sorting and zero-result recovery work.
- Final fresh-tab preview console check: no errors. Earlier development hot reload duplicated the preview root; the development entry now reuses its root during hot reload.

## Visual evidence

Screenshots are CSS-size full-page captures. Conversation captures are one screen tall; gallery captures include the entire page.

- `client/design/screenshots/chat-conversation-desktop.png`
- `client/design/screenshots/chat-conversation-mobile.png`
- `client/design/screenshots/chat-thread-desktop.png`
- `client/design/screenshots/chat-thread-tablet.png`
- `client/design/screenshots/chat-history-desktop.png`
- `client/design/screenshots/chat-history-mobile.png`
- `client/design/screenshots/chat-gallery-desktop.png`
- `client/design/screenshots/chat-gallery-mobile.png`
- `client/design/screenshots/chat-narrow-mobile.png`

Typography uses the app's Inter and Libre Caslon Display. Warm paper, restrained blue actions, botanical greens and terracotta accents continue the page aesthetic. Artwork is labelled illustrative. Real figure portraits and the transparent brand logo are retained. Desktop/mobile hierarchy, spacing, artwork crops, wrapping, and persistent controls were visually reviewed.

Resolved during review: empty conversations scrolling past their artwork; an unnamed mobile drawer button; excessive timeline navigation on small screens; no-op biography back button; development preview hot-reload root duplication.

## Remaining verification limits

No Firebase configuration or authenticated test session is available locally. Live character loading, existing saved messages, Firestore writes, conversation opening, account sign-out, and actual service replies have not been tested end-to-end. The existing `unique-username-generator` browser `crypto` externalization warning remains outside this redesign. No deployment was performed.
