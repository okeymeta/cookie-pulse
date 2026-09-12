import { useMemo, type ReactNode } from 'react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { NightlyWalletAdapter } from '@solana/wallet-adapter-nightly'
import { COOKIE_RPC, COOKIE_WSS } from '../lib/cookiechain'
import '@solana/wallet-adapter-react-ui/styles.css'

export function WalletProvider({ children }: { children: ReactNode }) {
  const endpoint = COOKIE_RPC
  const wallets = useMemo(() => [new NightlyWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: 'confirmed', wsEndpoint: COOKIE_WSS }}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
