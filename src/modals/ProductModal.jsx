import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Modal, Field, Input, NumInput, Select, Btn, KV } from "../ui.jsx";
import { StatusPill } from "../ui.jsx";
import { fmtEur, getStockStatus, todayStr, nextId } from "../helpers.js";
import { PRODUCT_CATEGORIES, IVA_OPTIONS } from "../data.js";
import { useLang, tx, BiLabel } from "../lang.jsx";

const BLANK = {
  id: "", name: "", nameEn: "", category: "Alimentari", supplier: "", location: "WH-01",
  stock: 0, reorder: 10, price: 0, cost: 0, iva: 4, shelf: "", expiry: "",
  status: "active", updated: "", sold30d: 0,
};

export default function ProductModal({ open, mode, initial, suppliers, locations, products, onClose, onSave }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);
  const isView   = mode === "view";
  const isCreate = mode === "create";
  const [form,   setForm]   = useState(BLANK);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (isCreate) {
      setForm({ ...BLANK, id: nextId(products || [], "SKU"), supplier: suppliers?.[0]?.name || "", location: "WH-01" });
    } else if (initial) {
      setForm({ ...BLANK, ...initial });
    }
  }, [open, mode, initial]);

  const clrErr = (k) => setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); clrErr(k); };

  const submit = (e) => {
    e?.preventDefault?.();
    const errs = {};
    if (!form.id.trim())   errs.id   = t("SKU obbligatorio", "SKU is required");
    if (!form.name.trim()) errs.name = t("Nome obbligatorio", "Name is required");
    if (+form.price < 0)   errs.price = t("Prezzo non valido", "Invalid price");
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, stock: +form.stock || 0, reorder: +form.reorder || 0, price: +form.price || 0,
      cost: +form.cost || 0, iva: +form.iva || 4, sold30d: +form.sold30d || 0, updated: todayStr() }, isCreate);
  };

  // View mode
  if (isView && form.id) {
    const status = getStockStatus(form);
    return (
      <Modal open={open} onClose={onClose} title={form.name} eyebrow={`${form.id} · ${form.category}`} size="lg"
        footer={<Btn variant="primary" onClick={onClose}>{t("Chiudi","Close")}</Btn>}>
        <div className="grid grid-cols-3 gap-5">
          <KV label="SKU" mono>{form.id}</KV>
          <KV label={t("Categoria","Category")}>{form.category}</KV>
          <KV label={t("Stato","Status")}><StatusPill tone={status.tone}>{t(status.label, status.labelEn)}</StatusPill></KV>
          <KV label={t("Nome IT","Italian Name")}>{form.name}</KV>
          <KV label={t("Nome EN","English Name")}>{form.nameEn || "—"}</KV>
          <KV label={t("Fornitore","Supplier")}>{form.supplier}</KV>
          <KV label={t("Locale","Location")} mono>{form.location}</KV>
          <KV label={t("Scaffale","Shelf")} mono>{form.shelf || "—"}</KV>
          <KV label={t("Aggiornato","Updated")} mono>{form.updated}</KV>
          <KV label={t("Giacenza","Stock")} mono>{form.stock} pz</KV>
          <KV label={t("Scorta Min.","Reorder At")} mono>{form.reorder} pz</KV>
          <KV label={t("Venduto 30gg","Sold 30d")} mono>{form.sold30d}</KV>
          <KV label={t("Prezzo Acquisto","Buy Price")} mono>{fmtEur(form.cost)}</KV>
          <KV label={t("Prezzo Vendita","Sell Price")} mono>{fmtEur(form.price)}</KV>
          <KV label="IVA" mono>{form.iva}%</KV>
          <KV label={t("Valore Giacenza","Stock Value")} mono>{fmtEur(form.stock * form.cost)}</KV>
          <KV label={t("Scadenza","Expiry")} mono>{form.expiry || "—"}</KV>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose}
      title={isCreate ? t("Nuovo Prodotto","New Product") : t(`Modifica Prodotto`,"Edit Product")}
      eyebrow={isCreate ? t("Crea","Create") : form.id} size="lg"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>{t("Annulla","Cancel")}</Btn>
          <Btn variant="primary" onClick={submit}>
            <Save className="w-3.5 h-3.5" />
            {isCreate ? t("Crea Prodotto","Create Product") : t("Salva Modifiche","Save Changes")}
          </Btn>
        </>
      }
    >
      <form onSubmit={submit} className="grid grid-cols-2 gap-4">
        <Field label={<BiLabel it="Codice SKU" en="SKU Code" />} required error={errors.id}>
          <Input value={form.id} onChange={(e) => set("id", e.target.value)} disabled={!isCreate} placeholder="SKU-XXXX" error={!!errors.id} />
        </Field>
        <Field label={<BiLabel it="Categoria" en="Category" />} required>
          <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
            {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label={<BiLabel it="Nome Prodotto (Italiano)" en="Product Name (Italian)" />} required error={errors.name} className="col-span-2">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Es. Riso Basmati Extra Lungo 1kg" error={!!errors.name} />
        </Field>
        <Field label={<BiLabel it="Nome in Inglese (opzionale)" en="English Name (optional)" />} className="col-span-2">
          <Input value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} placeholder="e.g. Basmati Long Grain Rice 1kg" />
        </Field>
        <Field label={<BiLabel it="Fornitore" en="Supplier" />}>
          <Select value={form.supplier} onChange={(e) => set("supplier", e.target.value)}>
            <option value="">{t("— Seleziona fornitore —","— Select supplier —")}</option>
            {(suppliers || []).map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
          </Select>
        </Field>
        <Field label={<BiLabel it="Locale / Area" en="Location / Area" />}>
          <Select value={form.location} onChange={(e) => set("location", e.target.value)}>
            {(locations || []).map((l) => <option key={l.id} value={l.id}>{l.id} — {l.name}</option>)}
          </Select>
        </Field>
        <Field label={<BiLabel it="Scaffale / Posizione" en="Shelf / Position" />}>
          <Input value={form.shelf} onChange={(e) => set("shelf", e.target.value)} placeholder="Es. A3, Frigo1, Banco" />
        </Field>
        <Field label={<BiLabel it="Data Scadenza" en="Expiry Date" />} hint={t("Solo per prodotti freschi o surgelati","Only for fresh or frozen items")}>
          <Input type="date" value={form.expiry} onChange={(e) => set("expiry", e.target.value)} />
        </Field>
        <Field label={<BiLabel it="Giacenza Attuale (pz)" en="Current Stock (pcs)" />}>
          <NumInput value={form.stock} min={0} onChange={(e) => set("stock", e.target.value)} />
        </Field>
        <Field label={<BiLabel it="Scorta Minima (pz)" en="Minimum Stock (pcs)" />}>
          <NumInput value={form.reorder} min={0} onChange={(e) => set("reorder", e.target.value)} />
        </Field>
        <Field label={<BiLabel it="Prezzo Acquisto (€)" en="Purchase Price (€)" />}>
          <NumInput value={form.cost} min={0} step="0.01" onChange={(e) => set("cost", e.target.value)} />
        </Field>
        <Field label={<BiLabel it="Prezzo Vendita (€)" en="Selling Price (€)" />} error={errors.price}>
          <NumInput value={form.price} min={0} step="0.01" onChange={(e) => set("price", e.target.value)} error={!!errors.price} />
        </Field>
        <Field label={<BiLabel it="Aliquota IVA" en="VAT Rate" />}>
          <Select value={form.iva} onChange={(e) => set("iva", e.target.value)}>
            {IVA_OPTIONS.map((r) => <option key={r} value={r}>{r}% — {r === 4 ? t("Alimenti base","Food staples") : r === 10 ? t("Alimenti trasf./surgelati","Processed/frozen food") : t("Beni generali","General goods")}</option>)}
          </Select>
        </Field>
        <Field label={<BiLabel it="Stato" en="Status" />}>
          <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="active">{t("Attivo","Active")}</option>
            <option value="discontinued">{t("Discontinuato","Discontinued")}</option>
          </Select>
        </Field>
      </form>
    </Modal>
  );
}
