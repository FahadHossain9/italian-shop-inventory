import React, { useState, useMemo } from "react";
import { Plus, Eye, Edit3, Trash2, ShoppingBag, DollarSign, TrendingUp, CheckCircle2, Printer } from "lucide-react";
import { useLang, tx } from "../lang.jsx";
import { StatusPill, KpiCard, IconBtn } from "../ui.jsx";
import { fmtEur, fmtEurShort, fmtDateIT } from "../helpers.js";
import { PAYMENT_CHANNELS } from "../data.js";

function printDocumento(v) {
  const linesHtml = (v.lines || []).map((l) =>
    `<tr><td>${l.sku}</td><td>${l.product}</td><td style="text-align:right">${l.qty}</td><td style="text-align:right">${fmtEur(l.price)}</td><td style="text-align:right">${fmtEur(l.qty * l.price)}</td></tr>`
  ).join("");
  const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"/>
  <title>Documento ${v.id}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Courier New',monospace;font-size:12px;color:#111;padding:28px 36px;max-width:620px;margin:0 auto}
    .header{text-align:center;border-bottom:2px solid #111;padding-bottom:12px;margin-bottom:16px}
    .shop{font-size:18px;font-weight:bold;letter-spacing:0.06em}
    .sub{font-size:10px;color:#555;margin-top:3px}
    .doc-title{font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:0.15em;margin:14px 0 8px}
    .meta{display:flex;justify-content:space-between;font-size:11px;color:#555;margin-bottom:14px}
    table{width:100%;border-collapse:collapse;margin:10px 0}
    th{font-size:9px;text-transform:uppercase;letter-spacing:0.12em;text-align:left;padding:4px 6px;background:#f0f0f0;border-bottom:1px solid #ccc}
    th:last-child,td:last-child{text-align:right}
    td{padding:5px 6px;border-bottom:1px solid #eee;font-size:11px}
    .total-row{display:flex;justify-content:space-between;font-size:15px;font-weight:bold;margin-top:14px;padding-top:10px;border-top:2px solid #111}
    .channel{display:inline-block;border:1px solid #999;padding:1px 8px;font-size:10px;letter-spacing:0.08em;margin-top:6px}
    .footer{margin-top:28px;font-size:9px;color:#aaa;text-align:center;border-top:1px solid #eee;padding-top:8px}
    @media print{body{padding:12px}}
  </style></head><body>
  <div class="header">
    <div class="shop">AL BAZAR DI MILANO</div>
    <div class="sub">Via Padova 104 · 20127 Milano · P.IVA 12345678901</div>
    <div class="sub">Tel: +39 02 1234567</div>
  </div>
  <div class="doc-title">Documento Commerciale Non Fiscale</div>
  <div class="meta">
    <span>N°: <strong>${v.id}</strong></span>
    <span>Data: <strong>${v.date}</strong></span>
    <span>Cliente: <strong>${v.customer || "Walk-in"}</strong></span>
  </div>
  <table>
    <thead><tr><th>SKU</th><th>Prodotto</th><th>Qtà</th><th>Prezzo</th><th>Totale</th></tr></thead>
    <tbody>${linesHtml || `<tr><td colspan="5" style="text-align:center;color:#999">—</td></tr>`}</tbody>
  </table>
  <div class="total-row"><span>TOTALE</span><span>${fmtEur(v.total)}</span></div>
  <div style="margin-top:8px"><span class="channel">${v.channel}</span></div>
  <div class="footer">Documento non fiscale · Al Bazar Shop Manager · ${new Date().toLocaleDateString("it-IT")}</div>
  </body></html>`;
  const win = window.open("", "_blank", "width=680,height=860");
  if (win) { win.document.write(html); win.document.close(); win.print(); }
}

const STATUS_TONE = { completata: "ok", "in consegna": "accent", "in elaborazione": "warning", annullata: "critical" };

const channelStyle = (id) => PAYMENT_CHANNELS.find((c) => c.id === id)?.color
  || "border-stone-300 text-stone-700 bg-stone-50";

export default function Vendite({ vendite, onView, onEdit, onCreate, onDelete }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);
  const [channelFilter, setChannelFilter] = useState("all");

  const filtered = useMemo(() =>
    channelFilter === "all" ? vendite : vendite.filter((v) => v.channel === channelFilter),
    [vendite, channelFilter]);

  const totalRev   = filtered.reduce((s, v) => s + (v.total || 0), 0);
  const completed  = vendite.filter((v) => v.status === "completata").length;
  const avgTicket  = filtered.length ? totalRev / filtered.length : 0;

  // ── Corrispettivi: IVA breakdown across all completed sales today ───────────
  const today = new Date().toISOString().slice(0, 10);
  const todaySales = vendite.filter((v) => v.date === today && v.status === "completata");
  const corrispettivi = useMemo(() => {
    const bd = {};
    todaySales.forEach((v) => {
      (v.lines || []).forEach((l) => {
        const gross      = l.qty * l.unitPrice;
        const imponibile = gross / (1 + l.iva / 100);
        if (!bd[l.iva]) bd[l.iva] = { imponibile: 0, iva: 0, lordo: 0 };
        bd[l.iva].imponibile += imponibile;
        bd[l.iva].iva        += gross - imponibile;
        bd[l.iva].lordo      += gross;
      });
    });
    return bd;
  }, [todaySales]);
  const totaleOggi = Object.values(corrispettivi).reduce((s, g) => s + g.lordo, 0);

  return (
    <div className="p-8 bg-[#faf8f3] min-h-full space-y-6">
      {/* ── KPI cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label={t("Vendite Totali","Total Sales")} labelEn={lang === "bilingual" ? "Total Sales" : undefined}
          value={vendite.length} delta="" deltaType="flat" sub={t("nel periodo","in period")} icon={ShoppingBag} accent />
        <KpiCard label={t("Ricavi Periodo","Period Revenue")}
          value={fmtEurShort(totalRev)} delta="+8,4%" deltaType="up" sub={t("vs settimana scorsa","vs last week")} icon={DollarSign} />
        <KpiCard label={t("Scontrino Medio","Avg Transaction")}
          value={fmtEurShort(avgTicket)} delta="" deltaType="flat" sub={t("per transazione","per transaction")} icon={TrendingUp} />
        <KpiCard label={t("Completate","Completed")}
          value={completed} delta="" deltaType="up"
          sub={`${Math.round((completed / Math.max(vendite.length, 1)) * 100)}% ${t("del totale","of total")}`} icon={CheckCircle2} />
      </div>

      {/* ── Corrispettivi del Giorno ───────────────────────────────────────── */}
      <div className="bg-white border border-stone-300 p-5">
        <div className="flex items-end justify-between mb-4 pb-2 border-b border-stone-200">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-stone-500">
              {t("Corrispettivi del Giorno","Today's Corrispettivi")}
            </div>
            <div className="text-[11px] text-stone-400 font-mono mt-0.5">
              {t("Riepilogo IVA da trasmettere all'Agenzia delle Entrate","VAT summary for Agenzia delle Entrate transmission")}
            </div>
          </div>
          <div className="text-[11px] font-mono text-stone-500">{today}</div>
        </div>
        {Object.keys(corrispettivi).length === 0 ? (
          <div className="text-[12px] text-stone-500 font-mono py-2">{t("Nessuna vendita oggi ancora.","No sales today yet.")}</div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(corrispettivi).map(([rate, g]) => (
              <div key={rate} className="border border-stone-200 p-3">
                <div className="text-[10px] uppercase tracking-wider font-mono text-stone-500 mb-2">IVA {rate}%</div>
                <div className="space-y-1 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-stone-600">{t("Lordo","Gross")}</span>
                    <span className="font-mono font-semibold">{fmtEur(g.lordo)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>{t("Imponibile","Base")}</span>
                    <span className="font-mono">{fmtEur(g.imponibile)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>IVA</span>
                    <span className="font-mono">{fmtEur(g.iva)}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="border border-stone-900 bg-stone-900 text-stone-50 p-3">
              <div className="text-[10px] uppercase tracking-wider font-mono text-stone-400 mb-2">{t("Totale Giorno","Day Total")}</div>
              <div className="text-[22px] font-mono font-semibold">{fmtEurShort(totaleOggi)}</div>
              <div className="text-[11px] font-mono text-stone-400 mt-1">
                {todaySales.length} {t("scontrini","transactions")}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Sales table ────────────────────────────────────────────────────── */}
      <div className="bg-white border border-stone-300">
        <div className="px-6 py-4 border-b border-stone-300 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">{t("Registro Vendite","Sales Register")}</div>
            <h3 className="font-serif text-[20px] text-stone-900 tracking-tight"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
              {t("Vendite al Negozio","Shop Sales")}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)}
              className="px-3 py-1.5 text-[12px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700 font-mono">
              <option value="all">{t("Tutti i canali","All channels")}</option>
              {PAYMENT_CHANNELS.map((ch) => (
                <option key={ch.id} value={ch.id}>{t(ch.it, ch.en)}</option>
              ))}
            </select>
            <button onClick={onCreate}
              className="px-3 py-1.5 text-[12px] bg-stone-900 text-stone-50 hover:bg-stone-700 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> {t("Nuova Vendita","New Sale")}
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-300">
            <tr>
              {[t("N° Vendita","Sale #"), t("Cliente","Customer"), t("Prodotti","Products"),
                t("Canale","Channel"), t("Totale","Total"), t("Data","Date"), t("Stato","Status"), ""].map((h, i) => (
                <th key={i} className="text-left px-4 py-3 text-[10px] uppercase tracking-[0.15em] font-mono text-stone-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-[12px] text-stone-500 font-mono">
                {t("Nessuna vendita in questo periodo.","No sales for this period.")}
              </td></tr>
            )}
            {filtered.map((v) => {
              const lineCount = v.lines?.length || v.items || 0;
              const preview   = (v.lines || []).slice(0, 2).map((l) => l.product).join(", ");
              return (
                <tr key={v.id} className="border-b border-stone-100 hover:bg-stone-50/60 group">
                  <td className="px-4 py-3 text-[12px] font-mono text-stone-900 font-medium">{v.id}</td>
                  <td className="px-4 py-3 text-[12px] text-stone-700 max-w-[120px] truncate">
                    {v.customer === "—" || !v.customer ? (
                      <span className="text-stone-400 italic">{t("Anonimo","Walk-in")}</span>
                    ) : v.customer}
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <div className="text-[11px] text-stone-800 truncate">{preview}{lineCount > 2 ? ` +${lineCount - 2}` : ""}</div>
                    <div className="text-[10px] font-mono text-stone-500">{lineCount} {t("articoli","items")}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 border ${channelStyle(v.channel)}`}>
                      {v.channel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-mono font-semibold text-stone-900">{fmtEur(v.total)}</td>
                  <td className="px-4 py-3 text-[11px] font-mono text-stone-600">{fmtDateIT(v.date)}</td>
                  <td className="px-4 py-3"><StatusPill tone={STATUS_TONE[v.status] || "info"}>{v.status}</StatusPill></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <IconBtn title={t("Stampa Documento","Print Receipt")} onClick={() => printDocumento(v)}><Printer className="w-3.5 h-3.5" /></IconBtn>
                      <IconBtn title={t("Visualizza","View")} onClick={() => onView(v)}><Eye className="w-3.5 h-3.5" /></IconBtn>
                      <IconBtn title={t("Modifica","Edit")} tone="accent" onClick={() => onEdit(v)}><Edit3 className="w-3.5 h-3.5" /></IconBtn>
                      <IconBtn title={t("Elimina","Delete")} tone="danger" onClick={() => onDelete(v)}><Trash2 className="w-3.5 h-3.5" /></IconBtn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
