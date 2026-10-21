export interface ExchangeQuote {
  ask: number;
  totalAsk: number;
  bid: number;
  totalBid: number;
  time: number;
}

export interface AggregatedQuotes {
  [exchange: string]: ExchangeQuote;
}

const BASE = "https://criptoya.com/api";

export async function fetchPair(
  coin: string,
  fiat: string,
  volume: number = 1
): Promise<AggregatedQuotes> {
  const res = await fetch(`${BASE}/${coin}/${fiat}/${volume}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("CryptoYa fetch failed");
  return res.json();
}

export async function fetchDollar() {
  const res = await fetch(`${BASE}/dolar`, { next: { revalidate: 60 } });
  return res.json();
}

export function detectArbitrage(quotes: AggregatedQuotes, minProfitPct = 0.3) {
  const entries = Object.entries(quotes).filter(
    ([, q]) => q.bid > 0 && q.ask > 0
  );

  const opportunities: any[] = [];

  for (const [buyEx, buyQ] of entries) {
    for (const [sellEx, sellQ] of entries) {
      if (buyEx === sellEx) continue;
      const buyPrice = buyQ.totalAsk || buyQ.ask;
      const sellPrice = sellQ.totalBid || sellQ.bid;
      if (sellPrice > buyPrice) {
        const profitPct = ((sellPrice - buyPrice) / buyPrice) * 100;
        if (profitPct >= minProfitPct) {
          opportunities.push({
            buyExchange: buyEx,
            sellExchange: sellEx,
            buyPrice,
            sellPrice,
            profitPct: profitPct.toFixed(3),
            timestamp: Math.max(buyQ.time, sellQ.time),
          });
        }
      }
    }
  }

  return opportunities.sort((a, b) => parseFloat(b.profitPct) - parseFloat(a.profitPct));
}
