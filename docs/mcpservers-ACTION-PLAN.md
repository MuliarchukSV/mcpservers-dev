# Action Plan — mcpservers-dev.pages.dev Technical SEO
**Generated:** 2026-04-06
**Priority:** P0 = blocker before domain purchase | P1 = fix within first week | P2 = fix within first month | P3 = nice-to-have

---

## P0 — Blockers (Fix Before Domain Purchase / Promotion)

### P0-1: Purchase mcpservers.dev and configure Cloudflare Pages
**Impact:** Resolves canonical, sitemap domain, and og:image issues in one step.
**Steps:**
1. Purchase domain mcpservers.dev
2. In Cloudflare Pages project settings, add custom domain: mcpservers.dev
3. Set DNS CNAME: `mcpservers.dev` → `mcpservers-dev.pages.dev`
4. Wait for SSL certificate provisioning (~5 min on Cloudflare)
5. Verify: `curl -I https://mcpservers.dev/` returns HTTP 200 with `server: cloudflare`

After this step, canonicals (`https://mcpservers.dev/...`) self-reference correctly. Sitemap URLs also resolve. og:image on articles becomes valid.

### P0-2: Fix robots.txt Sitemap directive
**Problem:** `Sitemap: https://mcpservers.dev/sitemap-index.xml` — that URL currently returns a JS redirect, not XML. After domain purchase this resolves, but the path should also be verified.
**Fix in Astro project (public/robots.txt or astro.config.ts sitemap config):**
```
Sitemap: https://mcpservers.dev/sitemap-index.xml
```
This URL must serve valid XML after domain is live. Test with:
```bash
curl -I https://mcpservers.dev/sitemap-index.xml
```
Expected: `Content-Type: application/xml`

### P0-3: Remove FAQPage schema from all article pages
**Problem:** FAQPage schema is restricted to government and healthcare sites since August 2023. Commercial tech blogs are ineligible for FAQ rich results. Keeping it risks a manual action.
**Fix in Astro component (wherever FAQPage schema is generated):**
- Remove the `<script type="application/ld+json">` block containing `"@type": "FAQPage"`
- The FAQ content can remain as HTML — just remove the structured data markup
**File to find:** Search for `FAQPage` in your Astro components/layouts

### P0-4: Add `image` field to Article schema
**Problem:** Article schema is missing the `image` property — required for Article rich results eligibility.
**Fix:** Add to Article schema JSON-LD:
```json
"image": {
  "@type": "ImageObject",
  "url": "https://mcpservers.dev/og/{slug}.png",
  "width": 1200,
  "height": 630
}
```
Use the same og:image URL that is already generated per article.

### P0-5: Add og:image to homepage
**Problem:** Homepage has no `og:image` — every social share appears without a preview image.
**Fix in Astro layout (BaseLayout or index page):**
```html
<meta property="og:image" content="https://mcpservers.dev/og/home.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```
Create a default OG image at `public/og/home.png` (1200x630px).

---

## P1 — Fix Within First Week

### P1-1: Add WebSite + Organization schema to homepage
**Why:** Required for Google Sitelinks Searchbox, Knowledge Panel eligibility, and E-E-A-T signals.
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MCPServers.dev",
  "url": "https://mcpservers.dev/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://mcpservers.dev/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MCPServers.dev",
  "url": "https://mcpservers.dev/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://mcpservers.dev/logo.png"
  },
  "sameAs": ["https://flipfactory.it.com"]
}
```

### P1-2: Add security headers via _headers file
Create `public/_headers` in Astro project:
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```
Note: CSP requires careful configuration to not break inline scripts. Add incrementally.

### P1-3: Fix sitemap lastmod dates
**Why:** Googlebot uses lastmod to prioritize recrawling. Sitemap without lastmod wastes crawl budget on unchanged pages.
**Fix in astro.config.ts (sitemap integration):**
```ts
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  integrations: [sitemap({
    serialize(item) {
      item.lastmod = item.changefreq ? new Date().toISOString() : undefined;
      return item;
    }
  })]
});
```
Or set `lastmod` to the article's `dateModified` field.

### P1-4: Fix llms-full.txt
**Problem:** `/llms-full.txt` returns HTML (homepage) instead of a text content dump.
**Fix:** Create `public/llms-full.txt` as a static file with all article content in markdown/text format. Astro can generate this at build time.
Example structure:
```
# MCPServers.dev — Full Content Index

## What is an MCP Server? The Complete Guide
URL: https://mcpservers.dev/blog/what-is-mcp-server/
Date: 2026-03-30

[Full article text here...]

---
## Getting Started with MCP Protocol in 2026
...
```

### P1-5: Add article links to llms.txt
**Current state:** llms.txt has no links — AI crawlers cannot discover content.
**Fix:** Add a Links section:
```markdown
## Articles
- [What is an MCP Server?](https://mcpservers.dev/blog/what-is-mcp-server/): Complete guide to MCP protocol and server architecture
- [Getting Started with MCP Protocol](https://mcpservers.dev/blog/getting-started-mcp-protocol/): Practical setup guide
- [MCP Server Security Best Practices](https://mcpservers.dev/blog/mcp-security-best-practices/): Security guide for MCP deployments
```

### P1-6: Fix homepage title tag
**Current:** `Home | MCPServers.dev` (no keyword, 21 chars)
**Fix:** `MCP Servers Directory & Protocol Guide | MCPServers.dev` (52 chars — includes target keyword)

### P1-7: Fix topic page title/description template
**Current:** `ai-agents — MCPServers.dev | MCPServers.dev` (raw slug, duplicate site name)
**Fix template:**
- Title: `[Topic Name] MCP Resources | MCPServers.dev`
- Description: `Explore MCP servers, tutorials, and guides on [Topic Name]. Curated resources from MCPServers.dev.`

---

## P2 — Fix Within First Month

### P2-1: Add BreadcrumbList schema to article pages
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://mcpservers.dev/"},
    {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://mcpservers.dev/blog/"},
    {"@type": "ListItem", "position": 3, "name": "What is an MCP Server?"}
  ]
}
```
Also add visual breadcrumb navigation in the HTML for UX.

### P2-2: Change Article @type to BlogPosting
Article pages are blog posts. Use `BlogPosting` instead of `Article` — more semantically accurate and aligns with publisher templates.

### P2-3: Add Person author schema or author page
**Current:** `"author": {"@type": "Organization", "name": "FlipFactory Editorial Team"}`
**Better for E-E-A-T:** Create an author page for the editorial team and use Person schema with profileUrl, sameAs links to social profiles.

### P2-4: Add images to articles
No article has any image. This limits:
- og:image richness (currently using generated PNGs, not real article images)
- Image search traffic
- Visual engagement
- LCP optimization (an image hero = predictable LCP target)

Minimum: 1 featured image per article (1200x630px, WebP format) with descriptive alt text.

### P2-5: Strengthen internal linking for topic pages
23 topic pages have only 1 incoming internal link. Add:
- A "Topics" section to the homepage listing key topic categories
- Cross-links between related topic pages
- "See also" sections at the end of articles pointing to 2-3 topic pages

### P2-6: Improve cache-control for static assets
**Current:** `cache-control: public, max-age=0, must-revalidate`
**Fix in public/_headers:**
```
/og/*.png
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400
/*.css
  Cache-Control: public, max-age=31536000, immutable
/*.js
  Cache-Control: public, max-age=31536000, immutable
```

### P2-7: Switch twitter:card to summary_large_image
**Current:** `twitter:card: summary` (small square thumbnail)
**Better:** `twitter:card: summary_large_image` (full-width banner — much higher CTR on X/Twitter)

### P2-8: Add Organization schema to About page
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MCPServers.dev",
  "description": "Comprehensive resource for MCP protocol...",
  "url": "https://mcpservers.dev/",
  "publisher": {
    "@type": "Organization",
    "name": "FlipFactory",
    "url": "https://flipfactory.it.com"
  }
}
```

---

## P3 — Nice-to-Have (After Promotion Starts)

### P3-1: Add Applebot-Extended, Bytespider, CCBot, FacebookBot to robots.txt
Explicit management (allow or disallow) for remaining AI crawlers. Currently they inherit the Allow: * rule which is fine, but explicit is better.

### P3-2: Submit sitemap to Google Search Console
After domain purchase and DNS propagation:
1. Add mcpservers.dev property to GSC
2. Submit `https://mcpservers.dev/sitemap-index.xml`
3. Monitor coverage report for index errors

### P3-3: Verify Core Web Vitals with PageSpeed
Run: `python3 .claude/skills/seo/scripts/pagespeed.py https://mcpservers.dev --strategy mobile`
Target: LCP < 2.5s, INP < 200ms, CLS < 0.1

### P3-4: Add search functionality (or remove SearchAction from WebSite schema)
If WebSite schema includes SearchAction (P1-1), there should be an actual `/search?q=` endpoint. If not, omit SearchAction from the WebSite schema.

### P3-5: Add llms.txt description blockquote
```markdown
# MCPServers.dev
> Your go-to resource for MCP protocol documentation, server reviews, and developer guides. Operated by FlipFactory.
```

---

## Pre-Launch Checklist

- [ ] B1: Domain mcpservers.dev purchased and DNS configured
- [ ] B2: robots.txt Sitemap verified to resolve to XML after domain live
- [ ] B3: Sitemap URLs confirmed on mcpservers.dev domain
- [ ] B4: FAQPage schema removed from all article pages
- [ ] B5: Article schema has `image` field populated
- [ ] B6: og:image added to homepage
- [ ] P1-1: WebSite + Organization schema on homepage
- [ ] P1-2: Security headers via _headers file
- [ ] P1-3: Sitemap has lastmod dates
- [ ] P1-4: llms-full.txt serves actual text content
- [ ] P1-5: llms.txt has article links
- [ ] P1-6: Homepage title tag keyword-optimized
- [ ] Verify with: `curl https://mcpservers.dev/sitemap-index.xml` returns XML
- [ ] Verify with: `curl https://mcpservers.dev/robots.txt` shows correct Sitemap URL
- [ ] Verify og:image loads: `curl -I https://mcpservers.dev/og/home.png`
- [ ] Submit sitemap to Google Search Console
