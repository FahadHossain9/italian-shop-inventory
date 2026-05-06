import React from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  DollarSign, Package, AlertTriangle, Clock, ChevronRight,
  ArrowDown, ArrowUp, ArrowLeftRight, Edit3, Plus,
} from "lucide-react";
import { useLang, tx } from "../lang.jsx";
import { KpiCard, SectionLabel } from "../ui.jsx";
import { fmtEur, fmtEurShort, getStockStatus, daysUntilExpiry, expiryTone, fmtDateIT } from "../helpers.js";
import { STOCK_TREND, CATEGORY_BREAKDOWN } from "../data.js";

export default function Dashboard({ products, movements, onJump, onNewMovement }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);

  const lowStock    = products.filter((p) => getStockStatus(p).tone !== "ok").sort((a, b) => a.stock - b.stock).slice(0, 6);
  const totalValue  = products.reduce((s, p) => s + p.stock * p.cost, 0);
  const expiring    = products.filter((p) => { const d = daysUntilExpiry(p.expiry); return d !== null && d <= 7; });
  const topMovers   = [...products].sort((a, b) => b.sold30d - a.sold30d).slice(0, 5);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12
    ? t("Buongiorno", "Good Morning")
    : hour < 17
    ? t("Buon pomeriggio", "Good Afternoon")
    : t("Buonasera", "Good Evening");

  return (
    <div className="p-8 space-y-8 bg-[#faf8f3] min-h-full">

      {/* Greeting bar */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-serif text-[22px] text-stone-900" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
            {greeting}, Rahman! 👋
          </div>
          <div className="text-[12px] text-stone-500 font-mono mt-0.5">
            Al Bazar di Milano · Via Padova 104 · {new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
        <button
          onClick={onNewMovement}
          className="px-4 py-2 bg-stone-900 text-stone-50 hover:bg-stone-700 text-[12px] font-medium flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          {t("Nuovo Movimento", "New Movement")}
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label={t("Valore Magazzino", "Stock Value")}
          labelEn={lang === "bilingual" ? "Stock Value" : undefined}
          value={fmtEurShort(totalValue)}
          delta="+4,2%" deltaType="up"
          sub={t("vs mese scorso", "vs last month")}
          icon={DollarSign} accent
        />
        <KpiCard
          label={t("Prodotti Attivi", "Active Products")}
          labelEn={lang === "bilingual" ? "Active Products" : undefined}
          value={products.length}
          delta="+2" deltaType="up"
          sub={t("questa settimana", "this week")}
          icon={Package}
        />
        <KpiCard
          label={t("Scorte in Esaurimento", "Low Stock")}
          labelEn={lang === "bilingual" ? "Low Stock" : undefined}
          value={lowStock.length}
          delta={lowStock.length > 0 ? t("da riordinare", "needs reorder") : t("tutto ok", "all good")}
          deltaType={lowStock.length > 2 ? "down" : "flat"}
          sub={t("prodotti sotto scorta min.", "products below min.")}
          icon={AlertTriangle}
        />
        <KpiCard
          label={t("In Scadenza (7gg)", "Expiring (7d)")}
          labelEn={lang === "bilingual" ? "Expiring in 7 days" : undefined}
          value={expiring.length}
          delta={expiring.length > 0 ? t("controlla frigo", "check fridge") : t("tutto ok", "all good")}
          deltaType={expiring.length > 0 ? "down" : "flat"}
          sub={t("prodotti con scadenza vicina", "products expiring soon")}
          icon={Clock}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Stock flow chart */}
        <div className="col-span-2 bg-white border border-stone-300 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">
                {t("Flusso Merci · Ultimi 7 Giorni", "Stock Flow · Last 7 Days")}
              </div>
              <h3 className="font-serif text-[20px] text-stone-900 mt-1 tracking-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
                {t("Entrate vs Uscite", "Inbound vs Outbound")}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#1a1a1a]" />{t("Entrate","In")}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#d4a437]" />{t("Uscite","Out")}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={STOCK_TREND} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="gIn"  x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1a1a1a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#d4a437" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#d4a437" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="#e7e2d6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fontFamily: "monospace", fill: "#78716c" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: "monospace", fill: "#78716c" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "none", color: "#fff", fontSize: 12, fontFamily: "monospace" }} cursor={{ stroke: "#d4a437", strokeWidth: 1, strokeDasharray: "4 4" }} />
              <Area type="monotone" dataKey="entrate" stroke="#1a1a1a" strokeWidth={2} fill="url(#gIn)" />
              <Area type="monotone" dataKey="uscite"  stroke="#d4a437" strokeWidth={2} fill="url(#gOut)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="bg-white border border-stone-300 p-6">
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">
              {t("Distribuzione", "Distribution")}
            </div>
            <h3 className="font-serif text-[20px] text-stone-900 mt-1 tracking-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
              {t("Per Categoria", "By Category")}
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={CATEGORY_BREAKDOWN} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={2} stroke="#faf8f3" strokeWidth={2}>
                {CATEGORY_BREAKDOWN.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "none", color: "#fff", fontSize: 11, fontFamily: "monospace" }}
                formatter={(v, n, { payload }) => [v + " SKU", lang === "en" ? payload.nameEn : payload.name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {CATEGORY_BREAKDOWN.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 flex-shrink-0" style={{ background: c.fill }} />
                  <span className="text-stone-700">{lang === "en" ? c.nameEn : c.name}</span>
                </span>
                <span className="font-mono text-stone-500">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Low stock + expiry alerts */}
        <div className="col-span-2 bg-white border border-stone-300 p-6">
          <SectionLabel accessory={
            <button onClick={() => onJump("products")} className="text-[11px] font-mono text-stone-600 hover:text-[#b8862f] flex items-center gap-1">
              {t("Vedi tutti", "View all")} <ChevronRight className="w-3 h-3" />
            </button>
          }>
            {t("Avvisi Urgenti — Scorte & Scadenze", "Urgent Alerts — Stock & Expiry")}
          </SectionLabel>

          {lowStock.length === 0 && expiring.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-[28px] mb-2">✅</div>
              <div className="text-[13px] text-stone-600">{t("Nessun avviso — tutto sotto controllo!", "No alerts — everything is under control!")}</div>
            </div>
          ) : (
            <div className="space-y-0">
              {/* Expiry warnings */}
              {expiring.map((p, i) => {
                const days = daysUntilExpiry(p.expiry);
                return (
                  <div key={p.id} className="flex items-center justify-between py-3 border-b border-stone-100">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-1 h-10 bg-rose-500" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] text-stone-900 font-medium truncate">{p.name}</div>
                        <div className="text-[11px] text-stone-500 font-mono">{p.id} · {t("Scade", "Expires")} {fmtDateIT(p.expiry)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-[12px] font-mono font-semibold px-2 py-0.5 border ${days <= 3 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}>
                        {days <= 0 ? t("SCADUTO", "EXPIRED") : `${days}gg`}
                      </div>
                      <div className="text-[11px] text-stone-500">{t("in scadenza", "expiring")}</div>
                    </div>
                  </div>
                );
              })}
              {/* Low stock warnings */}
              {lowStock.map((p, i) => {
                const status = getStockStatus(p);
                return (
                  <div key={p.id} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-b-0">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-1 h-10 ${status.tone === "critical" ? "bg-rose-500" : "bg-amber-500"}`} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] text-stone-900 font-medium truncate">{p.name}</div>
                        <div className="text-[11px] text-stone-500 font-mono">{p.id} · {t("Scaffale", "Shelf")} {p.shelf}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-[15px] font-mono font-semibold ${p.stock === 0 ? "text-rose-700" : "text-amber-800"}`}>{p.stock} pz</div>
                        <div className="text-[10px] text-stone-500 font-mono">{t("min", "min")} {p.reorder}</div>
                      </div>
                      <button className="text-[11px] font-mono uppercase tracking-wider text-stone-700 hover:text-stone-900 border border-stone-300 hover:border-stone-700 px-3 py-1.5 transition-colors">
                        {t("Ordina", "Reorder")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top movers + recent activity */}
        <div className="space-y-4">
          {/* Top movers */}
          <div className="bg-white border border-stone-300 p-5">
            <SectionLabel>{t("Più Venduti (30gg)", "Top Sellers (30d)")}</SectionLabel>
            <div className="space-y-2.5">
              {topMovers.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <span className="text-[11px] font-mono text-stone-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-stone-900 truncate">{p.name}</div>
                    <div className="h-1 bg-stone-100 mt-1">
                      <div className="h-full bg-stone-900" style={{ width: `${(p.sold30d / topMovers[0].sold30d) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-[13px] font-mono font-semibold text-stone-900 w-10 text-right">{p.sold30d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent movements */}
          <div className="bg-white border border-stone-300 p-5">
            <SectionLabel>{t("Ultima Attività", "Recent Activity")}</SectionLabel>
            <div className="space-y-0">
              {movements.slice(0, 6).map((m, i) => {
                const MAP = {
                  in:      { Icon: ArrowDown,       color: "text-emerald-700 bg-emerald-50" },
                  out:     { Icon: ArrowUp,          color: "text-rose-700 bg-rose-50"       },
                  adjust:  { Icon: Edit3,            color: "text-stone-700 bg-stone-100"    },
                  scaduto: { Icon: AlertTriangle,    color: "text-rose-700 bg-rose-50"       },
                  transfer:{ Icon: ArrowLeftRight,   color: "text-[#b8862f] bg-[#fbf3df]"   },
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
                        {m.type === "in" ? "+" : m.type === "out" || m.type === "scaduto" ? "−" : ""}{Math.abs(m.qty)} · {m.ref}
                      </div>
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">{m.time.split(" ")[1]}</div>
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
