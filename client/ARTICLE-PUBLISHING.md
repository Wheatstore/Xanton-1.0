# Automatic history publishing

The Reading Room includes repository-backed articles that load without Firebase. Existing Firebase articles remain available. The built-in articles and index are rendered to HTML at build time and included in the generated sitemap.

## Activate once

The implementation is local until committed and pushed. The GitHub workflow must be on the repository's default branch for its weekly schedule to run. It runs Tuesdays at 16:00 UTC (9 am Pacific daylight time / 8 am standard time), one queued topic per run. Ten topics are supplied. Five articles are already written (Caesar, Napoleon, Lincoln, Socrates, and Marie Curie); five topics remain in the queue. These are editorial hypotheses, not keyword-volume research.

In GitHub → Settings → Secrets and variables → Actions, configure:

| Type | Name | Value |
| --- | --- | --- |
| Secret | `OPENAI_API_KEY` | A server-side OpenAI API key with an appropriate project spending limit |
| Variable | `ARTICLE_MODEL` | A Responses API model supporting web search; choose according to your quality/cost requirements |
| Variable | `ARTICLE_FIREBASE_PROJECT_ID` | The site's Firebase project ID |
| Secret | `ARTICLE_FIREBASE_API_KEY` | The site's Firebase web API key; public read access to the bots collection must work from CI |
| Secret | `VERCEL_DEPLOY_HOOK` | A Vercel production deploy hook targeting the default branch |
| Variable | `ARTICLE_AUTOPUBLISH_ENABLED` | `true` to activate; `false` to pause |

Allow GitHub Actions to write repository contents. Branch protection may require a dedicated bot exemption; do not disable unrelated protections. Ensure the Vercel project uses `client` as its root and retains its existing production `VITE_FIREBASE_*` settings. The workflow build checks do not need those browser settings. Never put the OpenAI key in a `VITE_*` variable.

Run the workflow manually once and inspect its run and the deployed URL. A deploy-hook response only acknowledges the build request; confirm the production deployment succeeded. Submit `https://echoesofhistoryai.org/sitemap.xml` in Search Console. Track article impressions, search clicks, and signups over time; no traffic or indexing outcome is guaranteed.

## What happens each week

1. Pick the first unpublished title from `src/content/topics.json`; stop when the queue is exhausted.
2. Verify the exact figure name against the public bots collection. Adjust a queued name to match the live collection if needed.
3. Research with web search and draft a sourced explanation, timeline and three conversation questions.
4. Reject invalid metadata, duplicate slugs, broken source references, missing sections and URLs absent from the research results.
5. Run a separately prompted web-research fact check. A rejection stops the run without publishing.
6. Validate, build and inspect generated HTML. Only then commit the new content and trigger deployment.

Articles use text-only cards and headers; no per-article cover images are generated or stored. Each article discloses AI assistance. The second research pass can miss errors and is not human historical review. Check articles periodically and correct material issues. Failed runs appear in GitHub Actions; enable workflow-failure notifications. There is no unbounded retry loop. Each generation/review call is capped at eight tool calls and 10,000 output tokens; actual charges depend on the selected model and search usage.

## Add topics, correct or remove articles

Edit `src/content/topics.json` to add a question and an exact figure name. Avoid duplicates or cosmetic rewordings of existing topics. For corrections, edit the article in `src/content/articles.json`, rerun the checks below, and deploy. To remove a published article, remove its record and its queued topic before deploying, so the workflow does not regenerate it. Existing Firebase articles are separate and must be managed there.

Local checks (from `client`):

```sh
node scripts/publish-article.mjs --check
node --test scripts/article-validation.test.mjs
npm run build
node scripts/check-article-build.mjs
```

With the four generation environment variables set, `node scripts/publish-article.mjs` prepares one new article locally. It does not push or deploy. Review failed drafts through the workflow error rather than automatically loosening validation.

## Research and technical references

- [Google: useful, reliable content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [OpenAI: Responses web search and retrieved sources](https://developers.openai.com/api/docs/guides/tools-web-search)

The launch article links its historical sources directly. AI conversations are clearly labeled interpretations and point to a filtered figure collection, where the existing signup and conversation flow applies.
