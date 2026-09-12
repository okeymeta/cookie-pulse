import { useWallet } from '@solana/wallet-adapter-react'
import {
  COOKIE_BRIDGE,
  COOKIE_ONBOARD,
  explorerAddress,
  formatCook,
  NATIVE_SYMBOL,
  shortAddr,
} from '../lib/cookiechain'
import type { useWalletActivity } from '../hooks/useWalletActivity'

type Activity = ReturnType<typeof useWalletActivity>

export function PortfolioPanel({ activity }: { activity: Activity }) {
  const { publicKey, connected } = useWallet()

  if (!connected || !publicKey) {
    return (
      <section className="card">
        <p className="eyebrow">Portfolio</p>
        <h2>Connect Nightly to begin</h2>
        <p className="muted">
          CookiePulse reads your native {NATIVE_SYMBOL} balance, recent signatures, and DAS assets on Cookie
          Chain. Install{' '}
          <a href="https://nightly.app" target="_blank" rel="noreferrer">
            Nightly
          </a>
          , then connect and switch to Cookie Chain RPC.
        </p>
        <div className="cta-row">
          <a className="btn ghost" href={COOKIE_ONBOARD} target="_blank" rel="noreferrer">
            Onboard
          </a>
          <a className="btn ghost" href={COOKIE_BRIDGE} target="_blank" rel="noreferrer">
            Bridge COOK
          </a>
        </div>
      </section>
    )
  }

  return (
    <section className="card portfolio-card">
      <div className="card-head">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h2>
            <a href={explorerAddress(publicKey.toBase58())} target="_blank" rel="noreferrer" className="mono link">
              {shortAddr(publicKey.toBase58(), 6)}
            </a>
          </h2>
        </div>
        <button type="button" className="btn ghost sm" onClick={() => void activity.refresh()} disabled={activity.loading}>
          {activity.loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <div className="balance-hero">
        <span className="stat-label">Native balance</span>
        <p className="balance-value">
          {formatCook(activity.balanceCook, 6)} <span className="unit">{NATIVE_SYMBOL}</span>
        </p>
        <p className="muted mono">{activity.balanceLamports.toLocaleString()} lamports</p>
      </div>

      <div className="stat-grid tight">
        <div className="stat">
          <span className="stat-label">Recent txs</span>
          <span className="stat-value mono">{activity.signatures.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">DAS assets</span>
          <span className="stat-value mono">{activity.assets.total}</span>
        </div>
      </div>

      {activity.assets.sampleNames.length > 0 && (
        <p className="muted tags">
          {activity.assets.sampleNames.map((n) => (
            <span key={n} className="tag">
              {n}
            </span>
          ))}
        </p>
      )}

      {activity.balanceCook === 0 && (
        <p className="hint">
          Need {NATIVE_SYMBOL} for fees? Bridge via{' '}
          <a href={COOKIE_BRIDGE} target="_blank" rel="noreferrer">
            hyperlane.cookiescan.io
          </a>
          .
        </p>
      )}

      {activity.error && <p className="error-text">{activity.error}</p>}
    </section>
  )
}
