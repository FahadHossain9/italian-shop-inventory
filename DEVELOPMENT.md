# Gestione Magazzino — Inventory Management System
## Single-Shop Edition · Italy · Bilingual (IT / EN)

> **Who this is for:** A Bangladeshi shopkeeper operating a single retail store in Italy who needs a fast, clear, bilingual tool to run daily stock operations — no accounting degree required, no Italian bureaucracy confusion.

---

## Table of Contents

1. [Project Vision](#1-project-vision)
2. [Shop Context & Real-World Scenarios](#2-shop-context--real-world-scenarios)
3. [Tech Stack](#3-tech-stack)
4. [Application Architecture](#4-application-architecture)
5. [Feature Modules — Detailed Breakdown](#5-feature-modules--detailed-breakdown)
6. [Bilingual UI Strategy](#6-bilingual-ui-strategy)
7. [Data Model](#7-data-model)
8. [POS Integration Layer](#8-pos-integration-layer)
9. [Italy-Specific Compliance Notes](#9-italy-specific-compliance-notes)
10. [Dummy Data Design — Italy Context](#10-dummy-data-design--italy-context)
11. [Screen-by-Screen Design Guide](#11-screen-by-screen-design-guide)
12. [Development Phases](#12-development-phases)
13. [User Experience Principles](#13-user-experience-principles)
14. [File & Folder Structure](#14-file--folder-structure)

---

## 1. Project Vision

**Italian:** Un sistema semplice, veloce e bilingue per gestire il magazzino di un negozio singolo in Italia — senza confusione, senza burocrazia inutile.

**English:** A simple, fast, bilingual system to manage the stock of a single shop in Italy — no confusion, no unnecessary bureaucracy.

### Core Promise
- Open the app → see exactly what you have in stock → know what to order → done.
- Every screen works in **Italian and English** simultaneously (togglable, or shown side-by-side as labels).
- Built for a shopkeeper who is comfortable with smartphones, not necessarily computers.

### What This App Is NOT
- Not an accounting/billing system (no fattura generation — use a dedicated Italian fattura app for that)
- Not a multi-store SaaS platform
- Not a full POS terminal (but it exposes a clean integration layer so any market POS can sync stock levels)

---

## 2. Shop Context & Real-World Scenarios

### Typical Shop Type
A Bangladeshi-owned **Mini Market / Negozio Etnico** in an Italian city (Milan, Rome, Bologna, etc.), selling:

| Category (IT) | Category (EN) | Examples |
|---|---|---|
| Alimentari | Groceries | Riso Basmati, Lenticchie, Farina di Ceci |
| Bevande | Beverages | Acqua, Succhi, Soft Drink |
| Prodotti Etnici | Ethnic Products | Spezie Bengal, Salsa di Pesce, Naan |
| Cura della Casa | Household Care | Detersivo, Carta Igienica |
| Cura Personale | Personal Care | Shampoo, Sapone |
| Telefonia | Phone & SIM | Schede SIM, Ricariche, Accessori |
| Snack e Dolci | Snacks & Sweets | Biscotti, Chips, Cioccolato |
| Surgelati | Frozen Foods | Pane Surgelato, Pesce, Pollo |

### Daily Workflow (Real-World)
1. **Morning:** Shopkeeper opens app, checks dashboard — sees what's low in stock.
2. **During Day:** A product sells out → mark it as sold/outgoing stock movement.
3. **Supplier arrives (fornitore):** Mark incoming stock → quantities update automatically.
4. **Week End:** Print or export a simple stock report.
5. **Month End:** See profit margin estimates — did the shop do well this month?

### Key Pain Points This App Solves
- "I don't know how many kg of basmati rice I have left" → **Live stock count**
- "My supplier's invoice is in Italian, I can't read it fully" → **Bilingual labels on every form**
- "I ordered too much yogurt and it expired" → **Expiry date tracking + alerts**
- "My Italian accountant asks for stock value" → **One-click stock valuation report**
- "I want to connect my new Italian POS machine" → **POS integration layer (plug-in)**

---

## 3. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend Framework | **React 18 + Vite 5** | Fast, component-based, great ecosystem |
| Styling | **Tailwind CSS** | Utility-first, easy to theme |
| Icons | **lucide-react** | Clean, professional, consistent |
| Charts | **Recharts** | Lightweight, declarative |
| State Management | **Zustand** | Simple global state (no Redux complexity) |
| Persistence | **localStorage + JSON export** | Works offline, no server needed (Phase 1) |
| Backend (Phase 2) | **Node.js + Express + SQLite** | Lightweight, runs on a cheap VPS or Raspberry Pi |
| i18n (Translations) | **react-i18next** | Industry standard, lazy-loads language files |
| Date Handling | **date-fns** | Lightweight, supports Italian locale |
| PDF Export | **jsPDF + jsPDF-autotable** | Generate stock reports as PDF |
| CSV Export | **Papa Parse** | Import/export product lists via CSV |
| POS Adapter Layer | **Custom REST webhook system** | See Section 8 |

### Why No Backend in Phase 1?
The shopkeeper needs something that **works today** on his laptop or tablet without setting up servers. Phase 1 uses browser localStorage (persisted JSON). Phase 2 adds a Node.js backend so data is shared across devices (shop PC + personal tablet).

---

## 4. Application Architecture

```
┌─────────────────────────────────────────────┐
│              React Frontend                  │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│  │Dashboard │ │Products  │ │ Movements   │  │
│  └──────────┘ └──────────┘ └─────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│  │Suppliers │ │Orders    │ │  Reports    │  │
│  └──────────┘ └──────────┘ └─────────────┘  │
│  ┌──────────────────────────────────────┐   │
│  │        Language Toggle (IT/EN)       │   │
│  └──────────────────────────────────────┘   │
└───────────────────┬─────────────────────────┘
                    │
         ┌──────────▼──────────┐
         │   Zustand Store     │
         │  (Global State)     │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │  Persistence Layer  │
         │  localStorage(P1)   │
         │  SQLite API  (P2)   │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │  POS Adapter Layer  │
         │  (Webhook / REST)   │
         └─────────────────────┘
```

---

## 5. Feature Modules — Detailed Breakdown

### Module 1 — Dashboard (Cruscotto)

**Purpose:** First screen the shopkeeper sees every morning. Tells him instantly if anything is wrong.

| Widget | Italian Label | English Label | Description |
|---|---|---|---|
| KPI Card 1 | Prodotti Totali | Total Products | Count of all SKUs |
| KPI Card 2 | Valore Magazzino | Stock Value | Total cost value of current stock |
| KPI Card 3 | Scorte in Esaurimento | Low Stock Items | Count of products below reorder point |
| KPI Card 4 | Prodotti in Scadenza | Expiring Soon | Products expiring within 7 days |
| Chart 1 | Movimenti Ultimi 7 Giorni | Stock Flow (7 Days) | Area chart: stock in vs out |
| Chart 2 | Categorie per Valore | Value by Category | Pie chart |
| Alert List | Avvisi Urgenti | Urgent Alerts | Low stock + near-expiry items combined |
| Quick Actions | Azioni Rapide | Quick Actions | Buttons: + Product, + Movement, + Order |

**UX Detail:** The alert list uses traffic-light colors — red for "order now", yellow for "order soon", green for "all good". No text needed to understand the severity.

---

### Module 2 — Products (Prodotti)

**This is the heart of the app.** Every product the shop sells lives here.

#### Product List View
- Search bar (searches name, barcode, category)
- Filter by category, status (active/discontinued), stock level
- Sort by name, stock quantity, price, last updated
- Color-coded stock status indicator on each row
- Quick-edit inline (change price or stock directly in the list)

#### Product Detail / Form Fields

| Field (EN) | Campo (IT) | Type | Notes |
|---|---|---|---|
| Product Name | Nome Prodotto | Text | Bilingual: Italian name + optional Bengali/English name |
| Barcode / EAN | Codice a Barre | Text | Scannable via camera on mobile |
| Category | Categoria | Dropdown | See category list in Section 10 |
| Subcategory | Sottocategoria | Dropdown | Optional |
| Unit of Measure | Unità di Misura | Dropdown | kg, g, pz (pezzo), lt, ml, conf (confezione) |
| Selling Price (€) | Prezzo di Vendita (€) | Number | Includes IVA indicator |
| Purchase Price (€) | Prezzo di Acquisto (€) | Number | Cost from supplier |
| IVA Rate | Aliquota IVA | Dropdown | 4%, 10%, 22% (Italian VAT rates) |
| Current Stock | Giacenza Attuale | Number | Auto-calculated from movements |
| Minimum Stock | Scorta Minima | Number | Trigger for low-stock alert |
| Reorder Quantity | Quantità Ordine | Number | How much to order when reordering |
| Supplier | Fornitore | Select | Linked to Suppliers module |
| Shelf Location | Posizione Scaffale | Text | E.g., "A3", "Frigo 2" |
| Expiry Date | Data Scadenza | Date | Optional — for perishables |
| Notes | Note | Textarea | Free text, bilingual |
| Product Image | Immagine | File Upload | Optional — helps identify products |
| Status | Stato | Toggle | Active / Discontinued |
| Barcode Print | Stampa Etichetta | Button | Generate printable barcode label |

#### Barcode Scanning
- On mobile/tablet: click the camera icon to open device camera and scan barcode
- Automatically fills product name and IVA rate if barcode matches a known Italian product database lookup (Phase 2)

---

### Module 3 — Stock Movements (Movimenti di Magazzino)

**Every time stock goes in or out, it's recorded here.** This creates an audit trail.

#### Movement Types

| Type | Italian | Icon | Color | When to Use |
|---|---|---|---|---|
| IN — Carico | Stock In | ↑ Arrow | Green | Supplier delivery received |
| OUT — Scarico | Stock Out | ↓ Arrow | Red | Product sold (manual entry if no POS) |
| ADJUST — Rettifica | Adjustment | ⚡ | Orange | Inventory count correction |
| EXPIRED — Scaduto | Expired / Wasted | ⚠️ | Dark Red | Product discarded due to expiry |
| RETURN — Reso | Return to Supplier | ↩ | Blue | Sending damaged goods back |

#### Movement Form Fields

| Field (EN) | Campo (IT) | Notes |
|---|---|---|
| Movement Type | Tipo Movimento | Dropdown (types above) |
| Product | Prodotto | Searchable select |
| Quantity | Quantità | Number + unit auto-shown |
| Date & Time | Data e Ora | Defaults to now |
| Reference No. | Numero Riferimento | DDT number, receipt number, etc. |
| Supplier / Customer | Fornitore / Cliente | Optional |
| Unit Cost at Movement | Costo Unitario | For IN movements — records actual purchase price |
| Notes | Note | Free text |

#### Movement Log (History)
- Searchable, filterable by date range, product, type
- Each row shows: date, type badge, product name, qty, reference, who entered it
- Export to CSV or PDF

---

### Module 4 — Suppliers (Fornitori)

**Who the shopkeeper buys from.**

#### Supplier Form Fields

| Field (EN) | Campo (IT) | Notes |
|---|---|---|
| Company Name | Ragione Sociale | Full legal name |
| Contact Person | Persona di Contatto | Name of the rep |
| Phone | Telefono | Click-to-call on mobile |
| Email | Email | |
| WhatsApp | WhatsApp | Many Italian wholesale suppliers use WA |
| Address | Indirizzo | |
| City | Città | |
| P.IVA (VAT ID) | Partita IVA | Italian VAT number |
| Payment Terms | Termini di Pagamento | e.g., "30 days", "cash on delivery" |
| Min Order | Ordine Minimo | Minimum order value in € |
| Delivery Days | Giorni di Consegna | e.g., "Tuesday, Friday" |
| Preferred Language | Lingua Preferita | Italian / English / Bengali / Other |
| Notes | Note | Free text |
| Supplied Products | Prodotti Forniti | Auto-linked list |
| Order History | Storico Ordini | Auto-linked from Orders module |

#### Supplier Quick Actions
- "Send WhatsApp Order" — opens WhatsApp with a pre-filled message listing low-stock items from this supplier
- "View Outstanding Payments" — shows orders not yet paid

---

### Module 5 — Purchase Orders (Ordini di Acquisto)

**When the shopkeeper orders stock from a supplier.**

#### Order Statuses (with Italian translations)

| Status | Italiano | Color |
|---|---|---|
| Draft | Bozza | Grey |
| Sent | Inviato | Blue |
| Confirmed | Confermato | Light Blue |
| In Transit | In Transito | Purple |
| Received | Ricevuto | Green |
| Partially Received | Parzialmente Ricevuto | Orange |
| Cancelled | Annullato | Red |

#### Order Form
- Select supplier → product lines auto-populate with that supplier's products
- Each line: product, quantity to order, unit cost, total
- Auto-suggests quantities based on: current stock vs. minimum stock vs. reorder quantity
- "Receive Order" action: opens a checklist to tick off received items and auto-updates stock

#### Smart Reorder Suggestion
Every time the dashboard detects a low-stock item, the system auto-generates a **draft purchase order** grouped by supplier. The shopkeeper just reviews and confirms.

---

### Module 6 — Stock Count / Inventario Fisico

**Periodic physical count to verify the system matches reality.**

- Start a count session: freeze current system quantities as reference
- Go shelf by shelf: scan or type actual counts
- System shows: System Qty vs. Counted Qty vs. Difference
- Approve → auto-creates ADJUST movements for all discrepancies
- Schedule recurring counts (monthly, quarterly)

This module is critical for a small shop where small thefts or counting errors accumulate.

---

### Module 7 — Reports (Report / Rendiconti)

**Simple, printable reports that even a non-technical person can understand.**

| Report | Italian | What It Shows |
|---|---|---|
| Stock Status | Stato Magazzino | Current stock levels, value, min stock status |
| Low Stock | Scorte in Esaurimento | Items below reorder point |
| Expiry Report | Prodotti in Scadenza | Items expiring within N days |
| Stock Movements | Movimenti di Magazzino | All ins/outs for a date range |
| Top Moving Products | Prodotti Più Venduti | Highest turnover items (via OUT movements) |
| Supplier Spend | Spesa per Fornitore | How much spent with each supplier |
| Inventory Valuation | Valorizzazione Magazzino | Stock value at cost and at selling price |
| Profit Estimate | Stima Margine | Revenue (from OUT movements) - Cost |
| Monthly Summary | Riepilogo Mensile | Month-over-month comparison |

**Export formats:** PDF (ready to print or email to accountant), CSV (for Excel/Google Sheets)

---

### Module 8 — Settings (Impostazioni)

| Setting | Italian | English |
|---|---|---|
| Shop Name & Address | Nome e Indirizzo Negozio | Used in report headers |
| Currency | Valuta | Default: € (EUR) |
| Language | Lingua | Italian / English / Both |
| IVA Rates | Aliquote IVA | Configure which rates apply to your shop |
| Categories | Categorie | Add/edit product categories |
| Units of Measure | Unità di Misura | Add/edit units |
| Low Stock Alert Threshold | Soglia Allarme Scorte | Default: below reorder point |
| Expiry Warning Days | Giorni Avviso Scadenza | Default: 7 days before expiry |
| Backup & Restore | Backup e Ripristino | Export full data JSON + restore |
| POS Integration | Integrazione POS | Configure POS webhook (see Section 8) |
| User Account | Account Utente | Name, email, PIN for app lock |

---

## 6. Bilingual UI Strategy

### Approach: Parallel Labels

Rather than forcing the user to pick ONE language and miss the other, we show both in a clean hierarchy:

```
┌─────────────────────────────────────────┐
│  Nome Prodotto                          │
│  Product Name                    [EN]   │
│  ┌─────────────────────────────────┐   │
│  │  Riso Basmati Extra Lungo       │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

- **Primary label:** Italian (needed for official documents, talking to Italian suppliers)
- **Secondary label (smaller, grey):** English (owner's reference)
- **Toggle in header:** User can switch to English-only, Italian-only, or Bilingual mode

### Translation File Structure

```
/src/i18n/
  it.json       ← Italian translations (primary)
  en.json       ← English translations
  bn.json       ← Bengali (optional — for personal notes fields)
```

### Language Toggle
- Top-right of every screen: `IT | EN` toggle pills
- Preference saved in localStorage
- All form labels, buttons, alerts, and messages switch instantly

### Date & Number Formatting
- Dates: `dd/mm/yyyy` format (Italian standard), e.g., `05/01/2025`
- Numbers: Italian locale — comma as decimal separator → `1.234,50 €`
- Toggle: show in EN format `€1,234.50` when language is set to English

---

## 7. Data Model

### Product
```json
{
  "id": "SKU-1001",
  "name_it": "Riso Basmati Extra Lungo 1kg",
  "name_en": "Basmati Long Grain Rice 1kg",
  "barcode": "8001120890443",
  "category": "alimentari",
  "subcategory": "riso-cereali",
  "unit": "pz",
  "price_sell": 2.49,
  "price_buy": 1.20,
  "iva_rate": 4,
  "stock_current": 84,
  "stock_minimum": 20,
  "stock_reorder_qty": 60,
  "supplier_id": "SUP-01",
  "shelf_location": "B2",
  "expiry_date": null,
  "image_url": null,
  "notes": "",
  "status": "active",
  "created_at": "2026-01-15",
  "updated_at": "2026-05-05"
}
```

### Stock Movement
```json
{
  "id": "MV-0001",
  "type": "in",
  "product_id": "SKU-1001",
  "quantity": 60,
  "unit_cost": 1.20,
  "reference": "DDT-20260430-001",
  "supplier_id": "SUP-01",
  "note": "Consegna settimanale / Weekly delivery",
  "created_by": "owner",
  "created_at": "2026-04-30T09:15:00"
}
```

### Supplier
```json
{
  "id": "SUP-01",
  "name": "Milano Ingrosso Alimentari S.r.l.",
  "contact_person": "Marco Rossi",
  "phone": "+39 02 1234 5678",
  "whatsapp": "+39 333 1234 567",
  "email": "ordini@milanogrosso.it",
  "address": "Via Padova 88, Milano",
  "city": "Milano",
  "piva": "IT12345678901",
  "payment_terms": "30 giorni",
  "min_order_eur": 150,
  "delivery_days": ["Tuesday", "Friday"],
  "preferred_lang": "it",
  "notes": ""
}
```

### Purchase Order
```json
{
  "id": "PO-2026-001",
  "supplier_id": "SUP-01",
  "status": "received",
  "order_date": "2026-04-28",
  "expected_date": "2026-04-30",
  "received_date": "2026-04-30",
  "lines": [
    {
      "product_id": "SKU-1001",
      "qty_ordered": 60,
      "qty_received": 60,
      "unit_cost": 1.20
    }
  ],
  "total_cost": 72.00,
  "notes": "DDT numero 001/2026"
}
```

### App Settings
```json
{
  "shop_name": "Al Bazar di Milano",
  "shop_address": "Via Padova 104, 20131 Milano",
  "piva": "IT98765432101",
  "currency": "EUR",
  "language": "bilingual",
  "iva_rates": [4, 10, 22],
  "low_stock_threshold": "at_reorder_point",
  "expiry_warning_days": 7,
  "pos_integration": {
    "enabled": false,
    "adapter": null,
    "webhook_url": null,
    "api_key": null
  }
}
```

---

## 8. POS Integration Layer

### Design Philosophy
The app is **POS-agnostic**. It does not embed any specific POS logic. Instead, it exposes a clean **webhook + REST interface** that any POS terminal can push events to, or pull stock data from.

### How It Works

```
┌─────────────────┐        ┌───────────────────────┐
│   POS Terminal  │        │  Inventory App         │
│  (Any Brand)    │        │                        │
│                 │──────→ │  POST /api/movements   │
│  Sale recorded  │  sale  │  (creates OUT movement)│
│                 │        │  Stock auto-decrements  │
└─────────────────┘        └───────────────────────┘

┌─────────────────┐        ┌───────────────────────┐
│   POS Terminal  │        │  Inventory App         │
│                 │──────→ │  GET /api/products     │
│  Price check /  │  query │  Returns: stock, price │
│  stock check    │        │                        │
└─────────────────┘        └───────────────────────┘
```

### REST Endpoints (Phase 2)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List all products with current stock |
| GET | `/api/products/:barcode` | Lookup product by EAN barcode |
| POST | `/api/movements` | Create a stock movement (from POS sale) |
| GET | `/api/stock/:sku` | Get current stock for one SKU |
| PUT | `/api/products/:id/price` | Update selling price |

### Supported POS Adapters (Planned Plugins)

The adapter pattern means adding a new POS brand requires only writing one small adapter file:

| POS Brand | Status | Notes |
|---|---|---|
| **Ditron** (common in Italian small shops) | Planned | REST webhook |
| **EpsonFP-90III** (fiscal printer+POS) | Planned | Serial/USB event capture |
| **Micros / Oracle** | Planned | OAuth2 REST |
| **Square** | Planned | Square Webhooks API |
| **Custom / Generic** | Built-in | Raw webhook POST |

### Settings UI for POS
In Settings → POS Integration:
1. Toggle: Enable POS Sync (ON/OFF)
2. Select adapter from dropdown
3. Enter API key / webhook URL
4. Test connection button
5. View last 10 sync events log

---

## 9. Italy-Specific Compliance Notes

> These are informational — the app does not replace a certified fiscal system. It is a **stock management tool**, not an invoicing or fiscal system.

| Topic | What It Means | How App Handles It |
|---|---|---|
| **IVA (VAT)** | Italy has 3 main rates: 4% (food staples), 10% (some food), 22% (general goods) | Each product stores its IVA rate; reports show pre-IVA and IVA-inclusive values |
| **DDT (Documento di Trasporto)** | Supplier delivery note — required for goods in transit | DDT number is stored as reference on each IN movement |
| **Partita IVA** | Italian business VAT number | Stored in shop settings; shown in report headers |
| **FIFO / LIFO** | Italian accounting uses FIFO for inventory valuation | Valuation report uses weighted average cost (WAC) — acceptable for small retailers |
| **Magazzino Fiscale** | Formal tax inventory — required for certain business types | Not managed here — export reports to your commercialista (accountant) |

---

## 10. Dummy Data Design — Italy Context

### Products (Italian Mini Market)

| SKU | Italian Name | English Name | Category | Unit | Buy € | Sell € | IVA | Stock |
|---|---|---|---|---|---|---|---|---|
| SKU-1001 | Riso Basmati Extra Lungo 1kg | Basmati Long Grain Rice 1kg | Alimentari | pz | 1.20 | 2.49 | 4% | 84 |
| SKU-1002 | Farina di Ceci 500g | Chickpea Flour 500g | Alimentari | pz | 0.95 | 1.89 | 4% | 42 |
| SKU-1003 | Olio di Senape 1lt | Mustard Oil 1L | Alimentari | pz | 3.20 | 5.50 | 10% | 18 |
| SKU-1004 | Lenticchie Rosse 1kg | Red Lentils 1kg | Alimentari | pz | 1.10 | 2.20 | 4% | 56 |
| SKU-1005 | Curcuma in Polvere 200g | Turmeric Powder 200g | Spezie | pz | 0.80 | 1.79 | 4% | 30 |
| SKU-1006 | Cumino in Polvere 100g | Cumin Powder 100g | Spezie | pz | 0.65 | 1.49 | 4% | 25 |
| SKU-1007 | Peperoncino Piccante 100g | Chilli Powder 100g | Spezie | pz | 0.70 | 1.49 | 4% | 20 |
| SKU-1008 | Salsa di Soia 500ml | Soy Sauce 500ml | Condimenti | pz | 1.30 | 2.79 | 10% | 36 |
| SKU-1009 | Acqua Naturale 1.5lt | Still Water 1.5L | Bevande | pz | 0.22 | 0.49 | 4% | 120 |
| SKU-1010 | Coca-Cola 1.5lt | Coca-Cola 1.5L | Bevande | pz | 0.95 | 1.79 | 22% | 48 |
| SKU-1011 | Pane Naan Surgelato (5pz) | Frozen Naan Bread (5pcs) | Surgelati | pz | 1.80 | 3.49 | 10% | 24 |
| SKU-1012 | Yogurt Naturale 1kg | Plain Yogurt 1kg | Latticini | pz | 1.10 | 2.10 | 4% | 15 |
| SKU-1013 | Scheda SIM Wind 3 | Wind 3 SIM Card | Telefonia | pz | 0.00 | 0.00 | 22% | 40 |
| SKU-1014 | Ricarica Wind 10€ | Wind Top-Up €10 | Telefonia | pz | 9.50 | 10.00 | 22% | 30 |
| SKU-1015 | Detersivo Piatti 500ml | Dish Soap 500ml | Casa | pz | 0.60 | 1.29 | 22% | 52 |
| SKU-1016 | Carta Igienica 4 Rotoli | Toilet Paper 4 Rolls | Casa | pz | 1.20 | 2.49 | 4% | 38 |
| SKU-1017 | Biscotti al Cioccolato 200g | Chocolate Biscuits 200g | Snack | pz | 0.80 | 1.59 | 22% | 65 |
| SKU-1018 | Patatine Chips Barbecue 150g | BBQ Crisps 150g | Snack | pz | 0.75 | 1.49 | 22% | 45 |
| SKU-1019 | Sapone Liquido Mani 250ml | Liquid Hand Soap 250ml | Igiene | pz | 0.90 | 1.99 | 22% | 28 |
| SKU-1020 | Shampoo Pantene 400ml | Pantene Shampoo 400ml | Igiene | pz | 2.20 | 4.49 | 22% | 20 |

### Suppliers (Italy-Based)

| ID | Name | City | Contact | Phone | Type |
|---|---|---|---|---|---|
| SUP-01 | Milano Ingrosso Alimentari S.r.l. | Milano | Marco Rossi | +39 02 1234 5678 | Wholesale grocer |
| SUP-02 | Casa del Riso S.r.l. | Padova | Priya Patel | +39 049 8765 432 | Rice & grains specialist |
| SUP-03 | Spezie del Mondo | Bologna | Fatima Al-Hassan | +39 051 2345 678 | Ethnic spices importer |
| SUP-04 | Distribuzione Bibite Lombarda | Sesto S.G. | Luigi Colombo | +39 02 9876 5432 | Beverages distributor |
| SUP-05 | Wind Tre Business | Milano | (account portal) | — | Telecom top-up supplier |
| SUP-06 | Metro Cash & Carry | Milano Sesto | (self-service) | — | General wholesale |

### Categories (with Italian names)

```
alimentari          → Alimentari / Groceries
spezie              → Spezie / Spices
condimenti          → Condimenti / Condiments
bevande             → Bevande / Beverages
surgelati           → Surgelati / Frozen Foods
latticini           → Latticini / Dairy
telefonia           → Telefonia / Phone & SIM
casa                → Cura della Casa / Household
igiene              → Igiene Personale / Personal Care
snack               → Snack e Dolci / Snacks & Sweets
```

---

## 11. Screen-by-Screen Design Guide

### Global Layout
```
┌─────────────────────────────────────────────────────┐
│  [☰] Al Bazar di Milano    [🔔 3]    [IT|EN]  [👤] │  ← Top Bar
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  NAVIGATION  │          MAIN CONTENT               │
│  SIDEBAR     │                                      │
│              │                                      │
│  📊 Cruscotto │                                      │
│  📦 Prodotti  │                                      │
│  ↕ Movimenti │                                      │
│  🚚 Fornitori │                                      │
│  📋 Ordini   │                                      │
│  🔢 Inventario│                                      │
│  📈 Report   │                                      │
│  ⚙ Impostaz. │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

On mobile: sidebar collapses to a bottom tab bar (the 5 most-used modules).

### Screen 1 — Dashboard / Cruscotto
```
┌─────────────────────────────────────────────────────┐
│  Buongiorno! / Good Morning!  •  Lunedì 5 Maggio    │
├──────────┬──────────┬──────────┬──────────────────┤
│ Prodotti │ Valore   │ Scorte  │ In Scadenza       │
│  Totali  │Magazzino │  Basse  │  (7 giorni)        │
│   20     │€ 842,40  │  3 ⚠️   │  2 ⚠️             │
│ Products │ St. Value│Low Stock│ Expiring Soon      │
├──────────┴──────────┴──────────┴──────────────────┤
│  📊  Movimenti Ultimi 7 Giorni / Stock Flow (7d)   │
│  [area chart: green=in, red=out]                   │
├───────────────────────┬─────────────────────────┤
│  ⚠️ AVVISI URGENTI     │  🏆 Più Venduti (30gg) │
│  URGENT ALERTS        │  Top Movers (30 days)  │
│                       │                         │
│  🔴 Olio di Senape    │  1. Riso Basmati        │
│     3 rimasti / left  │  2. Acqua Naturale      │
│  🔴 Yogurt Naturale   │  3. Coca-Cola           │
│     2 rimasti / left  │                         │
│  🟡 Curcuma           │                         │
│     Scade 10/05/2026  │                         │
│  [Vedi Tutti / See All]│                        │
└───────────────────────┴─────────────────────────┘
│  [+ Prodotto] [+ Movimento] [+ Ordine]  Quick Actions│
└─────────────────────────────────────────────────────┘
```

### Screen 2 — Products / Prodotti
```
┌─────────────────────────────────────────────────────┐
│  Prodotti / Products               [+ Nuovo Prodotto]│
├─────────────────────────────────────────────────────┤
│  [🔍 Cerca / Search...] [Categoria ▼] [Stato ▼]    │
│  [Ordina per: Giacenza ▼]  [📤 Esporta CSV]         │
├──────┬────────────────────┬───────┬───────┬────────┤
│ SKU  │ Prodotto / Product │ Stock │ Valore│ Stato  │
├──────┼────────────────────┼───────┼───────┼────────┤
│1001  │ Riso Basmati 1kg   │  🟢84 │€100,80│ Attivo │
│1002  │ Farina di Ceci 500g│  🟢42 │ €39,90│ Attivo │
│1003  │ Olio di Senape 1lt │  🔴18 │ €57,60│⚠ Basso│
│1010  │ Coca-Cola 1.5lt    │  🟢48 │ €45,60│ Attivo │
└──────┴────────────────────┴───────┴───────┴────────┘
```
Stock colour: 🟢 OK, 🟡 Near reorder point, 🔴 Below minimum

### Screen 3 — Add/Edit Product Form
Full bilingual form as described in Module 2. Grouped into collapsible sections:
- **Informazioni Base / Basic Info** (always open)
- **Prezzi e IVA / Price & VAT**
- **Magazzino / Stock**
- **Fornitore e Posizione / Supplier & Location**
- **Dettagli Aggiuntivi / Additional Details** (collapsible)

### Screen 4 — Stock Movement Entry
```
┌─────────────────────────────────────────────────────┐
│  Nuovo Movimento / New Movement                      │
├─────────────────────────────────────────────────────┤
│  Tipo / Type:                                        │
│  [↑ Carico] [↓ Scarico] [⚡ Rettifica] [⚠ Scaduto] │
│   Stock IN    Stock OUT   Adjustment     Expired     │
├─────────────────────────────────────────────────────┤
│  Prodotto / Product                                  │
│  [🔍 Cerca o scansiona / Search or scan barcode]     │
├─────────────────────────────────────────────────────┤
│  Quantità / Quantity        Costo Unitario / Unit Cost│
│  [  60  ] pz               [  1.20  ] €              │
├─────────────────────────────────────────────────────┤
│  Riferimento / Reference    Data / Date              │
│  [DDT-2026-001           ]  [05/05/2026  ]           │
├─────────────────────────────────────────────────────┤
│  Note / Notes                                        │
│  [Consegna settimanale fornitore / Weekly delivery ] │
├─────────────────────────────────────────────────────┤
│               [Annulla / Cancel]  [✓ Salva / Save]  │
└─────────────────────────────────────────────────────┘
```

### Screen 5 — Reports
Each report has a **preview panel** before export. The header of every printed report shows:
```
Al Bazar di Milano
Via Padova 104, 20131 Milano
P.IVA: IT98765432101

STATO MAGAZZINO / STOCK STATUS REPORT
Data / Date: 05/05/2026
```

---

## 12. Development Phases

### Phase 1 — Core MVP (4–6 weeks)
**Goal:** Working, usable app with all essential inventory features. No backend — runs in browser.

| # | Task | Priority |
|---|---|---|
| 1.1 | Project setup: React + Vite + Tailwind + Zustand + i18next | P0 |
| 1.2 | Italian/English translation files (it.json, en.json) | P0 |
| 1.3 | Layout: sidebar, top bar, language toggle | P0 |
| 1.4 | Dashboard with KPIs and alerts | P0 |
| 1.5 | Products module: list, add, edit, delete | P0 |
| 1.6 | Stock Movements: log movements, auto-update stock | P0 |
| 1.7 | Suppliers module: CRUD | P1 |
| 1.8 | Italy-context dummy data (see Section 10) | P0 |
| 1.9 | Low-stock and expiry alerts | P0 |
| 1.10 | Basic reports: Stock Status + Low Stock (PDF export) | P1 |
| 1.11 | Settings: shop info, language, categories | P1 |
| 1.12 | localStorage persistence + JSON backup/restore | P1 |

**Deliverable:** Working app at `http://localhost:5173` with real Italian shop data.

---

### Phase 2 — Backend & Sync (3–4 weeks)
**Goal:** Data persists on a server; accessible from multiple devices in the shop.

| # | Task |
|---|---|
| 2.1 | Node.js + Express API setup |
| 2.2 | SQLite database with migrations |
| 2.3 | REST endpoints for all modules |
| 2.4 | React frontend switches from localStorage to API calls |
| 2.5 | POS Integration: generic webhook endpoint |
| 2.6 | Purchase Orders module (full CRUD + receive flow) |
| 2.7 | Stock Count / Inventario Fisico module |
| 2.8 | All reports with PDF + CSV export |
| 2.9 | Barcode scanning (camera API on mobile) |
| 2.10 | WhatsApp order shortcut for suppliers |
| 2.11 | Deploy to cheap VPS (e.g., €5/month DigitalOcean droplet) |

---

### Phase 3 — Polish & POS (2–3 weeks)
**Goal:** Production-ready, POS-connected, delightful to use daily.

| # | Task |
|---|---|
| 3.1 | POS adapter: Ditron / EpsonFP integration |
| 3.2 | Barcode label printing (Avery-compatible) |
| 3.3 | Monthly summary report with email delivery |
| 3.4 | Smart reorder suggestions (auto-draft purchase orders) |
| 3.5 | Offline mode (PWA — works when internet is down) |
| 3.6 | Mobile app wrapper (optional — Capacitor.js) |
| 3.7 | Bengali (bn.json) translation for personal notes |

---

## 13. User Experience Principles

### 1. Zero Training Required
Every action has an Italian label AND an English label. The shopkeeper should be able to navigate the app on day one without a manual.

### 2. Mobile-First on Tablet
Most small shopkeepers use a tablet at the counter. Every screen must be comfortable at 768px width. Tap targets ≥ 44px. No hover-only interactions.

### 3. Speed Over Completeness
Common actions (record a delivery, check stock) must take ≤ 3 taps. Advanced settings are buried, not in the way.

### 4. Forgiveness
- Every delete has a confirmation modal with bilingual text
- Movements can be soft-deleted (hidden, not erased) so mistakes are recoverable
- JSON backup is always one click away in Settings

### 5. Colour as Information
The app uses a consistent colour language:
- **Green:** Stock OK, received, active
- **Yellow/Orange:** Warning, low stock, pending
- **Red:** Critical, out of stock, expired
- **Blue:** Informational, in transit, draft
- **Grey:** Inactive, cancelled, archived

### 6. Numbers Must Be Clear
Stock quantities are always shown with their unit: `84 pz`, `3.5 kg`, `12 lt`. Never just `84`.

### 7. Offline Resilience
Phase 1 is entirely offline (localStorage). Phase 3 adds PWA so the app works even when the shop's internet is down.

---

## 14. File & Folder Structure

```
inventory-management-shop/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── i18n/
│   │   ├── index.js          ← i18next config
│   │   ├── it.json           ← Italian strings
│   │   ├── en.json           ← English strings
│   │   └── bn.json           ← Bengali strings (Phase 3)
│   ├── store/
│   │   ├── useProductStore.js
│   │   ├── useMovementStore.js
│   │   ├── useSupplierStore.js
│   │   ├── useOrderStore.js
│   │   └── useSettingsStore.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── LanguageToggle.jsx
│   │   ├── ui/
│   │   │   ├── KPICard.jsx
│   │   │   ├── StockBadge.jsx
│   │   │   ├── BilingualLabel.jsx  ← Renders IT + EN labels
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   └── EmptyState.jsx
│   │   └── charts/
│   │       ├── StockFlowChart.jsx
│   │       ├── CategoryPieChart.jsx
│   │       └── MonthlyBarChart.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── ProductForm.jsx
│   │   ├── Movements.jsx
│   │   ├── MovementForm.jsx
│   │   ├── Suppliers.jsx
│   │   ├── SupplierForm.jsx
│   │   ├── Orders.jsx
│   │   ├── OrderForm.jsx
│   │   ├── StockCount.jsx
│   │   ├── Reports.jsx
│   │   └── Settings.jsx
│   ├── data/
│   │   └── demoData.js        ← Italian shop dummy data
│   ├── utils/
│   │   ├── currency.js        ← Euro formatting
│   │   ├── dates.js           ← Italian date formatting
│   │   ├── stockCalc.js       ← Stock level calculations
│   │   ├── pdfExport.js       ← jsPDF report generation
│   │   ├── csvExport.js       ← CSV export helpers
│   │   └── posAdapter.js      ← POS integration layer
│   └── hooks/
│       ├── useAlerts.js       ← Low stock + expiry detection
│       └── usePersistence.js  ← localStorage sync
├── DEVELOPMENT.md             ← This file
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## Summary

This system is designed to be the **simplest possible tool** that actually solves the real problems of a Bangladeshi shopkeeper running a single store in Italy:

1. **Know your stock at a glance** — Dashboard with real alerts
2. **Record every movement easily** — 3-tap stock entry
3. **Never run out of key products** — Smart low-stock alerts + reorder suggestions
4. **Communicate with Italian suppliers** — Bilingual forms and printable reports
5. **Stay POS-ready** — Clean integration layer, no lock-in
6. **Work on any device** — Mobile-first, offline-capable

The Italy-specific context (IVA rates, DDT references, Euro formatting, Italian supplier names, Italian product categories) is built into the foundation — not bolted on later.

---

*Documento di Sviluppo / Development Document*
*Versione / Version: 1.0 — Maggio 2026*
*Lingua / Language: Bilingual (IT/EN)*
