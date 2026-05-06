import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { ArrowUpRight, Printer } from "lucide-react";
import { useLang, tx } from "../lang.jsx";
import { SectionLabel } from "../ui.jsx";
import { fmtEur, fmtEurShort, getStockStatus } from "../helpers.js";
import { REVENUE_TREND } from "../data.js";

function printReport(products, chartData, latestMonth, margin, marginDelta, healthStats, topProducts, period, catFilter) {
  const rows = chartData.map((m) => `
    <tr>
      <td>${m.month}</td>
      <td>${fmtEur(m.ricavi)}</td>
      <td>${fmtEur(m.costi)}</td>
      <td>${fmtEur(m.ricavi - m.costi)}</td>
      <td>${(((m.ricavi - m.costi) / m.ricavi) * 100).toFixed(1)}%</td>
    </tr>`).join("");

  const topRows = topProducts.map((p, i) => `
    <tr>
      <td>${(i + 1).toString().padStart(2, "0")}</td>
      <td>${p.name}</td>
      <td>${p.id}</td>
      <td>${p.category}</td>
      <td>${p.sold30d}</td>
      <td>${fmtEur(p.price)}</td>
    </tr>`).join("");

  const filterNote = catFilter !== "all" ? ` · Categoria: ${catFilter}` : "";

  const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"/>
  <title>Report — Al Bazar</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Courier New',monospace;font-size:11px;color:#111;padding:32px 40px;max-width:800px;margin:0 auto}
    .header{border-bottom:2px solid #111;padding-bottom:14px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-end}
    .shop{font-size:18px;font-weight:bold;letter-spacing:0.05em}
    .sub{font-size:10px;color:#555;margin-top:3px}
    .date{font-size:10px;color:#777;text-align:right}
    h2{font-size:12px;text-transform:uppercase;letter-spacing:0.15em;margin:22px 0 10px;border-bottom:1px solid #ddd;padding-bottom:5px}
    .kpi{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:8px}
    .kpi-box{border:1px solid #ddd;padding:10px 12px}
    .kpi-label{font-size:9px;text-transform:uppercase;letter-spacing:0.12em;color:#777}
    .kpi-val{font-size:18px;font-weight:bold;margin-top:4px}
    table{width:100%;border-collapse:collapse;margin-top:6px}
    th{font-size:9px;text-transform:uppercase;letter-spacing:0.12em;text-align:left;padding:5px 8px;background:#f5f5f5;border-bottom:1px solid #ccc}
    td{padding:5px 8px;border-bottom:1px solid #eee;font-size:11px}
    .footer{margin-top:32px;font-size:9px;color:#aaa;text-align:center;border-top:1px solid #eee;padding-top:10px}
    @media print{body{padding:16px}}
  </style></head><body>
  <div class="header">
    <div><div class="shop">AL BAZAR DI MILANO</div><div class="sub">Via Padova 104 · 20127 Milano · P.IVA 12345678901</div></div>
    <div class="date">Report generato il ${new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}<br/>Periodo: ${period}${filterNote}</div>
  </div>

  <div class="kpi">
    <div class="kpi-box"><div class="kpi-label">Ricavi (${latestMonth.month})</div><div class="kpi-val">${fmtEur(latestMonth.ricavi)}</div></div>
    <div class="kpi-box"><div class="kpi-label">Costi (${latestMonth.month})</div><div class="kpi-val">${fmtEur(latestMonth.costi)}</div></div>
    <div class="kpi-box"><div class="kpi-label">Utile Lordo</div><div class="kpi-val">${fmtEur(latestMonth.ricavi - latestMonth.costi)}</div></div>
    <div class="kpi-box"><div class="kpi-label">Margine</div><div class="kpi-val">${margin.toFixed(1)}% (${marginDelta >= 0 ? "+" : ""}${marginDelta.toFixed(1)}pp)</div></div>
  </div>

  <h2>Ricavi vs Costi Acquisto — ${period}</h2>
  <table><thead><tr><th>Mese</th><th>Ricavi</th><th>Costi</th><th>Utile</th><th>Margine</th></tr></thead>
  <tbody>${rows}</tbody></table>

  <h2>Prodotti Più Venduti — Ultimi 30 Giorni${filterNote}</h2>
  <table><thead><tr><th>#</th><th>Prodotto</th><th>SKU</th><th>Categoria</th><th>Venduti</th><th>Prezzo</th></tr></thead>
  <tbody>${topRows}</tbody></table>

  <h2>Salute del Magazzino${filterNote}</h2>
  <div class="kpi">
    ${healthStats.map((h) => `<div class="kpi-box"><div class="kpi-label">${h.it}</div><div class="kpi-val">${h.count} / ${products.length}</div></div>`).join("")}
    <div class="kpi-box"><div class="kpi-label">Valore Totale</div><div class="kpi-val">${fmtEurShort(products.reduce((s, p) => s + p.stock * p.cost, 0))}</div></div>
  </div>

  <div class="footer">Al Bazar Shop Manager · Documento non fiscale · Solo per uso interno</div>
  </body></html>`;
  const win = window.open("", "_blank", "width=900,height=1000");
  if (win) { win.document.write(html); win.document.close(); win.print(); }
}

const TOP_N_OPTIONS = [
  { label: "Top 5",  value: 5  },
  { label: "Top 10", value: 10 },
  { label: "Tutti",  value: 99 },
];

export default function Reports({ products }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);

  const [period,    setPeriod]    = useState("6M");
  const [catFilter, setCatFilter] = useState("all");
  const [topN,      setTopN]      = useState(8);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))].sort(), [products]);

  const filteredProducts = useMemo(() =>
    catFilter === "all" ? products : products.filter((p) => p.category === catFilter),
    [products, catFilter]);

  const chartData = period === "3M" ? REVENUE_TREND.slice(-3) : REVENUE_TREND;

  const topProducts = useMemo(() =>
    [...filteredProducts].sort((a, b) => b.sold30d - a.sold30d).slice(0, topN),
    [filteredProducts, topN]);

  const maxSold = Math.max(1, ...topProducts.map((p) => p.sold30d));

  const latestMonth = chartData[chartData.length - 1];
  const prevMonth   = chartData[chartData.length - 2];
  const margin      = ((latestMonth.ricavi - latestMonth.costi) / latestMonth.ricavi) * 100;
  const prevMargin  = ((prevMonth.ricavi - prevMonth.costi) / prevMonth.ricavi) * 100;
  const marginDelta = margin - prevMargin;

  const healthStats = useMemo(() => [
    { it: "Disponibili",  en: "In Stock",     count: filteredProducts.filter((p) => getStockStatus(p).tone === "ok").length,       color: "bg-emerald-500", textColor: "text-emerald-800" },
    { it: "Scorta Bassa", en: "Low Stock",    count: filteredProducts.filter((p) => getStockStatus(p).tone === "warning").length,  color: "bg-amber-500",   textColor: "text-amber-800"   },
    { it: "Esauriti",     en: "Out of Stock", count: filteredProducts.filter((p) => getStockStatus(p).tone === "critical").length, color: "bg-rose-500",    textColor: "text-rose-800"    },
  ], [filteredProducts]);

  const stockValue = filteredProducts.reduce((s, p) => s + p.stock * p.cost, 0);

  return (
    <div className="p-8 bg-[#faf8f3] min-h-full space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="text-[12px] text-stone-500 font-mono">
          {filteredProducts.length} SKU{catFilter !== "all" ? ` · ${catFilter}` : ""} · {t("aggiornato ora","updated just now")}
        </div>
        <button
          onClick={() => printReport(filteredProducts, chartData, latestMonth, margin, marginDelta, healthStats, topProducts, period, catFilter)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 font-mono"
        >
          <Printer className="w-3.5 h-3.5" />
          {t("Stampa Report","Print Report")}
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 pb-1">
        <span className="text-[10px] uppercase tracking-[0.15em] font-mono text-stone-500 mr-1">
          {t("Filtri","Filters")}
        </span>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-1.5 text-[12px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700 font-mono"
        >
          <option value="all">{t("Tutte le categorie","All categories")}</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={topN}
          onChange={(e) => setTopN(Number(e.target.value))}
          className="px-3 py-1.5 text-[12px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700 font-mono"
        >
          {TOP_N_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {catFilter !== "all" && (
          <button
            onClick={() => setCatFilter("all")}
            className="px-2.5 py-1.5 text-[11px] border border-stone-300 bg-white text-stone-600 hover:bg-stone-50 font-mono"
          >
            ✕ {t("Rimuovi filtro","Clear filter")}
          </button>
        )}
      </div>

      {/* Revenue + margin */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white border border-stone-300 p-6">
          <SectionLabel accessory={
            <div className="flex gap-1">
              {["3M", "6M"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-2 py-1 text-[10px] font-mono ${period === p ? "bg-stone-900 text-stone-50" : "text-stone-600 hover:bg-stone-100"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          }>
            {period === "3M"
              ? t("Ricavi vs Costi Acquisto — Ultimi 3 Mesi","Revenue vs Purchase Costs — Last 3 Months")
              : t("Ricavi vs Costi Acquisto — Ultimi 6 Mesi","Revenue vs Purchase Costs — Last 6 Months")}
          </SectionLabel>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#e7e2d6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "monospace", fill: "#78716c" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => "€" + (v / 1000).toFixed(1) + "k"} tick={{ fontSize: 11, fontFamily: "monospace", fill: "#78716c" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#1a1a1a", border: "none", color: "#fff", fontSize: 12, fontFamily: "monospace" }}
                cursor={{ fill: "rgba(212, 164, 55, 0.06)" }}
                formatter={(v) => [fmtEur(v), undefined]}
              />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }} iconType="square"
                formatter={(v) => v === "ricavi" ? t("Ricavi","Revenue") : t("Costi","Costs")} />
              <Bar dataKey="ricavi" fill="#1a1a1a" name="ricavi" />
              <Bar dataKey="costi"  fill="#d4a437" name="costi"  />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Margin card */}
        <div className="bg-white border border-stone-300 p-6">
          <SectionLabel>{t("Margine di Guadagno","Profit Margin")}</SectionLabel>
          <div className="text-center py-3">
            <div className="font-serif text-[52px] text-stone-900 leading-none tracking-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
              {margin.toFixed(1)}%
            </div>
            <div className="text-[11px] uppercase tracking-[0.18em] font-mono text-stone-500 mt-2">
              {t("Margine Lordo","Gross Margin")} · {latestMonth.month}
            </div>
            <div className={`inline-flex items-center gap-1 mt-3 px-2.5 py-1 text-[11px] font-mono border ${marginDelta >= 0 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
              <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
              {marginDelta >= 0 ? "+" : ""}{marginDelta.toFixed(1)}pp {t("vs mese scorso","vs prev month")}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-stone-200 space-y-2.5">
            {[
              { it: "Ricavi",         en: "Revenue",      val: fmtEur(latestMonth.ricavi),                         bold: false },
              { it: "Costi Acquisto", en: "Purchase Cost",val: fmtEur(latestMonth.costi),                          bold: false },
              { it: "Utile Lordo",    en: "Gross Profit", val: fmtEur(latestMonth.ricavi - latestMonth.costi),     bold: true, green: true },
            ].map((row) => (
              <div key={row.it} className={`flex justify-between text-[12px] ${row.bold ? "pt-2 border-t border-stone-200" : ""}`}>
                <span className={row.bold ? "text-stone-800 font-semibold" : "text-stone-600"}>{t(row.it, row.en)}</span>
                <span className={`font-mono ${row.bold ? (row.green ? "text-emerald-700 font-semibold" : "font-semibold") : "text-stone-900"}`}>{row.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top sellers + health */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-stone-300 p-6">
          <SectionLabel>
            {t("Prodotti Più Venduti · Ultimi 30 Giorni","Top-Selling Products · Last 30 Days")}
            {catFilter !== "all" && (
              <span className="ml-2 text-[10px] font-mono text-stone-400 normal-case tracking-normal">{catFilter}</span>
            )}
          </SectionLabel>
          {topProducts.length === 0 ? (
            <div className="py-8 text-center text-[12px] text-stone-500 font-mono">
              {t("Nessun prodotto in questa categoria.","No products in this category.")}
            </div>
          ) : (
            <div className="space-y-2.5">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-stone-400 w-5">{(i + 1).toString().padStart(2, "0")}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-stone-900 truncate">{p.name}</div>
                    <div className="h-1 bg-stone-100 mt-1">
                      <div className="h-full bg-stone-900" style={{ width: `${(p.sold30d / maxSold) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-[13px] font-mono font-semibold text-stone-900 w-10 text-right">{p.sold30d}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-stone-300 p-6">
          <SectionLabel>
            {t("Salute del Magazzino","Inventory Health")}
            {catFilter !== "all" && (
              <span className="ml-2 text-[10px] font-mono text-stone-400 normal-case tracking-normal">{catFilter}</span>
            )}
          </SectionLabel>
          <div className="space-y-3 mt-2">
            {healthStats.map((row) => {
              const pct = (row.count / Math.max(filteredProducts.length, 1)) * 100;
              return (
                <div key={row.it}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] text-stone-700">{t(row.it, row.en)}</span>
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
              <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">{t("Valore Magazzino","Stock Value")}</div>
              <div className="text-[22px] font-mono font-semibold text-stone-900 mt-1">
                {fmtEurShort(stockValue)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">{t("Prodotti","Products")}</div>
              <div className="text-[22px] font-mono font-semibold text-stone-900 mt-1">{filteredProducts.length} SKU</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
