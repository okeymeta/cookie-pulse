import { COOKIE_DAS_API } from './cookiechain'

export type DasAssetSummary = {
  total: number
  sampleNames: string[]
}

export async function getAssetsByOwner(owner: string, limit = 20): Promise<DasAssetSummary> {
  try {
    const res = await fetch(COOKIE_DAS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'cookiepulse',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: owner,
          page: 1,
          limit,
          displayOptions: { showFungible: true },
        },
      }),
    })
    if (!res.ok) throw new Error(`DAS HTTP ${res.status}`)
    const json = await res.json()
    if (json.error) throw new Error(json.error.message || 'DAS error')
    const items = json.result?.items ?? []
    const total = json.result?.total ?? items.length
    const sampleNames = items
      .slice(0, 5)
      .map((a: { content?: { metadata?: { name?: string; symbol?: string } } }) => {
        const m = a.content?.metadata
        return m?.symbol || m?.name || 'asset'
      })
    return { total, sampleNames }
  } catch {
    return { total: 0, sampleNames: [] }
  }
}
