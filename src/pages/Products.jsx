import React, { useState, useMemo } from "react";
import { Search, Download, Plus, Eye, Edit3, Trash2 } from "lucide-react";
import { useLang, tx } from "../lang.jsx";
import { StatusPill, IconBtn, Pagination } from "../ui.jsx";
import { fmtEur, fmtEurShort, getStockStatus, daysUntilExpiry, ivaTone, downloadCsv, todayStr, fmtDateIT } from "../helpers.js";

const PAGE_SIZE = 15;

export default function Products({ products, onView, onEdit, onCreate, onDelete }) {
  const { lang } = useLang();
  const t = (it, en) => tx(lang, it, en);

  const [filter,  setFilter]  = useState("all");
  const [search,  setSearch]  = useState("");
  const [sortBy,  setSortBy]  = useState("name");
  const [catFilter, setCat]   = useState("all");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => ["all", ...new Set(products.map((p) => p.category))], [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (filter === "low")  list = list.filter((p) => getStockStatus(p).tone === "warning");
    if (filter === "out")  list = list.filter((p) => getStockStatus(p).tone === "critical");
    if (filter === "ok")   list = list.filter((p) => getStockStatus(p).tone === "ok");
    if (catFilter !== "all") list = list.filter((p) => p.category === catFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.shelf || "").toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      if (sortBy === "stock") return b.stock - a.stock;
      if (sortBy === "value") return (b.stock * b.cost) - (a.stock * a.cost);
      if (sortBy === "expiry") return (a.expiry || "9999") > (b.expiry || "9999") ? 1 : -1;
      return a.name.localeCompare(b.name, "it");
    });
  }, [filter, catFilter, search, sortBy, products]);

  const paged = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  const exportCsv = () => {
    downloadCsv(`prodotti-${todayStr()}.csv`,
      ["SKU", "Prodotto / Product", "Categoria", "Fornitore", "Locale", "Scaffale", "Giacenza", "Scorta Min", "Costo €", "Prezzo €", "Valore €", "IVA%", "Scadenza", "Venduto 30gg"],
      filtered.map((p) => [p.id, p.name, p.category, p.supplier, p.location, p.shelf || "", p.stock, p.reorder,
        p.cost, p.price, (p.stock * p.cost).toFixed(2), p.iva, p.expiry || "", p.sold30d])
    );
  };

  const FILTERS = [
    { id: "all", it: "Tutti",         en: "All",         count: products.length },
    { id: "ok",  it: "Disponibili",   en: "In Stock",    count: products.filter((p) => getStockStatus(p).tone === "ok").length },
    { id: "low", it: "Scorta Bassa",  en: "Low Stock",   count: products.filter((p) => getStockStatus(p).tone === "warning").length },
    { id: "out", it: "Esauriti",      en: "Out of Stock",count: products.filter((p) => getStockStatus(p).tone === "critical").length },
  ];

  return (
    <div className="p-8 bg-[#faf8f3] min-h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f.id} onClick={() => { setFilter(f.id); setPage(1); }}
              className={`px-3 py-1.5 text-[12px] font-medium border transition-colors ${filter === f.id ? "bg-stone-900 text-stone-50 border-stone-900" : "bg-white text-stone-700 border-stone-300 hover:border-stone-500"}`}>
              {t(f.it, f.en)} <span className="font-mono opacity-70 ml-1">{f.count}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t("Cerca…", "Search…")}
              className="pl-8 pr-3 py-1.5 text-[12px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700 w-44" />
          </div>
          <select value={catFilter} onChange={(e) => { setCat(e.target.value); setPage(1); }}
            className="px-2 py-1.5 text-[12px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700 font-mono">
            {categories.map((c) => <option key={c} value={c}>{c === "all" ? t("Tutte categorie", "All categories") : c}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="px-2 py-1.5 text-[12px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700 font-mono">
            <option value="name">{t("Nome", "Name")}</option>
            <option value="stock">{t("Giacenza", "Stock")}</option>
            <option value="value">{t("Valore", "Value")}</option>
            <option value="expiry">{t("Scadenza", "Expiry")}</option>
          </select>
          <button onClick={exportCsv} className="px-3 py-1.5 text-[12px] border border-stone-300 bg-white hover:bg-stone-50 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> {t("Esporta", "Export")}
          </button>
          <button onClick={onCreate} className="px-3 py-1.5 text-[12px] bg-stone-900 text-stone-50 hover:bg-stone-700 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> {t("Nuovo Prodotto", "New Product")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-300 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-300">
            <tr>
              {[
                t("SKU","SKU"), t("Prodotto","Product"), t("Categoria","Category"),
                t("Scaffale","Shelf"), t("Giacenza","Stock"), t("Min","Min"),
                t("Costo","Cost"), t("Prezzo","Price"), t("Valore","Value"),
                "IVA", t("Scadenza","Expiry"), t("Stato","Status"), ""
              ].map((h) => (
                <th key={h} className="text-left px-3 py-3 text-[10px] uppercase tracking-[0.15em] font-mono text-stone-600 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={13} className="px-4 py-8 text-center text-[12px] text-stone-500 font-mono">
                {t("Nessun prodotto corrisponde al filtro.", "No products match the filter.")}
              </td></tr>
            )}
            {paged.map((p) => {
              const status = getStockStatus(p);
              const days   = daysUntilExpiry(p.expiry);
              return (
                <tr key={p.id} className="border-b border-stone-100 hover:bg-stone-50/60 group">
                  <td className="px-3 py-3 text-[11px] font-mono text-stone-600">{p.id}</td>
                  <td className="px-3 py-3">
                    <div className="text-[13px] text-stone-900 font-medium max-w-[200px] truncate">{p.name}</div>
                    <div className="text-[10px] text-stone-400 font-mono">{p.supplier}</div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-[11px] text-stone-700 px-2 py-0.5 bg-stone-100 border border-stone-200">{p.category}</span>
                  </td>
                  <td className="px-3 py-3 text-[12px] font-mono text-stone-600">{p.shelf || "—"}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[14px] font-mono font-semibold ${status.tone === "critical" ? "text-rose-700" : status.tone === "warning" ? "text-amber-800" : "text-stone-900"}`}>
                        {p.stock}
                      </span>
                      <div className="w-10 h-1 bg-stone-200">
                        <div className={`h-full ${status.tone === "critical" ? "bg-rose-500" : status.tone === "warning" ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${Math.min(100, (p.stock / Math.max(p.reorder * 2, 1)) * 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[12px] text-stone-500 font-mono">{p.reorder}</td>
                  <td className="px-3 py-3 text-[12px] text-stone-700 font-mono">{fmtEur(p.cost)}</td>
                  <td className="px-3 py-3 text-[12px] text-stone-900 font-mono font-medium">{fmtEur(p.price)}</td>
                  <td className="px-3 py-3 text-[12px] text-stone-900 font-mono">{fmtEurShort(p.stock * p.cost)}</td>
                  <td className="px-3 py-3">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 border ${ivaTone(p.iva)}`}>{p.iva}%</span>
                  </td>
                  <td className="px-3 py-3 text-[11px] font-mono">
                    {days !== null ? (
                      <span className={`${days <= 0 ? "text-rose-700 font-semibold" : days <= 3 ? "text-rose-600" : days <= 7 ? "text-amber-700" : "text-stone-600"}`}>
                        {fmtDateIT(p.expiry)}
                      </span>
                    ) : <span className="text-stone-400">—</span>}
                  </td>
                  <td className="px-3 py-3">
                    <StatusPill tone={status.tone}>{t(status.label, status.labelEn)}</StatusPill>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <IconBtn title={t("Visualizza","View")}   onClick={() => onView(p)}><Eye    className="w-3.5 h-3.5" /></IconBtn>
                      <IconBtn title={t("Modifica","Edit")}     tone="accent" onClick={() => onEdit(p)}><Edit3  className="w-3.5 h-3.5" /></IconBtn>
                      <IconBtn title={t("Elimina","Delete")}    tone="danger" onClick={() => onDelete(p)}><Trash2 className="w-3.5 h-3.5" /></IconBtn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={filtered.length} perPage={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}
