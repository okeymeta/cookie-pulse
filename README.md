# CookiePulse 🍪

Lightweight **portfolio + activity dashboard** for [Cookie Chain](https://www.cookiechain.wtf/) — an SVM-compatible community chain.

Built for the Superteam Earn bounty **Create an App on Cookie Chain**.

## Features

- **Nightly wallet connect** (required) via `@solana/wallet-adapter-nightly`
- One-click **Sync Nightly net** → Cookie Chain genesis + RPC (`changeNetwork`)
- Live **network pulse**: slot, epoch, tx count, health, slot sparkline (RPC polling)
- **Portfolio**: native **COOK** balance, recent signatures, DAS asset count (`api.cookiescan.io`)
- **On-chain action**: Memo program pulse **or** send COOK — realtime confirm + Cookiescan link
- Clean dark, mobile-friendly UI

## Chain endpoints

| | |
|---|---|
| HTTP RPC | `https://rpc.cookiescan.io` |
| WebSocket | `wss://wss.cookiescan.io` |
| DAS API | `https://api.cookiescan.io` |
| Explorer | [cookiescan.io](https://cookiescan.io) |
| Docs | [docs.cookiechain.wtf](https://docs.cookiechain.wtf) |
| Genesis hash | `9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2` |

## Cookie Bridge note

Cookie Chain native gas token is **COOK** (9 decimals).

To get COOK on Cookie Chain:

1. Acquire **sCOOK** on Solana (see [onboard.cookiechain.wtf](https://onboard.cookiechain.wtf)).
2. Bridge **1:1** via the live Hyperlane warp route: **[hyperlane.cookiescan.io](https://hyperlane.cookiescan.io)**  
   (legacy escrow bridge was deprecated July 10, 2026 — do not use it.)
3. Keep a small COOK balance for fees before sending txs from CookiePulse.

Official docs: [Bridge](https://docs.cookiechain.wtf/bridge) · [COOK](https://docs.cookiechain.wtf/cook)

## Quick start

```bash
npm install
npm run dev
```

Open the Vite URL, install [Nightly](https://nightly.app), connect, click **Sync Nightly net**, then send a memo.

```bash
npm run build
npm run preview
```

## Tech

- Vite + React + TypeScript
- `@solana/web3.js`
- `@solana/wallet-adapter-*` + Nightly adapter

## Deploy (Vercel)

```bash
npx vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard (framework: Vite, output: `dist`).

## License

MIT
