const TERM_THEME = {
  background:          '#0a0a0a',
  foreground:          '#e4e4e7',
  cursor:              '#e4e4e7',
  cursorAccent:        '#0a0a0a',
  selectionBackground: '#3f3f46',
  black:    '#18181b', brightBlack:   '#52525b',
  red:      '#f87171', brightRed:     '#fca5a5',
  green:    '#4ade80', brightGreen:   '#86efac',
  yellow:   '#facc15', brightYellow:  '#fde047',
  blue:     '#60a5fa', brightBlue:    '#93c5fd',
  magenta:  '#c084fc', brightMagenta: '#d8b4fe',
  cyan:     '#34d399', brightCyan:    '#6ee7b7',
  white:    '#e4e4e7', brightWhite:   '#f4f4f5',
}

// State — populated from /api/agents (fully dynamic, no hardcoded names)
let agentOrder = []       // ordered list of agent names from server
let agents = {}           // { name: { label, port, color, running, active } }
let activeAgent = null
const terminals = {}
const agentStatus = {}
const agentActivity = {}

// ── DOM refs ──
const agentListEl    = document.getElementById('agent-list')
const termContainer  = document.getElementById('terminal-container')
const headerColorBar = document.getElementById('header-color-bar')
const headerDot      = document.getElementById('header-dot')
const headerName     = document.getElementById('header-name')
const headerPort     = document.getElementById('header-port')
const btnStart       = document.getElementById('btn-start')
const btnStop        = document.getElementById('btn-stop')
const btnStartAll    = document.getElementById('btn-start-all')
const btnStopAll     = document.getElementById('btn-stop-all')
const modelSelect    = document.getElementById('model-select')

// ── Init ──

async function init() {
  const [agentData, modelData] = await Promise.all([
    fetch('/api/agents').then(r => r.json()),
    fetch('/api/model').then(r => r.json()),
  ])

  // Populate model selector
  for (const m of modelData.models) {
    const opt = document.createElement('option')
    opt.value = m.id
    opt.textContent = m.label
    if (m.id === modelData.model) opt.selected = true
    modelSelect.appendChild(opt)
  }

  // Use server-provided order
  agentOrder = agentData.order ?? Object.keys(agentData.agents)

  for (const name of agentOrder) {
    const a = agentData.agents[name]
    if (!a) continue
    agents[name] = a
    agentStatus[name] = a.running
    agentActivity[name] = a.active ?? false
  }

  renderSidebar()
  if (agentOrder.length > 0) selectAgent(agentOrder[0])
}

modelSelect.addEventListener('change', () => {
  fetch('/api/model', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: modelSelect.value }),
  })
})

// ── Sidebar ──

function renderSidebar() {
  agentListEl.innerHTML = ''
  for (const name of agentOrder) {
    const agent = agents[name]
    if (!agent) continue

    const item = document.createElement('div')
    item.className = 'agent-item'
    item.dataset.name = name
    item.style.setProperty('--agent-color', agent.color)

    item.innerHTML = `
      <span class="agent-color-dot ${agentStatus[name] ? 'running' : ''}"
            style="background:${agent.color}"></span>
      <span class="agent-info">
        <span class="agent-label">${agent.label}</span>
        <span class="agent-meta">${agent.port ? `:${agent.port}` : 'agent'}</span>
      </span>
      <span class="agent-status ${agentStatus[name] ? 'running' : ''}"></span>
    `

    item.addEventListener('click', () => selectAgent(name))
    agentListEl.appendChild(item)
  }
}

function updateSidebarItem(name) {
  const item = agentListEl.querySelector(`[data-name="${name}"]`)
  if (!item) return
  const running = agentStatus[name]
  const active  = agentActivity[name]
  const dot    = item.querySelector('.agent-color-dot')
  const status = item.querySelector('.agent-status')
  if (dot) {
    dot.classList.toggle('running', running)
    dot.classList.toggle('thinking', running && active)
  }
  if (status) status.classList.toggle('running', running)
}

// ── Select / switch agent ──

function selectAgent(name) {
  if (!agents[name]) return

  if (activeAgent && terminals[activeAgent]) {
    terminals[activeAgent].div.classList.remove('active')
  }
  agentListEl.querySelectorAll('.agent-item').forEach(el => {
    el.classList.toggle('active', el.dataset.name === name)
  })

  activeAgent = name
  const agent = agents[name]

  headerColorBar.style.background = agent.color
  headerDot.style.background = agent.color
  headerDot.classList.toggle('thinking', agentActivity[name] ?? false)
  headerName.textContent = agent.label

  if (agent.port) {
    headerPort.textContent = `:${agent.port}`
    headerPort.href = `http://localhost:${agent.port}`
    headerPort.classList.add('linkable')
  } else {
    headerPort.textContent = 'agent'
    headerPort.removeAttribute('href')
    headerPort.classList.remove('linkable')
  }
  headerPort.style.display = ''
  document.documentElement.style.setProperty('--active-color', agent.color)

  updateHeaderButtons()

  if (!terminals[name]) createTerminal(name)
  terminals[name].div.classList.add('active')

  requestAnimationFrame(() => {
    const savedY = terminals[name].term.buffer.active.viewportY
    terminals[name].fitAddon.fit()
    terminals[name].term.scrollToLine(savedY)
  })
}

// ── Terminal creation ──

function createTerminal(name) {
  const div = document.createElement('div')
  div.className = 'terminal-instance'
  termContainer.appendChild(div)

  const term = new Terminal({
    theme: TERM_THEME,
    fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, "Courier New", monospace',
    fontSize: 13,
    lineHeight: 1.4,
    cursorBlink: true,
    scrollback: 5000,
    allowTransparency: true,
    macOptionIsMeta: true,
  })

  const fitAddon = new FitAddon.FitAddon()
  term.loadAddon(fitAddon)
  term.open(div)
  fitAddon.fit()

  const wsRef = { current: null }

  term.onData((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'input', data }))
    }
  })

  let resizeTimer = null
  const resizeObserver = new ResizeObserver(() => {
    if (!div.classList.contains('active')) return
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      const savedY = term.buffer.active.viewportY
      fitAddon.fit()
      term.scrollToLine(savedY)
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }))
      }
    }, 50)
  })
  resizeObserver.observe(termContainer)

  terminals[name] = { term, fitAddon, div, ws: wsRef, resizeObserver }
  connectWS(name, term, wsRef)
}

// ── WebSocket ──

function connectWS(name, term, wsRef, skipBuffer = false) {
  const wsUrl = `ws://${location.host}/ws?agent=${name}&skipBuffer=${skipBuffer}`
  const ws = new WebSocket(wsUrl)
  wsRef.current = ws

  ws.addEventListener('message', (e) => {
    try {
      const msg = JSON.parse(e.data)
      if (msg.type === 'output') {
        term.write(msg.data)
      } else if (msg.type === 'status') {
        agentStatus[name] = msg.running
        updateSidebarItem(name)
        if (name === activeAgent) updateHeaderButtons()
      } else if (msg.type === 'activity') {
        agentActivity[name] = msg.active
        updateSidebarItem(name)
        if (name === activeAgent) headerDot.classList.toggle('thinking', msg.active)
      }
    } catch { /* ignore */ }
  })

  ws.addEventListener('close', () => {
    term.write('\r\n\x1b[90m[disconnected — reconnecting...]\x1b[0m\r\n')
    setTimeout(() => {
      if (!terminals[name]) return
      connectWS(name, term, wsRef, true)
    }, 3000)
  })
}

// ── Header buttons ──

function updateHeaderButtons() {
  if (!activeAgent) return
  const running = agentStatus[activeAgent]
  btnStart.style.opacity = running ? '0.4' : '1'
  btnStop.style.opacity  = running ? '1'   : '0.4'
}

btnStart.addEventListener('click', async () => {
  if (!activeAgent) return
  await fetch(`/api/agents/${activeAgent}/start`, { method: 'POST' })
  agentStatus[activeAgent] = true
  updateSidebarItem(activeAgent)
  updateHeaderButtons()
})

btnStop.addEventListener('click', async () => {
  if (!activeAgent) return
  await fetch(`/api/agents/${activeAgent}/stop`, { method: 'POST' })
  agentStatus[activeAgent] = false
  updateSidebarItem(activeAgent)
  updateHeaderButtons()
})

btnStartAll.addEventListener('click', async () => {
  for (const name of agentOrder) {
    await fetch(`/api/agents/${name}/start`, { method: 'POST' })
    agentStatus[name] = true
    updateSidebarItem(name)
  }
  updateHeaderButtons()
})

btnStopAll.addEventListener('click', async () => {
  for (const name of agentOrder) {
    await fetch(`/api/agents/${name}/stop`, { method: 'POST' })
    agentStatus[name] = false
    updateSidebarItem(name)
  }
  updateHeaderButtons()
})

// ── Keyboard shortcuts: Alt+1–9 ──
document.addEventListener('keydown', (e) => {
  if (e.altKey && !e.ctrlKey && !e.metaKey) {
    const idx = parseInt(e.key, 10) - 1
    const name = agentOrder[idx]
    if (name && agents[name]) {
      e.preventDefault()
      selectAgent(name)
    }
  }
})

init()
