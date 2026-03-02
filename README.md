# Hive

A web-based terminal dashboard for managing multiple [Claude Code](https://claude.ai/code) agents in a monorepo.

Drop Hive into any monorepo, define your agents, and get a real-time web UI at `localhost:4199` — xterm.js terminals, status indicators, session persistence, and model switching.

## Quick Start

```bash
npm install -D hive-agents
```

Add to `package.json`:
```json
{
  "scripts": {
    "hive": "hive"
  }
}
```

Create `hive.config.js` (optional — auto-discovers `apps/*/` if omitted):
```js
export default {
  agents: [
    { name: 'web',   dir: 'apps/web',   port: 3000, label: 'Web' },
    { name: 'api',   dir: 'apps/api',   port: 8000, label: 'API' },
  ]
}
```

Run:
```bash
npm run hive
# → Hive running at http://localhost:4199
```

## Docs

[hive-agents.dev](https://hive-agents.dev) — installation, configuration, API reference.

## License

MIT
