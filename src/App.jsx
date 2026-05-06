import React, { useState, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { LangProvider } from "./lang.jsx";
import { Confirm, Toast } from "./ui.jsx";
import { movementDelta, daysUntilExpiry, getStockStatus, nowStamp } from "./helpers.js";
import {
  PRODUCTS, SUPPLIERS, LOCATIONS, MOVEMENTS, PURCHASE_ORDERS, VENDITE,
} from "./data.js";

// Pages
import Dashboard      from "./pages/Dashboard.jsx";
import Products       from "./pages/Products.jsx";
import Movements      from "./pages/Movements.jsx";
import PurchaseOrders from "./pages/PurchaseOrders.jsx";
import Vendite        from "./pages/Vendite.jsx";
import Suppliers      from "./pages/Suppliers.jsx";
import Locali         from "./pages/Locali.jsx";
import Reports        from "./pages/Reports.jsx";
import Settings       from "./pages/Settings.jsx";
import Help           from "./pages/Help.jsx";
import Landing        from "./pages/Landing.jsx";

// Modals
import ProductModal       from "./modals/ProductModal.jsx";
import MovementModal      from "./modals/MovementModal.jsx";
import PurchaseOrderModal from "./modals/PurchaseOrderModal.jsx";
import VenditeModal       from "./modals/VenditeModal.jsx";
import SupplierModal      from "./modals/SupplierModal.jsx";
import LocaleModal        from "./modals/LocaleModal.jsx";

// Layout
import Sidebar from "./components/Sidebar.jsx";
import Topbar  from "./components/Topbar.jsx";

const PAGE_META = {
  dashboard: { it: "Cruscotto",       en: "Dashboard",       eyeIt: "Al Bazar di Milano",    eyeEn: "Al Bazar di Milano"     },
  products:  { it: "Prodotti",        en: "Products",        eyeIt: "Gestione Inventario",    eyeEn: "Inventory Management"   },
  movements: { it: "Movimenti",       en: "Stock Movements", eyeIt: "Carico / Scarico Merci", eyeEn: "Goods In / Out"         },
  purchases: { it: "Ordini Acquisto", en: "Purchase Orders", eyeIt: "Fornitori & Ordini",     eyeEn: "Suppliers & Orders"     },
  vendite:   { it: "Vendite",         en: "Sales",           eyeIt: "Registro Vendite",       eyeEn: "Sales Register"         },
  suppliers: { it: "Fornitori",       en: "Suppliers",       eyeIt: "Rubrica Fornitori",      eyeEn: "Supplier Directory"     },
  locali:    { it: "Locali",          en: "Shop Areas",      eyeIt: "Scaffali & Magazzino",   eyeEn: "Shelves & Storage"      },
  reports:   { it: "Report",          en: "Reports",         eyeIt: "Analisi & Statistiche",  eyeEn: "Analytics & Statistics" },
  settings:  { it: "Impostazioni",    en: "Settings",        eyeIt: "Configurazione Negozio", eyeEn: "Shop Configuration"     },
  help:      { it: "Aiuto & Guida",   en: "Help & Guide",    eyeIt: "Centro Assistenza",      eyeEn: "Help Center"            },
};

const BLANK_DIALOG  = { kind: null, mode: null, data: null };
const BLANK_CONFIRM = { show: false, msg: "", onConfirm: null };
const AUTH_KEY = "albazar-auth";

// ── Shop layout — owns all entity state, renders sub-routes ─────────────────
function ShopLayout({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive current page slug from URL: /shop/products → "products"
  const pageId = location.pathname.replace(/^\/shop\/?/, "").split("/")[0] || "dashboard";
  const goTo   = useCallback((id) => navigate(`/shop/${id}`), [navigate]);

  // ── Entity state ────────────────────────────────────────────────────────────
  const [products,  setProducts]  = useState(PRODUCTS);
  const [movements, setMovements] = useState(MOVEMENTS);
  const [purchases, setPurchases] = useState(PURCHASE_ORDERS);
  const [vendite,   setVendite]   = useState(VENDITE);
  const [suppliers, setSuppliers] = useState(SUPPLIERS);
  const [locations, setLocations] = useState(LOCATIONS);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [dialog,  setDialog]  = useState(BLANK_DIALOG);
  const [toast,   setToast]   = useState(null);
  const [confirm, setConfirm] = useState(BLANK_CONFIRM);

  // ── Toast helper ─────────────────────────────────────────────────────────────
  const showToast = useCallback((msg, tone = "ok") => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const openDialog  = (kind, mode, data = null) => setDialog({ kind, mode, data });
  const closeDialog = () => setDialog(BLANK_DIALOG);

  // ── Save handlers ────────────────────────────────────────────────────────────
  const saveProduct = (product, isCreate) => {
    if (isCreate) {
      setProducts((prev) => [...prev, { ...product, updated: nowStamp() }]);
      showToast(`Prodotto ${product.id} creato.`);
    } else {
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...product, updated: nowStamp() } : p));
      showToast(`Prodotto ${product.id} aggiornato.`);
    }
    closeDialog();
  };

  const saveMovement = (movement, isCreate) => {
    const delta = movementDelta(movement.type, movement.qty);
    if (isCreate) {
      setMovements((prev) => [{ ...movement, timestamp: nowStamp() }, ...prev]);
      if (delta !== 0) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === movement.sku
              ? { ...p, stock: Math.max(0, p.stock + delta), updated: nowStamp() }
              : p
          )
        );
      }
      showToast(`Movimento registrato per ${movement.sku}.`);
    } else {
      setMovements((prev) => prev.map((m) => m.id === movement.id ? movement : m));
      showToast("Movimento aggiornato.");
    }
    closeDialog();
  };

  const savePurchase = (po, isCreate) => {
    if (isCreate) {
      setPurchases((prev) => [po, ...prev]);
      showToast(`Ordine ${po.id} creato.`);
    } else {
      setPurchases((prev) => prev.map((p) => p.id === po.id ? po : p));
      showToast(`Ordine ${po.id} aggiornato.`);
    }
    closeDialog();
  };

  const saveVendita = (vendita, isCreate) => {
    if (isCreate) {
      setVendite((prev) => [vendita, ...prev]);
      if (vendita.lines?.length) {
        const newMovements = vendita.lines.map((line, i) => ({
          id:       `MV-V${vendita.id}-${i + 1}`,
          type:     "out",
          sku:      line.sku,
          product:  line.product,
          qty:      line.qty,
          ref:      vendita.id,
          location: "WH-01",
          user:     "cassa",
          time:     nowStamp(),
        }));
        setMovements((prev) => [...newMovements, ...prev]);
        setProducts((prev) => {
          let updated = [...prev];
          vendita.lines.forEach((line) => {
            updated = updated.map((p) =>
              p.id === line.sku
                ? { ...p, stock: Math.max(0, p.stock - Math.abs(line.qty)), updated: nowStamp() }
                : p
            );
          });
          return updated;
        });
      }
      showToast(`Vendita ${vendita.id} registrata. Magazzino aggiornato.`);
    } else {
      setVendite((prev) => prev.map((v) => v.id === vendita.id ? vendita : v));
      showToast(`Vendita ${vendita.id} aggiornata.`);
    }
    closeDialog();
  };

  const saveSupplier = (supplier, isCreate) => {
    if (isCreate) {
      setSuppliers((prev) => [...prev, supplier]);
      showToast(`Fornitore ${supplier.name} aggiunto.`);
    } else {
      setSuppliers((prev) => prev.map((s) => s.id === supplier.id ? supplier : s));
      showToast(`Fornitore ${supplier.name} aggiornato.`);
    }
    closeDialog();
  };

  const saveLocation = (loc, isCreate) => {
    if (isCreate) {
      setLocations((prev) => [...prev, loc]);
      showToast(`Locale ${loc.name} creato.`);
    } else {
      setLocations((prev) => prev.map((l) => l.id === loc.id ? loc : l));
      showToast(`Locale ${loc.name} aggiornato.`);
    }
    closeDialog();
  };

  // ── Delete helpers ────────────────────────────────────────────────────────────
  const askDelete = (kind, id, label) => {
    setConfirm({
      show: true,
      msg: `Eliminare "${label}"? Questa azione non può essere annullata.`,
      onConfirm: () => {
        if (kind === "product")  setProducts((p)  => p.filter((x) => x.id !== id));
        if (kind === "movement") setMovements((p) => p.filter((x) => x.id !== id));
        if (kind === "purchase") setPurchases((p) => p.filter((x) => x.id !== id));
        if (kind === "vendita")  setVendite((p)   => p.filter((x) => x.id !== id));
        if (kind === "supplier") setSuppliers((p) => p.filter((x) => x.id !== id));
        if (kind === "locale")   setLocations((p) => p.filter((x) => x.id !== id));
        showToast(`"${label}" eliminato.`, "danger");
        setConfirm(BLANK_CONFIRM);
      },
    });
  };

  // ── Alert count ───────────────────────────────────────────────────────────────
  const alertCount =
    products.filter((p) => getStockStatus(p).tone !== "ok").length +
    products.filter((p) => { const d = daysUntilExpiry(p.expiry); return d !== null && d <= 7; }).length;

  const meta = PAGE_META[pageId] || PAGE_META.dashboard;

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf8f3]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={meta.it} eyebrow={meta.eyeIt} alertCount={alertCount} onLogout={onLogout} />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={
              <Dashboard
                products={products}
                movements={movements}
                vendite={vendite}
                onJump={goTo}
                onNewMovement={() => openDialog("movement", "create", null)}
                onNewSale={() => { goTo("vendite"); openDialog("vendita", "create", null); }}
                onNewPurchaseOrder={() => { goTo("purchases"); openDialog("purchase", "create", null); }}
              />
            }/>

            <Route path="products" element={
              <Products
                products={products}
                onView={(p)   => openDialog("product", "view",   p)}
                onEdit={(p)   => openDialog("product", "edit",   p)}
                onCreate={()  => openDialog("product", "create", null)}
                onDelete={(p) => askDelete("product", p.id, p.name)}
              />
            }/>

            <Route path="movements" element={
              <Movements
                movements={movements}
                onCreate={() => openDialog("movement", "create", null)}
              />
            }/>

            <Route path="purchases" element={
              <PurchaseOrders
                purchaseOrders={purchases}
                onView={(po)   => openDialog("purchase", "view",   po)}
                onEdit={(po)   => openDialog("purchase", "edit",   po)}
                onCreate={()   => openDialog("purchase", "create", null)}
                onDelete={(po) => askDelete("purchase", po.id, po.id)}
              />
            }/>

            <Route path="vendite" element={
              <Vendite
                vendite={vendite}
                onView={(v)   => openDialog("vendita", "view",   v)}
                onEdit={(v)   => openDialog("vendita", "edit",   v)}
                onCreate={()  => openDialog("vendita", "create", null)}
                onDelete={(v) => askDelete("vendita", v.id, v.id)}
              />
            }/>

            <Route path="suppliers" element={
              <Suppliers
                suppliers={suppliers}
                onView={(s)   => openDialog("supplier", "view",   s)}
                onEdit={(s)   => openDialog("supplier", "edit",   s)}
                onCreate={()  => openDialog("supplier", "create", null)}
                onDelete={(s) => askDelete("supplier", s.id, s.name)}
              />
            }/>

            <Route path="locali" element={
              <Locali
                locations={locations}
                onView={(l)   => openDialog("locale", "view",   l)}
                onEdit={(l)   => openDialog("locale", "edit",   l)}
                onCreate={()  => openDialog("locale", "create", null)}
                onDelete={(l) => askDelete("locale", l.id, l.name)}
              />
            }/>

            <Route path="reports"  element={<Reports products={products} />} />

            <Route path="settings" element={
              <Settings
                products={products}
                movements={movements}
                suppliers={suppliers}
                locations={locations}
                purchaseOrders={purchases}
                vendite={vendite}
              />
            }/>

            <Route path="help" element={<Help onNavigate={goTo} />} />

            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <ProductModal
        open={dialog.kind === "product"}
        mode={dialog.mode}
        initial={dialog.data}
        products={products}
        suppliers={suppliers}
        locations={locations}
        onClose={closeDialog}
        onSave={saveProduct}
      />
      <MovementModal
        open={dialog.kind === "movement"}
        products={products}
        locations={locations}
        movements={movements}
        onClose={closeDialog}
        onSave={saveMovement}
      />
      <PurchaseOrderModal
        open={dialog.kind === "purchase"}
        mode={dialog.mode}
        initial={dialog.data}
        purchaseOrders={purchases}
        suppliers={suppliers}
        onClose={closeDialog}
        onSave={savePurchase}
      />
      <VenditeModal
        open={dialog.kind === "vendita"}
        mode={dialog.mode}
        initial={dialog.data}
        vendite={vendite}
        products={products}
        onClose={closeDialog}
        onSave={saveVendita}
      />
      <SupplierModal
        open={dialog.kind === "supplier"}
        mode={dialog.mode}
        initial={dialog.data}
        suppliers={suppliers}
        onClose={closeDialog}
        onSave={saveSupplier}
      />
      <LocaleModal
        open={dialog.kind === "locale"}
        mode={dialog.mode}
        initial={dialog.data}
        locations={locations}
        onClose={closeDialog}
        onSave={saveLocation}
      />

      <Confirm
        open={confirm.show}
        message={confirm.msg}
        onConfirm={confirm.onConfirm}
        onClose={() => setConfirm(BLANK_CONFIRM)}
        danger
      />
      <Toast toast={toast} />
    </div>
  );
}

// ── Route guard — redirects to "/" preserving the intended path in state ─────
function RequireAuth({ lang, onLogout }) {
  const location = useLocation();
  const loggedIn = localStorage.getItem(AUTH_KEY) === "1";
  if (!loggedIn) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }
  return (
    <LangProvider initialLang={lang}>
      <ShopLayout onLogout={onLogout} />
    </LangProvider>
  );
}

// ── Root App — handles auth + top-level routing ──────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem(AUTH_KEY) === "1");
  const [lang,     setLang]     = useState("bilingual");

  const handleLogin = useCallback(() => {
    localStorage.setItem(AUTH_KEY, "1");
    setLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setLoggedIn(false);
  }, []);

  return (
    <Routes>
      {/* Public: login — if already logged in, go to dashboard (or back to shared link) */}
      <Route path="/" element={
        loggedIn
          ? <Navigate to="/shop/dashboard" replace />
          : <Landing onEnter={handleLogin} lang={lang} setLang={setLang} />
      }/>

      {/* Protected: shop (all sub-pages) */}
      <Route path="/shop/*" element={
        <RequireAuth lang={lang} onLogout={handleLogout} />
      }/>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />}/>
    </Routes>
  );
}
