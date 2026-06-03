import type { BlogConfig } from './template/blog.config.ts';

const config: BlogConfig = {
  name: "MCPServers.services",
  homeTitle: "MCP Server Directory, Tutorials & Protocol Reference | MCPServers.services",
  description: "Everything about MCP protocol, servers, and ecosystem",
  site: "https://mcpservers.services",
  language: "en",
  niche: "MCP servers",
  colors: { primary: "#6366f1", accent: "#22d3ee" },
  analytics: { plausibleDomain: "mcpservers.services" },
  author: {
    type: 'Person',
    name: 'Sergii Muliarchuk',
    url: '/author',
    bio: 'Sergii Muliarchuk is the founder of FlipFactory, an AI automation agency building production AI systems — MCP servers, n8n workflows, and voice agents — for fintech, e-commerce, and SaaS clients.',
    sameAs: [
      'https://www.linkedin.com/in/sergii-muliarchuk/',
      'https://github.com/MuliarchukSV',
    ],
  },
};

export default config;
