#!/usr/bin/env node

import { existsSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const CWD = process.cwd()

// ── Load config ──────────────────────────────────────────────────────────────

async function loadConfig() {
  // Try hive.config.js (ESM)
  const jsConfig = join(CWD, 'hive.config.js')
  if (existsSync(jsConfig)) {
    const mod = await import(pathToFileURL(jsConfig).href)
    return mod.default ?? mod
  }

  // Try hive.config.json
  const jsonConfig = join(CWD, 'hive.config.json')
  if (existsSync(jsonConfig)) {
    const { readFileSync } = await import('node:fs')
    return JSON.parse(readFileSync(jsonConfig, 'utf8'))
  }

  // Auto-discover: scan apps/* and packages/*
  return autoDiscover()
}

function autoDiscover() {
  const COLOR_PALETTE = [
    '#4ade80', '#34d399', '#fb923c', '#60a5fa',
    '#94a3b8', '#c084fc', '#818cf8', '#fbbf24',
    '#f472b6', '#38bdf8', '#a3e635', '#f97316',
  ]

  const agents = []
  let colorIdx = 0

  for (const base of ['apps', 'packages']) {
    const dir = join(CWD, base)
    if (!existsSync(dir)) continue
    for (const entry of readdirSync(dir).sort()) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        agents.push({
          name: entry,
          dir: `${base}/${entry}`,
          label: toLabel(entry),
          color: COLOR_PALETTE[colorIdx++ % COLOR_PALETTE.length],
        })
      }
    }
  }

  if (agents.length === 0) {
    // Fallback: just use CWD itself
    agents.push({ name: 'main', dir: '.', label: 'Main', color: COLOR_PALETTE[0] })
  }

  console.log(`\n  Hive: auto-discovered ${agents.length} agent(s) from apps/ and packages/`)
  console.log('  Create hive.config.js to customize.\n')
  return { agents }
}

function toLabel(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

// ── Start ─────────────────────────────────────────────────────────────────────

const config = await loadConfig()
const { startServer } = await import('./server.js')
startServer(config, CWD)
