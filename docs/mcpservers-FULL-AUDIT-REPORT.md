# Technical SEO Audit — mcpservers-dev.pages.dev
**Date:** 2026-04-06
**Auditor:** FF-09 SEO Auditor
**Goal:** 100% technical readiness before domain purchase and SEO promotion
**Engine:** Astro v5.18.1 / Cloudflare Pages

---

## Overall Score: 61/100 — Needs Improvement

| Category | Score | Weight | Weighted |
|---|---|---|---|
| Crawlability & Indexability | 55/100 | 25% | 13.75 |
| On-Page SEO | 72/100 | 15% | 10.80 |
| Schema / Structured Data | 52/100 | 15% | 7.80 |
| Open Graph / Social Meta | 60/100 | 10% | 6.00 |
| Security Headers | 45/100 | 10% | 4.50 |
| AI Search Readiness (llms.txt) | 65/100 | 10% | 6.50 |
| Internal Linking | 55/100 | 10% | 5.50 |
| Performance / CWV | N/A — API rate-limited | 5% | — |
| **TOTAL** | | | **54.85 / ~100** |

> PageSpeed API was rate-limited during this audit. CWV score excluded. Confidence: MEDIUM for this category only.

---

## BLOCKERS BEFORE DOMAIN PURCHASE

These issues MUST be resolved before buying mcpservers.dev and starting SEO promotion:

| # | Blocker | Severity |
|---|---|---|
| B1 | Canonical tags point to mcpservers.dev — a domain you do not own (it currently redirects to /lander) | CRITICAL |
| B2 | robots.txt Sitemap directive points to mcpservers.dev/sitemap-index.xml — returns JS redirect, not XML | CRITICAL |
| B3 | sitemap-0.xml lists 45 URLs on mcpservers.dev domain — Google will try to index that domain, not pages.dev | CRITICAL |
| B4 | FAQPage schema on article pages is restricted to gov/health since Aug 2023 — must be removed | HIGH |
| B5 | Article schema missing `image` field — ineligible for Article rich results in Google Search | HIGH |
| B6 | og:image missing on homepage — every social share appears without preview image | HIGH |

**Verdict on domain purchase timing:**
- If mcpservers.dev is purchased and DNS is pointed to Cloudflare Pages FIRST, issues B1-B3 resolve themselves (canonicals will self-reference the real domain, sitemap will point to real domain).
- Buy the domain, configure DNS, THEN launch SEO promotion. Do NOT promote the pages.dev URL.

---

## DETAILED FINDINGS

### 1. Crawlability & Indexability

#### 1.1 robots.txt — PASS with warnings
```
User-agent: *
Allow: /
User-agent: GPTBot
Allow: /
...
Sitemap: https://mcpservers.dev/sitemap-index.xml
```

| Check | Status | Confidence |
|---|---|---|
| robots.txt HTTP 200 | PASS | HIGH |
| All crawlers allowed | PASS | HIGH |
| GPTBot explicitly allowed | PASS | HIGH |
| ClaudeBot explicitly allowed | PASS | HIGH |
| PerplexityBot explicitly allowed | PASS | HIGH |
| Google-Extended explicitly allowed | PASS | HIGH |
| anthropic-ai explicitly allowed | PASS | HIGH |
| Amazonbot explicitly allowed | PASS | HIGH |
| Sitemap URL resolves to valid XML | FAIL — returns JS redirect | HIGH |
| Applebot-Extended managed | WARN — inherits * | HIGH |
| Bytespider managed | WARN — inherits * | HIGH |
| CCBot managed | WARN — inherits * | HIGH |
| FacebookBot managed | WARN — inherits * | HIGH |

#### 1.2 Sitemap
- `sitemap-index.xml` on pages.dev: HTTP 200, valid XML, points to `mcpservers.dev/sitemap-0.xml`
- `sitemap-0.xml` on pages.dev: HTTP 200, valid XML, 45 URLs — all on mcpservers.dev domain
- `sitemap.xml` at root: HTTP 200 but returns HTML (homepage) — not a valid sitemap

| Check | Status | Confidence |
|---|---|---|
| sitemap-index.xml accessible | PASS | HIGH |
| sitemap-0.xml valid XML | PASS | HIGH |
| 45 URLs present | PASS | HIGH |
| URLs use correct serving domain | FAIL — mcpservers.dev | HIGH |
| lastmod present | FAIL | HIGH |
| priority / changefreq | FAIL | INFO |
| robots.txt Sitemap resolves | FAIL | HIGH |

#### 1.3 Canonical Tags — CRITICAL ISSUE
All pages set canonical to `https://mcpservers.dev/...` (domain not yet owned by you).

Evidence:
- Homepage canonical: `https://mcpservers.dev/`
- Article canonical: `https://mcpservers.dev/blog/what-is-mcp-server/`
- About canonical: `https://mcpservers.dev/about/`
- Topic canonical: `https://mcpservers.dev/topics/ai-agents/`

mcpservers.dev currently serves a JavaScript redirect (`window.location.href="/lander"`) — it is not your site. Google receives conflicting signals: pages.dev serves the content, but the canonical says mcpservers.dev is authoritative.

**Fix:** Purchase mcpservers.dev and configure Cloudflare Pages to serve it. Canonicals will then correctly self-reference.

---

### 2. On-Page SEO

#### 2.1 Title Tags

| Page | Title | Length | Status |
|---|---|---|---|
| Homepage | Home \| MCPServers.dev | 21 | WARN — no keyword in title |
| what-is-mcp-server | What is an MCP Server? The Complete Guide \| MCPServers.dev | 58 | PASS |
| getting-started-mcp-protocol | Getting Started with MCP Protocol in 2026 \| MCPServers.dev | 58 | PASS |
| mcp-security-best-practices | MCP Server Security Best Practices \| MCPServers.dev | 51 | PASS |
| about | About \| MCPServers.dev | 22 | WARN — generic |
| editorial-process | Editorial Process \| MCPServers.dev | 35 | WARN |
| topics/ai-agents | ai-agents — MCPServers.dev \| MCPServers.dev | 43 | FAIL — raw slug + duplicate site name |

#### 2.2 Meta Descriptions

| Page | Description | Length | Status |
|---|---|---|---|
| Homepage | Everything about MCP protocol, servers, and ecosystem | 53 | WARN — short, generic |
| what-is-mcp-server | Learn what MCP servers are... | 138 | PASS |
| about | About MCPServers.dev | 20 | FAIL — no value proposition |
| editorial-process | How MCPServers.dev creates content | 35 | WARN — thin |
| topics/ai-agents | Articles about ai-agents | 24 | FAIL — template placeholder |

#### 2.3 H1 Tags
- Article pages: single keyword-matched H1 — PASS
- Homepage: H1 = "MCPServers.dev" (brand only, no target keyword) — WARN
- Topic pages: H1 present, not keyword-optimized — WARN

#### 2.4 Content Volume
- Articles: ~1,500 words measured — PASS
- Homepage: ~382 words — WARN (thin for a competitive niche)
- No images on any page (zero `<img>` tags) — all text-only content

---

### 3. Schema / Structured Data

#### 3.1 Homepage
Finding: No schema markup on homepage.
Missing: WebSite (with SearchAction), Organization.

#### 3.2 Article Pages — 3 schema blocks found

**Article schema:**

| Field | Value | Status |
|---|---|---|
| @type | Article | PASS (use BlogPosting for blog) |
| headline | Present | PASS |
| description | Present | PASS |
| datePublished | 2026-03-30T00:00:00.000Z | PASS |
| dateModified | Same as published | WARN — should update on revisions |
| url | mcpservers.dev URL | WARN |
| image | MISSING | FAIL — required for rich results |
| author | Organization | WARN — Person preferred for E-E-A-T |
| publisher | Present, no logo | WARN — logo field missing |

**FAQPage schema — must be removed:**
FAQPage schema is restricted to government and healthcare authority sites since August 2023.
Commercial tech blogs cannot receive FAQ rich results. Keeping this schema risks a manual action or wasted crawl budget on invalid markup.

**WebPage/Speakable schema:**
Present — acceptable, informational.

#### 3.3 About / Editorial-Process
No schema on either page. About should carry Organization schema.

#### 3.4 Topic Pages
No schema. CollectionPage or ItemList would be appropriate.

#### 3.5 Missing: BreadcrumbList
No breadcrumb navigation or BreadcrumbList schema anywhere on the site. Important for site structure signals and sitelinks.

---

### 4. Open Graph / Social Meta

| Tag | Homepage | Articles | Status |
|---|---|---|---|
| og:title | Present | Present | PASS |
| og:description | Present | Present | PASS |
| og:type | website | article | PASS |
| og:url | mcpservers.dev (unowned) | mcpservers.dev | WARN |
| og:image | MISSING | Present | FAIL on homepage |
| og:site_name | Missing | Missing | INFO |
| og:locale | Missing | Missing | INFO |
| twitter:card | summary | summary | WARN — use summary_large_image |
| twitter:image | Missing | Missing | INFO |
| twitter:site | Missing | Missing | INFO |

Article og:image points to `https://mcpservers.dev/og/{slug}.png`. That domain returns HTTP 405 for direct image requests (not your server). The images ARE served on `mcpservers-dev.pages.dev/og/{slug}.png`. Social crawlers using the og:image URL from the article HTML will fail to load the image.

---

### 5. Security Headers

| Header | Status |
|---|---|
| HTTPS (Cloudflare TLS) | PASS |
| X-Content-Type-Options: nosniff | PASS |
| Referrer-Policy: strict-origin-when-cross-origin | PASS |
| Strict-Transport-Security (HSTS) | FAIL — not configured |
| Content-Security-Policy | FAIL — not configured |
| X-Frame-Options | FAIL — not configured |
| Permissions-Policy | FAIL — not configured |

Security score: 45/100. These headers are set via a `_headers` file in Cloudflare Pages root. Not set = default CF behavior (no HSTS, no CSP).

---

### 6. AI Search Readiness

#### 6.1 llms.txt
- HTTP 200, found — PASS
- Sections: About, Topics, Editorial Process, Contact — reasonable structure
- Missing: description (> blockquote format required by spec)
- Missing: links to articles — AI crawlers cannot discover content from this file
- Quality score: 45/100

#### 6.2 llms-full.txt
- HTTP 200 but serves HTML (redirects to homepage) — FAIL
- Should serve a full plain-text content dump for AI indexing

#### 6.3 AI Crawler robots.txt Management
- Explicitly allowed: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, anthropic-ai, Amazonbot — PASS
- Not explicitly managed: Applebot-Extended, Bytespider, CCBot, FacebookBot — WARN (currently inherit Allow: / from * rule, but no explicit intent declared)

---

### 7. Internal Linking

| Metric | Value | Status |
|---|---|---|
| Pages discovered | 45 | PASS |
| Total internal links | 155 | PASS |
| Avg links per page | 9.7 | PASS |
| Min links per page | 3 | PASS |
| Orphan pages (1 incoming link) | 23 | WARN |

All 23 orphan pages are topic/tag pages. Each receives only 1 incoming link (from the single article tagged with it). Topic pages need cross-linking between related topics and from the homepage navigation.

---

### 8. Broken Links

- 17 links checked, 0 broken — PASS
- 14 redirected: expected behavior (HTTP→HTTPS, trailing slash normalization on CF Pages)
- External links (flipfactory.it.com): 200 OK

---

### 9. HTTPS & Redirects

- Single hop, HTTP 200 in 85ms — PASS
- No redirect chains — PASS
- HTTPS via Cloudflare (auto TLS) — PASS
- cache-control: public, max-age=0, must-revalidate — WARN (no browser-side caching for static assets)

---

### 10. Core Web Vitals

Status: ENVIRONMENT LIMITATION — PageSpeed Insights API rate-limited during audit.

Inferred from site characteristics:
- Astro static HTML: no client-side JS rendering overhead
- Cloudflare Pages: global edge CDN
- No hero images: no LCP image paint risk
- gzip enabled: confirmed in headers

Run separately: `python3 .claude/skills/seo/scripts/pagespeed.py https://mcpservers-dev.pages.dev --strategy mobile`

---

## Appendix — Pages Audited

- https://mcpservers-dev.pages.dev/ (homepage)
- https://mcpservers-dev.pages.dev/blog/what-is-mcp-server
- https://mcpservers-dev.pages.dev/blog/getting-started-mcp-protocol
- https://mcpservers-dev.pages.dev/blog/mcp-security-best-practices
- https://mcpservers-dev.pages.dev/about
- https://mcpservers-dev.pages.dev/editorial-process
- https://mcpservers-dev.pages.dev/topics/ai-agents
- Sitemap: 45 URLs total
