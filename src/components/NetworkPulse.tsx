import { COOKIE_EXPLORER, COOKIE_RPC } from '../lib/cookiechain'
import type { NetworkStats } from '../hooks/useNetworkStats'
import { Sparkline } from './Sparkline'

export function NetworkPulse({ stats, loading }: { stats: NetworkStats | null; loading: boolean }) {
  const epochPct = stats ? (stats.slotIndex / Math.max(stats.slotsInEpoch, 1)) * 100 : 0
  return (
    <section className="card network-card">
      <div className="card-head">
        <div>
          <p className="eyebrow">Network pulse</p>
          <h2>Cookie Chain live</h2>
        </div>
        <span className={`pill ${stats?.health === 'ok' ? 'ok' : 'warn'}`}>
          {loading && !stats ? 'syncing…' : stats?.health ?? '—'}
        </span>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <span className="stat-label">Slot</span>
          <span className="stat-value mono">{stats?.slot?.toLocaleString() ?? '—'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Block height</span>
          <span className="stat-value mono">{stats?.blockHeight?.toLocaleString() ?? '—'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Epoch</span>
          <span className="stat-value mono">{stats?.epoch ?? '—'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Tx count</span>
          <span className="stat-value mono">{stats?.transactionCount?.toLocaleString() ?? '—'}</span>
        </div>
      </div>

      <div className="spark-row">
        <div>
          <p className="stat-label">Slot advance</p>
          <Sparkline data={stats?.slotHistory ?? []} width={220} height={48} />
        </div>
        <div className="epoch-bar-wrap">
          <div className="epoch-meta">
            <span className="stat-label">Epoch progress</span>
            <span className="mono muted">{epochPct.toFixed(1)}%</span>
          </div>
          <div className="epoch-bar">
            <div className="epoch-fill" style={{ width: `${epochPct}%` }} />
          </div>
        </div>
      </div>

      {stats?.error && <p className="error-text">{stats.error}</p>}

      <p className="footer-note">
        RPC <code>{COOKIE_RPC}</code> ·{' '}
        <a href={COOKIE_EXPLORER} target="_blank" rel="noreferrer">
          cookiescan.io
        </a>
      </p>
    </section>
  )
}
