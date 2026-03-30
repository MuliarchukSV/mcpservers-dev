---
title: "MCP Server Marketplace: Where to Find and Share Servers"
description: "A comprehensive guide to MCP server registries, marketplaces, and directories — where to discover servers and how to publish your own."
pubDate: "2026-03-30"
author: "FlipFactory Editorial Team"
tags: ["mcp", "marketplace", "smithery", "ecosystem"]
aiDisclosure: true
faq:
  - q: "What is the best place to find MCP servers?"
    a: "Smithery (smithery.ai) is the largest dedicated MCP marketplace with 3,000+ servers, categories, and reviews. The official MCP servers repository on GitHub has reference implementations. npm and PyPI host thousands more that can be found by searching for 'mcp-server'."
  - q: "How do I publish my MCP server to a marketplace?"
    a: "Start by publishing to npm (for TypeScript) or PyPI (for Python). Then submit to Smithery by creating an account and filling out the server listing form. Include a clear README, configuration examples, and screenshots or demos. The review process typically takes 1-3 days."
---

## TLDR

The MCP server ecosystem has matured from scattered GitHub repositories into organized marketplaces and registries. Smithery leads as the largest dedicated marketplace with over 3,000 servers. npm and PyPI serve as the primary distribution channels for installation. GitHub hosts the source code for most community servers. Dedicated directories like MCPServers.dev and awesome-mcp-servers curate quality picks. For server developers, the publishing path is clear: distribute through package managers, list on marketplaces, and maintain documentation. This guide covers every major discovery channel, compares their strengths, and explains how to publish a server for maximum reach.

## Smithery: The Dedicated Marketplace

Smithery (smithery.ai) has established itself as the central hub for MCP server discovery. Launched in mid-2025, it now hosts over 3,000 server listings organized by category, use case, and compatibility.

What Smithery offers that other channels do not:

- **Categorized browsing** — Servers are organized into categories like Development, Data, Productivity, and Communication. This is invaluable when you know what capability you need but not which server provides it.
- **Configuration generators** — Smithery can generate the JSON configuration snippet for your MCP host, reducing setup to a copy-paste operation.
- **Community ratings** — Users can rate and review servers, providing social proof for quality.
- **Compatibility badges** — Each listing shows which MCP hosts (Claude Desktop, VS Code, Cursor) the server is tested with.
- **Installation statistics** — Download counts and usage trends help identify actively maintained servers versus abandoned projects.

The submission process is straightforward. Create a Smithery account, provide your server's npm or PyPI package name, fill in the listing details (description, category, screenshots), and submit for review. The review team typically processes submissions within one to three days, checking for basic functionality and security hygiene.

One limitation: Smithery is curated, not comprehensive. Not every npm MCP package appears on Smithery, and the review process means there is always a lag between publication and listing. For the latest servers, checking npm directly is still necessary.

## npm and PyPI: The Distribution Backbone

While marketplaces handle discovery, package managers handle distribution. The vast majority of MCP servers are installed through npm or PyPI.

**npm** hosts roughly 6,000 packages with "mcp" in their name or description. The naming convention `@scope/mcp-server-*` or `mcp-server-*` has become standard, making keyword searches effective. Anthropic's official servers use the `@modelcontextprotocol` scope.

Searching npm effectively:
- `mcp-server` returns the broadest results
- Adding a domain keyword (`mcp-server postgres`, `mcp-server github`) narrows to specific use cases
- Sorting by "popularity" or "quality" filters out abandoned packages
- Checking the "last published" date identifies actively maintained servers

**PyPI** hosts around 2,500 MCP-related packages, searchable with similar keyword patterns. Python servers typically use `uvx` or `pip` for installation, with `uvx` preferred because it creates isolated environments automatically.

The key advantage of package managers is that `npx` and `uvx` can run servers without permanent installation. This means users can try a server risk-free — if it does not meet their needs, they simply remove the configuration line. No uninstall process needed.

## GitHub: The Source of Truth

Almost every MCP server has a GitHub repository, making GitHub the largest single source for server discovery — though not the most organized one.

**Anthropic's official repository** (`modelcontextprotocol/servers`) contains reference implementations covering filesystem, GitHub, GitLab, Google Drive, PostgreSQL, SQLite, Slack, Sentry, Brave Search, Puppeteer, and more. These are the gold standard for implementation quality and the first servers most developers encounter.

**The awesome-mcp-servers list** is a community-curated collection organized by category. With over 15,000 GitHub stars, it is the most comprehensive hand-picked directory available. Each entry includes a brief description, language tag, and link to the repository.

**GitHub search** surfaces servers by topic tag. Searching for repositories with the `mcp-server` topic returns several thousand results, sortable by stars, recent activity, or relevance. Many server developers add the `mcp`, `model-context-protocol`, and `mcp-server` topics to their repositories for discoverability.

## Curated Directories and Blogs

Several websites maintain curated directories that add editorial value beyond what automated listings provide:

**MCPServers.dev** focuses on education and curation, combining server listings with tutorials, best practices, and ecosystem news. Rather than listing every available server, it highlights servers with proven reliability and clear documentation.

**MCP.so** provides a searchable directory with filtering by language, category, and host compatibility. Its interface is particularly good for side-by-side comparison of servers that serve the same purpose.

**Glama.ai** hosts an MCP directory alongside other AI tool listings, useful for developers already in that ecosystem.

The editorial layer these directories provide is increasingly valuable as the raw number of servers grows. Finding a server is easy. Finding a *good* server — one that is actively maintained, well-documented, and production-tested — requires curation that automated listings cannot provide.

## Publishing Your Server: The Complete Path

For server developers, reaching the widest audience requires publishing to multiple channels. Here is the recommended sequence:

**Step 1: npm or PyPI.** Publish your package with a clear name, comprehensive README, and proper package.json/pyproject.toml metadata. Include keywords like "mcp", "mcp-server", and your domain area. Roughly 70% of MCP server installations come through package managers.

**Step 2: GitHub.** Ensure your repository has the `mcp-server` topic tag, a clear README with installation and configuration instructions, and at least one release tag. Add a LICENSE file — MIT is the most common choice in the MCP ecosystem.

**Step 3: Smithery.** Submit your listing with screenshots, a compelling description, and configuration examples for all major hosts. Smithery listings with screenshots receive approximately 3x more clicks than text-only listings.

**Step 4: awesome-mcp-servers.** Open a pull request to add your server to the appropriate category. The maintainers review PRs weekly and have clear acceptance criteria: the server must be functional, documented, and add value beyond existing listings.

**Step 5: Community channels.** Share on the MCP Discord server, relevant subreddits (r/ClaudeAI, r/LocalLLaMA), and social media. A launch post with a demo video or GIF drives significant initial adoption.

## Evaluating Server Quality

When choosing between multiple servers that serve the same purpose, these signals indicate quality:

- **Recent commits** — Active maintenance matters more than star count. A server updated last week is more likely to work than one untouched for six months.
- **Issue responsiveness** — Check how the maintainer handles bug reports. Quick responses indicate an engaged developer.
- **Configuration documentation** — Good servers include configuration examples for Claude Desktop, VS Code, and other hosts. Missing documentation often correlates with missing error handling.
- **Download trends** — Consistent or growing downloads indicate sustained value. A spike followed by decline might indicate hype without substance.
- **Security practices** — Does the server validate inputs? Does it follow least-privilege access patterns? Does the README mention security considerations?

## The Marketplace Landscape Ahead

The MCP marketplace ecosystem is still consolidating. Expect to see tighter integration between package managers and marketplaces, one-click installation flows in MCP hosts, and possibly a built-in marketplace within Claude Desktop itself.

For now, the multi-channel approach — publish to npm, list on Smithery, maintain on GitHub — gives server developers the broadest reach. For consumers, starting with Smithery for discovery and using npm for installation covers the vast majority of needs. As the ecosystem matures, the friction between discovery and installation will continue to decrease, making the rich world of MCP servers accessible to an ever-wider audience.
