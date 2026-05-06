import React, { useState } from "react";
import {
  Save, Download, Upload, Building2, Receipt, Globe,
  Database, Info, CheckCircle2, AlertTriangle, ShieldCheck,
} from "lucide-react";
import { useLang, tx } from "../lang.jsx";
import { Btn } from "../ui.jsx";

const SETTINGS_KEY = "albazar-settings";

const DEFAULT_SHOP = {
  name:    "Al Bazar di Milano",
  address: "Via Padova 104",
  city:    "Milano",
  cap:     "20131",
  piva:    "IT09876543201",
  owner:   "Rahman Ali",
  phone:   "+39 02 1234 5678",
  email:   "albazar.milano@gmail.com",
  rt:      "sumup",
};

const FlagIT = () => (
  <svg viewBox="0 0 3 2" className="w-8 h-[22px] rounded-[2px] flex-shrink-0">
    <rect width="1" height="2" fill="#009246"/>
    <rect x="1" width="1" height="2" fill="#FFF"/>
    <rect x="2" width="1" height="2" fill="#CE2B37"/>
  </svg>
);
const FlagGB = () => (
  <svg viewBox="0 0 60 40" className="w-8 h-[22px] rounded-[2px] flex-shrink-0">
    <rect width="60" height="40" fill="#012169"/>
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="white" strokeWidth="9"/>
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="5"/>
    <rect x="25" y="0" width="10" height="40" fill="white"/>
    <rect x="0" y="15" width="60" height="10" fill="white"/>
    <rect x="27" y="0" width="6" height="40" fill="#C8102E"/>
    <rect x="0" y="17" width="60" height="6" fill="#C8102E"/>
  </svg>
);

const TABS = [
  { id: "negozio",  Icon: Building2,  it: "Negozio",   en: "Shop Info"  },
  { id: "fiscale",  Icon: Receipt,     it: "Fiscale",   en: "Tax & RT"   },
  { id: "lingua",   Icon: Globe,       it: "Lingua",    en: "Language"   },
  { id: "backup",   Icon: Database,    it: "Backup",    en: "Backup"     },
  { id: "sistema",  Icon: Info,        it: "Sistema",   en: "System"     },
];

const RT_PROVIDERS = [
  { id: "sumup",        label: "SumUp RT",          note: "sumup.com"               },
  { id: "cassaincloud", label: "Cassa in Cloud",     note: "cassaincloud.it"         },
  { id: "agicash",      label: "Agicash",            note: "agicash.it"              },
  { id: "epson",        label: "Epson FP-90III",     note: "RT fiscale Epson"        },
  { id: "custom",       label: "Altro / Custom",     note: "Configurazione manuale"  },
];

const IVA_RATES = [
  { rate: "4%",  color: "#2D6A4F", bg: "#D8F0E8",
    it: "Alimenti base: riso, farina, latte, pane, verdure, uova",
    en: "Food staples: rice, flour, milk, bread, vegetables, eggs" },
  { rate: "10%", color: "#4A6FA5", bg: "#DDE8F8",
    it: "Alimenti trasformati, surgelati, succhi di frutta, bar",
    en: "Processed food, frozen goods, fruit juices, café items" },
  { rate: "22%", color: "#8B3A2A", bg: "#FCE0DE",
    it: "Beni generali: elettronica, detersivi, bevande gassate",
    en: "General goods: electronics, detergents, soft drinks" },
];

const inputCls = "w-full px-3 py-2.5 text-[13px] border border-stone-300 bg-white focus:outline-none focus:border-stone-700 focus:ring-1 focus:ring-stone-700/10 font-sans transition-colors";
const labelCls = "block text-[10px] uppercase tracking-[0.18em] font-mono text-stone-500 font-semibold mb-1.5";

export default function Settings({ products, movements, suppliers, locations, purchaseOrders, vendite }) {
  const { lang, setLang } = useLang();
  const t = (it, en) => tx(lang, it, en);

  const [activeTab, setActiveTab] = useState("negozio");
  const [saved,     setSaved]     = useState(false);

  const [shop, setShop] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY));
      return stored ? { ...DEFAULT_SHOP, ...stored } : DEFAULT_SHOP;
    } catch { return DEFAULT_SHOP; }
  });
  const setS = (k, v) => setShop((s) => ({ ...s, [k]: v }));

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(shop));
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  const handleExport = () => {
    const data = { shop, products, movements, suppliers, locations, purchaseOrders, vendite, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), { href: url, download: `albazar-backup-${new Date().toISOString().slice(0,10)}.json` });
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 bg-[#faf8f3] min-h-full">

      {/* Page header */}
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.25em] font-mono text-stone-500 mb-1">
          {t("Configurazione Negozio", "Shop Configuration")}
        </div>
        <h2 className="font-serif text-[32px] text-stone-900 tracking-tight"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
          {t("Impostazioni", "Settings")}
        </h2>
      </div>

      <div className="flex gap-7 items-start">

        {/* ── Left tab nav ──────────────────────────────────────────────── */}
        <div className="w-52 flex-shrink-0 sticky top-24">
          <nav className="bg-white border border-stone-200 shadow-sm overflow-hidden">
            {TABS.map(({ id, Icon, it, en }) => {
              const active = activeTab === id;
              return (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-b border-stone-100 last:border-b-0 transition-all group ${
                    active ? "bg-stone-900 text-stone-50" : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}>
                  {active && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#d4a437]"/>}
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-[#d4a437]" : "text-stone-400 group-hover:text-stone-600"}`} strokeWidth={1.75}/>
                  <span className="text-[13px] font-medium tracking-tight">{t(it, en)}</span>
                </button>
              );
            })}
          </nav>

          {/* Saved badge */}
          {saved && (
            <div className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0"/>
              <span className="text-[11px] font-mono font-semibold">{t("Salvato!", "Saved!")}</span>
            </div>
          )}
        </div>

        {/* ── Main content ──────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* ═══ NEGOZIO ════════════════════════════════════════════════ */}
          {activeTab === "negozio" && (
            <div className="space-y-5">
              <div className="bg-white border border-stone-200 shadow-sm p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-stone-500 mb-5 pb-3 border-b border-stone-100">
                  {t("Informazioni Principali", "Main Information")}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className={labelCls}>{t("Nome Negozio", "Shop Name")}</label>
                    <input className={inputCls} value={shop.name} onChange={(e) => setS("name", e.target.value)}/>
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>{t("Indirizzo", "Street Address")}</label>
                    <input className={inputCls} value={shop.address} onChange={(e) => setS("address", e.target.value)}/>
                  </div>
                  <div>
                    <label className={labelCls}>{t("Città", "City")}</label>
                    <input className={inputCls} value={shop.city} onChange={(e) => setS("city", e.target.value)}/>
                  </div>
                  <div>
                    <label className={labelCls}>CAP</label>
                    <input className={inputCls + " font-mono"} value={shop.cap} onChange={(e) => setS("cap", e.target.value)}/>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-stone-200 shadow-sm p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-stone-500 mb-5 pb-3 border-b border-stone-100">
                  {t("Titolare & Contatti", "Owner & Contacts")}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>{t("Titolare / Proprietario", "Owner")}</label>
                    <input className={inputCls} value={shop.owner} onChange={(e) => setS("owner", e.target.value)}/>
                  </div>
                  <div>
                    <label className={labelCls}>Partita IVA (P.IVA)</label>
                    <input className={inputCls + " font-mono"} value={shop.piva} onChange={(e) => setS("piva", e.target.value)} placeholder="IT00000000000"/>
                  </div>
                  <div>
                    <label className={labelCls}>{t("Telefono", "Phone")}</label>
                    <input className={inputCls + " font-mono"} value={shop.phone} onChange={(e) => setS("phone", e.target.value)}/>
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input className={inputCls} type="email" value={shop.email} onChange={(e) => setS("email", e.target.value)}/>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Btn variant={saved ? "accent" : "primary"} onClick={handleSave}>
                  <Save className="w-3.5 h-3.5"/>
                  {saved ? t("Salvato!", "Saved!") : t("Salva Impostazioni", "Save Settings")}
                </Btn>
              </div>
            </div>
          )}

          {/* ═══ FISCALE ════════════════════════════════════════════════ */}
          {activeTab === "fiscale" && (
            <div className="space-y-5">
              {/* RT device */}
              <div className="bg-white border border-stone-200 shadow-sm p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-stone-500 mb-1 pb-3 border-b border-stone-100">
                  {t("Registratore Telematico (RT)", "Fiscal Device (RT)")}
                </div>
                <p className="text-[12px] text-stone-500 mt-3 mb-4 leading-relaxed">
                  {t(
                    "Seleziona il dispositivo RT collegato al negozio. Obbligatorio per la trasmissione dei corrispettivi all'Agenzia delle Entrate.",
                    "Select the RT device connected to your shop. Required for transmitting corrispettivi to Agenzia delle Entrate."
                  )}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {RT_PROVIDERS.map((p) => (
                    <button key={p.id} onClick={() => setS("rt", p.id)}
                      className={`flex items-center justify-between px-4 py-3 border transition-all text-left ${
                        shop.rt === p.id
                          ? "border-stone-900 bg-stone-900 text-stone-50"
                          : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                      }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${shop.rt === p.id ? "border-[#d4a437] bg-[#d4a437]" : "border-stone-400"}`}/>
                        <span className="text-[13px] font-medium">{p.label}</span>
                      </div>
                      <span className={`text-[11px] font-mono ${shop.rt === p.id ? "text-stone-400" : "text-stone-400"}`}>{p.note}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-3 bg-sky-50 border border-sky-200 p-3">
                  <ShieldCheck className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5"/>
                  <p className="text-[12px] text-sky-800 leading-relaxed">
                    {t(
                      "Questo gestionale è compatibile con tutti i principali RT italiani ma non li sostituisce. L'RT deve essere configurato separatamente.",
                      "This system is compatible with all major Italian RT devices but does not replace them. The RT must be configured separately."
                    )}
                  </p>
                </div>
              </div>

              {/* IVA rates reference */}
              <div className="bg-white border border-stone-200 shadow-sm p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-stone-500 mb-5 pb-3 border-b border-stone-100">
                  {t("Aliquote IVA — Riferimento", "VAT Rates — Reference")}
                </div>
                <div className="space-y-3">
                  {IVA_RATES.map(({ rate, color, bg, it, en }) => (
                    <div key={rate} className="flex items-start gap-4 p-4 border border-stone-100">
                      <div className="flex-shrink-0 px-3 py-1.5 text-[15px] font-mono font-bold rounded-sm"
                        style={{ color, background: bg }}>
                        {rate}
                      </div>
                      <div>
                        <div className="text-[13px] text-stone-800">{t(it, en)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[11px] text-stone-400 font-mono">
                  {t("Fonte: Agenzia delle Entrate · Verificare con il proprio commercialista.", "Source: Agenzia delle Entrate · Verify with your accountant.")}
                </div>
              </div>

              <div className="flex justify-end">
                <Btn variant={saved ? "accent" : "primary"} onClick={handleSave}>
                  <Save className="w-3.5 h-3.5"/>
                  {saved ? t("Salvato!", "Saved!") : t("Salva", "Save")}
                </Btn>
              </div>
            </div>
          )}

          {/* ═══ LINGUA ════════════════════════════════════════════════ */}
          {activeTab === "lingua" && (
            <div className="space-y-5">
              <div className="bg-white border border-stone-200 shadow-sm p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-stone-500 mb-5 pb-3 border-b border-stone-100">
                  {t("Lingua Interfaccia", "Interface Language")}
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  {[
                    { id: "it", Flag: FlagIT, it: "Italiano",  en: "Italian",  desc_it: "Tutta l'interfaccia in italiano", desc_en: "Full Italian interface" },
                    { id: "en", Flag: FlagGB, it: "English",   en: "English",  desc_it: "Full English interface",          desc_en: "Full English interface" },
                  ].map(({ id, Flag, it: label, en: labelEn, desc_it, desc_en }) => (
                    <button key={id} onClick={() => setLang(id)}
                      className={`flex flex-col items-center gap-3 p-6 border-2 transition-all ${
                        lang === id
                          ? "border-stone-900 bg-stone-900 text-stone-50"
                          : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
                      }`}>
                      <Flag/>
                      <span className="text-[15px] font-semibold">{lang === "en" ? labelEn : label}</span>
                      <span className={`text-[11px] font-mono text-center leading-relaxed ${lang === id ? "text-stone-400" : "text-stone-400"}`}>
                        {t(desc_it, desc_en)}
                      </span>
                      {lang === id && (
                        <span className="text-[9px] uppercase tracking-wider font-mono text-[#d4a437]">
                          {t("Attivo", "Active")}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white border border-stone-200 shadow-sm p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-stone-500 mb-4 pb-3 border-b border-stone-100">
                  {t("Anteprima", "Preview")}
                </div>
                <div className="space-y-2 text-[13px]">
                  <div className="flex gap-3"><span className="text-stone-400 font-mono w-28">{t("Prodotti","Products")}:</span><span className="text-stone-800">{t("Gestione Inventario", "Inventory Management")}</span></div>
                  <div className="flex gap-3"><span className="text-stone-400 font-mono w-28">{t("Vendite","Sales")}:</span><span className="text-stone-800">{t("Registro Vendite", "Sales Register")}</span></div>
                  <div className="flex gap-3"><span className="text-stone-400 font-mono w-28">{t("Fornitori","Suppliers")}:</span><span className="text-stone-800">{t("Rubrica Fornitori", "Supplier Directory")}</span></div>
                  <div className="flex gap-3"><span className="text-stone-400 font-mono w-28">{t("Salva","Save")}:</span><span className="text-stone-800">{t("Salva Modifiche", "Save Changes")}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ BACKUP ════════════════════════════════════════════════ */}
          {activeTab === "backup" && (
            <div className="space-y-5">
              <div className="bg-white border border-stone-200 shadow-sm p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-stone-500 mb-5 pb-3 border-b border-stone-100">
                  {t("Esporta Dati", "Export Data")}
                </div>
                <p className="text-[13px] text-stone-600 mb-5 leading-relaxed">
                  {t(
                    "Scarica un file JSON con tutti i dati del negozio: prodotti, movimenti, vendite, fornitori, locali e ordini acquisto.",
                    "Download a JSON file with all shop data: products, movements, sales, suppliers, locations and purchase orders."
                  )}
                </p>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    [t("Prodotti","Products"),        products?.length      || 0],
                    [t("Movimenti","Movements"),      movements?.length     || 0],
                    [t("Vendite","Sales"),            vendite?.length       || 0],
                    [t("Fornitori","Suppliers"),      suppliers?.length     || 0],
                    [t("Locali","Locations"),         locations?.length     || 0],
                    [t("Ordini","Purchase Orders"),   purchaseOrders?.length|| 0],
                  ].map(([label, count]) => (
                    <div key={label} className="border border-stone-100 p-3 text-center">
                      <div className="text-[22px] font-mono font-bold text-stone-900">{count}</div>
                      <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
                <Btn variant="secondary" onClick={handleExport}>
                  <Download className="w-3.5 h-3.5"/> {t("Scarica Backup JSON", "Download JSON Backup")}
                </Btn>
              </div>

              <div className="bg-white border border-stone-200 shadow-sm p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-stone-500 mb-5 pb-3 border-b border-stone-100">
                  {t("Importa Dati", "Import Data")}
                </div>
                <p className="text-[13px] text-stone-500 mb-4 leading-relaxed">
                  {t(
                    "Carica un file di backup JSON precedente per ripristinare i dati del negozio.",
                    "Upload a previous JSON backup file to restore shop data."
                  )}
                </p>
                <Btn variant="secondary" disabled className="opacity-40 cursor-not-allowed">
                  <Upload className="w-3.5 h-3.5"/> {t("Carica File", "Upload File")}
                </Btn>
                <div className="mt-2 text-[11px] text-stone-400 font-mono">
                  {t("Funzione in arrivo", "Coming soon")}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"/>
                <p className="text-[12px] text-amber-800 leading-relaxed">
                  <strong>{t("Nota:", "Note:")}</strong>{" "}
                  {t(
                    "I dati sono salvati in memoria del browser. Esegui backup regolari. In produzione i dati vengono persistiti su database.",
                    "Data is stored in browser memory. Export backups regularly. In production, data is persisted to a database."
                  )}
                </p>
              </div>
            </div>
          )}

          {/* ═══ SISTEMA ════════════════════════════════════════════════ */}
          {activeTab === "sistema" && (
            <div className="space-y-5">
              <div className="bg-white border border-stone-200 shadow-sm p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-stone-500 mb-5 pb-3 border-b border-stone-100">
                  {t("Statistiche Negozio", "Shop Statistics")}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    [t("Prodotti a Catalogo", "Products"),      `${products?.length || 0} SKU`,         "#2D6A4F", "#D8F0E8"],
                    [t("Movimenti Totali",    "Total Movements"),`${movements?.length || 0}`,            "#4A6FA5", "#DDE8F8"],
                    [t("Vendite Registrate",  "Sales Recorded"), `${vendite?.length || 0}`,              "#8B5A1A", "#FEF3D0"],
                    [t("Fornitori Attivi",    "Active Suppliers"),`${suppliers?.length || 0}`,           "#6B5B8A", "#EEE8F8"],
                    [t("Locali / Aree",       "Shop Areas"),     `${locations?.length || 0}`,           "#8B3A2A", "#FCE0DE"],
                    [t("Ordini Acquisto",     "Purchase Orders"),`${purchaseOrders?.length || 0}`,      "#3A5A4A", "#D8F0E8"],
                  ].map(([label, value, color, bg]) => (
                    <div key={label} className="border border-stone-100 p-4">
                      <div className="text-[28px] font-mono font-bold" style={{ color }}>{value}</div>
                      <div className="text-[11px] text-stone-500 font-mono mt-1 leading-tight">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-stone-200 shadow-sm p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-stone-500 mb-5 pb-3 border-b border-stone-100">
                  {t("Informazioni App", "App Information")}
                </div>
                <div className="space-y-3">
                  {[
                    ["Versione",              "1.0.0"],
                    ["Stack",                 "React 18 · Vite 5 · Tailwind CSS"],
                    ["React Router",          "v7"],
                    [t("Lingua Attiva","Active Language"), lang.toUpperCase()],
                    ["RT Device",             RT_PROVIDERS.find(p => p.id === shop.rt)?.label || shop.rt],
                    ["P.IVA Negozio",         shop.piva],
                    [t("Titolare","Owner"),   shop.owner],
                    [t("Indirizzo","Address"),`${shop.address}, ${shop.cap} ${shop.city}`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                      <span className="text-[12px] text-stone-500 font-mono">{k}</span>
                      <span className="text-[12px] text-stone-900 font-mono font-semibold text-right max-w-[60%] truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 p-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"/>
                <p className="text-[12px] text-emerald-800 leading-relaxed">
                  {t(
                    "Sistema operativo. Tutti i moduli funzionanti: Inventario, Vendite, Corrispettivi, Fornitori, Report.",
                    "System operational. All modules working: Inventory, Sales, Corrispettivi, Suppliers, Reports."
                  )}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
