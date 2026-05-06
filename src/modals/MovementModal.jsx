import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Modal, Field, Input, NumInput, Select, Btn } from "../ui.jsx";
import { nextId, nowStamp } from "../helpers.js";
import { useLang, tx, BiLabel } from "../lang.jsx";

const TYPES = [
  { value: "in",       it: "Carico (+) — merce ricevuta",      en: "Stock In (+) — received goods"        },
  { value: "out",      it: "Scarico (−) — merce venduta",      en: "Stock Out (−) — sold goods"           },
  { value: "adjust",   it: "Rettifica (±) — correzione inventario", en: "Adjustment (±) — inventory correction" },
  { value: "scaduto",  it: "Scaduto (−) — merce eliminata",    en: "Expired (−) — discarded goods"        },
  { value: "transfer", it: "Trasferimento — cambio locale",     en: "Transfer — change location"           },
];

const BLANK = { id: "", type: "in", sku: "", product: "", qty: 1, ref: "", location: "", user: "Rahman A.", time: "" };

export default function MovementModal({ open, products, locations, movements, onClose, onSave }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);
  const [form,   setForm]   = useState(BLANK);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    const first = products?.[0];
    setForm({
      ...BLANK,
      id:       nextId(movements || [], "MV"),
      sku:      first?.id || "",
      product:  first?.name || "",
      location: locations?.[0]?.id || "",
      time:     nowStamp(),
    });
  }, [open]);

  const clrErr = (k) => setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); clrErr(k); };

  const onSkuChange = (sku) => {
    const p = (products || []).find((x) => x.id === sku);
    setForm((f) => ({ ...f, sku, product: p?.name || "" }));
    clrErr("sku");
  };

  const submit = (e) => {
    e?.preventDefault?.();
    const errs = {};
    if (!form.sku)   errs.sku = t("Seleziona un prodotto", "Select a product");
    if (!+form.qty)  errs.qty = t("Quantità non può essere zero", "Quantity cannot be zero");
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, qty: +form.qty, time: nowStamp() });
  };

  const selectedProduct = (products || []).find((p) => p.id === form.sku);

  return (
    <Modal open={open} onClose={onClose}
      title={t("Nuovo Movimento","New Stock Movement")}
      eyebrow={t("Inserimento Manuale","Manual Entry")} size="md"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>{t("Annulla","Cancel")}</Btn>
          <Btn variant="primary" onClick={submit}>
            <Save className="w-3.5 h-3.5" /> {t("Registra","Record")}
          </Btn>
        </>
      }
    >
      <form onSubmit={submit} className="grid grid-cols-2 gap-4">
        <Field label={<BiLabel it="ID Movimento" en="Movement ID" />}>
          <Input value={form.id} disabled className="font-mono" />
        </Field>
        <Field label={<BiLabel it="Tipo Movimento" en="Movement Type" />} required>
          <Select value={form.type} onChange={(e) => set("type", e.target.value)}>
            {TYPES.map((tp) => <option key={tp.value} value={tp.value}>{t(tp.it, tp.en)}</option>)}
          </Select>
        </Field>
        <Field label={<BiLabel it="Prodotto" en="Product" />} required error={errors.sku} className="col-span-2">
          <Select value={form.sku} onChange={(e) => onSkuChange(e.target.value)} error={!!errors.sku}>
            {(products || []).map((p) => (
              <option key={p.id} value={p.id}>{p.id} — {p.name} ({t("giacenza","stock")}: {p.stock})</option>
            ))}
          </Select>
          {selectedProduct && (
            <span className="text-[11px] text-stone-500 font-mono mt-1 block">
              {t("Scaffale","Shelf")}: {selectedProduct.shelf || "—"} · {t("Locale","Location")}: {selectedProduct.location}
            </span>
          )}
        </Field>
        <Field label={<BiLabel it="Quantità (pz)" en="Quantity (pcs)" />} required error={errors.qty}
          hint={!errors.qty && form.type === "adjust" ? t("Usa numero negativo per sottrarre.","Use negative number to subtract.") : ""}>
          <NumInput value={form.qty} onChange={(e) => set("qty", e.target.value)} step="1" error={!!errors.qty} />
        </Field>
        <Field label={<BiLabel it="Locale / Area" en="Location / Area" />}>
          <Select value={form.location} onChange={(e) => set("location", e.target.value)}>
            {(locations || []).map((l) => <option key={l.id} value={l.id}>{l.id} — {l.name}</option>)}
          </Select>
        </Field>
        <Field label={<BiLabel it="Riferimento" en="Reference" />}
          hint={t("Es. DDT-MIA-0503, RETT-0503","e.g. DDT-MIA-0503, SO-7711")}>
          <Input value={form.ref} onChange={(e) => set("ref", e.target.value)} placeholder="DDT-XXX-DDMM" />
        </Field>
        <Field label={<BiLabel it="Utente" en="User" />}>
          <Input value={form.user} onChange={(e) => set("user", e.target.value)} />
        </Field>
      </form>
    </Modal>
  );
}
