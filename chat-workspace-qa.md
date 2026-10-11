# Spacious conversation workspace — October 11, 2026

Implemented in `client/src/components/chat-interface/ChatWorkspace.jsx` and `workspace.css`.

## Design and behavior

- Replace the stacked navigation and character masthead with a compact header and collapsible character sidebar.
- At a 1280×900 viewport, the composer is 972px wide (previous CSS maximum: 730px), increasing to 1120px when navigation is hidden. The default composer is 145px tall.
- Give the message stream the remaining viewport height. Keep writing controls visible while the conversation scrolls independently.
- Retain the transparent logo, historical portraits, original painted writing-room artwork, warm paper, green accents, and blue actions.
- Keep Conversation, Explore history, all available chapters, historical sources, previous conversations, profile settings, and sign out accessible.
- Use mobile view tabs and a labelled navigation drawer. Preserve focus trapping, Escape dismissal, and focus return.
- Preserve drafts across view changes, maintain reading position when returning from history, and add a shortcut to the latest messages.
- Retain formatted replies and follow-up prompts. Restore visible list markers that the base CSS reset suppressed.
- Expand long introductions on request so the complete text remains available.

The Firebase adapter, chat endpoint, message persistence, authentication, and figure selection components were not modified in this iteration.

## Validation

Browser review used the actual production presentation component with explicit development fixtures at `/design/conversation-preview.html`. The preview does not call the chat service, write to Firebase, or bypass authentication, and it is not a production build entry. A `long-thread` fixture was added for scroll checks.

Verified in Chrome:

- Desktop 1280×900, short desktop 1024×640, tablet 768×1024, phone 390×844, and narrow phone 320×640. No horizontal document overflow; composer remains inside the viewport.
- Suggested questions populate and focus the composer; a submitted fixture message appears in the thread.
- Shift+Enter inserts a newline; Enter submits. A failed send restores the draft and displays the error with retry available.
- Loading, pending reply, and load error states render and disable unavailable writing controls.
- Draft survives a trip to history and back. All ten available chapters render their corresponding content.
- Mobile timeline moment selection and its ask-about-this action return the selected topic to the composer.
- A long conversation begins at the latest exchange. Scrolling to the start, entering history, and returning restores the start position. Latest messages returns to the bottom (within 1px).
- Recent conversations retains collection links, the current conversation, other conversations, profile settings, and sign out. Tab/Shift+Tab loop within the drawer; Escape returns focus to its trigger.
- Mobile character navigation opens, selects history, and closes correctly. Short desktop chapter navigation remains scrollable, with a separate chapter selector always available.
- Focus mode hides the sidebar and widens the message stream and composer.
- Final fresh-tab check: no console errors and no failed images.

Production build (including SSR and public-route prerender), focused ESLint, and whitespace checks pass. The existing `unique-username-generator` browser `crypto` externalization warning remains.

## Evidence

Local screenshots in `client/design/screenshots/`:

- `chat-room-desktop.png`
- `chat-room-mobile.png`
- `chat-room-thread.png`
- `chat-room-tablet.png`
- `chat-room-focus.png`
- `chat-room-history.png`

## Limits

Live authenticated character loading, saved conversation reads/writes, actual AI replies, and sign out were not exercised. No Firebase configuration or authenticated local test session is available. This is verified UI behavior and a passing production build, not a live service end-to-end certification. No deployment was performed.
