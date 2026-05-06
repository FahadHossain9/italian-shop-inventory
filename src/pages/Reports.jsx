import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { useLang, tx } from "../lang.jsx";
import { SectionLabel } from "../ui.jsx";
import { fmtEur, fmtEurShort, getStockStatus } from "../helpers.js";
import { REVENUE_TREND } from "../data.js";

export default function Reports({ products }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);

  const topProducts = [...products].sort((a, b) => b.sold30d - a.sold30d).slice(0, 8);
  const maxSold     = Math.max(1, ...topProducts.map((p) => p.sold30d));

  // Current month partial data
  const latestMonth = REVENUE_TREND[REVENUE_TREND.length - 1];
  const prevMonth   = REVENUE_TREND[REVENUE_TREND.length - 2];
  const margin      = ((latestMonth.ricavi - latestMonth.costi) / latestMonth.ricavi) * 100;
  const prevMargin  = ((prevMonth.ricavi - prevMonth.costi) / prevMonth.ricavi) * 100;
  const marginDelta = margin - prevMargin;

  const healthStats = [
    { it: "Disponibili",   en: "In Stock",    count: products.filter((p) => getStockStatus(p).tone === "ok").length,       color: "bg-emerald-500", textColor: "text-emerald-800" },
    { it: "Scorta Bassa",  en: "Low Stock",   count: products.filter((p) => getStockStatus(p).tone === "warning").length,  color: "bg-amber-500",   textColor: "text-amber-800"   },
    { it: "Esauriti",      en: "Out of Stock",count: products.filter((p) => getStockStatus(p).tone === "critical").length, color: "bg-rose-500",    textColor: "text-rose-800"    },
  ];

  return (
    <div className="p-8 bg-[#faf8f3] min-h-full space-y-6">
      {/* Revenue + margin */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white border border-stone-300 p-6">
          <SectionLabel accessory={
            <div className="flex gap-1">
              {["3M", "6M"].map((p) => (
                <button key={p} className={`px-2 py-1 text-[10px] font-mono ${p === "6M" ? "bg-stone-900 text-stone-50" : "text-stone-600 hover:bg-stone-100"}`}>{p}</button>
              ))}
            </div>
          }>
            {t("Ricavi vs Costi Acquisto — Ultimi 6 Mesi","Revenue vs Purchase Costs — Last 6 Months")}
          </SectionLabel>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={REVENUE_TREND} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
              { it: "Ricavi",        en: "Revenue",      val: fmtEur(latestMonth.ricavi), bold: false },
              { it: "Costi Acquisto",en: "Purchase Cost",val: fmtEur(latestMonth.costi),  bold: false },
              { it: "Utile Lordo",   en: "Gross Profit", val: fmtEur(latestMonth.ricavi - latestMonth.costi), bold: true, green: true },
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
          <SectionLabel>{t("Prodotti Più Venduti · Ultimi 30 Giorni","Top-Selling Products · Last 30 Days")}</SectionLabel>
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
        </div>

        <div className="bg-white border border-stone-300 p-6">
          <SectionLabel>{t("Salute del Magazzino","Inventory Health")}</SectionLabel>
          <div className="space-y-3 mt-2">
            {healthStats.map((row) => {
              const pct = (row.count / Math.max(products.length, 1)) * 100;
              return (
                <div key={row.it}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] text-stone-700">{t(row.it, row.en)}</span>
                    <span className={`text-[13px] font-mono font-semibold ${row.textColor}`}>
                      {row.count} <span className="text-stone-400 font-normal">/ {products.length}</span>
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
              <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">{t("Valore Totale Magazzino","Total Stock Value")}</div>
              <div className="text-[22px] font-mono font-semibold text-stone-900 mt-1">
                {fmtEurShort(products.reduce((s, p) => s + p.stock * p.cost, 0))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">{t("Prodotti Totali","Total Products")}</div>
              <div className="text-[22px] font-mono font-semibold text-stone-900 mt-1">{products.length} SKU</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
