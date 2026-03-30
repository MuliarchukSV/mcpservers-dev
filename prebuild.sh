#!/bin/bash
# Copy blog-specific content into template content directory
# This runs before astro build to merge per-blog articles with template
if [ -d "src/content/blog" ]; then
  cp -r src/content/blog/* template/src/content/blog/ 2>/dev/null || true
fi
if [ -f "src/content/config.ts" ]; then
  cp src/content/config.ts template/src/content/config.ts 2>/dev/null || true
fi
if [ -f "public/llms.txt" ]; then
  cp public/llms.txt template/public/llms.txt 2>/dev/null || true
fi
