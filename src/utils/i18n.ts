export type Language = 'am' | 'en';

export const translations = {
  am: {
    // Brand & Header
    appName: 'ሄቪኢክዊፕ',
    appSub: 'የከባድ ማሽነሪዎች መለዋወጫ መደብር እና ክምችት',
    brandTag: 'የከባድ ማሽነሪዎች መለዋወጫ',

    // Navigation
    navOverview: 'አጠቃላይ እይታ',
    navCatalog: 'የመለዋወጫ ካታሎግ',
    navSales: 'የመደብር ሽያጭ እና POS',
    navLedger: 'የእንቅስቃሴ መዝገብ',
    navPOs: 'የግዢ ትዕዛዞች (PO)',
    navBinMap: 'የመጋዘን እና ያርድ ካርታ',

    // Top Bar Actions
    btnNewSale: '+ አዲስ ሽያጭ (POS)',
    btnNewPart: '+ አዲስ ዕቃ መዝግብ',
    btnReceive: '+ ዕቃ ተቀበል',
    btnIssue: '- ዕቃ አውጣ',
    btnExportCSV: 'በ CSV አውርድ',
    btnPrint: 'አትም',
    btnResetData: 'ናሙና መረጃዎችን መልስ',

    // Operator roles
    activeOperator: 'ተረኛ ሠራተኛ',
    roleManager: 'የመለዋወጫ መደብር ሥራ አስኪያጅ',
    roleSpecialist: 'የቴክኒክ እና ፍሊት ስፔሻሊስት',
    roleSales: 'የካውንተር ሽያጭ ስፔሻሊስት',

    // Breadcrumbs
    dealershipLocation: 'የከባድ ማሽነሪዎች ሽያጭ እና መለዋወጫ መደብር',
    facilityStatus: 'የመደብር ሁኔታ: ዋና መጋዘን እና ያርድ ክፍት ነው',

    // Overview Stats
    statStoreRevenue: 'የመደብር ጠቅላላ ገቢ',
    statOrdersFulfilled: 'የተጠናቀቁ ሽያጮች',
    statSalesProfit: 'የሽያጭ ትርፍ',
    statGrossMargin: 'አጠቃላይ የተጣራ ትርፍ',
    statStockUnits: 'በክምችት ያለ ብዛት',
    statAcrossSKUs: 'በአጠቃላይ የመለዋወጫ ዓይነቶች',
    statInventoryValue: 'የክምችት የችርቻሮ ዋጋ',
    statCostValue: 'የግዢ ዋጋ',
    statCriticalShortages: 'አስቸኳይ እጥረት',
    statBelowMinimum: 'ከደህንነት መጠን በታች',
    statReorderAlert: 'ዳግም ማዘዣ ደርሷል',
    statAtROP: 'ወደ ማዘዣ ወለል የቀረበ',
    statReceivables: 'ያልተሰበሰበ ብድር (Net 30)',
    statCommercialCredit: 'የኮንትራክተሮች የብድር ሂሳብ',

    // Shortage Alert
    alertCriticalShortage: 'የከባድ ማሽነሪ መለዋወጫዎች እጥረት ማስጠንቀቂያ',
    alertShortageSub: 'ወሳኝ የማሽነሪ ክፍሎች (ፓምፕ፣ ኢንጄክተር፣ ሰንሰለት) ከደህንነት መጠን በታች ናቸው። የደንበኞች ማሽኖች እንዳይቆሙ ዳግም ይዘዙ።',
    btnDraftPO: 'የአቅራቢ የግዢ ትዕዛዝ አዘጋጅ',
    partNumber: 'የዕቃ ቁጥር (Part #)',
    brandAndDesc: 'ብራንድ እና ዝርዝር መግለጫ',
    supportedMachinery: 'የሚስማማቸው ማሽነሪዎች',
    inStock: 'በክምችት ያለ',
    safetyMin: 'ዝቅተኛ የደህንነት መጠን',
    action: 'ድርጊት',

    // Recent Activity
    recentActivity: 'የቅርብ ጊዜ የመደብር ሽያጮች እና የክምችት እንቅስቃሴ',
    recentActivitySub: 'በቀጥታ የተመዘገበ የደንበኞች ሽያጭ እና የዕቃዎች ገቢ ዝርዝር',
    viewFullLedger: 'ሙሉውን መዝገብ ተመልከት',

    // Quick POS / Store ops
    counterPOSOps: 'የካውንተር ሽያጭ እና ፈጣን ስራዎች',
    counterPOSSub: 'ሽያጭ ያከናውኑ ወይም አዲስ የገቡ ዕቃዎችን ይመዝግቡ',
    btnCreateSaleInvoice: '+ የደንበኛ ሽያጭ እና ደረሰኝ አውጣ',
    btnReceiveStock: '+ የገቡ ዕቃዎችን ተቀበል',
    btnReceiveSub: 'የአቅራቢዎች ርክክብ',
    btnWorkshopIssue: '- ለወርክሾፕ አውጣ',
    btnWorkshopSub: 'የውስጥ ጥገና አገልግሎት',
    btnCycleCount: '± የክምችት ቆጠራ ማስተካከያ',
    btnCycleSub: 'የመጋዘን ቆጠራ ልዩነት',
    btnSalesReports: 'የሽያጭ ሪፖርቶች',
    btnSalesReportsSub: 'ደረሰኞች እና ቀሪ ሂሳቦች',

    // Machinery Coverage
    supportedMachineryTitle: 'የሚደገፉ የከባድ ማሽነሪ ዓይነቶች',
    supportedMachinerySub: 'በመደብሩ ውስጥ ያሉ መለዋወጫዎች በማሽነሪ ብራንድ',
    applicationsCompatible: 'የሚስማማቸው አጠቃቀሞች',

    // Catalog & Filters
    searchPlaceholder: 'በዕቃ ቁጥር (1R-0716)፣ በማሽነሪ ሞዴል (336D)፣ በብራንድ፣ በቢን ፈልግ...',
    filterMake: 'የማሽነሪው ብራንድ / አምራች',
    allMakes: 'ሁሉም የማሽነሪ ብራንዶች',
    filterCategory: 'የመለዋወጫ ዓይነት / ሲስተም',
    allCategories: 'ሁሉም የመለዋወጫ ዓይነቶች',
    filterStockStatus: 'የክምችት ደረጃ',
    allStockLevels: 'ሁሉም የክምችት ደረጃዎች',
    statusCritical: 'አስቸኳይ እጥረት (< ዝቅተኛ)',
    statusLow: 'ማዘዣ ደርሷል (≤ ROP)',
    statusNominal: 'በቂ ክምችት',
    statusOverstocked: 'ከመጠን በላይ ክምችት',
    showingCatalog: 'የሚታዩት',
    ofCatalog: 'ከ',
    machinerySpareParts: 'የከባድ ማሽነሪ መለዋወጫዎች',
    resetFilters: 'ማጣሪያዎችን አጥፋ',
    catalogRetailValue: 'የካታሎጉ የችርቻሮ ክምችት ዋጋ',

    // Table Headers
    colPartNumber: 'የዕቃ ቁጥር / ብራንድ',
    colDescription: 'ዝርዝር መግለጫ',
    colCompatibleVehicles: 'የሚስማማቸው ማሽኖች',
    colLocation: 'የመጋዘን ቦታ (Bin)',
    colInStock: 'በክምችት',
    colWholesale: 'የጅምላ ዋጋ',
    colRetail: 'የችርቻሮ ዋጋ',
    colUnitCost: 'የግዢ ዋጋ',
    colCounterActions: 'የካውንተር ድርጊቶች',
    btnSell: 'ሽጥ',
    btnEdit: 'አስተካክል',
    btnDelete: 'ሰርዝ',
    weight: 'ክብደት',

    // POS & Invoicing Modal
    posTitle: 'የከባድ ማሽነሪ መለዋወጫዎች መደብር — የካውንተር ሽያጭ እና ደረሰኝ',
    posSub: 'የደንበኛ ትዕዛዝ ያጠናቁ፣ የጅምላ ወይም የችርቻሮ ዋጋ ይምረጡ፣ ከክምችት ቀንሰው ደረሰኝ ያትሙ',
    fieldCustomerAccount: 'ደንበኛ / የፍሊት አካውንት',
    fieldMachineryVehicle: 'የማሽኑ ሞዴል / የሰሌዳ ወይም ሴሪያል ቁጥር',
    requiredForWarranty: 'ለዋስትና እና ተስማሚነት ያስፈልጋል',
    pricingTier: 'የዋጋ ደረጃ:',
    tierWholesale: 'የጅምላ (Wholesale)',
    tierRetail: 'የችርቻሮ (Retail)',
    orderLines: 'የታዘዙ መለዋወጫዎች ዝርዝር',
    btnAddPartLine: '+ ተጨማሪ ዕቃ ጨምር',
    selectPart: 'መለዋወጫ ይምረጡ',
    quantity: 'ብዛት',
    unitPrice: 'የአንዱ ዋጋ',
    subtotal: 'ንዑስ ድምር',
    paymentMethod: 'የክፍያ ዘዴ',
    payFleetCredit: 'የፍሊት ብድር (Net 30 Commercial Credit)',
    payCard: 'ክሬዲት / ዴቢት ካርድ',
    payWire: 'በባንክ ዝውውር / ሐዋላ',
    payCash: 'በጥሬ ገንዘብ (ካውንተር)',
    invoiceStatus: 'የደረሰኝ ሁኔታ',
    statusPaid: 'ተከፍሏል (Paid)',
    statusPendingNet30: 'በመጠባበቅ ላይ (Net 30)',
    statusQuote: 'የዋጋ ማቅረቢያ (Quote/Estimate)',
    discountPercent: 'ቅናሽ (%)',
    deliveryNotes: 'የማስረከቢያ / የሥራ ትዕዛዝ ማስታወሻ',
    salesTax: 'የሽያጭ ታክስ / ቫት (5%):',
    grandTotal: 'አጠቃላይ ድምር:',
    storeGrossMargin: 'የመደብሩ ጠቅላላ ትርፍ:',
    btnProcessSale: 'ሽያጩን አጽድቅ እና ዕቃውን አስረክብ',
    cashier: 'አስተናጋጅ / ካሸር',
    cancel: 'ይቅር',
    close: 'ዝጋ',

    // Printable Invoice
    companyName: 'ሄቪኢክዊፕ የከባድ ማሽነሪ መለዋወጫዎች አቅራቢ',
    companySubtitle: 'የከባድ ማሽነሪዎች መለዋወጫ · Caterpillar፣ Komatsu፣ Volvo፣ Hitachi',
    companyPhone: 'ስልክ: +251 11 555 8899 / +1 (800) 555-MRO · sales@heavyequip.et',
    invoiceVoucher: 'የሽያጭ እና ማስረከቢያ ደረሰኝ',
    date: 'ቀን',
    customerAccount: 'የደንበኛ መለያ:',
    targetVehicle: 'የታሰበለት ማሽነሪ:',
    btnPrintInvoice: 'ደረሰኙን አትም',

    // PO & Restock
    poTitle: 'ዳግም ማዘዣ እና የግዢ ትዕዛዞች (Purchase Orders)',
    poSub: 'ከዝቅተኛ የደህንነት መጠን በታች ለወረዱ መለዋወጫዎች የተዘጋጁ የግዢ ትዕዛዞች',
    btnAutoDraftPO: 'በራስ-ሰር የግዢ ትዕዛዝ አዘጋጅ',
    btnReceiveDelivery: 'ርክክብ ፈጽም (ዕቃ አስገባ)',
    receivedDelivery: 'ተረክቧል',
    pendingReceipt: 'በጉዞ ላይ ያለ',
    supplier: 'አቅራቢ',
    expectedETA: 'የሚደርስበት ቀን',
    totalPOValue: 'የግዢው ጠቅላላ ዋጋ',

    // Bin & Yard Map
    yardMapTitle: 'የመጋዘን እና የያርድ ክምችት ካርታ',
    yardMapSub: 'መለዋወጫዎች ያሉበትን የመጋዘን ክፍል፣ ረድፍ (Aisle) እና ቢን በቀላሉ መመልከቻ',
    facility: 'መጋዘን / ያርድ:',
    aisles: 'ረድፎች (Aisles):',
    aisle: 'ረድፍ',
    rack: 'መደርደሪያ (Rack)',
    shelf: 'ደረጃ (Shelf)',
    bin: 'ሳጥን / ቢን (Bin)',
    fullSpecs: 'ሙሉ መረጃ',

    // Part Detail Modal
    partSpecsTitle: 'የመለዋወጫው ሙሉ ዝርዝር መረጃ',
    crossRefOEM: 'ተለዋዋጭ OEM ኮድ:',
    retailSellingPrice: 'የችርቻሮ መሸጫ ዋጋ',
    wholesaleFleetPrice: 'የጅምላ / የድርጅት ዋጋ',
    storePurchaseCost: 'የመደብሩ መግዣ ዋጋ',
    stockOnHand: 'በመጋዘን ያለ',
    availableForSale: 'ለሽያጭ ዝግጁ',
    margin: 'ትርፍ',
    fitsMachineryVehicles: 'የሚገጥምላቸው የከባድ ማሽነሪ ዓይነቶች',
    technicalDescription: 'ቴክኒካዊ መግለጫ',
    storageAndHandling: 'የአያያዝ እና የአቀማመጥ መመሪያ',
    storageLocation: 'የተቀመጠበት ቦታ',
    weightAndLogistics: 'ክብደት እና የሎጂስቲክስ መረጃ',
    leadTime: 'የማስረከቢያ ጊዜ (ቀናት)',
    movementHistory: 'የዕቃው እንቅስቃሴ ታሪክ',
    btnSellAtPOS: 'በካውንተር POS ሽጥ',

    // Add / Edit Modal
    addNewPartTitle: 'አዲስ የከባድ ማሽነሪ መለዋወጫ መዝግብ',
    editPartTitle: 'የመለዋወጫውን መረጃ አስተካክል',
    addPartSub: 'የማሽኑን ተስማሚነት፣ የችርቻሮ እና የጅምላ መሸጫ ዋጋ እና የመጋዘን ቦታ ያስገቡ',
    fieldPartNumber: 'የዕቃ ቁጥር / SKU',
    fieldName: 'የመለዋወጫው መጠሪያ ስም',
    fieldBrand: 'ብራንድ / አምራች',
    fieldOEM: 'የአምራች OEM ቁጥር',
    fieldCategory: 'የመለዋወጫ ክፍል',
    fieldWeight: 'ክብደት በኪሎግራም (ኪ.ግ)',
    fieldUnitCost: 'የመግዣ ዋጋ (ብር)',
    fieldWholesalePrice: 'የጅምላ ዋጋ (ብር)',
    fieldSellingPrice: 'የችርቻሮ መሸጫ ዋጋ (ብር)',
    fieldInitialStock: 'የመጀመሪያ ክምችት ብዛት',
    fieldROP: 'የዳግም ማዘዣ ወለል (ROP)',
    fieldWarehouse: 'መጋዘን',
    fieldAisle: 'ረድፍ (Aisle)',
    fieldRack: 'መደርደሪያ (Rack)',
    fieldBin: 'ቢን (Bin)',
    btnSavePart: 'መለዋወጫውን መዝግብ',
    btnUpdatePart: 'መረጃውን አድስ',

    // Movement Ledger
    ledgerTitle: 'የመለዋወጫዎች እንቅስቃሴ እና የኦዲት መዝገብ',
    ledgerSub: 'የእያንዳንዱ መለዋወጫ የገቢ፣ የወጪ፣ የሽያጭ እና የቆጠራ ማስተካከያ ሙሉ ታሪክ',
    filterByType: 'በእንቅስቃሴ ዓይነት ለይ:',
    txAll: 'ሁሉም እንቅስቃሴዎች',
    txSales: 'የመደብር ሽያጮች (ደረሰኞች)',
    txReceipts: 'የገቡ ዕቃዎች ርክክብ (PO)',
    txIssues: 'የወርክሾፕ ወጪዎች',
    txAdjustments: 'የክምችት ቆጠራ ማስተካከያዎች',
    exportLedgerCSV: 'የእንቅስቃሴ መዝገብ (CSV)',
    colTimestamp: 'ቀን እና ሰዓት',
    colType: 'ዓይነት',
    colPartNumName: 'የዕቃ ቁጥር እና ስም',
    colRefNum: 'የማመሳከሪያ ቁጥር',
    colMachineryWO: 'ማሽነሪ / የሥራ ትዕዛዝ',
    colQtyChanged: 'የተለወጠ ብዛት',
    colBalance: 'ቀሪ ክምችት',
    colOperatorNotes: 'ፈጻሚ እና ማስታወሻ',
    noMovementsFound: 'ምንም የተመዘገበ የዕቃ እንቅስቃሴ አልተገኘም',
    noMovementsSub: 'የፍለጋ ቃሉን ይቀይሩ ወይም አዲስ የዕቃ ገቢ/ወጪ ይመዝግቡ።',
    searchLedgerPlaceholder: 'በዕቃ #፣ በማመሳከሪያ (PO/WO)፣ በሠራተኛ፣ በምክንያት ፈልግ...',
    prevBalance: 'ቀደምት',
    nowBalance: 'አሁን',

    // Currency symbol
    currencySymbol: 'ብር',
  },
  en: {
    appName: 'HeavyEquip',
    appSub: 'Machinery Spare Parts Store & Inventory',
    brandTag: 'Machinery Spares Store',
    navOverview: 'Overview',
    navCatalog: 'Parts Catalog',
    navSales: 'Store Sales & POS',
    navLedger: 'Movement Ledger',
    navPOs: 'Restock POs',
    navBinMap: 'Yard & Bin Map',
    btnNewSale: '+ New Sale (POS)',
    btnNewPart: '+ New Part',
    btnReceive: '+ Receive',
    btnIssue: '- Issue',
    btnExportCSV: 'Export CSV',
    btnPrint: 'Print',
    btnResetData: 'Reset Demo Store',
    activeOperator: 'Active Operator',
    roleManager: 'Parts & Store Manager',
    roleSpecialist: 'Fleet Technical Specialist',
    roleSales: 'Counter Sales Specialist',
    dealershipLocation: 'Heavy Machinery Dealership & Spares Store',
    facilityStatus: 'Facility Status: Main Store & Heavy Yard Active',
    statStoreRevenue: 'Store Revenue',
    statOrdersFulfilled: 'orders fulfilled',
    statSalesProfit: 'Sales Profit',
    statGrossMargin: 'Gross parts margin',
    statStockUnits: 'Stock Units',
    statAcrossSKUs: 'Across heavy SKUs',
    statInventoryValue: 'Inventory Value',
    statCostValue: 'Cost Value',
    statCriticalShortages: 'Critical Shortages',
    statBelowMinimum: 'Below safety minimum',
    statReorderAlert: 'Reorder Alert',
    statAtROP: 'At or below ROP',
    statReceivables: 'Net 30 Receivables',
    statCommercialCredit: 'Contractor commercial credit',
    alertCriticalShortage: 'Heavy Equipment Parts Shortage Alert',
    alertShortageSub: 'Critical vehicle components (pumps, injectors, undercarriage) are below safety buffer. Fleet customer downtime risk.',
    btnDraftPO: 'Draft Supplier Restock PO',
    partNumber: 'Part #',
    brandAndDesc: 'Brand & Description',
    supportedMachinery: 'Supported Machinery',
    inStock: 'In Stock',
    safetyMin: 'Safety Min',
    action: 'Action',
    recentActivity: 'Recent Store Sales & Stock Activity',
    recentActivitySub: 'Live transaction stream of customer counter sales and parts receipts',
    viewFullLedger: 'Full Ledger',
    counterPOSOps: 'Store POS & Counter Operations',
    counterPOSSub: 'Process sales or record deliveries',
    btnCreateSaleInvoice: '+ Create Customer Sale & Invoice',
    btnReceiveStock: '+ Receive Stock',
    btnReceiveSub: 'PO delivery check-in',
    btnWorkshopIssue: '- Workshop Issue',
    btnWorkshopSub: 'Internal fleet rebuild',
    btnCycleCount: '± Cycle Count',
    btnCycleSub: 'Yard audit variance',
    btnSalesReports: 'Sales Reports',
    btnSalesReportsSub: 'Invoices & receivables',
    supportedMachineryTitle: 'Supported Machinery Vehicles',
    supportedMachinerySub: 'Inventory coverage by heavy equipment OEM make',
    applicationsCompatible: 'compatible applications',
    searchPlaceholder: 'Search by part # (1R-0716), machinery model (336D), brand, bin...',
    filterMake: 'Machinery Make / Brand',
    allMakes: 'All Machinery Makes',
    filterCategory: 'System / Category',
    allCategories: 'All Systems & Categories',
    filterStockStatus: 'Stock Level Status',
    allStockLevels: 'All Stock Levels',
    statusCritical: 'Critical Shortage (< Min)',
    statusLow: 'Needs Reorder (≤ ROP)',
    statusNominal: 'Adequate Stock',
    statusOverstocked: 'Overstocked',
    showingCatalog: 'Showing',
    ofCatalog: 'of',
    machinerySpareParts: 'machinery spare parts',
    resetFilters: 'Reset filters',
    catalogRetailValue: 'Catalog Retail Stock Value',
    colPartNumber: 'Part # / Brand',
    colDescription: 'Description',
    colCompatibleVehicles: 'Compatible Vehicles',
    colLocation: 'Location',
    colInStock: 'In Stock',
    colWholesale: 'Wholesale',
    colRetail: 'Retail Price',
    colUnitCost: 'Unit Cost',
    colCounterActions: 'Counter Actions',
    btnSell: 'Sell',
    btnEdit: 'Edit',
    btnDelete: 'Delete',
    weight: 'Weight',
    posTitle: 'Heavy Machinery Spares Store — Counter POS & Sales Invoicing',
    posSub: 'Process customer orders, apply wholesale fleet discounts, and deduct warehouse stock',
    fieldCustomerAccount: 'Customer / Fleet Account',
    fieldMachineryVehicle: 'Machinery Vehicle / Machine Serial',
    requiredForWarranty: 'Required for Warranty',
    pricingTier: 'Pricing Tier:',
    tierWholesale: 'Wholesale Fleet',
    tierRetail: 'Retail Counter',
    orderLines: 'Machinery Spare Parts Order Lines',
    btnAddPartLine: '+ Add Part Line',
    selectPart: 'Select Part',
    quantity: 'Quantity',
    unitPrice: 'Unit Price ($)',
    subtotal: 'Subtotal',
    paymentMethod: 'Payment Method',
    payFleetCredit: 'Fleet Account (Net 30 Commercial Credit)',
    payCard: 'Credit / Debit Card (Counter Terminal)',
    payWire: 'Bank Wire Transfer / ACH',
    payCash: 'Cash (Counter Pickup)',
    invoiceStatus: 'Invoice Status',
    statusPaid: 'Paid / Cleared',
    statusPendingNet30: 'Pending Net 30 Days',
    statusQuote: 'Quote / Estimate Only',
    discountPercent: 'Discount (%)',
    deliveryNotes: 'Delivery / Work Order Reference Notes',
    salesTax: 'State Sales Tax (5%):',
    grandTotal: 'Grand Total:',
    storeGrossMargin: 'Store Gross Margin:',
    btnProcessSale: 'Process Sale & Issue Parts',
    cashier: 'Cashier',
    cancel: 'Cancel',
    close: 'Close',
    companyName: 'HeavyEquip Parts & Machinery Supplies',
    companySubtitle: 'Heavy Machinery Vehicle Spares · Caterpillar, Komatsu, Volvo, Hitachi',
    companyPhone: 'Tel: +1 (800) 555-MRO-PARTS · sales@heavyequip.example.com',
    invoiceVoucher: 'Commercial Sales Invoice & Delivery Voucher',
    date: 'Date',
    customerAccount: 'Customer Account:',
    targetVehicle: 'Target Machinery Vehicle:',
    btnPrintInvoice: 'Print Invoice',
    poTitle: 'Replenishment & Purchase Orders',
    poSub: 'Automated stock replenishment orders based on Minimum Safety Thresholds and Reorder Points (ROP)',
    btnAutoDraftPO: 'Auto-Draft PO',
    btnReceiveDelivery: 'Receive Delivery',
    receivedDelivery: 'Received',
    pendingReceipt: 'Pending Receipt',
    supplier: 'Supplier',
    expectedETA: 'Expected ETA',
    totalPOValue: 'Total PO Value',
    yardMapTitle: 'Warehouse Bin & Yard Storage Map',
    yardMapSub: 'Physical layout visualizer for rapid parts picking and replenishment routing',
    facility: 'Facility:',
    aisles: 'Aisles:',
    aisle: 'Aisle',
    rack: 'Rack',
    shelf: 'Shelf',
    bin: 'Bin',
    fullSpecs: 'Full Specs',
    partSpecsTitle: 'Part Specifications & Machinery Fitment',
    crossRefOEM: 'Cross-Ref OEM:',
    retailSellingPrice: 'Retail Selling Price',
    wholesaleFleetPrice: 'Wholesale Fleet Price',
    storePurchaseCost: 'Store Purchase Cost',
    stockOnHand: 'Stock on Hand',
    availableForSale: 'Available for Sale',
    margin: 'Margin',
    fitsMachineryVehicles: 'Compatible Heavy Machinery Vehicles & Fitment',
    technicalDescription: 'Technical Description',
    storageAndHandling: 'Installation & Handling',
    storageLocation: 'Storage Location',
    weightAndLogistics: 'Weight & Supplier Logistics',
    leadTime: 'Lead Time (Days)',
    movementHistory: 'Transaction Movement History',
    btnSellAtPOS: 'Sell at Counter POS',
    addNewPartTitle: 'Register New Heavy Machinery Part',
    editPartTitle: 'Edit Machinery Part Specifications',
    addPartSub: 'Configure machinery fitment, commercial prices (wholesale/retail), and warehouse bin',
    fieldPartNumber: 'Part # / SKU',
    fieldName: 'Part Name / Title',
    fieldBrand: 'Brand / Manufacturer',
    fieldOEM: 'OEM / Cross-Ref Code',
    fieldCategory: 'System Category',
    fieldWeight: 'Weight in kg',
    fieldUnitCost: 'Store Purchase Cost ($)',
    fieldWholesalePrice: 'Wholesale Fleet Price ($)',
    fieldSellingPrice: 'Retail Counter Price ($)',
    fieldInitialStock: 'Initial Stock',
    fieldROP: 'Reorder Point (ROP)',
    fieldWarehouse: 'Warehouse',
    fieldAisle: 'Aisle / Bay',
    fieldRack: 'Rack',
    fieldBin: 'Bin',
    btnSavePart: 'Save to Catalog',
    btnUpdatePart: 'Update Part',

    // Movement Ledger
    ledgerTitle: 'Stock Movement & Audit Ledger',
    ledgerSub: 'Full history of spare parts receipts, sales, issues, and cycle count adjustments',
    filterByType: 'Filter by Type:',
    txAll: 'All Transactions',
    txSales: 'Store Sales (Invoices)',
    txReceipts: 'Goods Receipts (PO)',
    txIssues: 'Workshop Issues',
    txAdjustments: 'Cycle Adjustments',
    exportLedgerCSV: 'Export Ledger CSV',
    colTimestamp: 'Timestamp',
    colType: 'Type',
    colPartNumName: 'Part Number & Name',
    colRefNum: 'Reference #',
    colMachineryWO: 'Work Order / Machine',
    colQtyChanged: 'Quantity Change',
    colBalance: 'Stock Balance',
    colOperatorNotes: 'Operator & Notes',
    noMovementsFound: 'No stock movement logs found',
    noMovementsSub: 'Try adjusting your search criteria or record a new transaction.',
    searchLedgerPlaceholder: 'Search by part #, reference (PO/WO), operator, reason...',
    prevBalance: 'prev',
    nowBalance: 'now',

    currencySymbol: '$',
  },
};

export const CATEGORY_TRANSLATIONS: Record<string, { am: string; en: string }> = {
  'Undercarriage & Tracks': {
    am: 'የስር ሰረገላ እና ሰንሰለት (Undercarriage)',
    en: 'Undercarriage & Tracks',
  },
  'Hydraulics & Cylinders': {
    am: 'ሀይድሮሊክስ እና ሲሊንደሮች',
    en: 'Hydraulics & Cylinders',
  },
  'Engine & Fuel Injection': {
    am: 'ሞተር እና የነዳጅ ኢንጄክሽን',
    en: 'Engine & Fuel Injection',
  },
  'Transmission & Final Drive': {
    am: 'ትራንስሚሽን እና ፋይናል ድራይቭ',
    en: 'Transmission & Final Drive',
  },
  'Ground Engaging Tools (GET)': {
    am: 'የቆፋሪ ጥርሶች እና ቢላዎች (GET)',
    en: 'Ground Engaging Tools (GET)',
  },
  'Filters & Service Maintenance': {
    am: 'ማጣሪያዎች (ፊልተሮች) እና ሰርቪስ',
    en: 'Filters & Service Maintenance',
  },
  'Braking, Axles & Steering': {
    am: 'ፍሬን፣ አክስል እና ስቲሪንግ',
    en: 'Braking, Axles & Steering',
  },
  'Heavy Electrical, Starters & Sensors': {
    am: 'ኤሌክትሪክ፣ ስታርተር እና ሴንሰሮች',
    en: 'Heavy Electrical, Starters & Sensors',
  },
  'Cabin, Glass & Structural': {
    am: 'የካቢኔ፣ መስታወት እና አካል',
    en: 'Cabin, Glass & Structural',
  },
};

export const VEHICLE_TYPE_TRANSLATIONS: Record<string, { am: string; en: string }> = {
  'Hydraulic Excavator': {
    am: 'ኤክስካቫተር (ቆፋሪ)',
    en: 'Hydraulic Excavator',
  },
  'Bulldozer / Crawler': {
    am: 'ቡልዶዘር (ዶዘር)',
    en: 'Bulldozer / Crawler',
  },
  'Wheel Loader': {
    am: 'ዊል ሎደር (ጫኝ)',
    en: 'Wheel Loader',
  },
  'Articulated Haul Truck': {
    am: 'አርቲኩሌትድ ዳምፐር',
    en: 'Articulated Haul Truck',
  },
  'Motor Grader': {
    am: 'ሞተር ግሬደር',
    en: 'Motor Grader',
  },
  'Heavy Duty Mobile Crane': {
    am: 'ክሬን',
    en: 'Heavy Duty Mobile Crane',
  },
  'Mining Dump Truck': {
    am: 'የማዕድን ዳምፕ ትራክ',
    en: 'Mining Dump Truck',
  },
  'Backhoe Loader': {
    am: 'ባኮ ሎደር',
    en: 'Backhoe Loader',
  },
};

export function getTranslation(lang: Language = 'am') {
  return translations[lang] || translations.am;
}

export function translateCategory(cat: string, lang: Language = 'am'): string {
  const item = CATEGORY_TRANSLATIONS[cat];
  if (!item) return cat;
  return lang === 'am' ? item.am : item.en;
}

export function translateVehicleType(vt: string, lang: Language = 'am'): string {
  const item = VEHICLE_TYPE_TRANSLATIONS[vt];
  if (!item) return vt;
  return lang === 'am' ? item.am : item.en;
}

export function translateTransactionType(type: string, lang: Language = 'am'): string {
  if (lang === 'am') {
    switch (type) {
      case 'SALE':
        return 'ሽያጭ';
      case 'RECEIPT':
        return 'ገቢ (ርክክብ)';
      case 'ISSUE':
        return 'ወጪ (ለሥራ)';
      case 'ADJUSTMENT':
        return 'ማስተካከያ';
      default:
        return type;
    }
  }
  return type;
}

export function translatePaymentMethod(method: string, lang: Language = 'am'): string {
  if (lang === 'am') {
    switch (method) {
      case 'Fleet Account (Net 30)':
        return 'የፍሊት ብድር (Net 30)';
      case 'Credit / Debit Card':
        return 'ክሬዲት / ዴቢት ካርድ';
      case 'Bank Wire Transfer':
        return 'በባንክ ዝውውር';
      case 'Cash (Counter)':
        return 'ጥሬ ገንዘብ (ካውንተር)';
      default:
        return method;
    }
  }
  return method;
}

export function translateInvoiceStatus(status: string, lang: Language = 'am'): string {
  if (lang === 'am') {
    switch (status) {
      case 'Paid':
        return 'ተከፍሏል';
      case 'Pending Net 30':
        return 'በመጠባበቅ ላይ (Net 30)';
      case 'Quote / Estimate':
        return 'የዋጋ ማቅረቢያ';
      case 'Cancelled':
        return 'ተሰርዟል';
      default:
        return status;
    }
  }
  return status;
}

export function translateWarehouse(name: string, lang: Language = 'am'): string {
  if (lang === 'am') {
    if (name === 'Heavy Store Main') return 'ዋና መጋዘን';
    if (name === 'Yard Bay Undercarriage') return 'የስር ሰረገላ ያርድ';
  }
  return name;
}
