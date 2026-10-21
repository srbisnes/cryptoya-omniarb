# CryptoYa OmniArb

**Omnichain Arbitrage Engine** powered by the public CryptoYa API.

Invented and fully built by **Elcryptoboy** — the elite Web3 omnichaín architect.

## Problem

LatAm traders face fragmented CEX/P2P prices (ARS, BRL, etc.) with high spreads, fees, and no unified real-time arbitrage view across exchanges + on-chain settlement. Cross-chain capital movement is slow and expensive.

## Solution

- Live multi-exchange price aggregation from CryptoYa (120 req/min, 1-min updates)
- Automatic spread detection (ask/bid after fees)
- Profit calculator with configurable thresholds
- Omnichaín settlement path via LayerZero / CCTP-ready smart contracts
- AI-ready opportunity ranking (spread persistence + risk scoring)
- Production Next.js dashboard + Foundry contracts

## Architecture

```
CryptoYa API ──► Scanner (poll) ──► Opportunity Engine
                                      │
                                      ▼
                               Next.js Dashboard (live board)
                                      │
                                      ▼
                          Smart Contracts (ArbExecutor + Omnichain Router)
                                      │
                    LayerZero / CCTP / Axelar messaging
```

## Tech Stack

- **Data**: CryptoYa public API
- **Frontend**: Next.js 15 App Router + TypeScript + Tailwind
- **Contracts**: Solidity 0.8.24 + OpenZeppelin + Foundry
- **Omnichain**: Abstracted for LayerZero V2 / CCTP
- **Deployment**: Vercel + GitHub

## Local Setup

```bash
# Frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Contracts

```bash
cd contracts
forge build
forge test
```

## Environment

Copy `.env.example` and fill:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- RPC URLs
- Private keys (never commit)

## Deploy

1. Push to GitHub (already done)
2. Import to Vercel → set root to `frontend/`
3. Deploy contracts with Foundry scripts

## Security

- No private keys in code
- ReentrancyGuard + Ownable on contracts
- Rate-limit aware polling
- Profit threshold + max slippage guards

## Roadmap

- Full LayerZero V2 messaging for cross-chain arb
- On-chain DEX integration (Uniswap V3 / Aerodrome)
- AI spread prediction (Grok-style)
- Telegram/Discord alerts
- Institutional multi-sig + compliance hooks

---

**Built for real LatAm traders and fintechs.**  
Ready for company presentation.
