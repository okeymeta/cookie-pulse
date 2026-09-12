import { Connection } from '@solana/web3.js'

/** Cookie Chain community endpoints — verify at docs.cookiechain.wtf */
export const COOKIE_RPC = 'https://rpc.cookiescan.io'
export const COOKIE_WSS = 'wss://wss.cookiescan.io'
export const COOKIE_DAS_API = 'https://api.cookiescan.io'
export const COOKIE_EXPLORER = 'https://cookiescan.io'
export const COOKIE_BRIDGE = 'https://hyperlane.cookiescan.io'
export const COOKIE_DOCS = 'https://docs.cookiechain.wtf'
export const COOKIE_ONBOARD = 'https://onboard.cookiechain.wtf'

/** Verified via getGenesisHash on rpc.cookiescan.io */
export const COOKIE_GENESIS_HASH = '9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2'

export const NATIVE_SYMBOL = 'COOK'
export const NATIVE_DECIMALS = 9

export function createCookieConnection(commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed') {
  return new Connection(COOKIE_RPC, {
    commitment,
    wsEndpoint: COOKIE_WSS,
  })
}

export function explorerTx(sig: string) {
  return `${COOKIE_EXPLORER}/tx/${sig}`
}

export function explorerAddress(addr: string) {
  return `${COOKIE_EXPLORER}/account/${addr}`
}

export function shortAddr(addr: string, n = 4) {
  if (!addr || addr.length < n * 2 + 3) return addr
  return `${addr.slice(0, n)}…${addr.slice(-n)}`
}

export function lamportsToCook(lamports: number | bigint) {
  const v = typeof lamports === 'bigint' ? Number(lamports) : lamports
  return v / 10 ** NATIVE_DECIMALS
}

export function formatCook(amount: number, digits = 4) {
  if (!Number.isFinite(amount)) return '—'
  if (amount === 0) return '0'
  if (amount < 0.0001) return amount.toExponential(2)
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  })
}

/** Nightly custom SVM network payload */
export function nightlyCookieNetwork() {
  return {
    genesisHash: COOKIE_GENESIS_HASH,
    url: COOKIE_RPC,
  }
}

declare global {
  interface Window {
    nightly?: {
      solana?: {
        changeNetwork?: (n: { genesisHash: string; url?: string }) => Promise<unknown>
        genesisHash?: string
      }
    }
  }
}

export async function ensureNightlyOnCookieChain() {
  const nightly = window.nightly?.solana
  if (!nightly?.changeNetwork) return { ok: false, reason: 'Nightly not detected' as const }
  try {
    await nightly.changeNetwork(nightlyCookieNetwork())
    return { ok: true as const }
  } catch (e) {
    return { ok: false as const, reason: e instanceof Error ? e.message : String(e) }
  }
}

