const steps = [
  {
    n: '1',
    title: 'Install',
    code: 'npm install -D hive-agents',
    description: 'Add Hive to your monorepo as a dev dependency. Works with npm, pnpm, and yarn.',
  },
  {
    n: '2',
    title: 'Add a script',
    code: '"hive": "hive"',
    description: 'Add a script to your root package.json. Optionally create hive.config.js to define your agents.',
  },
  {
    n: '3',
    title: 'Run',
    code: 'npm run hive',
    description: 'Open localhost:4199 and manage all your Claude Code agents from one browser tab.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-6 border-t border-neutral-800/60">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Up in three steps</h2>
          <p className="text-neutral-400">Drop it in, run it, done.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.n} className="text-center sm:text-left">
              <div
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mb-4"
                style={{ background: 'var(--color-brand-glow)', color: 'var(--color-brand)', border: '1px solid var(--color-brand)' }}
              >
                {step.n}
              </div>
              <h3 className="font-semibold text-white mb-2">{step.title}</h3>
              <pre className="text-left text-xs bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 font-mono text-neutral-300 mb-3 overflow-x-auto">
                {step.code}
              </pre>
              <p className="text-sm text-neutral-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
