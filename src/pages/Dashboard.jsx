import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  DollarSign, Package, AlertTriangle, ChevronRight,
  ArrowDown, ArrowUp, ArrowLeftRight, Edit3,
  ShoppingBag, ShoppingCart, TrendingUp,
} from "lucide-react";
import { useLang, tx } from "../lang.jsx";
import { KpiCard, SectionLabel } from "../ui.jsx";
import { fmtEur, fmtEurShort, getStockStatus, daysUntilExpiry, fmtDateIT } from "../helpers.js";

// ── Date range helpers ─────────────────────────────────────────────────────────
const RANGES = [
  { id: "oggi", it: "Oggi",      en: "Today"     },
  { id: "7gg",  it: "7 giorni",  en: "7 days"    },
  { id: "30gg", it: "30 giorni", en: "30 days"   },
  { id: "3m",   it: "3 mesi",    en: "3 months"  },
];

function subtractDays(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function subtractMonths(n) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString().slice(0, 10);
}

function rangeWindow(id) {
  const today = new Date().toISOString().slice(0, 10);
  if (id === "oggi")  return { start: today,              prevStart: subtractDays(1),   prevEnd: subtractDays(1)  };
  if (id === "7gg")   return { start: subtractDays(6),    prevStart: subtractDays(13),  prevEnd: subtractDays(7)  };
  if (id === "30gg")  return { start: subtractDays(29),   prevStart: subtractDays(59),  prevEnd: subtractDays(30) };
  if (id === "3m")    return { start: subtractMonths(3),  prevStart: subtractMonths(6), prevEnd: subtractMonths(3)};
  return { start: today, prevStart: today, prevEnd: today };
}

// ── Revenue trend aggregation ──────────────────────────────────────────────────
function buildRevenueTrend(venditeInRange, rangeId, rangeStart) {
  if (rangeId === "3m") {
    const weeks = {};
    venditeInRange.forEach((v) => {
      const d   = new Date(v.date);
      const dow = d.getDay() || 7; // 1=Mon…7=Sun
      const mon = new Date(d);
      mon.setDate(d.getDate() - dow + 1);
      const key  = mon.toISOString().slice(0, 10);
      const label = `${mon.getDate()}/${mon.getMonth() + 1}`;
      if (!weeks[key]) weeks[key] = { day: label, rev: 0, count: 0 };
      weeks[key].rev   += v.total || 0;
      weeks[key].count += 1;
    });
    return Object.entries(weeks).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  }

  // Daily aggregation
  const days  = {};
  const cur   = new Date(rangeStart);
  const end   = new Date();
  while (cur <= end) {
    const key   = cur.toISOString().slice(0, 10);
    const label = rangeId === "oggi"
      ? "Oggi"
      : `${cur.getDate()} ${cur.toLocaleString("it-IT", { month: "short" })}`;
    days[key] = { day: label, rev: 0, count: 0 };
    cur.setDate(cur.getDate() + 1);
  }
  venditeInRange.forEach((v) => {
    if (days[v.date]) {
      days[v.date].rev   += v.total || 0;
      days[v.date].count += 1;
    }
  });
  return Object.values(days);
}

// ── Channel colour palette ─────────────────────────────────────────────────────
const CH_COLORS = ["#1a1a1a", "#d4a437", "#78716c", "#a8a29e", "#57534e"];

// ══════════════════════════════════════════════════════════════════════════════
export default function Dashboard({
  products, movements, vendite = [],
  onJump, onNewMovement, onNewSale, onNewPurchaseOrder,
}) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);
  const [range, setRange] = useState("30gg");

  const today = new Date().toISOString().slice(0, 10);
  const { start, prevStart, prevEnd } = useMemo(() => rangeWindow(range), [range]);

  // ── Filtered vendite ────────────────────────────────────────────────────────
  const venditeRange = useMemo(
    () => vendite.filter((v) => v.date >= start && v.date <= today),
    [vendite, start, today]
  );
  const venditePrev = useMemo(
    () => vendite.filter((v) => v.date >= prevStart && v.date <= prevEnd),
    [vendite, prevStart, prevEnd]
  );

  // ── Revenue metrics ─────────────────────────────────────────────────────────
  const totalRev   = venditeRange.reduce((s, v) => s + (v.total || 0), 0);
  const prevRev    = venditePrev.reduce((s,  v) => s + (v.total || 0), 0);
  const revDeltaPct = prevRev > 0 ? ((totalRev - prevRev) / prevRev * 100) : null;
  const salesCount  = venditeRange.length;
  const prevCount   = venditePrev.length;
  const cntDeltaPct = prevCount > 0 ? ((salesCount - prevCount) / prevCount * 100) : null;
  const avgTicket   = salesCount > 0 ? totalRev / salesCount : 0;

  // ── Stock metrics ───────────────────────────────────────────────────────────
  const lowStock   = products.filter((p) => getStockStatus(p).tone !== "ok")
                              .sort((a, b) => a.stock - b.stock).slice(0, 6);
  const expiring   = products.filter((p) => { const d = daysUntilExpiry(p.expiry); return d !== null && d <= 7; });
  const totalValue = products.reduce((s, p) => s + p.stock * p.cost, 0);
  const topMovers  = [...products].sort((a, b) => b.sold30d - a.sold30d).slice(0, 5);

  // ── Charts ──────────────────────────────────────────────────────────────────
  const revenueTrend = useMemo(
    () => buildRevenueTrend(venditeRange, range, start),
    [venditeRange, range, start]
  );

  const channelBreakdown = useMemo(() => {
    const map = {};
    venditeRange.forEach((v) => {
      if (!map[v.channel]) map[v.channel] = { name: v.channel, rev: 0, count: 0 };
      map[v.channel].rev   += v.total || 0;
      map[v.channel].count += 1;
    });
    return Object.values(map)
      .sort((a, b) => b.rev - a.rev)
      .map((c, i) => ({ ...c, fill: CH_COLORS[i % CH_COLORS.length] }));
  }, [venditeRange]);

  // ── Greeting ────────────────────────────────────────────────────────────────
  const hour = new Date().getHours();
  const greeting = hour < 12
    ? t("Buongiorno", "Good Morning")
    : hour < 17
    ? t("Buon pomeriggio", "Good Afternoon")
    : t("Buonasera", "Good Evening");

  const fmtDelta = (pct) =>
    pct === null ? "—" : `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
  const deltaType = (pct) =>
    pct === null ? "flat" : pct >= 0 ? "up" : "down";

  // ── X-axis interval to avoid label clutter ──────────────────────────────────
  const xInterval = range === "30gg" ? 4 : range === "3m" ? 1 : 0;

  return (
    <div className="p-8 space-y-6 bg-[#faf8f3] min-h-full">

      {/* ── Header: greeting + date range ───────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-serif text-[22px] text-stone-900"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
            {greeting}, Rahman! 👋
          </div>
          <div className="text-[12px] text-stone-500 font-mono mt-0.5">
            Al Bazar di Milano · Via Padova 104 ·{" "}
            {new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>

        {/* Date range pills */}
        <div className="flex items-center gap-0 bg-white border border-stone-300 p-1">
          {RANGES.map((r) => (
            <button key={r.id} onClick={() => setRange(r.id)}
              className={`px-3.5 py-1.5 text-[11px] font-mono font-semibold transition-colors ${
                range === r.id
                  ? "bg-stone-900 text-stone-50"
                  : "text-stone-600 hover:bg-stone-100"
              }`}>
              {t(r.it, r.en)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { it: "Nuova Vendita",      en: "New Sale",       Icon: ShoppingBag,    fn: onNewSale,                          accent: true  },
          { it: "Carico Merci",       en: "Stock In",       Icon: ArrowDown,      fn: onNewMovement,                      accent: false },
          { it: "Nuovo Ordine",       en: "New PO",         Icon: ShoppingCart,   fn: onNewPurchaseOrder,                 accent: false },
          { it: "Aggiungi Prodotto",  en: "Add Product",    Icon: Package,        fn: () => onJump?.("products"),         accent: false },
        ].map(({ it, en, Icon, fn, accent }) => (
          <button key={it} onClick={fn}
            className={`flex items-center gap-3 px-4 py-3.5 border text-left transition-all hover:shadow-sm group ${
              accent
                ? "bg-[#d4a437] border-[#b8862f] text-stone-900 hover:bg-[#b8862f]"
                : "bg-white border-stone-300 text-stone-800 hover:border-stone-600"
            }`}>
            <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${
              accent ? "bg-[#b8862f]/30" : "bg-stone-100 group-hover:bg-stone-200 transition-colors"
            }`}>
              <Icon className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <span className="text-[12px] font-semibold leading-tight">{t(it, en)}</span>
          </button>
        ))}
      </div>

      {/* ── KPI cards ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label={t("Ricavi Periodo", "Period Revenue")}
          labelEn={lang === "bilingual" ? "Period Revenue" : undefined}
          value={fmtEurShort(totalRev)}
          delta={fmtDelta(revDeltaPct)}
          deltaType={deltaType(revDeltaPct)}
          sub={t("vs periodo precedente", "vs previous period")}
          icon={DollarSign} accent
        />
        <KpiCard
          label={t("N° Vendite", "Sales Count")}
          labelEn={lang === "bilingual" ? "Sales Count" : undefined}
          value={salesCount}
          delta={fmtDelta(cntDeltaPct)}
          deltaType={deltaType(cntDeltaPct)}
          sub={t(`scontrino medio ${fmtEur(avgTicket)}`, `avg ticket ${fmtEur(avgTicket)}`)}
          icon={ShoppingBag}
        />
        <KpiCard
          label={t("Valore Magazzino", "Stock Value")}
          labelEn={lang === "bilingual" ? "Stock Value" : undefined}
          value={fmtEurShort(totalValue)}
          delta="+4,2%" deltaType="up"
          sub={t("vs mese scorso", "vs last month")}
          icon={Package}
        />
        <KpiCard
          label={t("Scorte Basse", "Low Stock")}
          labelEn={lang === "bilingual" ? "Low Stock" : undefined}
          value={lowStock.length + expiring.length}
          delta={lowStock.length + expiring.length > 0 ? t("richiede attenzione", "needs attention") : t("tutto ok", "all good")}
          deltaType={lowStock.length + expiring.length > 0 ? "down" : "flat"}
          sub={t(`${lowStock.length} stock · ${expiring.length} scadenze`, `${lowStock.length} stock · ${expiring.length} expiry`)}
          icon={AlertTriangle}
        />
      </div>

      {/* ── Charts row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Revenue trend */}
        <div className="col-span-2 bg-white border border-stone-300 p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">
                {t("Andamento Ricavi", "Revenue Trend")} · {RANGES.find((r) => r.id === range)?.[lang === "en" ? "en" : "it"]}
              </div>
              <h3 className="font-serif text-[20px] text-stone-900 mt-1 tracking-tight"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
                {t("Ricavi & Transazioni", "Revenue & Transactions")}
              </h3>
            </div>
            <div className="text-right">
              <div className="text-[22px] font-mono font-semibold text-stone-900 leading-none">{fmtEurShort(totalRev)}</div>
              <div className="text-[11px] text-stone-500 font-mono mt-1">{salesCount} {t("vendite", "sales")}</div>
              {revDeltaPct !== null && (
                <div className={`text-[10px] font-mono font-bold mt-0.5 ${revDeltaPct >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                  {fmtDelta(revDeltaPct)} {t("vs periodo prec.", "vs prev. period")}
                </div>
              )}
            </div>
          </div>
          {revenueTrend.length === 0 || totalRev === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-[12px] text-stone-400 font-mono">
              {t("Nessuna vendita in questo periodo.", "No sales in this period.")}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueTrend} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1a1a1a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="#e7e2d6" vertical={false} />
                <XAxis dataKey="day"
                  tick={{ fontSize: 10, fontFamily: "monospace", fill: "#78716c" }}
                  axisLine={false} tickLine={false} interval={xInterval} />
                <YAxis
                  tick={{ fontSize: 10, fontFamily: "monospace", fill: "#78716c" }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v) => fmtEurShort(v)} />
                <Tooltip
                  contentStyle={{ background: "#1a1a1a", border: "none", color: "#fff", fontSize: 11, fontFamily: "monospace" }}
                  formatter={(v, n, { payload }) => [fmtEur(v), t("Ricavi", "Revenue")]}
                  labelFormatter={(label) => label}
                  cursor={{ stroke: "#d4a437", strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Area type="monotone" dataKey="rev" stroke="#1a1a1a" strokeWidth={2} fill="url(#gRev)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Channel breakdown */}
        <div className="bg-white border border-stone-300 p-6">
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">
              {t("Canali di Vendita", "Sales Channels")}
            </div>
            <h3 className="font-serif text-[20px] text-stone-900 mt-1 tracking-tight"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
              {t("Per Canale", "By Channel")}
            </h3>
          </div>
          {channelBreakdown.length === 0 ? (
            <div className="text-[12px] text-stone-400 font-mono py-10 text-center">
              {t("Nessuna vendita nel periodo.", "No sales in period.")}
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={channelBreakdown} dataKey="rev"
                    cx="50%" cy="50%" innerRadius={38} outerRadius={58}
                    paddingAngle={2} stroke="#faf8f3" strokeWidth={2}>
                    {channelBreakdown.map((_, i) => <Cell key={i} fill={channelBreakdown[i].fill} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#1a1a1a", border: "none", color: "#fff", fontSize: 11, fontFamily: "monospace" }}
                    formatter={(v) => [fmtEur(v), t("Ricavi", "Revenue")]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-2">
                {channelBreakdown.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 flex-shrink-0" style={{ background: c.fill }} />
                      <span className="text-stone-700 font-mono">{c.name}</span>
                    </span>
                    <div className="text-right">
                      <span className="font-mono text-stone-900 font-semibold">{fmtEurShort(c.rev)}</span>
                      <span className="text-stone-400 font-mono text-[10px] ml-1.5">{c.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Bottom row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Alerts panel */}
        <div className="col-span-2 bg-white border border-stone-300 p-6">
          <SectionLabel accessory={
            <button onClick={() => onJump?.("products")}
              className="text-[11px] font-mono text-stone-600 hover:text-[#b8862f] flex items-center gap-1">
              {t("Vedi tutti", "View all")} <ChevronRight className="w-3 h-3" />
            </button>
          }>
            {t("Avvisi Urgenti — Scorte & Scadenze", "Urgent Alerts — Stock & Expiry")}
          </SectionLabel>

          {lowStock.length === 0 && expiring.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-[28px] mb-2">✅</div>
              <div className="text-[13px] text-stone-600">
                {t("Nessun avviso — tutto sotto controllo!", "No alerts — everything is under control!")}
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {expiring.map((p) => {
                const days = daysUntilExpiry(p.expiry);
                return (
                  <div key={`exp-${p.id}`} className="flex items-center justify-between py-3 border-b border-stone-100">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-1 h-10 bg-rose-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] text-stone-900 font-medium truncate">{p.name}</div>
                        <div className="text-[11px] text-stone-500 font-mono">{p.id} · {t("Scade", "Expires")} {fmtDateIT(p.expiry)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className={`text-[12px] font-mono font-semibold px-2 py-0.5 border ${days <= 3 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}>
                        {days <= 0 ? t("SCADUTO", "EXPIRED") : `${days}gg`}
                      </div>
                    </div>
                  </div>
                );
              })}
              {lowStock.map((p) => {
                const status = getStockStatus(p);
                return (
                  <div key={`low-${p.id}`} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-b-0">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-1 h-10 flex-shrink-0 ${status.tone === "critical" ? "bg-rose-500" : "bg-amber-500"}`} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] text-stone-900 font-medium truncate">{p.name}</div>
                        <div className="text-[11px] text-stone-500 font-mono">{p.id} · {t("Scaffale", "Shelf")} {p.shelf}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className={`text-[15px] font-mono font-semibold ${p.stock === 0 ? "text-rose-700" : "text-amber-800"}`}>
                          {p.stock} pz
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">{t("min", "min")} {p.reorder}</div>
                      </div>
                      <button onClick={() => onNewPurchaseOrder?.()}
                        className="text-[11px] font-mono uppercase tracking-wider text-stone-700 hover:text-stone-900 border border-stone-300 hover:border-stone-700 px-3 py-1.5 transition-colors">
                        {t("Ordina", "Reorder")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: top movers + recent movements */}
        <div className="space-y-4">
          <div className="bg-white border border-stone-300 p-5">
            <SectionLabel>{t("Più Venduti (30gg)", "Top Sellers (30d)")}</SectionLabel>
            <div className="space-y-2.5">
              {topMovers.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <span className="text-[11px] font-mono text-stone-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-stone-900 truncate">{p.name}</div>
                    <div className="h-1 bg-stone-100 mt-1">
                      <div className="h-full bg-stone-900"
                        style={{ width: `${(p.sold30d / Math.max(topMovers[0].sold30d, 1)) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-[13px] font-mono font-semibold text-stone-900 w-10 text-right">{p.sold30d}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-stone-300 p-5">
            <SectionLabel>{t("Ultima Attività", "Recent Activity")}</SectionLabel>
            <div className="space-y-0">
              {movements.slice(0, 6).map((m, i) => {
                const MAP = {
                  in:       { Icon: ArrowDown,       color: "text-emerald-700 bg-emerald-50" },
                  out:      { Icon: ArrowUp,          color: "text-rose-700 bg-rose-50"       },
                  adjust:   { Icon: Edit3,            color: "text-stone-700 bg-stone-100"    },
                  scaduto:  { Icon: AlertTriangle,    color: "text-rose-700 bg-rose-50"       },
                  transfer: { Icon: ArrowLeftRight,   color: "text-[#b8862f] bg-[#fbf3df]"   },
                };
                const { Icon, color } = MAP[m.type] || MAP.adjust;
                return (
                  <div key={m.id} className={`flex items-start gap-2.5 py-2 ${i < 5 ? "border-b border-stone-100" : ""}`}>
                    <div className={`w-6 h-6 ${color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-3 h-3" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-stone-900 truncate">{m.product}</div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {m.type === "in" ? "+" : (m.type === "out" || m.type === "scaduto") ? "−" : ""}
                        {Math.abs(m.qty)} · {m.ref}
                      </div>
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono flex-shrink-0">{m.time.split(" ")[1]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
