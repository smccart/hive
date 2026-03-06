import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import GitHubIcon from '../components/GitHubIcon'

export default function HeroSection() {
  return (
    <section className="pt-40 pb-24 px-6 text-center relative overflow-hidden">
      {/* Background glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'var(--color-brand)' }}
      />
      <div
        className="absolute top-20 right-[10%] w-75 h-62.5 rounded-full blur-3xl opacity-6 pointer-events-none"
        style={{ background: 'var(--color-purple)' }}
      />
      <div
        className="absolute top-32 left-[8%] w-62.5 h-50 rounded-full blur-3xl opacity-6 pointer-events-none"
        style={{ background: 'var(--color-blue)' }}
      />

      <div className="relative max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs text-neutral-300 border border-neutral-800 rounded-full px-3 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          Open source · MIT License
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
          All your Claude agents.<br />
          <span style={{ background: 'linear-gradient(90deg, var(--color-brand), var(--color-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>One tab.</span>
        </h1>

        <p className="text-lg text-neutral-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Drop HiveScan into any monorepo. Get a real-time web dashboard for managing multiple{' '}
          <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors">
            Claude Code
          </a>{' '}
          agents — terminals, status indicators, session persistence, model switching, and permissions management.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 font-mono text-sm text-neutral-300">
            <span className="text-neutral-500">$</span>
            npx hivescan
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/docs/introduction"
              className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-brand transition-colors"
            >
              Read the docs <ArrowRight size={14} />
            </Link>

            <a
              href="https://github.com/smccart/hive"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors"
            >
              <GitHubIcon size={14} />
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Terminal preview */}
      <div className="relative max-w-4xl mx-auto mt-20">
        <div className="rounded-xl border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-neutral-700" />
            <span className="w-3 h-3 rounded-full bg-neutral-700" />
            <span className="w-3 h-3 rounded-full bg-neutral-700" />
            <span className="ml-3 text-xs text-neutral-400 font-mono">localhost:4199</span>
          </div>
          <TerminalMockup />
        </div>
      </div>
    </section>
  )
}

function TerminalMockup() {
  const agents = [
    { name: 'web',    color: '#4ade80', status: 'thinking', port: ':5173' },
    { name: 'api',    color: '#60a5fa', status: 'running',  port: ':3001' },
    { name: 'admin',  color: '#c084fc', status: 'waiting',  port: null    },
    { name: 'worker', color: '#fb923c', status: 'stopped',  port: null    },
  ]

  const statusDot = (status: string, color: string) => {
    const bg = status === 'stopped' ? '#3f3f46' : color
    const animate = status === 'thinking' ? 'animate-pulse' : ''
    return <span className={`w-2 h-2 rounded-full shrink-0 ${animate}`} style={{ background: bg }} />
  }

  return (
    <div className="bg-[#0a0a0a] flex" style={{ minHeight: 320 }}>
      {/* Sidebar */}
      <div className="w-44 bg-[#111] border-r border-[#1e1e1e] flex flex-col shrink-0">
        <div className="px-3 py-2.5 flex items-center gap-2 border-b border-[#1e1e1e]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <span className="text-xs font-semibold text-neutral-300">HiveScan</span>
        </div>
        <div className="flex-1 py-1">
          {agents.map((a, i) => (
            <div
              key={a.name}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs cursor-default ${i === 0 ? 'bg-[#1c1c1c] border-l-2' : 'border-l-2 border-transparent'}`}
              style={i === 0 ? { borderColor: a.color } : undefined}
            >
              {statusDot(a.status, a.color)}
              <span className={i === 0 ? 'text-white' : 'text-neutral-400'}>{a.name}</span>
              {a.port && (
                <span className="ml-auto text-[10px] text-neutral-500">{a.port}</span>
              )}
              {a.status === 'waiting' && (
                <span className="ml-auto text-[10px] px-1 rounded bg-amber-500/10 text-amber-400">wait</span>
              )}
            </div>
          ))}
        </div>
        {/* Sidebar footer */}
        <div className="px-2 py-2 mt-auto border-t border-[#1e1e1e] flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
            <span className="flex-1 flex items-center gap-1 px-1.5 py-1 rounded" style={{ background: '#161616', border: '1px solid #1e1e1e' }}>
              <span className="text-neutral-500">Model</span>
              <span className="ml-auto text-neutral-300">opus-4</span>
            </span>
            <span className="flex items-center justify-center w-6 h-6 rounded" style={{ background: '#161616', border: '1px solid #1e1e1e' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="flex-1 flex items-center justify-center gap-1 px-1.5 py-1 rounded text-neutral-400" style={{ background: '#161616', border: '1px solid #1e1e1e' }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
              Permissions
            </span>
            <span className="flex items-center justify-center gap-1 px-1.5 py-1 rounded text-neutral-400" style={{ background: '#161616', border: '1px solid #1e1e1e' }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              All
            </span>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Agent header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1e1e1e] bg-[#0d0d0d]">
          <div className="w-1 h-4 rounded-full" style={{ background: '#4ade80' }} />
          {statusDot('thinking', '#4ade80')}
          <span className="text-xs font-medium text-white">web</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#4ade80]/10 text-[#4ade80]">thinking</span>
          <span className="text-[10px] text-neutral-500 ml-1">:5173</span>
          <div className="ml-auto flex items-center gap-1">
            {['Start', 'Stop', 'Restart'].map(label => (
              <span key={label} className="text-[10px] text-neutral-500 px-1.5 py-0.5 rounded" style={{ background: '#161616', border: '1px solid #1e1e1e' }}>{label}</span>
            ))}
            <span className="text-[10px] text-neutral-500 px-1 py-0.5 rounded" style={{ background: '#161616', border: '1px solid #1e1e1e' }}>?</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-[#1e1e1e] bg-[#0d0d0d]">
          <div className="flex items-center gap-0.5 px-2 py-1">
            {agents.filter(a => a.port).map((a, i) => (
              <span
                key={a.name}
                className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-t ${i === 0 ? 'bg-[#0a0a0a] text-white border-t border-x border-[#1e1e1e]' : 'text-neutral-500'}`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: a.color }} />
                {a.name}
                <span className="text-neutral-600">{a.port}</span>
              </span>
            ))}
          </div>
          <div className="ml-2 border-l border-[#1e1e1e] flex items-center gap-0.5 px-2 py-1">
            {agents.map((a, i) => (
              <span
                key={a.name}
                className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded ${i === 0 ? 'bg-[#1c1c1c] text-white' : 'text-neutral-500'}`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: a.status === 'stopped' ? '#3f3f46' : a.color }} />
                {a.name}
              </span>
            ))}
          </div>
        </div>

        {/* Terminal area */}
        <div className="flex-1 p-3 font-mono text-xs text-neutral-300 overflow-hidden">
          <div className="text-[#4ade80] mb-1">✓ Task complete: added dark mode toggle</div>
          <div className="text-neutral-500 mb-1">  Read [src/components/Header.tsx](src/components/Header.tsx)</div>
          <div className="text-neutral-300 mb-1">
            {'> '}I'll add the toggle to the header. Checking theme config first.
          </div>
          <div className="text-neutral-500 mb-1">  Read [src/theme/index.ts](src/theme/index.ts)</div>
          <div className="text-neutral-500 mb-1">  Write [src/components/Header.tsx](src/components/Header.tsx)</div>
          <div className="text-[#4ade80] mb-1">✓ Dark mode toggle added</div>
          <div className="text-neutral-500 mb-3">
            Run <span className="text-neutral-300">npm run dev</span> to preview.
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#4ade80]">◆</span>
            <span className="text-white">claude</span>
            <span className="text-neutral-500">web ›</span>
            <span className="w-2 h-4 bg-neutral-300 animate-pulse ml-1 inline-block" />
          </div>
        </div>
      </div>
    </div>
  )
}
