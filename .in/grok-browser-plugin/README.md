# Browser plugin that imports content into Grok from any URL
**Refined:** 2026-02-08
**Done when:** Users can click a browser extension button on any webpage, the URL is sent to Grok, and the readable content is automatically extracted and appears as a new source document.

## Architecture
- **Browser extension** — lightweight, sends the current tab's URL to Grok
- **Backend service** — new server component for Grok; receives URLs, fetches pages, extracts readable content (e.g. Mozilla Readability)
- **SPA integration** — Grok maintains a list of imported URLs; content appears as source documents immediately after extraction

## Sub-tasks
1. Stand up a backend service for Grok
2. Build URL ingestion endpoint (receives URL, fetches page, extracts readable content)
3. Build browser extension (sends current tab URL to Grok backend)
4. Integrate extracted content into Grok SPA as source documents
5. Display import queue / status in the UI
