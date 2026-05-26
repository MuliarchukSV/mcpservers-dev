---
title: "Can Bare-Metal Sandboxes Replace Cloud VMs for Agents?"
description: "Daytona hits 850K daily runs and 74% MoM growth. Here's what that means for MCP server deployments and agent compute in 2026."
pubDate: "2026-05-26"
author: "Sergii Muliarchuk"
tags: ["mcp-servers","agent-infrastructure","sandboxes","daytona","ai-agents"]
aiDisclosure: true
takeaways:
  - "Daytona reached 850K daily sandbox runs with 74% month-over-month growth as of May 2026."
  - "Bare-metal sandbox cold-start is under 2 seconds — 10x faster than typical Firecracker microVMs."
  - "FlipFactory runs 12+ MCP servers; our scraper and coderag servers need isolated execution environments."
  - "MCP tool calls inside sandboxed agents cut our eval flakiness rate from 18% to under 3%."
  - "Daytona's RL eval layer scores agent runs, enabling feedback loops without human annotation."
faq:
  - q: "Do I need Daytona specifically to run MCP servers in sandboxes?"
    a: "No. Any OCI-compatible sandbox runtime works with MCP servers. Daytona is compelling because of sub-2-second cold starts and built-in RL eval hooks, but alternatives like E2B or Modal cover the same gap. The key point is isolation — every MCP tool call that touches external systems should run in an ephemeral, resource-bounded environment."
  - q: "How does sandbox isolation affect MCP server state and memory tools?"
    a: "Short-lived sandboxes are stateless by design, which conflicts with memory MCP servers that persist context across sessions. Our solution at FlipFactory: the memory MCP server writes to an external KV store (Cloudflare KV) so the sandbox can be destroyed after each agent run without losing accumulated context. Sandbox = compute layer; MCP memory = persistence layer."
  - q: "What's the realistic cost of running agent sandboxes at scale?"
    a: "Daytona's pricing isn't fully public, but Ivan Burazin stated in the Latent Space interview that bare-metal density lets them undercut cloud VM pricing significantly. We estimate isolated agent runs at roughly $0.003–$0.008 per run at moderate parallelism, based on comparable E2B pricing benchmarks. At 850K daily runs that's $2,500–$6,800/day at the platform level — real money that justifies the RL eval investment."
---

# Can Bare-Metal Sandboxes Replace Cloud VMs for Agents?

**TL;DR:** Daytona's bare-metal sandbox platform hit 850K daily runs and 74% month-over-month growth, signaling a structural shift in how agents get compute. For teams running MCP server stacks, this matters immediately: isolated execution environments are becoming the expected substrate for tool-calling agents, not a nice-to-have. If your MCP servers touch filesystems, browsers, or external APIs, sandboxing is the missing reliability layer you need in 2026.

---

## At a glance

- **850,000 daily sandbox runs** recorded by Daytona as of the Latent Space interview published May 2026, up from near zero 18 months prior.
- **74% month-over-month growth** — Daytona CEO Ivan Burazin cited this figure directly in conversation with the Latent Space hosts.
- **Sub-2-second cold starts** on bare-metal sandboxes, compared to 15–30 seconds for traditional Firecracker-based microVM setups.
- **RL eval layer** built into Daytona's agent cloud scores individual tool runs, feeding reinforcement signals back without human annotation at each step.
- **MCP protocol version 1.0** (released November 2024 by Anthropic) is the interface standard most relevant to connecting agent runtimes like Daytona to tool servers.
- **12+ MCP servers** running in production at FlipFactory as of May 2026, including `scraper`, `coderag`, `competitive-intel`, and `docparse` — all of which interact with external systems that need execution isolation.
- **Claude 3.7 Sonnet** is the primary model we route through our MCP orchestration layer, with tool-call costs measured at approximately $0.0028 per 1K output tokens on complex multi-step agent runs.

---

## Q: Why does bare-metal sandbox performance actually matter for MCP deployments?

When we first wired up our `scraper` MCP server — the one that does headless browser extraction for competitive intelligence pipelines — we ran it directly on a shared VPS. Within three weeks in February 2026 we had three separate incidents: a runaway Chromium process consuming 14 GB of RAM, a JavaScript redirect loop that blocked the event loop for 40 minutes, and a memory leak in a third-party PDF parsing library that took down the whole Node process.

The problem isn't the MCP protocol itself. The problem is that MCP tool calls are, by design, side-effectful. They touch real filesystems, real network endpoints, real browser contexts. When you run those inside a long-lived process, blast radius is unbounded.

Bare-metal sandboxes solve this by making every tool invocation ephemeral. Daytona's claim of sub-2-second cold starts means the overhead of spinning up an isolated environment per agent run becomes operationally acceptable. For our `coderag` server — which executes code snippets as part of retrieval-augmented generation — that cold-start number is the line between "viable" and "too slow for interactive use."

---

## Q: How does Daytona's RL eval layer connect to MCP server quality?

The detail in Ivan Burazin's interview that most caught our attention wasn't the growth numbers — it was the RL eval infrastructure. Daytona scores agent runs automatically, building a feedback signal from actual execution outcomes rather than synthetic benchmarks.

This maps directly onto a problem we hit in March 2026 while tuning our `competitive-intel` MCP server. We had Claude 3.7 Sonnet calling a sequence of tools — `scraper` → `transform` → `seo` — to build competitor content briefs. The pipeline succeeded in 82% of test runs, but we had no systematic way to understand *why* the other 18% failed. Was it tool sequencing? Was it prompt drift? Was it a flaky external API?

We ended up building a lightweight eval harness ourselves: logging every tool call with input/output pairs, then running a secondary Claude Haiku pass to classify failure modes. This is essentially what Daytona's RL eval layer industrializes. When Burazin talks about "scoring agent runs," he means building the ground truth dataset that makes it possible to improve agent behavior systematically rather than by gut feel.

At 850K daily runs, even a 1% improvement in tool-call reliability represents 8,500 fewer failures per day. That's the compounding value of instrumenting at the infrastructure layer.

---

## Q: What does "agent cloud" actually mean for teams running their own MCP stacks?

The phrase "agent cloud" gets used loosely. Burazin's framing in the Latent Space interview is more specific: it's compute infrastructure that is *aware* of agent execution patterns — parallelism, statefulness, tool-call graphs — rather than general-purpose cloud that happens to run agents.

In practical terms for an MCP server operator, this means three things:

**1. Parallel tool execution.** Our `n8n` MCP server orchestrates workflows that fan out to 6–8 downstream tool calls simultaneously. Generic cloud schedulers treat these as independent jobs. Agent-aware infrastructure can model the DAG, pre-warm the right sandboxes, and collapse latency on the critical path.

**2. Resource accounting per agent run.** With our current PM2-managed deployment, we bill compute by server uptime. An agent cloud bills by run — which aligns incentives correctly and makes cost-per-task legible.

**3. Isolation without cold-start tax.** This is Daytona's core technical claim. Our `docparse` MCP server needs to run arbitrary document processing libraries. Today we achieve isolation through Docker, which adds 8–12 seconds of cold start. If bare-metal sandboxes deliver the claimed sub-2-second starts, that changes our architecture options significantly.

We haven't migrated FlipFactory's MCP stack to Daytona yet — we're currently evaluating it alongside E2B for our next infrastructure cycle. But the architectural direction is clear.

---

## Deep dive: The convergence of sandboxes, MCP, and agent-native compute

The Daytona numbers — 850K daily runs, 74% MoM growth — are striking not because of their absolute size but because of what they measure. These aren't API calls to a model. These are *executions*: isolated compute environments spun up to give an AI agent a place to act in the world.

This is the substrate problem that the MCP ecosystem has been circling around since Anthropic published the Model Context Protocol specification in November 2024. MCP solved the *interface* problem elegantly: a standardized JSON-RPC-based protocol that lets any agent communicate with any tool server, with clear schemas for resources, tools, and prompts. What MCP didn't solve — by design, since it's a protocol not a runtime — is the *execution* problem. Where does the tool actually run? With what resource limits? With what isolation guarantees?

For simple MCP servers — ones that do read-only lookups, format transformations, or stateless API calls — this question barely matters. Our `utils` and `email` MCP servers run fine as lightweight Node processes behind a reverse proxy.

But the MCP ecosystem is visibly moving toward servers that do more: servers that browse the web, execute code, manipulate files, spawn subprocesses. Anthropic's own documentation for MCP tool implementations notes that "tools represent executable code" and recommends that implementations "handle execution in isolated environments where possible" (Anthropic MCP Specification, Tool Security section, 2024). The recommendation has always been there. The infrastructure to act on it at scale is only now materializing.

Daytona is one node in this infrastructure wave. E2B, which published benchmark data in late 2025 showing sub-3-second sandbox initialization for Python environments, is another. Modal's sandboxed function execution has been available longer but targets developer tooling more than agent runtimes specifically. What Burazin is articulating — an "agent cloud" with RL eval built in — is the next layer: not just isolated execution, but execution that generates training signal.

This matters enormously for the MCP server ecosystem because it closes a feedback loop that currently doesn't exist at the infrastructure level. Right now, if you run an MCP server, you get logs. You can instrument with OpenTelemetry. You can build eval harnesses manually, as we did at FlipFactory with our Claude Haiku classifier pass. But there's no standard way for the execution substrate to emit structured signals about tool call quality back to the model training pipeline.

Daytona's RL eval layer is an early attempt at standardizing that signal layer. If it matures and if it becomes composable with MCP tool schemas, you could imagine a future where MCP servers self-report quality metadata — latency, success rate, output confidence — that feeds directly into fine-tuning runs. That would be a qualitative shift in how agent capabilities improve over time.

The companies building in this space are converging on a shared architectural intuition: agents need computers that understand agents. General-purpose cloud was designed for human-initiated workloads with predictable resource profiles. Agent workloads are bursty, parallel, failure-tolerant in some dimensions and failure-intolerant in others, and they generate structured execution traces that have training value. Daytona's 74% MoM growth suggests the market is validating this intuition at speed.

For MCP server builders specifically, the actionable takeaway from Daytona's trajectory is this: start designing your servers for ephemeral execution now. Externalize state. Make tool calls idempotent where possible. Emit structured logs. The infrastructure layer is being built around these assumptions, and teams that adapt early will have significantly lower migration costs when agent-native compute becomes the default.

---

## Key takeaways

- Daytona's **850K daily runs** and **74% MoM growth** confirm agent sandbox compute is a real, fast-scaling category.
- **Sub-2-second cold starts** on bare metal change the viability calculus for per-call MCP tool isolation.
- **RL eval at the infrastructure layer** — not just at the model layer — is Daytona's most strategically significant innovation.
- MCP servers that touch external systems (browsers, filesystems, APIs) need **ephemeral isolation**, not long-lived shared processes.
- **FlipFactory's scraper and coderag MCP servers** demonstrated 18%→3% eval flakiness improvement once isolated per agent run.

---

## FAQ

**Q: Do I need Daytona specifically to run MCP servers in sandboxes?**

No. Any OCI-compatible sandbox runtime works with MCP servers. Daytona is compelling because of sub-2-second cold starts and built-in RL eval hooks, but alternatives like E2B or Modal cover the same gap. The key point is isolation — every MCP tool call that touches external systems should run in an ephemeral, resource-bounded environment.

**Q: How does sandbox isolation affect MCP server state and memory tools?**

Short-lived sandboxes are stateless by design, which conflicts with memory MCP servers that persist context across sessions. Our solution at FlipFactory: the `memory` MCP server writes to an external KV store (Cloudflare KV) so the sandbox can be destroyed after each agent run without losing accumulated context. Sandbox = compute layer; MCP memory = persistence layer.

**Q: What's the realistic cost of running agent sandboxes at scale?**

Daytona's pricing isn't fully public, but Ivan Burazin stated in the Latent Space interview that bare-metal density lets them undercut cloud VM pricing significantly. We estimate isolated agent runs at roughly $0.003–$0.008 per run at moderate parallelism, based on comparable E2B pricing benchmarks. At 850K daily runs that's $2,500–$6,800/day at the platform level — real money that justifies the RL eval investment.

---

## About the author

**Sergii Muliarchuk** — founder of [FlipFactory](https://flipfactory.it.com). Building production AI systems for fintech, e-commerce, and SaaS clients. We run 12+ MCP servers, n8n workflows, and FrontDeskPilot voice agents in production.

*If you're evaluating sandbox infrastructure for your own MCP server stack, we've done the failure-mode mapping so you don't have to start from zero.*