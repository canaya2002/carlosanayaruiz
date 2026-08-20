# IndexNow — operational runbook

> **Note on `public/llms.txt`.** That file was added at the same time as this
> runbook, so record the reasoning here rather than inside the file itself:
> `llms.txt` is **not** a Google ranking mechanism. Google has not announced
> support for it, no search engine has committed to reading it, and it should
> never be described to a client as an optimisation. It is included because it
> costs almost nothing to maintain, it gives retrieval crawlers and LLM agents
> one canonical, machine-readable statement of the entity facts (name, role,
> location, credentials, service URLs, contact), and it reduces the chance that
> an AI answer about Carlos is assembled from stale third-party profiles. Treat
> it as entity hygiene, in the same category as a consistent NAP — not as a
> ranking lever. Its facts must stay in sync with `lib/constants.ts` (NAP,
> ROUTES) and `data/*.ts`; if they drift, `llms.txt` becomes a liability rather
> than an asset.

---

## What IndexNow is, and is not

IndexNow is a push protocol: instead of waiting for a crawler to rediscover a
changed URL, you notify the participating engines that it changed.

**Participating engines:** Bing (and therefore Microsoft Copilot, which answers
from the Bing index), Yandex, Seznam, Naver, Yep. A submission to one
participating endpoint is shared with the others.

**Google does not participate.** Nothing in this document affects Google.
For Google, the levers remain: `sitemap.xml`, internal linking, and the URL
Inspection tool in Search Console for one-off urgent requests.

IndexNow is a *discovery* accelerator, not a ranking or indexing guarantee. A
submitted URL still has to earn indexation on its own merits.

---

## One-time setup: the key file

### 1. Get a key

Two acceptable sources:

- **Bing Webmaster Tools** (preferred, because it also lets you see submission
  history): <https://www.bing.com/webmasters> → **Settings** → **API access** →
  **IndexNow** → generate a key.
- **Self-generated.** The spec only requires 8–128 characters of `a–z`, `A–Z`,
  `0–9`, and `-`. A UUID v4 with the hyphens kept is fine.

> **No key is committed to this repo, and none should be.** It is not a secret
> (it is served publicly at a well-known URL), but hard-coding it means the
> repo, not the Webmaster Tools account, becomes the source of truth — and
> rotating it later becomes a code change. Keep it in the password manager and
> in `INDEXNOW_KEY` in the Vercel project environment variables.

### 2. Host the key file

Create a file in `public/` named `<key>.txt`, whose **only content is the key
itself**, no trailing text:

```
public/<YOUR_INDEXNOW_KEY>.txt
```

It is then served at:

```
https://carlosanayaruiz.com/<YOUR_INDEXNOW_KEY>.txt
```

### 3. Verify it before submitting anything

```bash
curl -sI https://carlosanayaruiz.com/<YOUR_INDEXNOW_KEY>.txt
# expect: HTTP/2 200, content-type: text/plain
curl -s  https://carlosanayaruiz.com/<YOUR_INDEXNOW_KEY>.txt
# expect: the key, and nothing else
```

If this returns a **307/308 redirect**, stop — the locale middleware is
rewriting it. It should not: `middleware.ts` excludes any path containing a dot,
which covers `*.txt`. If that exclusion is ever narrowed, the key file becomes
unreachable, every submission starts returning `403`, and the failure is silent
because nothing on the site depends on it. Re-run the two `curl`s above after
any change to the middleware matcher.

---

## Submitting

### Single URL (GET)

```bash
curl -s -o /dev/null -w '%{http_code}\n' \
  "https://api.indexnow.org/indexnow?url=https://carlosanayaruiz.com/es/seo-tecnico&key=<YOUR_INDEXNOW_KEY>"
```

### Batch (POST) — preferred for anything above one URL

Up to 10,000 URLs per request. All URLs must be on the same host as `host`.

```bash
curl -s -o /dev/null -w '%{http_code}\n' \
  -X POST 'https://api.indexnow.org/indexnow' \
  -H 'Content-Type: application/json; charset=utf-8' \
  -d '{
    "host": "carlosanayaruiz.com",
    "key": "<YOUR_INDEXNOW_KEY>",
    "keyLocation": "https://carlosanayaruiz.com/<YOUR_INDEXNOW_KEY>.txt",
    "urlList": [
      "https://carlosanayaruiz.com/es/seo-tecnico",
      "https://carlosanayaruiz.com/en/technical-seo"
    ]
  }'
```

`keyLocation` is optional when the key file sits at the domain root under its
own name, but send it anyway — it makes a `403` unambiguous to debug.

### Response codes

| Code | Meaning | Action |
|---|---|---|
| `200` | Accepted, key validated | Done. |
| `202` | Accepted, key validation pending | Usually fine. Re-check the key file resolves. |
| `400` | Malformed request | Bad JSON, or a URL that is not absolute. |
| `403` | Key not valid / not found at `keyLocation` | Run the two verification `curl`s above. |
| `422` | URL does not belong to `host`, or key mismatch | Check for a `www.` vs apex mismatch, or a locale-less URL. |
| `429` | Too many requests | You are pinging per deploy instead of per content change. Stop. |

---

## When to submit

Submit the **exact canonical URL**, always locale-prefixed, and always **both
language variants of the same page** — they are separate URLs.

| Event | Submit? | What |
|---|---|---|
| New page published | Yes | The `/es/...` and `/en/...` URLs, plus the pages whose internal links now point to it (the services hub, usually). |
| Meaningful content change | Yes | Both locale variants of the changed page. "Meaningful" = copy, headings, structured data, pricing, service scope. |
| Page deleted or 410'd | Yes | The dead URL itself. Pushing it gets it recrawled and dropped faster than waiting for the crawler to find the 404. |
| Slug renamed | Yes | Both the old URL (now redirecting) and the new one. |
| Redirect target changed | Yes | The source URL. |
| Typo fix, style tweak, dependency bump, refactor | **No** | Nothing changed that a search engine can perceive. |
| Every deploy, automatically | **No** | This is how a site earns `429`s and teaches the engine to distrust its signals. |

### Companion step

When content genuinely changed, bump `CONTENT_UPDATED` in `app/sitemap.ts` in
the same commit. IndexNow tells Bing *now*; `lastmod` tells every other crawler
*later*. Doing one without the other leaves the two signals contradicting each
other.

---

## Quick post-publish checklist

1. Deploy is live and the new URL returns `200` (not a redirect chain).
2. `CONTENT_UPDATED` bumped in `app/sitemap.ts`; `/sitemap.xml` shows the new
   date and lists the new URL.
3. Both locale variants carry reciprocal `hreflang` and a self-referencing
   canonical.
4. IndexNow POST sent for both variants; response code recorded.
5. Google side: request indexing for the `es` URL in Search Console, and let
   internal links and the sitemap carry the `en` one.
