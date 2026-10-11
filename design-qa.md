# Design QA — inner pages and history tabs

Source visual truth: the approved homepage and the user's instruction to carry its style across the other pages. This is a style extension with page-specific content and compositions, rather than a pixel clone of the homepage.

Source captures:
- `client/design/screenshots/pages-source-home-desktop.png` — 1280 × 3341 pixels; CSS viewport 1280 × 900; DPR 1.
- `client/design/screenshots/pages-source-home-mobile.png` — 390 × 5090 pixels; CSS viewport 390 × 844; DPR 1.

Implementation captures:
- `client/design/screenshots/pages-about-desktop.png` — 1280 × 2337 pixels.
- `client/design/screenshots/pages-partners-desktop.png` — 1280 × 2281 pixels.
- `client/design/screenshots/pages-login-mobile.png` — 390 × 1247 pixels.
- `client/design/screenshots/pages-profile-mobile.png` — 390 × 1960 pixels.
- `client/design/screenshots/pages-workspace-mobile.png` — 390 × 1294 pixels.
- Additional full-page desktop/mobile captures cover Features, Partners, Our Figures, Articles, Login, Signup, Feedback, Privacy, Terms, Sitemap, 404, figure requests, submission receipt, profile, directory cards, and administration.

States: public visitor with Firebase configuration absent; graceful unavailable states for live data and account access. Protected UI was reviewed through a development-only component fixture containing clearly labelled example data. Production route guards were not bypassed.

## Comparison evidence

- Full-view comparison: `client/design/screenshots/pages-style-comparison.png`, homepage left and About right. Both 1280-pixel source captures were cropped to their first 1500 pixels and reduced uniformly to 640 × 750 for a 1280 × 750 composite.
- Focused comparison: `client/design/screenshots/pages-focused-comparison.png`, homepage above About, each at original 1280-pixel width with a 600-pixel header/hero crop. This makes the logo, navigation, heading typography, body text, imagery, and image captions readable.
- Mobile comparison: `client/design/screenshots/pages-mobile-comparison.png`, homepage, About, Login, and Profile in order. All remain at their original 390-pixel width. Crops extend to 1400 pixels; the shorter login capture is padded with the paper background rather than stretched.
- Page overview: `client/design/screenshots/pages-desktop-overview.png`.
- Final review preview: `client/design/screenshots/pages-final-preview.png`.
- Artwork review: `client/design/screenshots/inner-art-all-twelve.png`.

## Findings and fixes

1. [P0, resolved] Missing Firebase configuration caused public routes to render blank. Firebase now initializes only with configuration; the auth observer handles absence without granting access. Articles and figures show explicit unavailable states, and account submit controls are disabled. All six protected route patterns redirected to login in the browser.
2. [P1, resolved] Initial inner-page art reused homepage assets. After the user's correction, generated twelve original page-specific images with the built-in image_gen tool, inspected every image, saved WebP assets inside the project, and replaced all homepage-art references outside the homepage. Public portrait identities remain the original figure images.
3. [P2, resolved] Fixed-height hero crops concealed parts of the new compositions. Hero images now retain a 3:2 ratio; the figure collection painting also retains its full composition.
4. [P2, resolved] Hiding the mobile authentication heading's line break joined adjacent words; small white text also crossed a bright portion of the painting. Added explicit word spacing and a darker mobile image overlay. Recaptured Login and Signup and inspected the revised comparison.
5. [P2, resolved] Ideas tabs lacked arrow-key navigation. Added Left/Right/Home/End navigation and a single selected tab stop. Browser verification confirmed ArrowRight selects and focuses the next idea.
6. [P3, resolved] React 18 warned about the hero image fetchPriority prop. Removed it and checked a fresh browser session with no console errors.

## Required fidelity surfaces

- Fonts/typography: Libre Caslon Display for headings and Inter for UI/body, matching the homepage. Light serif display weights, comfortable paragraph leading, and readable responsive wrapping. The profile's hierarchy and authentication headings were inspected at full size.
- Spacing/layout: warm, spacious editorial grids, 5–6px radii, thin rules, restrained elevation, and generous breathing room. Page-specific split heroes replace the homepage's full-bleed hero intentionally. Desktop, mobile, and 320px checks found no document overflow.
- Colors/tokens: paper #f8f6f1, light paper #fcfaf6, ink #191a18, muted text #5f6370, and blue #214f78. Blue identifies actions and selected states. Mobile text over artwork received additional contrast treatment.
- Images/assets: twelve original high-quality paintings, optimized to at most 1440px wide at WebP quality 88; original PNGs retained. No CSS/SVG artwork substitutes. The provided transparent logo is preserved and darkened only for contrast on paper. Illustrative artwork is labelled separately from historical sources.
- Copy/content: pages describe historical AI conversations, timelines, documents, ideas, learning, and figure discovery. Simplified navigation and form wording, removed a nonfunctional password-reset link, and avoided presenting database failures as empty collections. A text comparison confirmed all eleven Privacy sections and sixteen Terms sections are unchanged.
- Icons/accessibility: existing Lucide icons retained; labelled inputs, visible focus indicators, mobile menu Escape/focus return, selected states, and reduced-motion handling preserved or improved.

## Browser checks

- Twelve public screens reviewed at 1280 × 900 and 390 × 844, DPR 1.
- About, Login, Signup, Our Figures, and Privacy checked at 320 × 740 without overflow.
- Requests, receipt, profile, directory cards, and administration reviewed with component fixtures at desktop/mobile widths.
- All ten history workspace tabs rendered; timeline Next, document question action, idea selection, and keyboard idea navigation worked.
- Mobile menu opens, closes with Escape and returns focus, and closes after navigation.
- Password Show/Hide worked. Profile input validation and Cancel worked without submitting changes.
- Legal contents links jump to visible sections; article fallback links return to the reading room.
- Six protected route patterns redirect unauthenticated visitors to login.
- Console checked after the fixes: no errors.
- Production build and focused ESLint checks passed. The pre-existing username-generator crypto externalization warning remains.

## Limits and accepted differences

No live Firebase credentials or authenticated session were available. Live sign-in, article/figure loading, profile saving, backend submissions, and chat replies were not exercised. Their existing services and route permissions remain in place. Component fixtures are excluded from the production build. The administration page retains its existing demonstration data and labels it accordingly.

The new page-specific art and split compositions intentionally extend the homepage's visual language without repeating its landscape and archival imagery. This follows the user's latest direction.

## Implementation checklist

- [x] Shared navigation, original tabs, transparent logo, footer, forms, legal layouts, and utility screens redesigned.
- [x] Collection, profile, figure requests, receipt, administration, and history tabs styled consistently.
- [x] Twelve original images generated, inspected, integrated, and optimized.
- [x] Prompts and asset paths saved in `client/design/inner-page-art-prompts.md`.
- [x] Responsive evidence and interaction checks complete for the available states.
- [x] No remaining actionable P0/P1/P2 visual findings.

final result: passed
