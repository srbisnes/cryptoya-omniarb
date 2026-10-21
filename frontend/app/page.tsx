"use client";

import { useEffect, useState } from "react";
import { detectArbitrage, fetchPair, AggregatedQuotes } from "@/lib/cryptoya";

const PAIRS = [
  { coin: "USDT", fiat: "ARS" },
  { coin: "USDC", fiat: "ARS" },
  { coin: "BTC", fiat: "ARS" },
  { coin: "ETH", fiat: "ARS" },
];

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(PAIRS[0]);

  async function load() {
    setLoading(true);
    try {
      const quotes: AggregatedQuotes = await fetchPair(
        selected.coin,
        selected.fiat,
        1
      );
      const opps = detectArbitrage(quotes, 0.15);
      setData(opps.slice(0, 15));
    } catch (e) {
      console.error(e);
      setData([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, [selected]);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          CryptoYa OmniArb
        </h1>
        <p className="text-zinc-400 mt-2">
          Omnichain Arbitrage Engine · Powered by CryptoYa · By Elcryptoboy
        </p>
      </header>

      <div className="flex gap-3 mb-6 flex-wrap">
        {PAIRS.map((p) => (
          <button
            key={p.coin + p.fiat}
            onClick={() => setSelected(p)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selected.coin === p.coin
                ? "bg-emerald-500 text-black"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            {p.coin}/{p.fiat}
          </button>
        ))}
        <button
          onClick={load}
          className="ml-auto px-4 py-2 bg-zinc-800 rounded-full text-sm"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-400">Scanning exchanges...</p>
      ) : data.length === 0 ? (
        <p className="text-zinc-400">No profitable opportunities above threshold right now.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="text-left py-3">Buy</th>
                <th className="text-left">Sell</th>
                <th className="text-right">Buy Price</th>
                <th className="text-right">Sell Price</th>
                <th className="text-right">Profit %</th>
              </tr>
            </thead>
            <tbody>
              {data.map((o, i) => (
                <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                  <td className="py-3 font-medium">{o.buyExchange}</td>
                  <td>{o.sellExchange}</td>
                  <td className="text-right">{o.buyPrice.toLocaleString()}</td>
                  <td className="text-right">{o.sellPrice.toLocaleString()}</td>
                  <td className="text-right text-emerald-400 font-bold">
                    +{o.profitPct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer className="mt-12 text-xs text-zinc-500">
        Data from CryptoYa public API · Updates every 60s · Not financial advice · Omnichain settlement via smart contracts ready
      </footer>
    </main>
  );
}
