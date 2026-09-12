import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletBar } from './components/WalletBar'
import { NetworkPulse } from './components/NetworkPulse'
import { PortfolioPanel } from './components/PortfolioPanel'
import { ActivityFeed } from './components/ActivityFeed'
import { SendPanel } from './components/SendPanel'
import { useNetworkStats } from './hooks/useNetworkStats'
import { useWalletActivity } from './hooks/useWalletActivity'
import { COOKIE_BRIDGE, COOKIE_DOCS, COOKIE_ONBOARD } from './lib/cookiechain'

export default function App() {
  const { publicKey, connected } = useWallet()
  const { stats, loading: netLoading } = useNetworkStats(5000)
  const [refreshKey, setRefreshKey] = useState(0)
  const activity = useWalletActivity(publicKey, refreshKey)

  return (
    <div className="app">
      <div className="bg-glow" aria-hidden />
      <header className="top">
        <div className="brand">
          <span className="logo" aria-hidden>
            🍪
          </span>
          <div>
            <h1>CookiePulse</h1>
            <p className="tagline">Portfolio + activity dashboard for Cookie Chain</p>
          </div>
        </div>
        <WalletBar />
      </header>

      <main className="layout">
        <NetworkPulse stats={stats} loading={netLoading} />
        <PortfolioPanel activity={activity} />
        <SendPanel onSuccess={() => setRefreshKey((k) => k + 1)} />
        <ActivityFeed signatures={activity.signatures} connected={connected} loading={activity.loading} />
      </main>

      <footer className="foot">
        <p>
          Built for{' '}
          <a href="https://superteam.fun" target="_blank" rel="noreferrer">
            Superteam Earn
          </a>{' '}
          · Cookie Chain cApp ·{' '}
          <a href={COOKIE_DOCS} target="_blank" rel="noreferrer">
            Docs
          </a>{' '}
          ·{' '}
          <a href={COOKIE_ONBOARD} target="_blank" rel="noreferrer">
            Onboard
          </a>{' '}
          ·{' '}
          <a href={COOKIE_BRIDGE} target="_blank" rel="noreferrer">
            Bridge (Hyperlane)
          </a>
        </p>
        <p className="muted sm">
          Nightly required. Point wallet RPC to https://rpc.cookiescan.io. Native token is COOK (9 decimals).
        </p>
      </footer>
    </div>
  )
}
