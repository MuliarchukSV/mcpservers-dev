---
title: "Building Your First MCP Server in TypeScript"
description: "Step-by-step tutorial to build a production-ready MCP server in TypeScript with tools, resources, error handling, and testing."
pubDate: "2026-03-30"
author: "FlipFactory Editorial Team"
tags: ["mcp", "typescript", "tutorial", "development"]
aiDisclosure: true
faq:
  - q: "How long does it take to build a basic MCP server?"
    a: "A minimal MCP server with one or two tools can be built in under 30 minutes. A production-ready server with error handling, input validation, and documentation typically takes 2-4 hours. The official TypeScript SDK handles most of the protocol complexity for you."
  - q: "Can I build MCP servers in languages other than TypeScript?"
    a: "Yes. Official SDKs exist for TypeScript, Python, Java, C#, and Rust. Community SDKs cover Go, Ruby, and several other languages. TypeScript and Python are the most popular choices, with roughly 60% and 30% of community servers respectively."
---

## TLDR

Building an MCP server is more accessible than most developers expect. The official TypeScript SDK abstracts away the protocol details, letting you focus on your server's actual functionality. In this tutorial, we build a complete MCP server from scratch — a weather service that exposes tools for current conditions and forecasts. Along the way, we cover project setup, tool definitions with Zod validation, error handling, testing strategies, and publishing. By the end, you will have a working server that you can adapt to wrap any API or service.

## Project Setup

Start by creating a new project and installing the MCP SDK:

```bash
mkdir mcp-weather-server
cd mcp-weather-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node
npx tsc --init
```

Update `tsconfig.json` with these settings for MCP server development:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "declaration": true
  }
}
```

Create the entry point at `src/index.ts`. This is where we define the server, register tools, and start listening for connections.

## Defining the Server

The SDK provides a `McpServer` class that handles all protocol communication. Here is the minimal boilerplate:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "weather-server",
  version: "1.0.0",
  description: "Get weather data for any location"
});

// Tools will be registered here

const transport = new StdioServerTransport();
await server.connect(transport);
```

This creates a server that communicates over stdio — the standard transport for local MCP servers. When a host like Claude Desktop starts this server, it connects through stdin/stdout automatically.

## Adding Tools

Tools are the primary way AI models interact with your server. Each tool has a name, description, input schema, and a handler function. Here is a complete tool for getting current weather:

```typescript
server.tool(
  "get_current_weather",
  "Get the current weather conditions for a specific location",
  {
    location: z.string().describe("City name or coordinates (e.g., 'London' or '51.5,-0.1')"),
    units: z.enum(["celsius", "fahrenheit"]).default("celsius")
      .describe("Temperature unit preference")
  },
  async ({ location, units }) => {
    try {
      const data = await fetchWeather(location, units);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            location: data.name,
            temperature: data.temp,
            units: units,
            conditions: data.description,
            humidity: data.humidity,
            wind_speed: data.wind
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error fetching weather for "${location}": ${error.message}`
        }],
        isError: true
      };
    }
  }
);
```

Several details matter here. The Zod schema defines parameter types, defaults, and descriptions that AI models use to understand how to call the tool correctly. The `.describe()` calls are not documentation for humans — they are instructions for the AI model. Make them clear and specific.

The return format uses a `content` array with typed blocks. The `text` type is the most common, but MCP also supports `image` and `resource` content types. Setting `isError: true` tells the AI model that the operation failed, allowing it to handle errors gracefully.

## Implementing the API Layer

The actual weather fetching is a standard HTTP call. Here we use the Open-Meteo API, which is free and requires no API key:

```typescript
interface WeatherData {
  name: string;
  temp: number;
  description: string;
  humidity: number;
  wind: number;
}

async function fetchWeather(
  location: string,
  units: string
): Promise<WeatherData> {
  // First, geocode the location
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const geoRes = await fetch(geoUrl);
  const geoData = await geoRes.json();

  if (!geoData.results?.length) {
    throw new Error(`Location not found: ${location}`);
  }

  const { latitude, longitude, name } = geoData.results[0];
  const tempUnit = units === "fahrenheit" ? "fahrenheit" : "celsius";

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=${tempUnit}`;
  const weatherRes = await fetch(weatherUrl);
  const weather = await weatherRes.json();

  return {
    name,
    temp: weather.current.temperature_2m,
    description: weatherCodeToDescription(weather.current.weather_code),
    humidity: weather.current.relative_humidity_2m,
    wind: weather.current.wind_speed_10m
  };
}
```

This two-step process — geocode then fetch weather — is a common pattern in MCP servers. The AI model sends a human-friendly location name, and the server handles the translation to API-specific coordinates.

## Error Handling Patterns

Robust error handling separates production MCP servers from demos. There are three categories of errors to handle:

**Input validation errors** are caught automatically by Zod. If the AI sends invalid parameters, the SDK returns a structured error before your handler runs. This happens about 5-10% of the time based on community telemetry, making it a non-trivial concern.

**External service errors** should be caught in your handler and returned with `isError: true`. Include enough context for the AI to either retry with different parameters or explain the issue to the user.

**Server-level errors** (crashes, unhandled exceptions) should be caught with a global error handler:

```typescript
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});
```

The MCP host will restart a crashed server automatically in most cases, but clean error messages help the AI model understand what went wrong.

## Testing Your Server

Testing MCP servers requires a different approach than testing REST APIs. The MCP Inspector is the official debugging tool:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

This opens a web interface where you can see your server's registered tools, call them with custom parameters, and inspect the responses. It is indispensable during development.

For automated testing, the SDK provides a client class that can connect to your server programmatically:

```typescript
import { McpClient } from "@modelcontextprotocol/sdk/client/mcp.js";

const client = new McpClient({ name: "test-client" });
// Connect to your server and call tools
const result = await client.callTool("get_current_weather", {
  location: "London",
  units: "celsius"
});
assert(result.content[0].text.includes("London"));
```

Write tests for each tool with valid inputs, invalid inputs, and edge cases. The 5-10% AI error rate mentioned earlier means your server will receive unexpected inputs in production.

## Publishing and Distribution

Once your server works locally, publishing to npm makes it available to the entire MCP community:

```bash
# Update package.json
{
  "name": "@yourscope/mcp-weather-server",
  "bin": { "mcp-weather-server": "./dist/index.js" },
  "files": ["dist"]
}

# Build and publish
npm run build
npm publish
```

Add a shebang line (`#!/usr/bin/env node`) to the top of your entry point so it runs directly as an executable. Users can then configure it with `npx -y @yourscope/mcp-weather-server`.

Consider also submitting to the Smithery marketplace and the MCP server directories for broader visibility. A well-documented README with configuration examples and a clear description of capabilities goes a long way toward adoption.

## What to Build Next

The weather server pattern — external API wrapper with structured tools — applies to virtually any API. Common next projects include wrapping your company's internal APIs, adding MCP access to a SaaS product, or building utility servers for common developer tasks.

The MCP ecosystem rewards servers that do one thing well over Swiss-army-knife servers that do everything poorly. Pick a focused use case, implement it thoroughly with good error handling and descriptions, and you will have a server that other developers actually want to use.
