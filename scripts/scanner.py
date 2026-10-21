#!/usr/bin/env python3
"""
CryptoYa OmniArb Scanner
Polls CryptoYa and prints top arbitrage opportunities.
"""
import json
import time
import urllib.request

BASE = "https://criptoya.com/api"
PAIRS = [("USDT", "ARS"), ("USDC", "ARS"), ("BTC", "ARS")]

def fetch(coin, fiat, vol=1):
    url = f"{BASE}/{coin}/{fiat}/{vol}"
    with urllib.request.urlopen(url) as r:
        return json.loads(r.read().decode())

def find_opps(quotes, min_pct=0.2):
    opps = []
    items = list(quotes.items())
    for be, bq in items:
        for se, sq in items:
            if be == se: continue
            buy = bq.get("totalAsk") or bq.get("ask")
            sell = sq.get("totalBid") or sq.get("bid")
            if buy and sell and sell > buy:
                pct = (sell - buy) / buy * 100
                if pct >= min_pct:
                    opps.append((pct, be, se, buy, sell))
    return sorted(opps, reverse=True)

def main():
    print("CryptoYa OmniArb Scanner started")
    while True:
        for coin, fiat in PAIRS:
            try:
                data = fetch(coin, fiat)
                opps = find_opps(data)
                if opps:
                    print(f"\n=== {coin}/{fiat} ===")
                    for pct, be, se, buy, sell in opps[:5]:
                        print(f"  +{pct:.3f}%  Buy@{be} {buy:.2f} → Sell@{se} {sell:.2f}")
            except Exception as e:
                print("Error:", e)
        time.sleep(60)

if __name__ == "__main__":
    main()
