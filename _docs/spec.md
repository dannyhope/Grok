# Grok specification

## Local development

Grok runs as a SvelteKit/Vite browser app with live reload during development. The dev server binds to `127.0.0.1` on preferred port `5741`. `npm run dev` verifies the `grok.local` loopback mapping before starting.

Bombay's shared port-80 proxy should route:

`grok.local` → `127.0.0.1:5741`

This project does not create or own the shared proxy.
