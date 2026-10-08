import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Trash2,
  ShoppingCart,
  DollarSign,
  Printer,
  CheckCircle2,
  AlertTriangle,
  User,
  Truck,
  Percent,
} from 'lucide-react';
import { Part, Customer, SaleInvoice, SaleItem, PaymentMethod, InvoiceStatus } from '../types/inventory';
import { formatCurrency } from '../utils/formatters';
import { AppUser } from '../utils/storage';

interface SalesPOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  parts: Part[];
  customers: Customer[];
  currentUser: AppUser;
  onCompleteSale: (invoice: Omit<SaleInvoice, 'id' | 'createdAt'>) => void;
  preselectedPart?: Part | null;
}

export const SalesPOSModal: React.FC<SalesPOSModalProps> = ({
  isOpen,
  onClose,
  parts,
  customers,
  currentUser,
  onCompleteSale,
  preselectedPart,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [machineryVehicle, setMachineryVehicle] = useState<string>('');
  const [priceTier, setPriceTier] = useState<'retail' | 'wholesale'>('wholesale');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Fleet Account (Net 30)');
  const [orderStatus, setOrderStatus] = useState<InvoiceStatus>('Paid');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [applyTax, setApplyTax] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Selected line items
  const [lineItems, setLineItems] = useState<
    Array<{
      partId: string;
      quantity: number;
      overridePrice?: number;
    }>
  >(() => {
    if (preselectedPart) {
      return [{ partId: preselectedPart.id, quantity: 1 }];
    }
    return [{ partId: parts[0]?.id || '', quantity: 1 }];
  });

  const selectedCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId) || customers[0];
  }, [customers, selectedCustomerId]);

  // Set machinery vehicle recommendation when customer changes
  React.useEffect(() => {
    if (selectedCustomer && !machineryVehicle) {
      const fleetSnippet = selectedCustomer.machineryFleet.split(',')[0] || '';
      setMachineryVehicle(fleetSnippet.trim());
    }
  }, [selectedCustomer]);

  // Set preselected part if modal opens with one
  React.useEffect(() => {
    if (preselectedPart) {
      setLineItems([{ partId: preselectedPart.id, quantity: 1 }]);
      if (preselectedPart.compatibleVehicles[0]) {
        const v = preselectedPart.compatibleVehicles[0];
        setMachineryVehicle(`${v.make} ${v.model} (${v.vehicleType})`);
      }
    }
  }, [preselectedPart, isOpen]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setLineItems([...lineItems, { partId: parts[0]?.id || '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, idx) => idx !== index));
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  // Calculate totals
  const preparedItems: SaleItem[] = lineItems.map((item) => {
    const part = parts.find((p) => p.id === item.partId) || parts[0];
    const basePrice =
      priceTier === 'wholesale' ? part.wholesalePrice : part.sellingPrice;
    const finalPrice = item.overridePrice !== undefined ? item.overridePrice : basePrice;
    const lineTotal = item.quantity * finalPrice;

    return {
      partId: part.id,
      partNumber: part.partNumber,
      partName: part.name,
      brand: part.brand,
      quantity: item.quantity,
      unitCost: part.unitCost,
      unitPrice: finalPrice,
      discountPercent: 0,
      lineTotal,
    };
  });

  const subtotal = preparedItems.reduce((acc, it) => acc + it.lineTotal, 0);
  const discountTotal = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountTotal);
  const taxAmount = applyTax ? taxableAmount * 0.05 : 0; // 5% state/industrial tax
  const grandTotal = taxableAmount + taxAmount;

  const totalCost = preparedItems.reduce((acc, it) => acc + it.quantity * it.unitCost, 0);
  const grossProfit = Math.max(0, subtotal - discountTotal - totalCost);
  const marginPercent = grandTotal > 0 ? (grossProfit / (subtotal - discountTotal)) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!machineryVehicle.trim()) {
      setError('Machinery vehicle model or fleet ID is required for warranty/fitment');
      return;
    }

    // Verify stock availability
    for (const item of preparedItems) {
      const part = parts.find((p) => p.id === item.partId);
      if (part && item.quantity > part.stockQuantity) {
        setError(
          `Insufficient stock for ${part.partNumber}. In stock: ${part.stockQuantity} ${part.unitOfMeasure}, requested: ${item.quantity}.`
        );
        return;
      }
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-2026-${randomSuffix}`;

    onCompleteSale({
      invoiceNumber,
      customer: selectedCustomer,
      machineryVehicle: machineryVehicle.trim(),
      items: preparedItems,
      subtotal,
      discountTotal,
      taxAmount,
      grandTotal,
      grossProfit,
      paymentMethod,
      status: orderStatus,
      cashier: `${currentUser.name} (${currentUser.role})`,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Heavy Machinery Spares Store — Counter POS & Sales Invoicing
              </h3>
              <p className="text-xs text-slate-400">
                Process customer orders, apply wholesale fleet discounts, and deduct warehouse stock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Top Row: Customer & Target Machinery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Picker */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Customer / Fleet Account</span>
                </label>
                <span className="text-[10px] text-amber-400/90 font-mono font-medium">
                  {selectedCustomer.accountType}
                </span>
              </div>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs focus:outline-none focus:border-amber-400"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} — {c.name}
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-slate-400 truncate">
                <span>Fleet: </span>
                <span className="text-slate-300">{selectedCustomer.machineryFleet}</span>
              </div>
            </div>

            {/* Target Machinery Vehicle */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Machinery Vehicle / Machine Serial</span>
                </label>
                <span className="text-[10px] text-slate-400">Required for Warranty</span>
              </div>
              <input
                type="text"
                value={machineryVehicle}
                onChange={(e) => setMachineryVehicle(e.target.value)}
                placeholder="e.g. Caterpillar 336D Excavator (Machine #EX-02)"
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-white text-xs focus:outline-none focus:border-amber-400"
              />
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span>Pricing Tier:</span>
                <button
                  type="button"
                  onClick={() => setPriceTier('wholesale')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    priceTier === 'wholesale'
                      ? 'bg-amber-400 text-slate-950 font-semibold'
                      : 'bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                >
                  Wholesale Fleet
                </button>
                <button
                  type="button"
                  onClick={() => setPriceTier('retail')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    priceTier === 'retail'
                      ? 'bg-amber-400 text-slate-950 font-semibold'
                      : 'bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                >
                  Retail Counter
                </button>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="font-semibold text-slate-200">
                Machinery Spare Parts Order Lines ({lineItems.length})
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Part Line</span>
              </button>
            </div>

            <div className="space-y-2">
              {lineItems.map((item, idx) => {
                const part = parts.find((p) => p.id === item.partId) || parts[0];
                const basePrice =
                  priceTier === 'wholesale' ? part.wholesalePrice : part.sellingPrice;
                const activePrice =
                  item.overridePrice !== undefined ? item.overridePrice : basePrice;
                const isOverStock = item.quantity > part.stockQuantity;

                return (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-900 border border-slate-800 rounded flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    {/* Part Select */}
                    <div className="flex-1 min-w-[280px]">
                      <select
                        value={item.partId}
                        onChange={(e) => handleItemChange(idx, 'partId', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded font-mono text-white text-xs focus:outline-none focus:border-amber-400"
                      >
                        {parts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.partNumber} · {p.brand} — {p.name} (Stock: {p.stockQuantity}{' '}
                            {p.unitOfMeasure})
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span>Bin: {part.location.aisle}-{part.location.bin}</span>
                        <span aria-hidden="true">·</span>
                        <span className={isOverStock ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                          {part.stockQuantity} {part.unitOfMeasure} available
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Weight: {part.weightKg * item.quantity} kg</span>
                      </div>
                    </div>

                    {/* Quantity & Unit Price */}
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Quantity</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)
                          }
                          className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-white text-right"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Unit Price ($)</span>
                        <input
                          type="number"
                          step="0.01"
                          value={activePrice}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              'overridePrice',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-white text-right"
                        />
                      </div>

                      <div className="text-right w-24">
                        <span className="text-[10px] text-slate-400 block mb-0.5">Subtotal</span>
                        <span className="font-mono text-sm font-bold text-white tabular-nums">
                          {formatCurrency(item.quantity * activePrice)}
                        </span>
                      </div>

                      {lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors self-end md:self-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment & Financial Breakdown Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payment Method & Status */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="Fleet Account (Net 30)">Fleet Account (Net 30 Commercial Credit)</option>
                  <option value="Credit / Debit Card">Credit / Debit Card (Counter Terminal)</option>
                  <option value="Bank Wire Transfer">Bank Wire Transfer / ACH</option>
                  <option value="Cash (Counter)">Cash (Counter Pickup)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Invoice Status</label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value as InvoiceStatus)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Paid">Paid / Cleared</option>
                    <option value="Pending Net 30">Pending Net 30 Days</option>
                    <option value="Quote / Estimate">Quote / Estimate Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded font-mono text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Delivery / Work Order Reference Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Job site delivery, PO #TX-9901, quarry loader breakdown"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Calculations & Profitability Box */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Items:</span>
                <span className="text-white tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Customer Discount ({discountPercent}%):</span>
                  <span className="tabular-nums">-{formatCurrency(discountTotal)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-400">
                <label className="flex items-center gap-1.5 cursor-pointer font-sans text-xs">
                  <input
                    type="checkbox"
                    checked={applyTax}
                    onChange={(e) => setApplyTax(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-800 text-amber-400"
                  />
                  <span>State Sales Tax (5%):</span>
                </label>
                <span className="tabular-nums">{formatCurrency(taxAmount)}</span>
              </div>

              <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                <span className="font-sans font-bold text-sm text-white">Grand Total:</span>
                <span className="text-xl font-bold text-emerald-400 tabular-nums">
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              <div className="border-t border-slate-800/80 pt-2 flex justify-between text-[11px] text-slate-400">
                <span>Store Gross Margin:</span>
                <span className="text-emerald-400 font-semibold tabular-nums">
                  {formatCurrency(grossProfit)} ({marginPercent.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <span className="text-slate-400 text-[11px]">
              Cashier: <strong className="text-slate-200">{currentUser.name}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Process Sale & Issue Parts</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
