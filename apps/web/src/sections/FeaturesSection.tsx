import { Layers, Zap, RotateCcw, Settings2 } from 'lucide-react'

const features = [
  {
    icon: Layers,
    title: 'Multi-agent dashboard',
    description:
      'One xterm.js terminal per agent. Switch between them instantly with keyboard shortcuts (Alt+1–9) or the sidebar. No more tab hunting.',
  },
  {
    icon: RotateCcw,
    title: 'Session persistence',
    description:
      'Hive buffers terminal output to disk. Restart the server and your agents\' history is right where you left it.',
  },
  {
    icon: Zap,
    title: 'Live activity indicators',
    description:
      'Animated status dots show you which agents are running and which are actively processing — so you always know what\'s happening.',
  },
  {
    icon: Settings2,
    title: 'Zero config, fully configurable',
    description:
      'Auto-discovers apps/* and packages/* directories in your monorepo. Drop in a hive.config.js to customize agents, ports, labels, and colors.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 border-t border-neutral-800/60">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Everything you need</h2>
          <p className="text-neutral-400 max-w-lg mx-auto">
            Hive is purpose-built for Claude Code monorepo workflows. Small API surface, zero fluff.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 hover:border-neutral-700 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: 'var(--color-brand-glow)', color: 'var(--color-brand)' }}
              >
                <f.icon size={18} />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
