import { useCallback, useEffect, useState } from 'react'
import { PublicKey, type ConfirmedSignatureInfo } from '@solana/web3.js'
import { createCookieConnection, lamportsToCook } from '../lib/cookiechain'
import { getAssetsByOwner, type DasAssetSummary } from '../lib/das'

export type WalletActivity = {
  balanceLamports: number
  balanceCook: number
  signatures: ConfirmedSignatureInfo[]
  assets: DasAssetSummary
  loading: boolean
  error?: string
  lastRefresh: number
}

export function useWalletActivity(pubkey: PublicKey | null, refreshKey = 0) {
  const [state, setState] = useState<WalletActivity>({
    balanceLamports: 0,
    balanceCook: 0,
    signatures: [],
    assets: { total: 0, sampleNames: [] },
    loading: false,
    lastRefresh: 0,
  })

  const refresh = useCallback(async () => {
    if (!pubkey) {
      setState({
        balanceLamports: 0,
        balanceCook: 0,
        signatures: [],
        assets: { total: 0, sampleNames: [] },
        loading: false,
        lastRefresh: 0,
      })
      return
    }
    setState((s) => ({ ...s, loading: true, error: undefined }))
    const connection = createCookieConnection()
    try {
      const [bal, sigs, assets] = await Promise.all([
        connection.getBalance(pubkey, 'confirmed'),
        connection.getSignaturesForAddress(pubkey, { limit: 12 }, 'confirmed'),
        getAssetsByOwner(pubkey.toBase58()),
      ])
      setState({
        balanceLamports: bal,
        balanceCook: lamportsToCook(bal),
        signatures: sigs,
        assets,
        loading: false,
        lastRefresh: Date.now(),
      })
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e.message : String(e),
        lastRefresh: Date.now(),
      }))
    }
  }, [pubkey])

  useEffect(() => {
    void refresh()
  }, [refresh, refreshKey])

  return { ...state, refresh }
}
