import { useCallback, useState } from 'react'
import { Buffer } from 'buffer'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import {
  COOKIE_EXPLORER,
  NATIVE_DECIMALS,
  NATIVE_SYMBOL,
  ensureNightlyOnCookieChain,
  explorerTx,
} from '../lib/cookiechain'

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')

type Status =
  | { kind: 'idle' }
  | { kind: 'pending'; message: string }
  | { kind: 'success'; signature: string }
  | { kind: 'error'; message: string }

export function SendPanel({ onSuccess }: { onSuccess?: () => void }) {
  const { connection } = useConnection()
  const { publicKey, sendTransaction, connected, wallet } = useWallet()
  const [mode, setMode] = useState<'memo' | 'transfer'>('memo')
  const [memo, setMemo] = useState('CookiePulse ✓ on Cookie Chain')
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('0.001')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const submit = useCallback(async () => {
    if (!publicKey || !connected) {
      setStatus({ kind: 'error', message: 'Connect Nightly first' })
      return
    }
    setStatus({ kind: 'pending', message: 'Switching Nightly to Cookie Chain…' })
    await ensureNightlyOnCookieChain()

    try {
      const tx = new Transaction()
      if (mode === 'memo') {
        const data = new TextEncoder().encode(memo || 'CookiePulse')
        tx.add(
          new TransactionInstruction({
            keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
            programId: MEMO_PROGRAM_ID,
            data: Buffer.from(data),
          }),
        )
      } else {
        let recipient: PublicKey
        try {
          recipient = new PublicKey(to.trim())
        } catch {
          setStatus({ kind: 'error', message: 'Invalid recipient address' })
          return
        }
        const cook = Number(amount)
        if (!Number.isFinite(cook) || cook <= 0) {
          setStatus({ kind: 'error', message: 'Enter a positive amount' })
          return
        }
        const lamports = Math.round(cook * 10 ** NATIVE_DECIMALS)
        tx.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipient,
            lamports,
          }),
        )
      }

      setStatus({ kind: 'pending', message: 'Confirm in Nightly…' })
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext('confirmed')

      tx.feePayer = publicKey
      tx.recentBlockhash = blockhash

      const signature = await sendTransaction(tx, connection, { minContextSlot })
      setStatus({ kind: 'pending', message: `Submitted ${signature.slice(0, 8)}… confirming` })

      const conf = await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        'confirmed',
      )
      if (conf.value.err) {
        setStatus({ kind: 'error', message: `Tx failed: ${JSON.stringify(conf.value.err)}` })
        return
      }
      setStatus({ kind: 'success', signature })
      onSuccess?.()
    } catch (e) {
      setStatus({ kind: 'error', message: e instanceof Error ? e.message : String(e) })
    }
  }, [publicKey, connected, mode, memo, to, amount, connection, sendTransaction, onSuccess])

  return (
    <section className="card send-card">
      <div className="card-head">
        <div>
          <p className="eyebrow">On-chain action</p>
          <h2>Prove a Cookie Chain tx</h2>
        </div>
        {wallet && <span className="pill">{wallet.adapter.name}</span>}
      </div>

      <div className="tabs">
        <button type="button" className={mode === 'memo' ? 'tab active' : 'tab'} onClick={() => setMode('memo')}>
          Memo pulse
        </button>
        <button
          type="button"
          className={mode === 'transfer' ? 'tab active' : 'tab'}
          onClick={() => setMode('transfer')}
        >
          Send {NATIVE_SYMBOL}
        </button>
      </div>

      {mode === 'memo' ? (
        <label className="field">
          <span>Memo text</span>
          <input value={memo} onChange={(e) => setMemo(e.target.value)} maxLength={200} placeholder="Your message" />
        </label>
      ) : (
        <>
          <label className="field">
            <span>Recipient</span>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Cookie Chain address"
              className="mono"
            />
          </label>
          <label className="field">
            <span>Amount ({NATIVE_SYMBOL})</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder={`e.g. 0.001 (1 ${NATIVE_SYMBOL} ≈ ${LAMPORTS_PER_SOL.toLocaleString()} lamports)`}
            />
          </label>
        </>
      )}

      <button type="button" className="btn primary wide" disabled={!connected || status.kind === 'pending'} onClick={() => void submit()}>
        {status.kind === 'pending' ? status.message : mode === 'memo' ? 'Send memo tx' : `Send ${NATIVE_SYMBOL}`}
      </button>

      {status.kind === 'success' && (
        <p className="success-text">
          Confirmed{' '}
          <a href={explorerTx(status.signature)} target="_blank" rel="noreferrer" className="mono">
            {status.signature.slice(0, 16)}…
          </a>{' '}
          on{' '}
          <a href={COOKIE_EXPLORER} target="_blank" rel="noreferrer">
            Cookiescan
          </a>
        </p>
      )}
      {status.kind === 'error' && <p className="error-text">{status.message}</p>}
      {!connected && <p className="hint">Nightly wallet required — connect above, then run a tx for realtime feedback.</p>}
    </section>
  )
}
