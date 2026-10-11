# Interactive history redesign — October 11, 2026

## Implemented

- A continuous horizontal timeline with dated markers, a selected-event panel, previous/next controls, keyboard navigation (arrows, Home, End), event search, and a range scrubber. Event spacing is explicitly labelled as adjusted for readability, not a proportional time scale.
- Chronological ordering handles ISO dates, written month dates, approximate years, year ranges, BCE and signed years. Undated events follow dated events; ties retain record order. The first chronological event is selected initially.
- A consistent chapter layout with a compact illustrated header, readable excerpts, expandable complete text, and contextual conversation actions.
- A biography overview with essential facts, full-record disclosures, and a chapter directory. Previous/next chapter controls provide a clear onward path.
- Selectable ideas and documents, relationship-type filters, side-by-side world/legacy comparisons, selectable interpretations, and searchable/filterable sources.
- Source links remain attached to records. Records without a usable online link are shown without a misleading link action.
- Chapter changes reset the reading area and focus the new heading. Mobile retains the visible Conversation tab and removes the duplicate back-to-conversation control.

Existing historical data, original portraits, transparent logo, generated artwork, and the chat adapter are retained. Short previews are excerpts of supplied text, not newly generated historical summaries. The development fixture now includes eight sample timeline events and multiple relationships, source types, and legacy perspectives to exercise the UI; these are not production historical records.

## Verification

- `npm run build`: passed, including SSR and public-route prerender. The existing `unique-username-generator` browser crypto externalization warning remains.
- Focused ESLint and `git diff --check`: passed.
- `node --test src/components/chat-interface/character-info/historyData.test.js`: 5 tests passed. Covers BCE ordering, written dates, ranges, stable ties and unknown dates, fallback timeline records, excerpt/content handling, and usable source URLs.
- Browser review at 1280×900, 768×1024, 390×844, and 320×640. All ten chapters were checked at the narrowest width with no horizontal document overflow.
- Timeline next/previous availability, End/Home navigation, range-keyboard changes, filtering to one event, empty-search recovery, expanded long text, and selected-event prompts verified.
- Context and legacy comparisons, relationship filtering, source search and recovery, idea selection/disclosure, biography details, chapter-directory navigation, and chapter-footer navigation verified.
- Timeline and interpretation prompts populate and focus the chat composer. A source's original href was checked without opening an external service.
- Browser console: no errors during the final review.

## Visual evidence

- `client/design/screenshots/history-timeline-desktop.png`
- `client/design/screenshots/history-timeline-mobile.png`
- `client/design/screenshots/history-timeline-tablet.png`
- `client/design/screenshots/history-overview-desktop.png`
- `client/design/screenshots/history-compare-desktop.png`

## Limits

UI checks used the production components with explicit development fixtures at `/design/conversation-preview.html`. Live authenticated data loading, AI replies, and Firebase persistence were not exercised. Authentication and the chat service were not changed. No deployment was performed.
