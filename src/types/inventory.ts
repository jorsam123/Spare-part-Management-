export type PartCategory =
  | 'Undercarriage & Tracks'
  | 'Hydraulics & Cylinders'
  | 'Engine & Fuel Injection'
  | 'Transmission & Final Drive'
  | 'Ground Engaging Tools (GET)'
  | 'Filters & Service Maintenance'
  | 'Braking, Axles & Steering'
  | 'Heavy Electrical, Starters & Sensors'
  | 'Cabin, Glass & Structural';

export type MachineryMake =
  | 'Caterpillar'
  | 'Komatsu'
  | 'Volvo CE'
  | 'Hitachi'
  | 'Liebherr'
  | 'John Deere'
  | 'Hyundai'
  | 'Universal Heavy Equipment';

export type VehicleType =
  | 'Hydraulic Excavator'
  | 'Bulldozer / Crawler'
  | 'Wheel Loader'
  | 'Articulated Haul Truck'
  | 'Motor Grader'
  | 'Heavy Duty Mobile Crane'
  | 'Mining Dump Truck'
  | 'Backhoe Loader';

export interface VehicleCompatibility {
  make: MachineryMake | string;
  model: string;
  vehicleType: VehicleType | string;
  engineModel?: string;
  serialPrefix?: string;
}

export type UnitOfMeasure = 'ea' | 'set' | 'pair' | 'meter' | 'liter' | 'pack' | 'kg';

export type CriticalityLevel = 'High' | 'Medium' | 'Low';

export interface StorageLocation {
  warehouse: string;
  aisle: string;
  rack: string;
  shelf: string;
  bin: string;
}

export interface SupplierInfo {
  name: string;
  code: string;
  leadTimeDays: number;
  contactEmail: string;
  supplierPartNumber: string;
}

export interface Part {
  id: string;
  partNumber: string;           // OEM SKU e.g. 1R-0716, 708-2L-00300
  oemPartNumber: string;        // Cross reference / Alternate code
  name: string;                 // e.g. High Efficiency Fuel Filter Water Separator
  description: string;
  brand: string;                // Caterpillar OEM, Komatsu Genuine, Berco, Donaldson, etc.
  category: PartCategory;
  unitOfMeasure: UnitOfMeasure;
  location: StorageLocation;
  stockQuantity: number;        // Physical units in warehouse / store
  reservedQuantity: number;     // Reserved for open sales orders / kits
  minStockLevel: number;        // Safety reorder threshold
  reorderPoint: number;
  maxStockLevel: number;
  unitCost: number;             // Store purchase cost ($ USD)
  sellingPrice: number;         // Standard counter sales price ($ USD)
  wholesalePrice: number;       // Fleet contractor trade price ($ USD)
  weightKg: number;             // Heavy machinery parts weight (kg)
  compatibleVehicles: VehicleCompatibility[]; // Vehicles this part fits
  criticality: CriticalityLevel;
  supplier: SupplierInfo;
  lastRestockedAt: string;
  updatedAt: string;
  notes?: string;
  barcode: string;
}

export type TransactionType = 'RECEIPT' | 'SALE' | 'ISSUE' | 'RETURN' | 'ADJUSTMENT' | 'TRANSFER';

export interface StockTransaction {
  id: string;
  partId: string;
  partNumber: string;
  partName: string;
  type: TransactionType;
  quantity: number;             // Positive for receipts/returns, negative for sales/issues
  previousStock: number;
  newStock: number;
  unitPrice?: number;           // Selling price or cost
  referenceNumber: string;      // Invoice #, PO #, Work Order #
  workOrderOrMachine?: string;  // Customer fleet vehicle or internal machine
  performedBy: string;
  timestamp: string;
  reason: string;
  customerName?: string;
  toLocation?: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  accountType: 'Fleet Contractor' | 'Mining & Quarry Operator' | 'Equipment Rental Fleet' | 'Over-the-Counter Cash';
  machineryFleet: string;       // e.g. "4x CAT 336D, 3x Komatsu PC300-8, 2x Volvo L150H"
  taxNumber?: string;
  address?: string;
}

export interface SaleItem {
  partId: string;
  partNumber: string;
  partName: string;
  brand: string;
  quantity: number;
  unitCost: number;
  unitPrice: number;
  discountPercent: number;
  lineTotal: number;
}

export type PaymentMethod =
  | 'Credit / Debit Card'
  | 'Bank Wire Transfer'
  | 'Fleet Account (Net 30)'
  | 'Cash (Counter)';

export type InvoiceStatus = 'Paid' | 'Pending Net 30' | 'Quote / Estimate' | 'Cancelled';

export interface SaleInvoice {
  id: string;
  invoiceNumber: string;        // e.g. INV-2026-1048
  customer: Customer;
  machineryVehicle: string;     // e.g. "Caterpillar 336D (Fleet #EX-02)"
  items: SaleItem[];
  subtotal: number;
  discountTotal: number;
  taxAmount: number;            // e.g. 5% tax or calculated
  grandTotal: number;
  grossProfit: number;          // Total revenue - Total cost
  paymentMethod: PaymentMethod;
  status: InvoiceStatus;
  createdAt: string;
  cashier: string;
  notes?: string;
}

export type POStatus = 'Draft' | 'Sent' | 'Partially Received' | 'Received' | 'Cancelled';

export interface POItem {
  partId: string;
  partNumber: string;
  partName: string;
  quantity: number;
  unitCost: number;
  receivedQty: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  status: POStatus;
  items: POItem[];
  totalAmount: number;
  expectedDeliveryDate: string;
  createdAt: string;
  notes?: string;
}
