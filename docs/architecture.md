# Architecture Notes

## Detection
- Poll CryptoYa `/api/{coin}/{fiat}/{vol}` every 60s
- Compare totalAsk vs totalBid across all exchanges
- Filter by min profit % after implicit fees (totalAsk/totalBid already include some)

## Omnichain Extension
1. Detect arb on LatAm CEX
2. Move USDT via CCTP or LayerZero OFT to destination chain
3. Execute on DEX or another CEX via router
4. Bridge profit back

## Risk
- Latency: 1-min data freshness
- Liquidity: check volume param
- Fees: model exchange withdrawal + bridge cost
- Blacklist low-liquidity or P2P-only venues if needed
