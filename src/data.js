// ============================================================================
// AL BAZAR DI MILANO — Demo Data (Italy context)
// ============================================================================

export const PRODUCTS = [
  // ── ALIMENTARI (IVA 4%) ──────────────────────────────────────────────────
  { id: "SKU-1001", name: "Riso Basmati Extra Lungo 1kg",    nameEn: "Basmati Long Grain Rice 1kg",      category: "Alimentari",  supplier: "Casa del Riso",                    location: "WH-02", stock: 84,  reorder: 20, price: 2.49, cost: 1.20, iva: 4,  unit: "pz", shelf: "B2",     expiry: null,         status: "active", updated: "2026-05-03", sold30d: 156 },
  { id: "SKU-1002", name: "Farina di Ceci 500g",             nameEn: "Chickpea Flour 500g",              category: "Alimentari",  supplier: "Milano Ingrosso Alimentari",       location: "WH-02", stock: 42,  reorder: 15, price: 1.79, cost: 0.85, iva: 4,  unit: "pz", shelf: "B3",     expiry: null,         status: "active", updated: "2026-05-02", sold30d: 48  },
  { id: "SKU-1003", name: "Lenticchie Rosse 1kg",            nameEn: "Red Lentils 1kg",                  category: "Alimentari",  supplier: "Milano Ingrosso Alimentari",       location: "WH-02", stock: 56,  reorder: 20, price: 2.29, cost: 1.10, iva: 4,  unit: "pz", shelf: "B3",     expiry: null,         status: "active", updated: "2026-05-01", sold30d: 67  },
  { id: "SKU-1004", name: "Ceci Secchi 500g",                nameEn: "Dried Chickpeas 500g",             category: "Alimentari",  supplier: "Milano Ingrosso Alimentari",       location: "WH-02", stock: 38,  reorder: 12, price: 1.59, cost: 0.75, iva: 4,  unit: "pz", shelf: "B3",     expiry: null,         status: "active", updated: "2026-04-30", sold30d: 44  },
  { id: "SKU-1005", name: "Pasta Penne Rigate 500g",         nameEn: "Penne Rigate Pasta 500g",          category: "Alimentari",  supplier: "Milano Ingrosso Alimentari",       location: "WH-01", stock: 72,  reorder: 25, price: 1.19, cost: 0.55, iva: 4,  unit: "pz", shelf: "A4",     expiry: null,         status: "active", updated: "2026-05-02", sold30d: 89  },
  { id: "SKU-1006", name: "Pane Naan 5 pz",                  nameEn: "Naan Bread 5 pcs",                 category: "Alimentari",  supplier: "Milano Ingrosso Alimentari",       location: "WH-01", stock: 24,  reorder: 10, price: 2.99, cost: 1.30, iva: 4,  unit: "pz", shelf: "A1",     expiry: "2026-05-09", status: "active", updated: "2026-05-03", sold30d: 52  },
  { id: "SKU-1007", name: "Farina 00 1kg",                   nameEn: "Plain Flour 00 1kg",               category: "Alimentari",  supplier: "Milano Ingrosso Alimentari",       location: "WH-01", stock: 48,  reorder: 20, price: 1.29, cost: 0.60, iva: 4,  unit: "pz", shelf: "A3",     expiry: null,         status: "active", updated: "2026-04-28", sold30d: 35  },
  // ── SPEZIE (IVA 4%) ──────────────────────────────────────────────────────
  { id: "SKU-1008", name: "Curcuma in Polvere 200g",         nameEn: "Turmeric Powder 200g",             category: "Spezie",      supplier: "Spezie del Mondo",                 location: "WH-01", stock: 30,  reorder: 12, price: 1.79, cost: 0.80, iva: 4,  unit: "pz", shelf: "C1",     expiry: null,         status: "active", updated: "2026-04-29", sold30d: 42  },
  { id: "SKU-1009", name: "Cumino in Polvere 100g",          nameEn: "Cumin Powder 100g",                category: "Spezie",      supplier: "Spezie del Mondo",                 location: "WH-01", stock: 25,  reorder: 10, price: 1.49, cost: 0.65, iva: 4,  unit: "pz", shelf: "C1",     expiry: null,         status: "active", updated: "2026-04-29", sold30d: 38  },
  { id: "SKU-1010", name: "Peperoncino Piccante 100g",       nameEn: "Hot Chilli Powder 100g",           category: "Spezie",      supplier: "Spezie del Mondo",                 location: "WH-01", stock: 7,   reorder: 10, price: 1.39, cost: 0.60, iva: 4,  unit: "pz", shelf: "C2",     expiry: null,         status: "active", updated: "2026-05-01", sold30d: 31  },
  { id: "SKU-1011", name: "Garam Masala 100g",               nameEn: "Garam Masala 100g",                category: "Spezie",      supplier: "Spezie del Mondo",                 location: "WH-01", stock: 18,  reorder: 8,  price: 1.89, cost: 0.85, iva: 4,  unit: "pz", shelf: "C2",     expiry: null,         status: "active", updated: "2026-04-27", sold30d: 29  },
  { id: "SKU-1012", name: "Olio di Senape 1lt",              nameEn: "Mustard Oil 1L",                   category: "Condimenti",  supplier: "Spezie del Mondo",                 location: "WH-01", stock: 14,  reorder: 6,  price: 5.49, cost: 3.20, iva: 10, unit: "pz", shelf: "C3",     expiry: null,         status: "active", updated: "2026-04-28", sold30d: 22  },
  // ── LATTICINI (IVA 4%) — frigo ───────────────────────────────────────────
  { id: "SKU-1013", name: "Yogurt Naturale Intero 1kg",      nameEn: "Plain Whole Yogurt 1kg",           category: "Latticini",   supplier: "Milano Ingrosso Alimentari",       location: "WH-03", stock: 12,  reorder: 8,  price: 2.19, cost: 1.10, iva: 4,  unit: "pz", shelf: "Frigo1", expiry: "2026-05-10", status: "active", updated: "2026-05-03", sold30d: 48  },
  { id: "SKU-1014", name: "Latte Intero 1lt",                nameEn: "Full Fat Milk 1L",                 category: "Latticini",   supplier: "Milano Ingrosso Alimentari",       location: "WH-03", stock: 24,  reorder: 12, price: 1.79, cost: 0.90, iva: 4,  unit: "pz", shelf: "Frigo1", expiry: "2026-05-12", status: "active", updated: "2026-05-03", sold30d: 78  },
  // ── BEVANDE ──────────────────────────────────────────────────────────────
  { id: "SKU-1015", name: "Acqua Minerale Naturale 1,5lt",   nameEn: "Still Mineral Water 1.5L",         category: "Bevande",     supplier: "Distribuzione Bibite Lombarda",    location: "WH-01", stock: 120, reorder: 40, price: 0.49, cost: 0.22, iva: 4,  unit: "pz", shelf: "D1",     expiry: null,         status: "active", updated: "2026-05-02", sold30d: 245 },
  { id: "SKU-1016", name: "Coca-Cola 1,5lt",                 nameEn: "Coca-Cola 1.5L",                   category: "Bevande",     supplier: "Distribuzione Bibite Lombarda",    location: "WH-01", stock: 48,  reorder: 20, price: 1.89, cost: 0.95, iva: 22, unit: "pz", shelf: "D2",     expiry: null,         status: "active", updated: "2026-05-02", sold30d: 134 },
  { id: "SKU-1017", name: "Pepsi Cola 1,5lt",                nameEn: "Pepsi Cola 1.5L",                  category: "Bevande",     supplier: "Distribuzione Bibite Lombarda",    location: "WH-01", stock: 36,  reorder: 15, price: 1.79, cost: 0.90, iva: 22, unit: "pz", shelf: "D2",     expiry: null,         status: "active", updated: "2026-05-01", sold30d: 98  },
  { id: "SKU-1018", name: "Succo d'Arancia Skipper 1lt",     nameEn: "Orange Juice Skipper 1L",          category: "Bevande",     supplier: "Distribuzione Bibite Lombarda",    location: "WH-01", stock: 42,  reorder: 15, price: 1.59, cost: 0.85, iva: 10, unit: "pz", shelf: "D3",     expiry: null,         status: "active", updated: "2026-04-30", sold30d: 78  },
  // ── SURGELATI (IVA 10%) — congelatore ────────────────────────────────────
  { id: "SKU-1019", name: "Pane Naan Surgelato 5 pz",        nameEn: "Frozen Naan Bread 5 pcs",          category: "Surgelati",   supplier: "Surgelati Express",                location: "WH-04", stock: 20,  reorder: 8,  price: 3.49, cost: 1.80, iva: 10, unit: "pz", shelf: "Gel1",   expiry: "2026-08-15", status: "active", updated: "2026-04-29", sold30d: 34  },
  { id: "SKU-1020", name: "Pollo Congelato 1kg",             nameEn: "Frozen Chicken 1kg",               category: "Surgelati",   supplier: "Surgelati Express",                location: "WH-04", stock: 0,   reorder: 6,  price: 6.99, cost: 3.50, iva: 10, unit: "pz", shelf: "Gel2",   expiry: "2026-07-20", status: "active", updated: "2026-05-03", sold30d: 28  },
  // ── SNACK (IVA 22%) ──────────────────────────────────────────────────────
  { id: "SKU-1021", name: "Biscotti Digestive McVitie's 400g", nameEn: "Digestive Biscuits 400g",        category: "Snack",       supplier: "Dolci & Snack Italia",             location: "WH-01", stock: 65,  reorder: 20, price: 1.99, cost: 0.95, iva: 22, unit: "pz", shelf: "E1",     expiry: null,         status: "active", updated: "2026-04-27", sold30d: 88  },
  { id: "SKU-1022", name: "Patatine Lay's BBQ 150g",         nameEn: "Lay's BBQ Crisps 150g",            category: "Snack",       supplier: "Dolci & Snack Italia",             location: "WH-01", stock: 44,  reorder: 18, price: 1.59, cost: 0.75, iva: 22, unit: "pz", shelf: "E2",     expiry: null,         status: "active", updated: "2026-04-28", sold30d: 72  },
  { id: "SKU-1023", name: "Cioccolata Kinder 50g",           nameEn: "Kinder Chocolate 50g",             category: "Snack",       supplier: "Dolci & Snack Italia",             location: "WH-01", stock: 88,  reorder: 30, price: 1.29, cost: 0.55, iva: 22, unit: "pz", shelf: "E3",     expiry: null,         status: "active", updated: "2026-04-26", sold30d: 145 },
  // ── CASA (IVA 22% / 4% igienica) ─────────────────────────────────────────
  { id: "SKU-1024", name: "Detersivo Piatti Fairy 500ml",    nameEn: "Fairy Dish Soap 500ml",            category: "Casa",        supplier: "Cash & Carry Metro",               location: "WH-02", stock: 52,  reorder: 18, price: 1.99, cost: 0.85, iva: 22, unit: "pz", shelf: "F1",     expiry: null,         status: "active", updated: "2026-04-29", sold30d: 64  },
  { id: "SKU-1025", name: "Carta Igienica Regina 4 Rotoli",  nameEn: "Toilet Paper Regina 4 Rolls",      category: "Casa",        supplier: "Cash & Carry Metro",               location: "WH-02", stock: 38,  reorder: 15, price: 2.49, cost: 1.10, iva: 4,  unit: "pz", shelf: "F2",     expiry: null,         status: "active", updated: "2026-04-28", sold30d: 54  },
  { id: "SKU-1026", name: "Sacchetti Spazzatura 30lt 10 pz", nameEn: "Bin Bags 30L 10 pcs",              category: "Casa",        supplier: "Cash & Carry Metro",               location: "WH-02", stock: 45,  reorder: 15, price: 1.79, cost: 0.80, iva: 22, unit: "pz", shelf: "F3",     expiry: null,         status: "active", updated: "2026-04-27", sold30d: 48  },
  // ── IGIENE (IVA 22%) ──────────────────────────────────────────────────────
  { id: "SKU-1027", name: "Sapone Liquido Mani 250ml",       nameEn: "Liquid Hand Soap 250ml",           category: "Igiene",      supplier: "Cash & Carry Metro",               location: "WH-02", stock: 28,  reorder: 10, price: 1.99, cost: 0.90, iva: 22, unit: "pz", shelf: "G1",     expiry: null,         status: "active", updated: "2026-04-30", sold30d: 38  },
  { id: "SKU-1028", name: "Shampoo Pantene 400ml",           nameEn: "Pantene Shampoo 400ml",            category: "Igiene",      supplier: "Cash & Carry Metro",               location: "WH-02", stock: 20,  reorder: 8,  price: 4.49, cost: 2.20, iva: 22, unit: "pz", shelf: "G2",     expiry: null,         status: "active", updated: "2026-04-26", sold30d: 22  },
  // ── TELEFONIA (IVA 22%) ───────────────────────────────────────────────────
  { id: "SKU-1029", name: "Ricarica Wind Tre €10",           nameEn: "Wind Tre Top-Up €10",              category: "Telefonia",   supplier: "Fortel Telecomunicazioni",         location: "WH-01", stock: 30,  reorder: 10, price: 10.00, cost: 9.50, iva: 22, unit: "pz", shelf: "Banco",  expiry: null,         status: "active", updated: "2026-05-01", sold30d: 56  },
  { id: "SKU-1030", name: "Cavo USB-C 1m",                   nameEn: "USB-C Cable 1m",                   category: "Telefonia",   supplier: "Fortel Telecomunicazioni",         location: "WH-01", stock: 20,  reorder: 8,  price: 5.99, cost: 2.50, iva: 22, unit: "pz", shelf: "Banco",  expiry: null,         status: "active", updated: "2026-04-25", sold30d: 22  },
];

export const SUPPLIERS = [
  { id: "SUP-01", name: "Milano Ingrosso Alimentari S.r.l.", contact: "Marco Rossetti",   email: "ordini@milanogrosso.it",     phone: "+39 02 2345 6789", whatsapp: "+39 347 1234 567", city: "Milano",            piva: "IT02345678901", products: 8, totalSpend: 3840, rating: 4.7, leadTime: "2–3 giorni",    lastOrder: "2026-04-30", paymentTerms: "30 giorni" },
  { id: "SUP-02", name: "Casa del Riso Vercelli",            contact: "Giulia Ferrari",   email: "giulia@casadelriso.it",      phone: "+39 0161 98 7654", whatsapp: "+39 335 9876 543", city: "Vercelli",          piva: "IT09876543210", products: 1, totalSpend: 864,  rating: 4.9, leadTime: "3–4 giorni",    lastOrder: "2026-04-28", paymentTerms: "Contanti alla consegna" },
  { id: "SUP-03", name: "Spezie del Mondo Import S.r.l.",    contact: "Priya Singh",      email: "info@speziedelmondo.it",     phone: "+39 051 3456 789", whatsapp: "+39 392 3456 789", city: "Bologna",           piva: "IT05432167890", products: 5, totalSpend: 1140, rating: 4.8, leadTime: "4–5 giorni",    lastOrder: "2026-04-29", paymentTerms: "15 giorni" },
  { id: "SUP-04", name: "Distribuzione Bibite Lombarda S.r.l.", contact: "Luigi Colombo",email: "l.colombo@bibitech.it",      phone: "+39 02 9876 5432", whatsapp: "+39 333 8765 432", city: "Sesto S. Giovanni", piva: "IT07654321098", products: 4, totalSpend: 2280, rating: 4.6, leadTime: "2 giorni",      lastOrder: "2026-05-01", paymentTerms: "30 giorni" },
  { id: "SUP-05", name: "Cash & Carry Metro",                contact: "Self-service",     email: "metro.sesto@metro.it",       phone: "+39 02 2487 1000", whatsapp: "",                 city: "Sesto S. Giovanni", piva: "IT01234567890", products: 5, totalSpend: 1920, rating: 4.5, leadTime: "stesso giorno", lastOrder: "2026-05-02", paymentTerms: "Pagamento in cassa" },
  { id: "SUP-06", name: "Fortel Telecomunicazioni",          contact: "Andrea Bianchi",   email: "a.bianchi@fortel.it",        phone: "+39 02 4567 8901", whatsapp: "+39 345 6789 012", city: "Milano",            piva: "IT03456789012", products: 2, totalSpend: 570,  rating: 4.4, leadTime: "1 giorno",      lastOrder: "2026-04-27", paymentTerms: "Prepagato" },
  { id: "SUP-07", name: "Surgelati Express S.r.l.",          contact: "Franco Martini",   email: "franco@surgelatiexpress.it", phone: "+39 011 2345 678", whatsapp: "+39 348 2345 678", city: "Torino",            piva: "IT08765432109", products: 2, totalSpend: 630,  rating: 4.6, leadTime: "2–3 giorni",    lastOrder: "2026-04-26", paymentTerms: "15 giorni" },
  { id: "SUP-08", name: "Dolci & Snack Italia S.p.A.",       contact: "Sofia Gentile",    email: "sofia@dolcisnack.it",        phone: "+39 0521 456 789", whatsapp: "+39 349 4567 890", city: "Parma",             piva: "IT06543210987", products: 3, totalSpend: 1260, rating: 4.7, leadTime: "3–4 giorni",    lastOrder: "2026-04-25", paymentTerms: "30 giorni" },
];

export const LOCATIONS = [
  { id: "WH-01", name: "Scaffali Principali",  nameEn: "Main Shelves",         city: "Milano", address: "Via Padova 104", capacity: 5000, used: 3280, products: 18, value: 2840, manager: "Rahman Ali", type: "scaffale"    },
  { id: "WH-02", name: "Magazzino Retro",       nameEn: "Back Storage",         city: "Milano", address: "Via Padova 104", capacity: 3000, used: 1820, products: 8,  value: 1640, manager: "Rahman Ali", type: "magazzino"   },
  { id: "WH-03", name: "Banco Frigo",           nameEn: "Refrigerated Counter", city: "Milano", address: "Via Padova 104", capacity: 500,  used: 360,  products: 2,  value: 285,  manager: "Rahman Ali", type: "frigo"       },
  { id: "WH-04", name: "Congelatore",           nameEn: "Freezer",              city: "Milano", address: "Via Padova 104", capacity: 300,  used: 188,  products: 2,  value: 420,  manager: "Rahman Ali", type: "congelatore" },
];

export const MOVEMENTS = [
  { id: "MV-0015", type: "in",      sku: "SKU-1001", product: "Riso Basmati Extra Lungo 1kg",      qty: 60, ref: "DDT-CdR-0503",  location: "WH-02", user: "Rahman A.", time: "2026-05-03 09:15" },
  { id: "MV-0014", type: "out",     sku: "SKU-1015", product: "Acqua Minerale Naturale 1,5lt",     qty: 48, ref: "VEND-0503",     location: "WH-01", user: "sistema",   time: "2026-05-03 08:40" },
  { id: "MV-0013", type: "out",     sku: "SKU-1016", product: "Coca-Cola 1,5lt",                   qty: 24, ref: "VEND-0503",     location: "WH-01", user: "sistema",   time: "2026-05-02 17:22" },
  { id: "MV-0012", type: "scaduto", sku: "SKU-1013", product: "Yogurt Naturale Intero 1kg",        qty: 3,  ref: "SCAD-0502",     location: "WH-03", user: "Rahman A.", time: "2026-05-02 14:10" },
  { id: "MV-0011", type: "in",      sku: "SKU-1008", product: "Curcuma in Polvere 200g",           qty: 30, ref: "DDT-SDM-0429",  location: "WH-01", user: "Rahman A.", time: "2026-05-02 11:30" },
  { id: "MV-0010", type: "out",     sku: "SKU-1023", product: "Cioccolata Kinder 50g",             qty: 22, ref: "VEND-0502",     location: "WH-01", user: "sistema",   time: "2026-05-02 09:55" },
  { id: "MV-0009", type: "in",      sku: "SKU-1019", product: "Pane Naan Surgelato 5 pz",          qty: 20, ref: "DDT-SUR-0429",  location: "WH-04", user: "Rahman A.", time: "2026-05-01 16:45" },
  { id: "MV-0008", type: "adjust",  sku: "SKU-1022", product: "Patatine Lay's BBQ 150g",           qty: -3, ref: "RETT-0501",     location: "WH-01", user: "Rahman A.", time: "2026-05-01 14:20" },
  { id: "MV-0007", type: "out",     sku: "SKU-1005", product: "Pasta Penne Rigate 500g",           qty: 18, ref: "VEND-0501",     location: "WH-01", user: "sistema",   time: "2026-05-01 11:05" },
  { id: "MV-0006", type: "in",      sku: "SKU-1003", product: "Lenticchie Rosse 1kg",              qty: 40, ref: "DDT-MIA-0428",  location: "WH-02", user: "Rahman A.", time: "2026-04-30 10:00" },
  { id: "MV-0005", type: "out",     sku: "SKU-1029", product: "Ricarica Wind Tre €10",             qty: 12, ref: "VEND-0430",     location: "WH-01", user: "sistema",   time: "2026-04-30 09:30" },
  { id: "MV-0004", type: "in",      sku: "SKU-1015", product: "Acqua Minerale Naturale 1,5lt",     qty: 96, ref: "DDT-DBL-0429",  location: "WH-01", user: "Rahman A.", time: "2026-04-29 15:00" },
  { id: "MV-0003", type: "out",     sku: "SKU-1021", product: "Biscotti Digestive McVitie's 400g", qty: 15, ref: "VEND-0429",     location: "WH-01", user: "sistema",   time: "2026-04-29 12:30" },
  { id: "MV-0002", type: "scaduto", sku: "SKU-1014", product: "Latte Intero 1lt",                  qty: 2,  ref: "SCAD-0428",     location: "WH-03", user: "Rahman A.", time: "2026-04-28 08:00" },
  { id: "MV-0001", type: "in",      sku: "SKU-1020", product: "Pollo Congelato 1kg",               qty: 10, ref: "DDT-SUR-0428",  location: "WH-04", user: "Rahman A.", time: "2026-04-28 07:45" },
];

export const PURCHASE_ORDERS = [
  { id: "OA-2026-008", supplier: "Milano Ingrosso Alimentari S.r.l.",    items: 5, total: 142.80, status: "ricevuto",    created: "2026-04-28", expected: "2026-04-30" },
  { id: "OA-2026-007", supplier: "Casa del Riso Vercelli",               items: 2, total: 72.00,  status: "ricevuto",    created: "2026-04-27", expected: "2026-04-30" },
  { id: "OA-2026-006", supplier: "Spezie del Mondo Import S.r.l.",       items: 5, total: 38.50,  status: "ricevuto",    created: "2026-04-26", expected: "2026-04-29" },
  { id: "OA-2026-005", supplier: "Distribuzione Bibite Lombarda S.r.l.", items: 4, total: 198.40, status: "in transito", created: "2026-05-01", expected: "2026-05-05" },
  { id: "OA-2026-004", supplier: "Cash & Carry Metro",                   items: 8, total: 284.60, status: "in transito", created: "2026-04-30", expected: "2026-05-04" },
  { id: "OA-2026-003", supplier: "Fortel Telecomunicazioni",             items: 2, total: 190.00, status: "in attesa",   created: "2026-05-02", expected: "2026-05-06" },
  { id: "OA-2026-002", supplier: "Surgelati Express S.r.l.",             items: 3, total: 87.50,  status: "bozza",       created: "2026-05-03", expected: "—"          },
  { id: "OA-2026-001", supplier: "Dolci & Snack Italia S.p.A.",          items: 3, total: 64.80,  status: "in attesa",   created: "2026-05-02", expected: "2026-05-07" },
];

// ── Vendite (Sales) — with product line items ─────────────────────────────────
export const VENDITE = [
  {
    id: "VEN-0052", customer: "—", channel: "Contante", status: "completata", date: "2026-05-03", note: "",
    lines: [
      { sku: "SKU-1001", product: "Riso Basmati Extra Lungo 1kg",  qty: 5, unit: "pz", unitPrice: 2.49, iva: 4,  lineTotal: 12.45 },
      { sku: "SKU-1015", product: "Acqua Minerale Naturale 1,5lt", qty: 6, unit: "pz", unitPrice: 0.49, iva: 4,  lineTotal: 2.94  },
      { sku: "SKU-1023", product: "Cioccolata Kinder 50g",         qty: 3, unit: "pz", unitPrice: 1.29, iva: 22, lineTotal: 3.87  },
      { sku: "SKU-1008", product: "Curcuma in Polvere 200g",       qty: 2, unit: "pz", unitPrice: 1.79, iva: 4,  lineTotal: 3.58  },
    ],
    total: 22.84,
  },
  {
    id: "VEN-0051", customer: "—", channel: "POS/Carta", status: "completata", date: "2026-05-03", note: "",
    lines: [
      { sku: "SKU-1005", product: "Pasta Penne Rigate 500g",  qty: 3, unit: "pz", unitPrice: 1.19, iva: 4,  lineTotal: 3.57 },
      { sku: "SKU-1014", product: "Latte Intero 1lt",         qty: 2, unit: "pz", unitPrice: 1.79, iva: 4,  lineTotal: 3.58 },
      { sku: "SKU-1016", product: "Coca-Cola 1,5lt",          qty: 2, unit: "pz", unitPrice: 1.89, iva: 22, lineTotal: 3.78 },
      { sku: "SKU-1021", product: "Biscotti Digestive McVitie's 400g", qty: 2, unit: "pz", unitPrice: 1.99, iva: 22, lineTotal: 3.98 },
    ],
    total: 14.91,
  },
  {
    id: "VEN-0050", customer: "—", channel: "Contante", status: "completata", date: "2026-05-02", note: "",
    lines: [
      { sku: "SKU-1007", product: "Farina 00 1kg",             qty: 2, unit: "pz", unitPrice: 1.29, iva: 4,  lineTotal: 2.58 },
      { sku: "SKU-1013", product: "Yogurt Naturale Intero 1kg",qty: 1, unit: "pz", unitPrice: 2.19, iva: 4,  lineTotal: 2.19 },
      { sku: "SKU-1027", product: "Sapone Liquido Mani 250ml", qty: 1, unit: "pz", unitPrice: 1.99, iva: 22, lineTotal: 1.99 },
      { sku: "SKU-1022", product: "Patatine Lay's BBQ 150g",   qty: 2, unit: "pz", unitPrice: 1.59, iva: 22, lineTotal: 3.18 },
    ],
    total: 9.94,
  },
  {
    id: "VEN-0049", customer: "Ricariche giornaliere", channel: "Contante", status: "completata", date: "2026-05-02", note: "",
    lines: [
      { sku: "SKU-1029", product: "Ricarica Wind Tre €10", qty: 4, unit: "pz", unitPrice: 10.00, iva: 22, lineTotal: 40.00 },
    ],
    total: 40.00,
  },
  {
    id: "VEN-0048", customer: "—", channel: "POS/Carta", status: "completata", date: "2026-05-01", note: "",
    lines: [
      { sku: "SKU-1001", product: "Riso Basmati Extra Lungo 1kg",  qty: 3, unit: "pz", unitPrice: 2.49, iva: 4,  lineTotal: 7.47 },
      { sku: "SKU-1003", product: "Lenticchie Rosse 1kg",          qty: 2, unit: "pz", unitPrice: 2.29, iva: 4,  lineTotal: 4.58 },
      { sku: "SKU-1015", product: "Acqua Minerale Naturale 1,5lt", qty: 6, unit: "pz", unitPrice: 0.49, iva: 4,  lineTotal: 2.94 },
      { sku: "SKU-1012", product: "Olio di Senape 1lt",            qty: 1, unit: "pz", unitPrice: 5.49, iva: 10, lineTotal: 5.49 },
      { sku: "SKU-1023", product: "Cioccolata Kinder 50g",         qty: 2, unit: "pz", unitPrice: 1.29, iva: 22, lineTotal: 2.58 },
    ],
    total: 23.06,
  },
  {
    id: "VEN-0047", customer: "Anwar (WhatsApp)", channel: "Bonifico", status: "completata", date: "2026-05-01", note: "Ordine via WhatsApp — consegnato a domicilio",
    lines: [
      { sku: "SKU-1001", product: "Riso Basmati Extra Lungo 1kg", qty: 5, unit: "pz", unitPrice: 2.49, iva: 4, lineTotal: 12.45 },
      { sku: "SKU-1003", product: "Lenticchie Rosse 1kg",         qty: 2, unit: "pz", unitPrice: 2.29, iva: 4, lineTotal: 4.58  },
      { sku: "SKU-1008", product: "Curcuma in Polvere 200g",      qty: 2, unit: "pz", unitPrice: 1.79, iva: 4, lineTotal: 3.58  },
      { sku: "SKU-1011", product: "Garam Masala 100g",            qty: 1, unit: "pz", unitPrice: 1.89, iva: 4, lineTotal: 1.89  },
    ],
    total: 22.50,
  },
  {
    id: "VEN-0046", customer: "—", channel: "Contante", status: "completata", date: "2026-04-30", note: "",
    lines: [
      { sku: "SKU-1006", product: "Pane Naan 5 pz",                      qty: 2, unit: "pz", unitPrice: 2.99, iva: 4,  lineTotal: 5.98 },
      { sku: "SKU-1016", product: "Coca-Cola 1,5lt",                      qty: 2, unit: "pz", unitPrice: 1.89, iva: 22, lineTotal: 3.78 },
      { sku: "SKU-1021", product: "Biscotti Digestive McVitie's 400g",    qty: 2, unit: "pz", unitPrice: 1.99, iva: 22, lineTotal: 3.98 },
      { sku: "SKU-1025", product: "Carta Igienica Regina 4 Rotoli",       qty: 1, unit: "pz", unitPrice: 2.49, iva: 4,  lineTotal: 2.49 },
    ],
    total: 16.23,
  },
  {
    id: "VEN-0045", customer: "Fatima (WhatsApp)", channel: "Contante", status: "completata", date: "2026-04-30", note: "Spezie mensili",
    lines: [
      { sku: "SKU-1002", product: "Farina di Ceci 500g",      qty: 2, unit: "pz", unitPrice: 1.79, iva: 4, lineTotal: 3.58 },
      { sku: "SKU-1008", product: "Curcuma in Polvere 200g",  qty: 1, unit: "pz", unitPrice: 1.79, iva: 4, lineTotal: 1.79 },
      { sku: "SKU-1009", product: "Cumino in Polvere 100g",   qty: 1, unit: "pz", unitPrice: 1.49, iva: 4, lineTotal: 1.49 },
      { sku: "SKU-1013", product: "Yogurt Naturale Intero 1kg",qty: 1, unit: "pz", unitPrice: 2.19, iva: 4, lineTotal: 2.19 },
    ],
    total: 9.05,
  },
];

export const STOCK_TREND = [
  { day: "29 Apr", entrate: 180, uscite: 145 },
  { day: "30 Apr", entrate: 240, uscite: 198 },
  { day: "1 Mag",  entrate: 120, uscite: 167 },
  { day: "2 Mag",  entrate: 310, uscite: 245 },
  { day: "3 Mag",  entrate:  90, uscite: 134 },
  { day: "4 Mag",  entrate: 180, uscite: 156 },
  { day: "5 Mag",  entrate: 210, uscite: 188 },
];

export const REVENUE_TREND = [
  { month: "Dic", ricavi: 7820, costi: 3910 },
  { month: "Gen", ricavi: 6840, costi: 3420 },
  { month: "Feb", ricavi: 7260, costi: 3630 },
  { month: "Mar", ricavi: 8440, costi: 4220 },
  { month: "Apr", ricavi: 9180, costi: 4590 },
  { month: "Mag", ricavi: 3680, costi: 1840 },
];

export const CATEGORY_BREAKDOWN = [
  { name: "Alimentari",  nameEn: "Groceries", value: 7,  fill: "#1a1a1a" },
  { name: "Bevande",     nameEn: "Beverages", value: 4,  fill: "#d4a437" },
  { name: "Snack",       nameEn: "Snacks",    value: 3,  fill: "#6b5d4f" },
  { name: "Casa/Igiene", nameEn: "Household", value: 5,  fill: "#a89178" },
  { name: "Telefonia",   nameEn: "Telecom",   value: 2,  fill: "#3a3530" },
  { name: "Spezie",      nameEn: "Spices",    value: 5,  fill: "#8c8378" },
  { name: "Surgelati",   nameEn: "Frozen",    value: 2,  fill: "#c4b89a" },
  { name: "Latticini",   nameEn: "Dairy",     value: 2,  fill: "#e8ddc8" },
];

export const PRODUCT_CATEGORIES = [
  "Alimentari", "Spezie", "Condimenti", "Latticini",
  "Bevande", "Surgelati", "Snack", "Casa", "Igiene", "Telefonia",
];

export const IVA_OPTIONS = [4, 10, 22];

// ── Italian payment channels ────────────────────────────────────────────────
// Contante: cash | POS/Carta: card via Nexi/SumUp | Buoni Pasto: meal vouchers (Edenred/Pluxee)
// Satispay: popular Italian mobile payment | Bonifico: bank transfer
export const PAYMENT_CHANNELS = [
  { id: "Contante",    it: "Contante",     en: "Cash",           color: "bg-emerald-50 text-emerald-800 border-emerald-300"  },
  { id: "POS/Carta",   it: "POS / Carta",  en: "Card (POS)",     color: "bg-sky-50 text-sky-800 border-sky-300"             },
  { id: "Buoni Pasto", it: "Buoni Pasto",  en: "Meal Vouchers",  color: "bg-purple-50 text-purple-800 border-purple-300"    },
  { id: "Satispay",    it: "Satispay",     en: "Satispay",       color: "bg-rose-50 text-rose-800 border-rose-300"          },
  { id: "Bonifico",    it: "Bonifico",     en: "Bank Transfer",  color: "bg-amber-50 text-amber-800 border-amber-300"       },
];
