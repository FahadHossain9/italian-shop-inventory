import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Printer } from "lucide-react";
import { useLang, tx } from "../lang.jsx";
import { SectionLabel } from "../ui.jsx";
import { fmtEur, fmtEurShort, getStockStatus } from "../helpers.js";

// ── Date helpers ─────────────────────────────────────────────────────────────
function isoToday() { return new Date().toISOString().slice(0, 10); }
function subtractDays(n) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10);
}
function subtractMonths(n) {
  const d = new Date(); d.setMonth(d.getMonth() - n); return d.toISOString().slice(0, 10);
}

const RANGES = [
  { id: "7gg",  label: "7 Giorni",  start: () => subtractDays(6),   prevStart: () => subtractDays(13), prevEnd: () => subtractDays(7)  },
  { id: "30gg", label: "30 Giorni", start: () => subtractDays(29),  prevStart: () => subtractDays(59), prevEnd: () => subtractDays(30) },
  { id: "3m",   label: "3 Mesi",   start: () => subtractMonths(3), prevStart: () => subtractMonths(6), prevEnd: () => subtractMonths(3) },
  { id: "all",  label: "Tutto",    start: () => "2000-01-01",       prevStart: null, prevEnd: null },
];

// ── Group vendite into chart buckets ─────────────────────────────────────────
function buildChartData(sales, rangeId, skuCatMap, catFilter) {
  const rev = (v) => {
    if (catFilter === "all") return v.total || 0;
    return (v.lines || [])
      .filter((l) => skuCatMap[l.sku] === catFilter)
      .reduce((s, l) => s + (l.lineTotal ?? l.qty * l.unitPrice), 0);
  };

  if (rangeId === "7gg") {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      const key   = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("it-IT", { day: "2-digit", month: "short" });
      return { label, ricavi: sales.filter((v) => v.date === key).reduce((s, v) => s + rev(v), 0) };
    });
  }

  if (rangeId === "30gg") {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (29 - i));
      const key   = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("it-IT", { day: "2-digit", month: "short" });
      return { label, ricavi: sales.filter((v) => v.date === key).reduce((s, v) => s + rev(v), 0) };
    }).filter((_, i) => i % 3 === 2 || i === 0 || i === 29); // thin out labels: every 3rd day
  }

  if (rangeId === "3m") {
    const grouped = {};
    sales.forEach((v) => {
      const d = new Date(v.date);
      const day = d.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      d.setDate(d.getDate() + diff);
      const key = d.toISOString().slice(0, 10);
      grouped[key] = (grouped[key] || 0) + rev(v);
    });
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([key, ricavi]) => {
      const d = new Date(key);
      return { label: d.toLocaleDateString("it-IT", { day: "2-digit", month: "short" }), ricavi };
    });
  }

  // all — monthly
  const grouped = {};
  sales.forEach((v) => {
    const key = v.date.slice(0, 7);
    grouped[key] = (grouped[key] || 0) + rev(v);
  });
  return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([key, ricavi]) => {
    const [y, m] = key.split("-");
    const d = new Date(+y, +m - 1, 1);
    return { label: d.toLocaleDateString("it-IT", { month: "short", year: "2-digit" }), ricavi };
  });
}

function printReport(products, topSellers, healthStats, periodLabel, catLabel, totalRev, totalCost, margin, marginDelta) {
  const topRows = topSellers.map((s, i) => `
    <tr><td>${(i + 1).toString().padStart(2, "0")}</td><td>${s.name}</td><td>${s.sku}</td>
    <td>${s.category}</td><td>${s.qty}</td><td>${fmtEur(s.revenue)}</td></tr>`).join("");

  const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"/>
  <title>Report — Al Bazar</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Courier New',monospace;font-size:11px;color:#111;padding:32px 40px;max-width:800px;margin:0 auto}
    .header{border-bottom:2px solid #111;padding-bottom:14px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-end}
    .shop{font-size:18px;font-weight:bold;letter-spacing:0.05em}.sub{font-size:10px;color:#555;margin-top:3px}
    h2{font-size:12px;text-transform:uppercase;letter-spacing:0.15em;margin:22px 0 10px;border-bottom:1px solid #ddd;padding-bottom:5px}
    .kpi{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:8px}
    .kpi-box{border:1px solid #ddd;padding:10px 12px}.kpi-label{font-size:9px;text-transform:uppercase;letter-spacing:.12em;color:#777}
    .kpi-val{font-size:18px;font-weight:bold;margin-top:4px}
    table{width:100%;border-collapse:collapse;margin-top:6px}
    th{font-size:9px;text-transform:uppercase;letter-spacing:.12em;text-align:left;padding:5px 8px;background:#f5f5f5;border-bottom:1px solid #ccc}
    td{padding:5px 8px;border-bottom:1px solid #eee;font-size:11px}
    .footer{margin-top:32px;font-size:9px;color:#aaa;text-align:center;border-top:1px solid #eee;padding-top:10px}
  </style></head><body>
  <div class="header">
    <div><div class="shop">AL BAZAR DI MILANO</div><div class="sub">Via Padova 104 · 20127 Milano · P.IVA 12345678901</div></div>
    <div class="sub" style="text-align:right">Report · ${periodLabel}${catLabel ? " · " + catLabel : ""}<br/>Generato ${new Date().toLocaleDateString("it-IT",{day:"2-digit",month:"long",year:"numeric"})}</div>
  </div>
  <div class="kpi">
    <div class="kpi-box"><div class="kpi-label">Ricavi Periodo</div><div class="kpi-val">${fmtEur(totalRev)}</div></div>
    <div class="kpi-box"><div class="kpi-label">Costi Stimati</div><div class="kpi-val">${fmtEur(totalCost)}</div></div>
    <div class="kpi-box"><div class="kpi-label">Utile Lordo</div><div class="kpi-val">${fmtEur(totalRev - totalCost)}</div></div>
    <div class="kpi-box"><div class="kpi-label">Margine</div><div class="kpi-val">${margin.toFixed(1)}% (${marginDelta >= 0 ? "+" : ""}${marginDelta.toFixed(1)}pp)</div></div>
  </div>
  <h2>Prodotti Più Venduti — ${periodLabel}${catLabel ? " · " + catLabel : ""}</h2>
  <table><thead><tr><th>#</th><th>Prodotto</th><th>SKU</th><th>Categoria</th><th>Q.tà</th><th>Ricavo</th></tr></thead>
  <tbody>${topRows || '<tr><td colspan="6" style="text-align:center;color:#999">—</td></tr>'}</tbody></table>
  <h2>Salute Magazzino${catLabel ? " · " + catLabel : ""}</h2>
  <div class="kpi">
    ${healthStats.map((h) => `<div class="kpi-box"><div class="kpi-label">${h.it}</div><div class="kpi-val">${h.count}</div></div>`).join("")}
  </div>
  <div class="footer">Al Bazar Shop Manager · Documento non fiscale · Solo per uso interno</div>
  </body></html>`;
  const win = window.open("", "_blank", "width=900,height=1000");
  if (win) { win.document.write(html); win.document.close(); win.print(); }
}

const TOP_N_OPTIONS = [{ label: "Top 5", value: 5 }, { label: "Top 10", value: 10 }, { label: "Tutti", value: 99 }];

export default function Reports({ products, vendite = [] }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);

  const [rangeId,   setRangeId]   = useState("30gg");
  const [catFilter, setCatFilter] = useState("all");
  const [topN,      setTopN]      = useState(8);

  const range = RANGES.find((r) => r.id === rangeId);

  // ── Product lookups ────────────────────────────────────────────────────────
  const productMap = useMemo(() => {
    const m = {};
    products.forEach((p) => { m[p.id] = p; });
    return m;
  }, [products]);

  const skuCatMap = useMemo(() => {
    const m = {};
    products.forEach((p) => { m[p.id] = p.category; });
    return m;
  }, [products]);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))].sort(), [products]);

  // ── Sales filter ──────────────────────────────────────────────────────────
  const periodStart = range.start();
  const today       = isoToday();

  const completedSales = useMemo(() => vendite.filter((v) => v.status === "completata"), [vendite]);

  const periodSales = useMemo(() =>
    completedSales.filter((v) => v.date >= periodStart && v.date <= today),
    [completedSales, periodStart, today]);

  const prevSales = useMemo(() => {
    if (!range.prevStart) return [];
    const ps = range.prevStart(), pe = range.prevEnd();
    return completedSales.filter((v) => v.date >= ps && v.date <= pe);
  }, [completedSales, range]);

  // ── Revenue & cost ────────────────────────────────────────────────────────
  const { totalRev, totalCost } = useMemo(() => {
    let rev = 0, cost = 0;
    periodSales.forEach((v) => {
      (v.lines || []).forEach((l) => {
        if (catFilter !== "all" && skuCatMap[l.sku] !== catFilter) return;
        rev  += l.lineTotal ?? l.qty * l.unitPrice;
        cost += l.qty * (productMap[l.sku]?.cost ?? 0);
      });
    });
    return { totalRev: rev, totalCost: cost };
  }, [periodSales, catFilter, skuCatMap, productMap]);

  const { prevRev, prevCost } = useMemo(() => {
    let rev = 0, cost = 0;
    prevSales.forEach((v) => {
      (v.lines || []).forEach((l) => {
        if (catFilter !== "all" && skuCatMap[l.sku] !== catFilter) return;
        rev  += l.lineTotal ?? l.qty * l.unitPrice;
        cost += l.qty * (productMap[l.sku]?.cost ?? 0);
      });
    });
    return { prevRev: rev, prevCost: cost };
  }, [prevSales, catFilter, skuCatMap, productMap]);

  const margin     = totalRev > 0 ? ((totalRev - totalCost) / totalRev) * 100 : 0;
  const prevMargin = prevRev  > 0 ? ((prevRev  - prevCost)  / prevRev)  * 100 : 0;
  const marginDelta = margin - prevMargin;
  const revDelta    = prevRev > 0 ? ((totalRev - prevRev) / prevRev) * 100 : null;

  // ── Chart ─────────────────────────────────────────────────────────────────
  const chartData = useMemo(() =>
    buildChartData(periodSales, rangeId, skuCatMap, catFilter),
    [periodSales, rangeId, skuCatMap, catFilter]);

  // ── Top sellers from actual transactions ─────────────────────────────────
  const topSellers = useMemo(() => {
    const agg = {};
    periodSales.forEach((v) => {
      (v.lines || []).forEach((l) => {
        const cat = skuCatMap[l.sku] || "—";
        if (catFilter !== "all" && cat !== catFilter) return;
        if (!agg[l.sku]) agg[l.sku] = { sku: l.sku, name: l.product, qty: 0, revenue: 0, category: cat };
        agg[l.sku].qty     += l.qty;
        agg[l.sku].revenue += l.lineTotal ?? l.qty * l.unitPrice;
      });
    });
    return Object.values(agg).sort((a, b) => b.qty - a.qty).slice(0, topN);
  }, [periodSales, catFilter, skuCatMap, topN]);

  const maxQty = Math.max(1, ...topSellers.map((s) => s.qty));

  // ── Inventory health ──────────────────────────────────────────────────────
  const filteredProducts = useMemo(() =>
    catFilter === "all" ? products : products.filter((p) => p.category === catFilter),
    [products, catFilter]);

  const healthStats = useMemo(() => [
    { it: "Disponibili",  count: filteredProducts.filter((p) => getStockStatus(p).tone === "ok").length,       color: "bg-emerald-500", textColor: "text-emerald-800" },
    { it: "Scorta Bassa", count: filteredProducts.filter((p) => getStockStatus(p).tone === "warning").length,  color: "bg-amber-500",   textColor: "text-amber-800"   },
    { it: "Esauriti",     count: filteredProducts.filter((p) => getStockStatus(p).tone === "critical").length, color: "bg-rose-500",    textColor: "text-rose-800"    },
  ], [filteredProducts]);

  const stockValue = filteredProducts.reduce((s, p) => s + p.stock * p.cost, 0);
  const periodLabel = range.label;
  const catLabel    = catFilter !== "all" ? catFilter : "";

  return (
    <div className="p-8 bg-[#faf8f3] min-h-full space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="text-[12px] text-stone-500 font-mono">
          {filteredProducts.length} SKU{catLabel ? ` · ${catLabel}` : ""} · {periodSales.length} vendite nel periodo
        </div>
        <button
          onClick={() => printReport(products, topSellers, healthStats, periodLabel, catLabel, totalRev, totalCost, margin, marginDelta)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 font-mono"
        >
          <Printer className="w-3.5 h-3.5" />
          {t("Stampa Report","Print Report")}
        </button>
      </div>

      {/* ── Filter bar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Date range */}
        <div className="flex gap-0.5 border border-stone-300 bg-white p-0.5">
          {RANGES.map((r) => (
            <button key={r.id} onClick={() => setRangeId(r.id)}
              className={`px-3 py-1.5 text-[11px] font-mono transition-colors ${rangeId === r.id ? "bg-stone-900 text-stone-50" : "text-stone-600 hover:bg-stone-100"}`}>
              {r.label}
            </button>
          ))}
        </div>

        {/* Category */}
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-1.5 text-[12px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700 font-mono">
          <option value="all">Tutte le categorie</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Top N */}
        <select value={topN} onChange={(e) => setTopN(Number(e.target.value))}
          className="px-3 py-1.5 text-[12px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700 font-mono">
          {TOP_N_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {catFilter !== "all" && (
          <button onClick={() => setCatFilter("all")}
            className="px-2.5 py-1.5 text-[11px] border border-stone-300 bg-white text-stone-600 hover:bg-stone-50 font-mono">
            ✕ {catFilter}
          </button>
        )}
      </div>

      {/* ── KPI row ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Ricavi Periodo",  value: fmtEurShort(totalRev),  sub: revDelta !== null ? `${revDelta >= 0 ? "+" : ""}${revDelta.toFixed(1)}% vs periodo prec.` : "tutto il periodo", deltaUp: revDelta === null || revDelta >= 0 },
          { label: "Costi Acquisto",  value: fmtEurShort(totalCost), sub: "stimati da listino", deltaUp: true },
          { label: "Utile Lordo",     value: fmtEurShort(totalRev - totalCost), sub: "ricavi − costi", deltaUp: totalRev >= totalCost },
          { label: "Margine Lordo",   value: `${margin.toFixed(1)}%`, sub: marginDelta !== 0 ? `${marginDelta >= 0 ? "+" : ""}${marginDelta.toFixed(1)}pp vs periodo prec.` : "—", deltaUp: marginDelta >= 0 },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-stone-300 p-5">
            <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">{k.label}</div>
            <div className="text-[26px] font-mono font-semibold text-stone-900 mt-1 leading-none">{k.value}</div>
            <div className={`text-[11px] font-mono mt-2 ${k.deltaUp ? "text-emerald-700" : "text-rose-700"}`}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Revenue chart + margin ─────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white border border-stone-300 p-6">
          <SectionLabel>
            Ricavi per Periodo{catLabel ? ` · ${catLabel}` : ""} — {periodLabel}
          </SectionLabel>
          {chartData.length === 0 || chartData.every((d) => d.ricavi === 0) ? (
            <div className="h-[260px] flex items-center justify-center text-[12px] text-stone-500 font-mono">
              Nessuna vendita in questo periodo.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#e7e2d6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fontFamily: "monospace", fill: "#78716c" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tickFormatter={(v) => v >= 1000 ? "€" + (v / 1000).toFixed(1) + "k" : "€" + v} tick={{ fontSize: 10, fontFamily: "monospace", fill: "#78716c" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1a1a1a", border: "none", color: "#fff", fontSize: 12, fontFamily: "monospace" }}
                  cursor={{ fill: "rgba(212, 164, 55, 0.06)" }}
                  formatter={(v) => [fmtEur(v), "Ricavi"]}
                />
                <Bar dataKey="ricavi" fill="#1a1a1a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Margin card */}
        <div className="bg-white border border-stone-300 p-6">
          <SectionLabel>Margine di Guadagno</SectionLabel>
          <div className="text-center py-3">
            <div className="font-serif text-[52px] text-stone-900 leading-none tracking-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
              {totalRev > 0 ? `${margin.toFixed(1)}%` : "—"}
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] font-mono text-stone-500 mt-2">
              Margine Lordo · {periodLabel}
            </div>
            {rangeId !== "all" && (
              <div className={`inline-flex items-center gap-1 mt-3 px-2.5 py-1 text-[11px] font-mono border ${marginDelta >= 0 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
                {marginDelta >= 0
                  ? <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
                  : <ArrowDownRight className="w-3 h-3" strokeWidth={2.5} />}
                {marginDelta >= 0 ? "+" : ""}{marginDelta.toFixed(1)}pp vs periodo prec.
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-stone-200 space-y-2.5">
            {[
              { label: "Ricavi",         val: fmtEur(totalRev),                       bold: false },
              { label: "Costi Acquisto", val: fmtEur(totalCost),                      bold: false },
              { label: "Utile Lordo",    val: fmtEur(totalRev - totalCost),           bold: true, green: true },
            ].map((row) => (
              <div key={row.label} className={`flex justify-between text-[12px] ${row.bold ? "pt-2 border-t border-stone-200" : ""}`}>
                <span className={row.bold ? "text-stone-800 font-semibold" : "text-stone-600"}>{row.label}</span>
                <span className={`font-mono ${row.bold ? (row.green ? "text-emerald-700 font-semibold" : "font-semibold") : "text-stone-900"}`}>{row.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top sellers + health ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-stone-300 p-6">
          <SectionLabel>
            Prodotti Più Venduti · {periodLabel}
            {catLabel && <span className="ml-2 text-[10px] font-mono text-stone-400 normal-case tracking-normal">{catLabel}</span>}
          </SectionLabel>
          {topSellers.length === 0 ? (
            <div className="py-8 text-center text-[12px] text-stone-500 font-mono">Nessuna vendita in questo periodo.</div>
          ) : (
            <div className="space-y-2.5">
              {topSellers.map((s, i) => (
                <div key={s.sku} className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-stone-400 w-5">{(i + 1).toString().padStart(2, "0")}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-[12px] text-stone-900 truncate">{s.name}</div>
                      <div className="text-[10px] font-mono text-stone-400 ml-2 shrink-0">{fmtEur(s.revenue)}</div>
                    </div>
                    <div className="h-1 bg-stone-100 mt-1">
                      <div className="h-full bg-stone-900" style={{ width: `${(s.qty / maxQty) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-[13px] font-mono font-semibold text-stone-900 w-10 text-right">{s.qty}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-stone-300 p-6">
          <SectionLabel>
            Salute del Magazzino
            {catLabel && <span className="ml-2 text-[10px] font-mono text-stone-400 normal-case tracking-normal">{catLabel}</span>}
          </SectionLabel>
          <div className="space-y-3 mt-2">
            {healthStats.map((row) => {
              const pct = (row.count / Math.max(filteredProducts.length, 1)) * 100;
              return (
                <div key={row.it}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] text-stone-700">{row.it}</span>
                    <span className={`text-[13px] font-mono font-semibold ${row.textColor}`}>
                      {row.count} <span className="text-stone-400 font-normal">/ {filteredProducts.length}</span>
                    </span>
                  </div>
                  <div className="h-2 bg-stone-100">
                    <div className={`h-full ${row.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-5 border-t border-stone-200 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">Valore Magazzino</div>
              <div className="text-[22px] font-mono font-semibold text-stone-900 mt-1">{fmtEurShort(stockValue)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">Prodotti</div>
              <div className="text-[22px] font-mono font-semibold text-stone-900 mt-1">{filteredProducts.length} SKU</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
