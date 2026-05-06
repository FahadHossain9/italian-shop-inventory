import React from "react";
import {
  LayoutDashboard, Package, ArrowLeftRight, ShoppingCart,
  ShoppingBag, Truck, MapPin, BarChart3, Settings, Box, HelpCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLang, tx } from "../lang.jsx";

const NAV_GROUPS = [
  {
    labelIt: "Magazzino", labelEn: "Inventory",
    items: [
      { id: "dashboard", it: "Cruscotto",      en: "Dashboard",       icon: LayoutDashboard },
      { id: "products",  it: "Prodotti",        en: "Products",        icon: Package         },
      { id: "movements", it: "Movimenti",       en: "Stock Movements", icon: ArrowLeftRight  },
    ],
  },
  {
    labelIt: "Commerciale", labelEn: "Sales & Suppliers",
    items: [
      { id: "purchases", it: "Ordini Acquisto", en: "Purchase Orders", icon: ShoppingCart },
      { id: "vendite",   it: "Vendite",         en: "Sales",           icon: ShoppingBag  },
      { id: "suppliers", it: "Fornitori",       en: "Suppliers",       icon: Truck        },
      { id: "locali",    it: "Locali",          en: "Shop Areas",      icon: MapPin       },
    ],
  },
  {
    labelIt: "Analisi", labelEn: "Analytics",
    items: [
      { id: "reports", it: "Report", en: "Reports", icon: BarChart3 },
    ],
  },
];

const BOTTOM_ITEMS = [
  { id: "help",     it: "Aiuto & Guida",   en: "Help & Guide",  icon: HelpCircle },
  { id: "settings", it: "Impostazioni",    en: "Settings",      icon: Settings   },
];

function NavItem({ item }) {
  const { lang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === `/shop/${item.id}`;
  const Icon = item.icon;
  return (
    <button
      onClick={() => navigate(`/shop/${item.id}`)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 text-[13px] transition-all relative group rounded-sm ${
        isActive
          ? "bg-stone-800/80 text-stone-50"
          : "text-stone-400 hover:bg-stone-800/40 hover:text-stone-200"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#d4a437] rounded-r-full" />
      )}
      <Icon className={`w-[15px] h-[15px] flex-shrink-0 transition-colors ${isActive ? "text-[#d4a437]" : "text-stone-500 group-hover:text-stone-300"}`}
        strokeWidth={isActive ? 2 : 1.75} />
      <span className={`font-medium tracking-tight leading-tight text-left ${isActive ? "text-stone-50" : ""}`}>
        {tx(lang, item.it, item.en)}
      </span>
    </button>
  );
}

export default function Sidebar() {
  const { lang } = useLang();
  return (
    <aside className="w-60 flex flex-col h-screen sticky top-0 select-none"
      style={{ background: "linear-gradient(180deg, #141414 0%, #1a1a1a 100%)" }}>

      {/* ── Brand ──────────────────────────────────────────────────────────── */}
      <div className="px-5 py-6 border-b border-stone-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#d4a437] flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ boxShadow: "0 2px 12px rgba(212,164,55,0.4)" }}>
            <Box className="w-4.5 h-4.5 text-[#1a1a1a]" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <div className="font-serif text-[17px] text-stone-50 leading-none tracking-tight"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>
              Al Bazar
            </div>
            <div className="text-[9px] uppercase tracking-[0.22em] text-stone-500 mt-1 font-mono truncate">
              {tx(lang, "Gestione Negozio", "Shop Manager")}
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.labelIt}>
            <div className="px-3 mb-1.5 text-[9px] uppercase tracking-[0.25em] text-stone-600 font-mono font-semibold">
              {tx(lang, group.labelIt, group.labelEn)}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Status card ────────────────────────────────────────────────────── */}
      <div className="mx-3 mb-3 bg-stone-900/60 border border-stone-800 p-3 rounded-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="relative flex-shrink-0">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-60" />
          </div>
          <span className="text-[11px] text-stone-300 font-medium">
            {tx(lang, "Sistema operativo", "All systems OK")}
          </span>
        </div>
        <div className="text-[10px] text-stone-600 font-mono">Via Padova 104 · Milano</div>
      </div>

      {/* ── Bottom items ───────────────────────────────────────────────────── */}
      <div className="px-3 pb-4 border-t border-stone-800/60 pt-3 space-y-0.5">
        {BOTTOM_ITEMS.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </div>
    </aside>
  );
}
