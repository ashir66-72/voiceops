import { useEffect, useState, useCallback } from 'react'
import { useVoiceAgent } from './useVoiceAgent'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'

function App() {
  const { status, transcript, start, stop } = useVoiceAgent()
  const [snapshot, setSnapshot] = useState(null)
  const [bestSellers, setBestSellers] = useState([])
  const [overdue, setOverdue] = useState([])
  const [activity, setActivity] = useState([])

  const refreshDashboard = useCallback(async () => {
  try {
    const [sRes, bRes, oRes, aRes] = await Promise.all([
      fetch(`${BACKEND_URL}/tools/business_snapshot`),
      fetch(`${BACKEND_URL}/tools/best_sellers?limit=5`),
      fetch(`${BACKEND_URL}/tools/overdue_payments`),
      fetch(`${BACKEND_URL}/tools/activity_log?limit=10`),
    ])
    const s = sRes.ok ? await sRes.json() : null
    const b = bRes.ok ? await bRes.json() : { best_sellers: [] }
    const o = oRes.ok ? await oRes.json() : { overdue_payments: [] }
    const a = aRes.ok ? await aRes.json() : { activity_log: [] }
    setSnapshot(s)
    setBestSellers(b.best_sellers ?? [])
    setOverdue(o.overdue_payments ?? [])
    setActivity(a.activity_log ?? [])
  } catch (err) {
    console.error('Dashboard refresh failed:', err)
  }
}, [])

  useEffect(() => { refreshDashboard() }, [refreshDashboard])

  // Auto-refresh after any tool call, so a write action shows up live
  useEffect(() => {
    const last = transcript[transcript.length - 1]
    if (last?.who === 'tool') refreshDashboard()
  }, [transcript, refreshDashboard])

  return (
    <div className="min-h-screen p-6 md:p-10">
      <header className="mb-8 flex items-baseline justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">Urban Bites</h1>
          <p className="text-sm text-[var(--color-ink-muted)]">VoiceOps operator dashboard</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: status === 'error' ? 'var(--color-alert)' : 'var(--color-accent)' }}
          ></span>
          {status}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-line)] rounded-md p-6 flex flex-col">
          <button
            onClick={status === 'idle' || status === 'error' ? start : stop}
            className="w-full py-3 rounded-md text-white font-medium mb-6"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            {status === 'idle' || status === 'error' ? 'Start call' : 'End call'}
          </button>
          <div className="flex-1 space-y-3 text-sm overflow-y-auto max-h-[420px]">
            {transcript.length === 0 && (
              <p className="text-[var(--color-ink-muted)]">Start a call and ask about Urban Bites.</p>
            )}
            {transcript.map((line) => (
              <p key={line.id} className={line.who === 'tool' ? 'text-xs' : ''} style={{ color: line.who === 'tool' ? 'var(--color-spice)' : undefined }}>
                {line.who !== 'tool' && <span className="text-[var(--color-ink-muted)]">{line.who}: </span>}
                {line.who === 'tool' ? `tool: ${line.text}` : line.text}
              </p>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-md">
            <div className="grid grid-cols-4 divide-x divide-[var(--color-line)]">
              {[
                { label: 'Customers', value: snapshot?.total_customers ?? '—' },
                { label: 'Orders', value: snapshot?.total_orders ?? '—' },
                { label: 'Revenue', value: snapshot ? `$${snapshot.total_revenue.toFixed(2)}` : '—', accent: true },
                { label: 'Overdue', value: snapshot?.overdue_payment_count ?? '—', alert: true },
              ].map((kpi) => (
                <div key={kpi.label} className="p-4">
                  <p className="text-xs text-[var(--color-ink-muted)] mb-1">{kpi.label}</p>
                  <p
                    className="font-[family-name:var(--font-display)] text-2xl"
                    style={{ color: kpi.alert ? 'var(--color-alert)' : kpi.accent ? 'var(--color-spice)' : 'var(--color-ink)' }}
                  >
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-display)] text-lg mb-3">Best sellers</h2>
            <ol className="space-y-2 text-sm">
              {bestSellers.map((p, i) => (
                <li key={p.product_id} className="flex justify-between">
                  <span>{i + 1}. {p.product_name}</span>
                  <span className="text-[var(--color-ink-muted)]">{p.total_quantity_sold} sold</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-display)] text-lg mb-3">Overdue payments</h2>
            <ul className="space-y-2 text-sm">
              {overdue.length === 0 && <li className="text-[var(--color-ink-muted)]">None right now.</li>}
              {overdue.map((p) => (
                <li key={p.payment_id} className="border-l-2 pl-3 flex justify-between" style={{ borderColor: 'var(--color-alert)' }}>
                  <span>{p.customer_name}</span>
                  <span style={{ color: 'var(--color-alert)' }}>${p.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-display)] text-lg mb-3">Activity</h2>
            <ul className="space-y-1 text-xs text-[var(--color-ink-muted)]">
              {activity.map((a) => <li key={a.id}>{a.description}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App