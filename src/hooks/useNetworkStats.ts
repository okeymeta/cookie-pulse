import { useCallback, useEffect, useState } from 'react'
import { COOKIE_RPC, createCookieConnection } from '../lib/cookiechain'

export type NetworkStats = {
  slot: number
  blockHeight: number
  epoch: number
  slotIndex: number
  slotsInEpoch: number
  transactionCount: number
  health: string
  slotHistory: number[]
  updatedAt: number
  error?: string
}

const MAX_POINTS = 24

async function fetchHealth(): Promise<string> {
  try {
    const res = await fetch(COOKIE_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getHealth', params: [] }),
    })
    const json = await res.json()
    return typeof json.result === 'string' ? json.result : 'ok'
  } catch {
    return 'unknown'
  }
}

export function useNetworkStats(pollMs = 4000) {
  const [stats, setStats] = useState<NetworkStats | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const connection = createCookieConnection()
    try {
      const [slot, epochInfo, health] = await Promise.all([
        connection.getSlot('confirmed'),
        connection.getEpochInfo('confirmed'),
        fetchHealth(),
      ])
      setStats((prev) => {
        const hist = [...(prev?.slotHistory ?? []), slot].slice(-MAX_POINTS)
        return {
          slot,
          blockHeight: epochInfo.blockHeight ?? 0,
          epoch: epochInfo.epoch,
          slotIndex: epochInfo.slotIndex,
          slotsInEpoch: epochInfo.slotsInEpoch,
          transactionCount: epochInfo.transactionCount ?? 0,
          health,
          slotHistory: hist,
          updatedAt: Date.now(),
        }
      })
      setLoading(false)
    } catch (e) {
      setStats((prev) =>
        prev
          ? { ...prev, error: e instanceof Error ? e.message : String(e) }
          : {
              slot: 0,
              blockHeight: 0,
              epoch: 0,
              slotIndex: 0,
              slotsInEpoch: 1,
              transactionCount: 0,
              health: 'error',
              slotHistory: [],
              updatedAt: Date.now(),
              error: e instanceof Error ? e.message : String(e),
            },
      )
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const id = window.setInterval(() => void refresh(), pollMs)
    return () => window.clearInterval(id)
  }, [refresh, pollMs])

  return { stats, loading, refresh }
}
