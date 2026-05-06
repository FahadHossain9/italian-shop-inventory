import React, { useState, useEffect, useMemo } from "react";
import { Save, Plus, Trash2, Printer, Receipt } from "lucide-react";
import { Modal, Field, Input, Select, Btn, KV } from "../ui.jsx";
import { fmtEur, todayStr, nextId, fmtDateIT } from "../helpers.js";
import { useLang, tx, BiLabel } from "../lang.jsx";
import { PAYMENT_CHANNELS } from "../data.js";

const BLANK_LINE = { sku: "", product: "", qty: 1, unit: "pz", unitPrice: 0, iva: 22, lineTotal: 0 };

// Print a Documento Commerciale Non Fiscale in a new window
function printDocumento(vendita, shopInfo) {
  const { id, date, lines, total, channel, customer, note } = vendita;
  const ivaGroups = {};
  lines.forEach((l) => {
    const gross = l.qty * l.unitPrice;
    const imponibile = gross / (1 + l.iva / 100);
    const iva = gross - imponibile;
    if (!ivaGroups[l.iva]) ivaGroups[l.iva] = { imponibile: 0, iva: 0 };
    ivaGroups[l.iva].imponibile += imponibile;
    ivaGroups[l.iva].iva += iva;
  });

  const fmtIT = (n) => "€ " + Number(n).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const linesHtml = lines.map((l) =>
    `<tr><td>${l.product}</td><td class="r">${l.qty} ${l.unit}</td><td class="r">${fmtIT(l.unitPrice)}</td><td class="r">${l.iva}%</td><td class="r">${fmtIT(l.qty * l.unitPrice)}</td></tr>`
  ).join("");
  const ivaHtml = Object.entries(ivaGroups).map(([rate, g]) =>
    `<tr><td>IVA ${rate}%</td><td class="r">${fmtIT(g.imponibile)}</td><td class="r">${fmtIT(g.iva)}</td></tr>`
  ).join("");

  const html = `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8">
<title>Documento Commerciale ${id}</title>
<style>
  body{font-family:monospace;font-size:11px;max-width:320px;margin:10px auto;color:#111}
  h2{font-size:13px;text-align:center;margin:4px 0}
  .center{text-align:center} .r{text-align:right}
  table{width:100%;border-collapse:collapse;margin:6px 0}
  td,th{padding:2px 4px;vertical-align:top}
  th{border-bottom:1px solid #000;font-size:10px}
  .sep{border-top:1px dashed #666;margin:6px 0}
  .total{font-size:14px;font-weight:bold;text-align:right;padding:4px 0}
  .footer{font-size:9px;text-align:center;margin-top:8px;color:#555}
</style></head><body>
<div class="center"><strong>AL BAZAR DI MILANO</strong></div>
<div class="center">Via Padova 104 · 20131 Milano</div>
<div class="center">P.IVA IT09876543201</div>
<div class="center">Tel. +39 02 1234 5678</div>
<hr class="sep">
<div class="center"><em>DOCUMENTO COMMERCIALE NON FISCALE</em></div>
<div>N° ${id} · Data: ${fmtDateIT(date)}</div>
${customer && customer !== "—" ? `<div>Cliente: ${customer}</div>` : ""}
<hr class="sep">
<table>
  <thead><tr><th>Prodotto</th><th class="r">Qtà</th><th class="r">Prezzo</th><th class="r">IVA</th><th class="r">Totale</th></tr></thead>
  <tbody>${linesHtml}</tbody>
</table>
<hr class="sep">
<table>
  <thead><tr><th>Aliquota IVA</th><th class="r">Imponibile</th><th class="r">IVA</th></tr></thead>
  <tbody>${ivaHtml}</tbody>
</table>
<hr class="sep">
<div class="total">TOTALE: ${fmtIT(total)}</div>
<div>Pagamento: ${channel}</div>
${note ? `<div>Note: ${note}</div>` : ""}
<hr class="sep">
<div class="footer">Per l'emissione del Documento Fiscale ufficiale collegare<br>un Registratore Telematico (RT) abilitato — es. SumUp, Cassa in Cloud<br><br>Grazie per la visita!</div>
</body></html>`;

  const win = window.open("", "_blank", "width=380,height=640");
  if (win) { win.document.write(html); win.document.close(); win.print(); }
}

export default function VenditeModal({ open, mode, initial, vendite, products, onClose, onSave }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);
  const isView   = mode === "view";
  const isCreate = mode === "create";

  const [id,       setId]       = useState("");
  const [lines,    setLines]    = useState([{ ...BLANK_LINE }]);
  const [channel,  setChannel]  = useState("Contante");
  const [customer, setCustomer] = useState("");
  const [note,     setNote]     = useState("");

  useEffect(() => {
    if (!open) return;
    if (isCreate) {
      setId(nextId(vendite || [], "VEN"));
      setLines([{ ...BLANK_LINE }]);
      setChannel("Contante");
      setCustomer("");
      setNote("");
    } else if (initial) {
      setId(initial.id);
      setLines(initial.lines?.length ? initial.lines.map((l) => ({ ...l })) : [{ ...BLANK_LINE }]);
      setChannel(initial.channel || "Contante");
      setCustomer(initial.customer === "—" ? "" : (initial.customer || ""));
      setNote(initial.note || "");
    }
  }, [open, mode, initial]);

  // ── Line helpers ────────────────────────────────────────────────────────────
  const selectProduct = (idx, sku) => {
    const p = products?.find((x) => x.id === sku);
    if (!p) return;
    setLines((prev) => prev.map((l, i) =>
      i !== idx ? l : {
        ...l, sku: p.id, product: p.name, unit: p.unit || "pz",
        unitPrice: p.price, iva: p.iva,
        lineTotal: parseFloat((l.qty * p.price).toFixed(2)),
      }
    ));
  };

  const updateQty = (idx, raw) => {
    const qty = parseFloat(raw) || 0;
    setLines((prev) => prev.map((l, i) =>
      i !== idx ? l : { ...l, qty, lineTotal: parseFloat((qty * l.unitPrice).toFixed(2)) }
    ));
  };

  const addLine    = ()    => setLines((prev) => [...prev, { ...BLANK_LINE }]);
  const removeLine = (idx) => setLines((prev) => prev.filter((_, i) => i !== idx));

  // ── Totals ──────────────────────────────────────────────────────────────────
  const validLines   = lines.filter((l) => l.sku && l.qty > 0);
  const grandTotal   = validLines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
  const ivaBreakdown = useMemo(() => {
    const bd = {};
    validLines.forEach((l) => {
      const gross      = l.qty * l.unitPrice;
      const imponibile = gross / (1 + l.iva / 100);
      if (!bd[l.iva]) bd[l.iva] = { imponibile: 0, iva: 0 };
      bd[l.iva].imponibile += imponibile;
      bd[l.iva].iva        += gross - imponibile;
    });
    return bd;
  }, [lines]);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const submit = (andPrint = false) => {
    if (validLines.length === 0)
      return alert(t("Aggiungere almeno un prodotto.", "Add at least one product."));
    const record = {
      id, customer: customer.trim() || "—", channel, status: "completata",
      date: todayStr(), note,
      lines: validLines.map((l) => ({ ...l, lineTotal: parseFloat((l.qty * l.unitPrice).toFixed(2)) })),
      total: parseFloat(grandTotal.toFixed(2)),
    };
    onSave(record, isCreate);
    if (andPrint) printDocumento(record, {});
  };

  // ── VIEW MODE ───────────────────────────────────────────────────────────────
  if (isView && initial) {
    const chInfo = PAYMENT_CHANNELS.find((c) => c.id === initial.channel);
    return (
      <Modal open={open} onClose={onClose}
        title={`${t("Vendita","Sale")} ${initial.id}`}
        eyebrow={`${fmtDateIT(initial.date)} · ${initial.channel}`}
        size="lg"
        footer={
          <>
            <Btn variant="secondary" onClick={() => printDocumento(initial, {})}>
              <Printer className="w-3.5 h-3.5" /> {t("Stampa Documento","Print Receipt")}
            </Btn>
            <Btn variant="primary" onClick={onClose}>{t("Chiudi","Close")}</Btn>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <KV label="ID" mono>{initial.id}</KV>
            <KV label={t("Data","Date")} mono>{fmtDateIT(initial.date)}</KV>
            <KV label={t("Pagamento","Payment")}>
              <span className={`inline-flex px-2 py-0.5 text-[11px] font-mono border ${chInfo?.color || ""}`}>
                {initial.channel}
              </span>
            </KV>
            <KV label={t("Cliente","Customer")}>{initial.customer || "—"}</KV>
            <KV label={t("Note","Notes")} className="col-span-2">{initial.note || "—"}</KV>
          </div>

          <div className="border border-stone-200">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="text-left px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-500">{t("Prodotto","Product")}</th>
                  <th className="text-right px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-500">{t("Qtà","Qty")}</th>
                  <th className="text-right px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-500">{t("Prezzo","Price")}</th>
                  <th className="text-right px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-500">IVA</th>
                  <th className="text-right px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-500">{t("Totale","Total")}</th>
                </tr>
              </thead>
              <tbody>
                {(initial.lines || []).map((l, i) => (
                  <tr key={i} className="border-b border-stone-100 last:border-b-0">
                    <td className="px-3 py-2 text-stone-900">{l.product}</td>
                    <td className="px-3 py-2 text-right font-mono">{l.qty} {l.unit}</td>
                    <td className="px-3 py-2 text-right font-mono">{fmtEur(l.unitPrice)}</td>
                    <td className="px-3 py-2 text-right font-mono text-stone-500">{l.iva}%</td>
                    <td className="px-3 py-2 text-right font-mono font-semibold">{fmtEur(l.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* IVA breakdown */}
          <div className="bg-stone-50 border border-stone-200 p-3 text-[12px]">
            <div className="text-[10px] uppercase tracking-wider font-mono text-stone-500 mb-2">
              {t("Riepilogo IVA (Corrispettivi)","VAT Summary (Corrispettivi)")}
            </div>
            {Object.entries((() => {
              const bd = {};
              (initial.lines || []).forEach((l) => {
                const gross = l.qty * l.unitPrice;
                const imponibile = gross / (1 + l.iva / 100);
                if (!bd[l.iva]) bd[l.iva] = { imponibile: 0, iva: 0 };
                bd[l.iva].imponibile += imponibile;
                bd[l.iva].iva += gross - imponibile;
              });
              return bd;
            })()).map(([rate, g]) => (
              <div key={rate} className="flex items-center justify-between py-1 border-b border-stone-100 last:border-0">
                <span className="text-stone-600">IVA {rate}%</span>
                <span className="font-mono text-stone-700">
                  {t("Imp.","Base")} {fmtEur(g.imponibile)} + IVA {fmtEur(g.iva)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-semibold text-stone-900">
              <span>{t("TOTALE","TOTAL")}</span>
              <span className="font-mono">{fmtEur(initial.total)}</span>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  // ── CREATE / EDIT MODE ───────────────────────────────────────────────────────
  return (
    <Modal open={open} onClose={onClose}
      title={isCreate ? t("Nuova Vendita","New Sale") : t("Modifica Vendita","Edit Sale")}
      eyebrow={isCreate ? t("Cassa — inserisci i prodotti","Checkout — enter products") : id}
      size="xl"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>{t("Annulla","Cancel")}</Btn>
          <Btn variant="secondary" onClick={() => submit(true)} disabled={validLines.length === 0}>
            <Printer className="w-3.5 h-3.5" /> {t("Salva & Stampa","Save & Print")}
          </Btn>
          <Btn variant="primary" onClick={() => submit(false)} disabled={validLines.length === 0}>
            <Save className="w-3.5 h-3.5" /> {t("Registra Vendita","Register Sale")}
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        {/* ── Product lines ────────────────────────────────────────────────── */}
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500 mb-2">
            {t("Prodotti venduti","Products sold")}
          </div>
          <div className="border border-stone-200">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-500 w-[38%]">{t("Prodotto","Product")}</th>
                  <th className="text-left px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-500 w-[14%]">{t("Qtà (peso)","Qty (weight)")}</th>
                  <th className="text-left px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-500 w-[8%]">{t("Unità","Unit")}</th>
                  <th className="text-left px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-500 w-[14%]">{t("Prezzo","Price")}</th>
                  <th className="text-left px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-500 w-[8%]">IVA</th>
                  <th className="text-right px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-500 w-[14%]">{t("Totale","Total")}</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {lines.map((l, idx) => (
                  <tr key={idx} className="border-b border-stone-100 last:border-0">
                    <td className="px-2 py-1.5">
                      <select
                        value={l.sku}
                        onChange={(e) => selectProduct(idx, e.target.value)}
                        className="w-full px-2 py-1.5 text-[12px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700"
                      >
                        <option value="">{t("— Seleziona prodotto —","— Select product —")}</option>
                        {(products || []).map((p) => (
                          <option key={p.id} value={p.id} disabled={p.stock === 0}>
                            {p.name}{p.stock === 0 ? ` (${t("esaurito","out of stock")})` : ""}
                          </option>
                        ))}
                      </select>
                      {l.sku && (
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5 px-1">{l.sku}</div>
                      )}
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="number"
                        min="0.001"
                        step={l.unit === "kg" || l.unit === "g" || l.unit === "l" ? "0.1" : "1"}
                        value={l.qty}
                        onChange={(e) => updateQty(idx, e.target.value)}
                        className="w-full px-2 py-1.5 text-[12px] border border-stone-300 font-mono focus:outline-none focus:border-stone-700"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <select
                        value={l.unit}
                        onChange={(e) => setLines((prev) => prev.map((x, i) => i === idx ? { ...x, unit: e.target.value } : x))}
                        className="w-full px-2 py-1.5 text-[12px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700 font-mono"
                      >
                        {["pz", "kg", "g", "l"].map((u) => <option key={u}>{u}</option>)}
                      </select>
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={l.unitPrice}
                        onChange={(e) => {
                          const p = parseFloat(e.target.value) || 0;
                          setLines((prev) => prev.map((x, i) =>
                            i !== idx ? x : { ...x, unitPrice: p, lineTotal: parseFloat((x.qty * p).toFixed(2)) }
                          ));
                        }}
                        className="w-full px-2 py-1.5 text-[12px] border border-stone-300 font-mono focus:outline-none focus:border-stone-700"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <select
                        value={l.iva}
                        onChange={(e) => setLines((prev) => prev.map((x, i) => i === idx ? { ...x, iva: +e.target.value } : x))}
                        className="w-full px-2 py-1.5 text-[12px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700 font-mono"
                      >
                        {[4, 10, 22].map((r) => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono font-semibold text-stone-900">
                      {fmtEur(l.qty * l.unitPrice)}
                    </td>
                    <td className="px-1 py-1.5">
                      {lines.length > 1 && (
                        <button onClick={() => removeLine(idx)}
                          className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addLine}
            className="mt-2 flex items-center gap-1.5 text-[12px] text-stone-600 hover:text-stone-900 font-medium px-2 py-1 hover:bg-stone-100 transition-colors">
            <Plus className="w-3.5 h-3.5" /> {t("Aggiungi prodotto","Add product")}
          </button>
        </div>

        {/* ── IVA breakdown + total ────────────────────────────────────────── */}
        {validLines.length > 0 && (
          <div className="bg-stone-50 border border-stone-200 p-3 text-[12px]">
            <div className="text-[10px] uppercase tracking-wider font-mono text-stone-500 mb-2">
              {t("Riepilogo IVA — Corrispettivi Telematici","VAT Summary — Corrispettivi")}
            </div>
            {Object.entries(ivaBreakdown).map(([rate, g]) => (
              <div key={rate} className="flex justify-between py-0.5 text-stone-600">
                <span>IVA {rate}%</span>
                <span className="font-mono">
                  {t("Imp.","Base")} {fmtEur(g.imponibile)} + IVA {fmtEur(g.iva)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-stone-300 mt-1 font-semibold text-stone-900 text-[14px]">
              <span>{t("TOTALE","TOTAL")}</span>
              <span className="font-mono">{fmtEur(grandTotal)}</span>
            </div>
          </div>
        )}

        {/* ── Payment + customer ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">
          <Field label={<BiLabel it="Metodo di Pagamento" en="Payment Method" />}>
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              {PAYMENT_CHANNELS.map((ch) => (
                <button key={ch.id} type="button"
                  onClick={() => setChannel(ch.id)}
                  className={`px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                    channel === ch.id
                      ? ch.color + " border-current"
                      : "bg-white text-stone-600 border-stone-300 hover:border-stone-500"
                  }`}>
                  {t(ch.it, ch.en)}
                </button>
              ))}
            </div>
          </Field>
          <Field label={<BiLabel it="Cliente (opzionale)" en="Customer (optional)" />}
            hint={t("Lascia vuoto per cliente anonimo","Leave blank for anonymous")}>
            <input
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder={t("Es. Anwar, Fatima, Cliente banco…","e.g. Anwar, Fatima, Walk-in…")}
              className="w-full px-3 py-2 text-[13px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700"
            />
          </Field>
        </div>
        <Field label={<BiLabel it="Note" en="Notes" />}>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("Es. Ordine WhatsApp, consegna domicilio…","e.g. WhatsApp order, home delivery…")}
            className="w-full px-3 py-2 text-[13px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700"
          />
        </Field>

        {/* ── RT notice ───────────────────────────────────────────────────── */}
        <div className="bg-sky-50 border border-sky-200 p-3 text-[11px] text-sky-800 flex items-start gap-2">
          <Receipt className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>{t("Nota RT:","RT Note:")}</strong>{" "}
            {t(
              "Per emettere il Documento Commerciale Fiscale obbligatorio, collegare un Registratore Telematico abilitato (es. SumUp, Cassa in Cloud, Agicash). Questo software è compatibile con i principali RT sul mercato italiano.",
              "To issue the mandatory Fiscal Commercial Document, connect a certified Registratore Telematico (e.g. SumUp, Cassa in Cloud, Agicash). This software is compatible with all major Italian RT devices."
            )}
          </span>
        </div>
      </div>
    </Modal>
  );
}
