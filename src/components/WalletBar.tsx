import { useCallback, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { COOKIE_RPC, COOKIE_GENESIS_HASH, ensureNightlyOnCookieChain, shortAddr } from '../lib/cookiechain'

export function WalletBar() {
  const { connected, publicKey, disconnect, connecting, wallet } = useWallet()
  const { setVisible } = useWalletModal()
  const [netMsg, setNetMsg] = useState<string | null>(null)

  const switchNetwork = useCallback(async () => {
    setNetMsg('Requesting Cookie Chain in Nightly…')
    const res = await ensureNightlyOnCookieChain()
    setNetMsg(res.ok ? 'Nightly set to Cookie Chain RPC' : `Network switch: ${res.reason}`)
  }, [])

  return (
    <div className="wallet-bar">
      <div className="wallet-meta">
        <span className="chain-badge">Cookie Chain · SVM</span>
        <span className="muted sm mono hide-sm">{COOKIE_RPC.replace('https://', '')}</span>
      </div>
      <div className="wallet-actions">
        {connected && (
          <button type="button" className="btn ghost sm" onClick={() => void switchNetwork()}>
            Sync Nightly net
          </button>
        )}
        {connected && publicKey ? (
          <>
            <span className="addr mono">{shortAddr(publicKey.toBase58(), 4)}</span>
            <button type="button" className="btn ghost sm" onClick={() => void disconnect()}>
              Disconnect
            </button>
          </>
        ) : (
          <button type="button" className="btn primary" onClick={() => setVisible(true)} disabled={connecting}>
            {connecting ? 'Connecting…' : 'Connect Nightly'}
          </button>
        )}
      </div>
      {wallet && connected && <p className="muted sm net-msg">Adapter: {wallet.adapter.name}</p>}
      {netMsg && <p className="muted sm net-msg">{netMsg} · genesis {COOKIE_GENESIS_HASH.slice(0, 8)}…</p>}
    </div>
  )
}
