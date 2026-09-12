import { explorerTx, shortAddr } from '../lib/cookiechain'
import type { ConfirmedSignatureInfo } from '@solana/web3.js'

export function ActivityFeed({
  signatures,
  connected,
  loading,
}: {
  signatures: ConfirmedSignatureInfo[]
  connected: boolean
  loading: boolean
}) {
  return (
    <section className="card">
      <div className="card-head">
        <div>
          <p className="eyebrow">Activity</p>
          <h2>Recent signatures</h2>
        </div>
      </div>

      {!connected && <p className="muted">Connect a wallet to load on-chain history.</p>}
      {connected && loading && signatures.length === 0 && <p className="muted">Loading signatures…</p>}
      {connected && !loading && signatures.length === 0 && (
        <p className="muted">No signatures yet — send a memo below to create your first CookiePulse tx.</p>
      )}

      <ul className="tx-list">
        {signatures.map((s) => {
          const ok = !s.err
          const when = s.blockTime ? new Date(s.blockTime * 1000).toLocaleString() : 'pending'
          return (
            <li key={s.signature} className="tx-row">
              <span className={`dot ${ok ? 'ok' : 'err'}`} title={ok ? 'success' : 'failed'} />
              <div className="tx-main">
                <a href={explorerTx(s.signature)} target="_blank" rel="noreferrer" className="mono link">
                  {shortAddr(s.signature, 8)}
                </a>
                <span className="muted sm">{s.memo ? `memo: ${s.memo}` : when}</span>
              </div>
              <span className="muted sm mono">{s.slot?.toLocaleString() ?? '—'}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
