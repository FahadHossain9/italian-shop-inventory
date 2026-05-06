import React, { useState, useMemo } from "react";
import { Plus, Eye, Edit3, Trash2, ShoppingCart, DollarSign, Truck, Clock, Printer } from "lucide-react";
import { useLang, tx } from "../lang.jsx";
import { StatusPill, KpiCard, IconBtn, Pagination } from "../ui.jsx";
import { fmtEur, fmtEurShort, fmtDateIT } from "../helpers.js";

function printOrdine(po) {
  const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"/>
  <title>Ordine ${po.id}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Courier New',monospace;font-size:12px;color:#111;padding:32px 40px;max-width:680px;margin:0 auto}
    .header{border-bottom:2px solid #111;padding-bottom:14px;margin-bottom:20px}
    .shop{font-size:20px;font-weight:bold;letter-spacing:0.05em}
    .sub{font-size:11px;color:#555;margin-top:3px}
    .title{font-size:15px;font-weight:bold;text-transform:uppercase;letter-spacing:0.12em;margin:20px 0 4px}
    .meta{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;margin:16px 0}
    .kv{display:flex;flex-direction:column;gap:2px}
    .kv-label{font-size:9px;text-transform:uppercase;letter-spacing:0.14em;color:#777}
    .kv-val{font-size:13px;font-weight:bold}
    .divider{border-top:1px solid #ccc;margin:18px 0}
    .total-row{display:flex;justify-content:space-between;font-size:15px;font-weight:bold;margin-top:12px;padding-top:12px;border-top:2px solid #111}
    .status{display:inline-block;padding:2px 10px;border:1px solid #111;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;margin-top:4px}
    .footer{margin-top:40px;font-size:10px;color:#999;text-align:center}
    .sig{margin-top:48px;display:grid;grid-template-columns:1fr 1fr;gap:40px}
    .sig-line{border-top:1px solid #555;padding-top:6px;font-size:10px;color:#666;text-align:center}
    @media print{body{padding:20px}}
  </style></head><body>
  <div class="header">
    <div class="shop">AL BAZAR DI MILANO</div>
    <div class="sub">Via Padova 104 · 20127 Milano · P.IVA 12345678901</div>
  </div>
  <div class="title">Ordine di Acquisto</div>
  <div class="status">${po.status}</div>
  <div class="meta">
    <div class="kv"><span class="kv-label">N° Ordine</span><span class="kv-val">${po.id}</span></div>
    <div class="kv"><span class="kv-label">Data Ordine</span><span class="kv-val">${po.created}</span></div>
    <div class="kv"><span class="kv-label">Fornitore</span><span class="kv-val">${po.supplier}</span></div>
    <div class="kv"><span class="kv-label">Consegna Attesa</span><span class="kv-val">${po.expected || "—"}</span></div>
    <div class="kv"><span class="kv-label">N° Articoli (SKU)</span><span class="kv-val">${po.items}</span></div>
  </div>
  <div class="divider"></div>
  <div class="total-row"><span>Totale Ordine</span><span>${fmtEur(po.total)}</span></div>
  <div class="sig">
    <div class="sig-line">Firma Responsabile Acquisti</div>
    <div class="sig-line">Timbro e Firma Fornitore</div>
  </div>
  <div class="footer">Documento generato da Al Bazar Shop Manager · ${new Date().toLocaleDateString("it-IT")}</div>
  </body></html>`;
  const win = window.open("", "_blank", "width=720,height=900");
  if (win) { win.document.write(html); win.document.close(); win.print(); }
}

const STATUS_TONE = { ricevuto: "ok", "in transito": "accent", "in attesa": "warning", bozza: "info", annullato: "critical" };
const PAGE_SIZE = 10;

export default function PurchaseOrders({ purchaseOrders, onView, onEdit, onCreate, onDelete }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);
  const [page, setPage] = useState(1);

  const openOrders  = purchaseOrders.filter((p) => p.status !== "ricevuto" && p.status !== "annullato");
  const inTransit   = purchaseOrders.filter((p) => p.status === "in transito");
  const totalOpen   = openOrders.reduce((s, p) => s + p.total, 0);
  const totalAll    = purchaseOrders.reduce((s, p) => s + p.total, 0);

  const paged = useMemo(() => purchaseOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [purchaseOrders, page]);

  return (
    <div className="p-8 bg-[#faf8f3] min-h-full">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label={t("Ordini Aperti","Open Orders")} labelEn={lang==="bilingual"?"Open Orders":undefined}
          value={openOrders.length} delta="" deltaType="flat" sub={t("da ricevere","to receive")} icon={ShoppingCart} accent />
        <KpiCard label={t("Spesa Aperta","Open Spend")} value={fmtEurShort(totalOpen)}
          delta="" deltaType="flat" sub={t("ordini in corso","orders in progress")} icon={DollarSign} />
        <KpiCard label={t("In Transito","In Transit")} value={inTransit.length}
          delta={t("in arrivo","arriving soon")} deltaType="flat" sub={t("consegne attese","expected deliveries")} icon={Truck} />
        <KpiCard label={t("Tempo Medio","Avg Lead Time")} value="2,8gg"
          delta="-0,4gg" deltaType="up" sub={t("ultimi 30 giorni","last 30 days")} icon={Clock} />
      </div>

      <div className="bg-white border border-stone-300">
        <div className="px-6 py-4 border-b border-stone-300 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500">{t("Approvvigionamento","Procurement")}</div>
            <h3 className="font-serif text-[20px] text-stone-900 tracking-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
              {t("Ordini di Acquisto","Purchase Orders")}
            </h3>
          </div>
          <button onClick={onCreate} className="px-3 py-1.5 text-[12px] bg-stone-900 text-stone-50 hover:bg-stone-700 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> {t("Nuovo Ordine","New Order")}
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-300">
            <tr>
              {[t("N° Ordine","Order #"), t("Fornitore","Supplier"), t("Articoli","Items"),
                t("Totale","Total"), t("Data Ordine","Order Date"),
                t("Consegna Attesa","Expected"), t("Stato","Status"), ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-[0.15em] font-mono text-stone-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-[12px] text-stone-500 font-mono">
                {t("Nessun ordine. Clicca \"Nuovo Ordine\" per iniziare.","No orders yet. Click \"New Order\" to start.")}
              </td></tr>
            )}
            {paged.map((po) => (
              <tr key={po.id} className="border-b border-stone-100 hover:bg-stone-50/60 group">
                <td className="px-4 py-3 text-[12px] font-mono text-stone-900 font-medium">{po.id}</td>
                <td className="px-4 py-3 text-[13px] text-stone-800 max-w-[180px] truncate">{po.supplier}</td>
                <td className="px-4 py-3 text-[11px] font-mono text-stone-600">{po.items} SKU</td>
                <td className="px-4 py-3 text-[13px] font-mono font-semibold text-stone-900">{fmtEur(po.total)}</td>
                <td className="px-4 py-3 text-[11px] font-mono text-stone-600">{fmtDateIT(po.created)}</td>
                <td className="px-4 py-3 text-[11px] font-mono text-stone-600">{po.expected === "—" ? "—" : fmtDateIT(po.expected)}</td>
                <td className="px-4 py-3"><StatusPill tone={STATUS_TONE[po.status] || "info"}>{po.status}</StatusPill></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <IconBtn title={t("Stampa Ordine","Print Order")} onClick={() => printOrdine(po)}><Printer className="w-3.5 h-3.5" /></IconBtn>
                    <IconBtn title={t("Visualizza","View")} onClick={() => onView(po)}><Eye className="w-3.5 h-3.5" /></IconBtn>
                    <IconBtn title={t("Modifica","Edit")} tone="accent" onClick={() => onEdit(po)}><Edit3 className="w-3.5 h-3.5" /></IconBtn>
                    <IconBtn title={t("Elimina","Delete")} tone="danger" onClick={() => onDelete(po)}><Trash2 className="w-3.5 h-3.5" /></IconBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-stone-50 border-t border-stone-300">
            <tr>
              <td colSpan={3} className="px-4 py-3 text-[11px] uppercase tracking-wider font-mono text-stone-600">
                {t("Totale tutti gli ordini","Total all orders")}
              </td>
              <td className="px-4 py-3 text-[14px] font-mono font-semibold text-stone-900">{fmtEur(totalAll)}</td>
              <td colSpan={4} />
            </tr>
          </tfoot>
        </table>
      </div>
      <Pagination page={page} total={purchaseOrders.length} perPage={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}
