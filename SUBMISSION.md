# Superteam Earn — CookiePulse submission checklist

Bounty: Create an App on Cookie Chain (`create-an-app-on-cookie-chain-app`)  
Reward: $1000 USDC · 2 winners × $500 · Deadline: **2026-09-22** · Region: Global

## Links to paste

| Field | Value |
|-------|--------|
| Live app URL | Claim/deploy Vercel (see below) or your production URL |
| GitHub repo | https://github.com/okeymeta/cookie-pulse |
| Demo / Loom (optional) | Screen record: Nightly connect → Sync net → Memo pulse → Cookiescan confirm |
| Wallet for payout | Your Solana / USDC address |

## What judges should see

1. Connect **Nightly** on Cookie Chain (`https://rpc.cookiescan.io`).
2. Network pulse cards update (slot / epoch / tx count).
3. Portfolio shows COOK balance + recent signatures.
4. **Memo pulse** or **Send COOK** creates a real tx with confirmation + Cookiescan link.
5. README documents Cookie Bridge: [hyperlane.cookiescan.io](https://hyperlane.cookiescan.io).

## Human deploy (permanent URL)

Temporary anonymous Vercel deploys expire ~60 minutes unless claimed.

1. Claim the latest temporary deployment via the claim URL printed by the agent, **or**
2. `cd cookie-pulse && npx vercel login && npx vercel --prod`
3. Or connect `okeymeta/cookie-pulse` in Vercel dashboard (Vite → `dist`).

## X / Twitter thread (copy-paste)

```
1/ Shipped CookiePulse 🍪 — a portfolio + activity dashboard on Cookie Chain (SVM).

Nightly connect · live network pulse · COOK balance · memo/send tx with realtime confirm.

Built for @SuperteamEarn × Cookie Chain.

2/ Stack: Vite + React + TS · @solana/web3.js · Nightly wallet-adapter
RPC: rpc.cookiescan.io · Explorer: cookiescan.io · Bridge: hyperlane.cookiescan.io

3/ Try it: <LIVE_URL>
Code: https://github.com/okeymeta/cookie-pulse

Tag: Cookie Chain builders — what’s next on-chain?
```

## Submit on Superteam

1. Open the listing on superteam.fun (slug `create-an-app-on-cookie-chain-app`).
2. Submit with live URL + GitHub + short description + X post link.
3. Mention Nightly + real Cookie Chain tx proof (Cookiescan signature).
