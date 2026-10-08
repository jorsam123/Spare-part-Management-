import React, { useState, useEffect } from 'react';
import {
  getStoredParts,
  saveStoredParts,
  getStoredTransactions,
  saveStoredTransactions,
  getStoredCustomers,
  saveStoredCustomers,
  getStoredSalesInvoices,
  saveStoredSalesInvoices,
  getStoredPurchaseOrders,
  saveStoredPurchaseOrders,
  resetAllToSampleData,
  APP_USERS,
  AppUser,
} from './utils/storage';
import {
  Part,
  StockTransaction,
  Customer,
  SaleInvoice,
  PurchaseOrder,
  TransactionType,
} from './types/inventory';
import { Language, getTranslation } from './utils/i18n';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { InventoryTableView } from './components/InventoryTableView';
import { SalesInvoicesView } from './components/SalesInvoicesView';
import { MovementsLedgerView } from './components/MovementsLedgerView';
import { PurchaseOrdersView } from './components/PurchaseOrdersView';
import { WarehouseBinMapView } from './components/WarehouseBinMapView';
import { PartDetailModal } from './components/PartDetailModal';
import { AddEditPartModal } from './components/AddEditPartModal';
import { QuickMovementModal } from './components/QuickMovementModal';
import { SalesPOSModal } from './components/SalesPOSModal';
import { PrintLabelModal } from './components/PrintLabelModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser>(APP_USERS[0]);
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('he_lang_v1');
      return (stored as Language) || 'am';
    } catch {
      return 'am';
    }
  });

  const [parts, setParts] = useState<Part[]>(() => getStoredParts());
  const [transactions, setTransactions] = useState<StockTransaction[]>(() => getStoredTransactions());
  const [customers, setCustomers] = useState<Customer[]>(() => getStoredCustomers());
  const [invoices, setInvoices] = useState<SaleInvoice[]>(() => getStoredSalesInvoices());
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => getStoredPurchaseOrders());

  const [activeTab, setActiveTab] = useState<string>('overview');

  // Modals
  const [selectedPartForDetail, setSelectedPartForDetail] = useState<Part | null>(null);
  const [isAddPartOpen, setIsAddPartOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [isSalesPOSOpen, setIsSalesPOSOpen] = useState(false);
  const [preselectedSellPart, setPreselectedSellPart] = useState<Part | null>(null);
  const [quickActionState, setQuickActionState] = useState<{
    isOpen: boolean;
    mode: TransactionType;
    partId?: string;
  }>({
    isOpen: false,
    mode: 'RECEIPT',
  });
  const [printLabelPart, setPrintLabelPart] = useState<Part | null>(null);

  const t = getTranslation(currentLang);

  // Sync lang to storage
  useEffect(() => {
    try {
      localStorage.setItem('he_lang_v1', currentLang);
    } catch (e) {
      console.error(e);
    }
  }, [currentLang]);

  // Sync data to localStorage
  useEffect(() => {
    saveStoredParts(parts);
  }, [parts]);

  useEffect(() => {
    saveStoredTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveStoredCustomers(customers);
  }, [customers]);

  useEffect(() => {
    saveStoredSalesInvoices(invoices);
  }, [invoices]);

  useEffect(() => {
    saveStoredPurchaseOrders(purchaseOrders);
  }, [purchaseOrders]);

  // Keep modal part updated
  useEffect(() => {
    if (selectedPartForDetail) {
      const updated = parts.find((p) => p.id === selectedPartForDetail.id);
      if (updated) setSelectedPartForDetail(updated);
    }
  }, [parts]);

  // Handlers
  const handleSavePart = (part: Part) => {
    const exists = parts.some((p) => p.id === part.id);
    if (exists) {
      setParts(parts.map((p) => (p.id === part.id ? part : p)));
    } else {
      setParts([part, ...parts]);
      if (part.stockQuantity > 0) {
        const initTx: StockTransaction = {
          id: `txn-${Date.now()}`,
          partId: part.id,
          partNumber: part.partNumber,
          partName: part.name,
          type: 'RECEIPT',
          quantity: part.stockQuantity,
          previousStock: 0,
          newStock: part.stockQuantity,
          referenceNumber: 'CATALOG-REG',
          performedBy: `${currentUser.name} (${currentUser.role})`,
          timestamp: new Date().toISOString(),
          reason: currentLang === 'am' ? 'የመጀመሪያ የመለዋወጫ ካታሎግ ምዝገባ' : 'Initial machinery spare part catalog registration',
          toLocation: `${part.location.warehouse} / ${part.location.aisle}-${part.location.bin}`,
        };
        setTransactions([initTx, ...transactions]);
      }
    }
  };

  const handleDeletePart = (partId: string) => {
    setParts(parts.filter((p) => p.id !== partId));
  };

  // Complete a Customer Sale from Counter POS
  const handleCompleteSale = (saleData: Omit<SaleInvoice, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newInvoice: SaleInvoice = {
      ...saleData,
      id: `inv-${Date.now()}`,
      createdAt: now,
    };

    const newTxns: StockTransaction[] = [];
    setParts((prevParts) =>
      prevParts.map((part) => {
        const saleItem = saleData.items.find((it) => it.partId === part.id);
        if (saleItem) {
          const qtySold = saleItem.quantity;
          const prev = part.stockQuantity;
          const updatedStock = Math.max(0, prev - qtySold);

          newTxns.push({
            id: `txn-${Date.now()}-${part.id}`,
            partId: part.id,
            partNumber: part.partNumber,
            partName: part.name,
            type: 'SALE',
            quantity: -qtySold,
            previousStock: prev,
            newStock: updatedStock,
            unitPrice: saleItem.unitPrice,
            referenceNumber: saleData.invoiceNumber,
            workOrderOrMachine: saleData.machineryVehicle,
            performedBy: `${currentUser.name} (${currentUser.role})`,
            timestamp: now,
            customerName: saleData.customer.company,
            reason: currentLang === 'am'
              ? `የደንበኛ የካውንተር ሽያጭ (${saleData.customer.company} - ${saleData.machineryVehicle})`
              : `Customer Counter Sale (${saleData.customer.company} - ${saleData.machineryVehicle})`,
          });

          return {
            ...part,
            stockQuantity: updatedStock,
            updatedAt: now,
          };
        }
        return part;
      })
    );

    setInvoices([newInvoice, ...invoices]);
    if (newTxns.length > 0) {
      setTransactions([...newTxns, ...transactions]);
    }
    setActiveTab('sales');
  };

  const handleRecordTransaction = (txData: Omit<StockTransaction, 'id' | 'timestamp'>) => {
    const now = new Date().toISOString();
    const newTx: StockTransaction = {
      ...txData,
      id: `txn-${Date.now()}`,
      timestamp: now,
    };

    setParts((prevParts) =>
      prevParts.map((p) => {
        if (p.id === txData.partId) {
          return {
            ...p,
            stockQuantity: txData.newStock,
            lastRestockedAt: txData.type === 'RECEIPT' ? now : p.lastRestockedAt,
            updatedAt: now,
          };
        }
        return p;
      })
    );

    setTransactions([newTx, ...transactions]);
  };

  const handleReceivePO = (poId: string) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;

    const now = new Date().toISOString();
    const newTxns: StockTransaction[] = [];

    setParts((prevParts) =>
      prevParts.map((part) => {
        const poItem = po.items.find((it) => it.partId === part.id);
        if (poItem) {
          const qtyToAdd = poItem.quantity;
          const prev = part.stockQuantity;
          const updatedStock = prev + qtyToAdd;

          newTxns.push({
            id: `txn-${Date.now()}-${part.id}`,
            partId: part.id,
            partNumber: part.partNumber,
            partName: part.name,
            type: 'RECEIPT',
            quantity: qtyToAdd,
            previousStock: prev,
            newStock: updatedStock,
            referenceNumber: po.poNumber,
            performedBy: `${currentUser.name} (${currentUser.role})`,
            timestamp: now,
            reason: currentLang === 'am'
              ? `ከአቅራቢ ${po.supplierName} የተላከ ዕቃ ርክክብ ተፈጽሟል`
              : `Received factory delivery from ${po.supplierName}`,
            toLocation: `${part.location.warehouse} / ${part.location.aisle}-${part.location.bin}`,
          });

          return {
            ...part,
            stockQuantity: updatedStock,
            lastRestockedAt: now,
            updatedAt: now,
          };
        }
        return part;
      })
    );

    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === poId
          ? {
              ...p,
              status: 'Received',
              items: p.items.map((it) => ({ ...it, receivedQty: it.quantity })),
            }
          : p
      )
    );

    if (newTxns.length > 0) {
      setTransactions([...newTxns, ...transactions]);
    }
  };

  const handleAutoGeneratePO = () => {
    const lowParts = parts.filter((p) => p.stockQuantity <= p.reorderPoint);
    if (lowParts.length === 0) return;

    const poNumber = `PO-2026-${Math.floor(200 + Math.random() * 800)}`;
    const now = new Date();
    const etaDate = new Date();
    etaDate.setDate(now.getDate() + 7);

    const poItems = lowParts.map((part) => {
      const target = Math.max(part.maxStockLevel, part.reorderPoint * 2);
      const orderQty = Math.max(1, target - part.stockQuantity);
      return {
        partId: part.id,
        partNumber: part.partNumber,
        partName: part.name,
        quantity: orderQty,
        unitCost: part.unitCost,
        receivedQty: 0,
      };
    });

    const totalAmount = poItems.reduce((acc, it) => acc + it.quantity * it.unitCost, 0);

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber,
      supplierName: lowParts[0]?.supplier?.name || 'Cat OEM Master Distributor',
      status: 'Sent',
      items: poItems,
      totalAmount,
      expectedDeliveryDate: etaDate.toISOString().slice(0, 10),
      createdAt: now.toISOString(),
      notes: currentLang === 'am'
        ? `እጥረት ላጋጠማቸው ${lowParts.length} የከባድ ማሽነሪ መለዋወጫዎች የተዘጋጀ አዲስ የግዢ ትዕዛዝ።`
        : `Replenishment order for ${lowParts.length} critical heavy equipment components.`,
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    setActiveTab('purchase-orders');
  };

  const handleResetData = () => {
    if (window.confirm(currentLang === 'am' ? 'የማሽነሪ መለዋወጫዎችን እና የሽያጭ መረጃዎችን ወደ መጀመሪያው ናሙና መረጃዎች መመለስ ይፈልጋሉ?' : 'Reset machinery parts catalog, store sales, and POs to initial baseline data?')) {
      resetAllToSampleData();
      setParts(getStoredParts());
      setTransactions(getStoredTransactions());
      setCustomers(getStoredCustomers());
      setInvoices(getStoredSalesInvoices());
      setPurchaseOrders(getStoredPurchaseOrders());
    }
  };

  const openSellModalForPart = (part: Part) => {
    setPreselectedSellPart(part);
    setIsSalesPOSOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Header Contract with Amharic language switcher */}
      <Header
        currentUser={currentUser}
        onSwitchUser={setCurrentUser}
        users={APP_USERS}
        onOpenAddPart={() => {
          setEditingPart(null);
          setIsAddPartOpen(true);
        }}
        onOpenNewSale={() => {
          setPreselectedSellPart(null);
          setIsSalesPOSOpen(true);
        }}
        onOpenQuickAction={(mode) => {
          setQuickActionState({ isOpen: true, mode });
        }}
        onResetData={handleResetData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLang={currentLang}
        onToggleLang={setCurrentLang}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Breadcrumb in Amharic */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{t.dealershipLocation}</span>
            <span aria-hidden="true">/</span>
            <span className="text-white font-medium capitalize">
              {activeTab === 'inventory'
                ? t.navCatalog
                : activeTab === 'sales'
                ? t.navSales
                : activeTab === 'movements'
                ? t.navLedger
                : activeTab === 'purchase-orders'
                ? t.navPOs
                : activeTab === 'bin-map'
                ? t.navBinMap
                : t.navOverview}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{t.facilityStatus}</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-amber-400 font-mono">CAT · Komatsu · Volvo · Hitachi</span>
          </div>
        </div>

        {/* Dynamic Views */}
        {activeTab === 'overview' && (
          <DashboardView
            parts={parts}
            transactions={transactions}
            invoices={invoices}
            onSelectPart={(part) => setSelectedPartForDetail(part)}
            onOpenQuickAction={(mode, partId) =>
              setQuickActionState({ isOpen: true, mode, partId })
            }
            onOpenNewSale={() => {
              setPreselectedSellPart(null);
              setIsSalesPOSOpen(true);
            }}
            onNavigateTab={setActiveTab}
            onAutoGeneratePO={handleAutoGeneratePO}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryTableView
            parts={parts}
            onSelectPart={(part) => setSelectedPartForDetail(part)}
            onEditPart={(part) => {
              setEditingPart(part);
              setIsAddPartOpen(true);
            }}
            onDeletePart={handleDeletePart}
            onOpenAddPart={() => {
              setEditingPart(null);
              setIsAddPartOpen(true);
            }}
            onOpenQuickAction={(mode, partId) =>
              setQuickActionState({ isOpen: true, mode, partId })
            }
            onSellPart={openSellModalForPart}
            onPrintLabel={(part) => setPrintLabelPart(part)}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'sales' && (
          <SalesInvoicesView
            invoices={invoices}
            onOpenNewSale={() => {
              setPreselectedSellPart(null);
              setIsSalesPOSOpen(true);
            }}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'movements' && (
          <MovementsLedgerView
            transactions={transactions}
            onOpenQuickAction={(mode) => setQuickActionState({ isOpen: true, mode })}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'purchase-orders' && (
          <PurchaseOrdersView
            purchaseOrders={purchaseOrders}
            parts={parts}
            onAutoGeneratePO={handleAutoGeneratePO}
            onReceivePO={handleReceivePO}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'bin-map' && (
          <WarehouseBinMapView
            parts={parts}
            onSelectPart={(part) => setSelectedPartForDetail(part)}
            onOpenQuickAction={(mode, partId) =>
              setQuickActionState({ isOpen: true, mode, partId })
            }
            currentLang={currentLang}
          />
        )}
      </main>

      {/* Modals */}
      {selectedPartForDetail && (
        <PartDetailModal
          part={selectedPartForDetail}
          onClose={() => setSelectedPartForDetail(null)}
          onEdit={(part) => {
            setEditingPart(part);
            setIsAddPartOpen(true);
          }}
          onDelete={handleDeletePart}
          onOpenQuickAction={(mode, partId) =>
            setQuickActionState({ isOpen: true, mode, partId })
          }
          onSellPart={openSellModalForPart}
          onPrintLabel={(part) => setPrintLabelPart(part)}
          transactions={transactions}
          currentLang={currentLang}
        />
      )}

      {isAddPartOpen && (
        <AddEditPartModal
          isOpen={isAddPartOpen}
          onClose={() => {
            setIsAddPartOpen(false);
            setEditingPart(null);
          }}
          onSave={handleSavePart}
          initialPart={editingPart}
          currentLang={currentLang}
        />
      )}

      {isSalesPOSOpen && (
        <SalesPOSModal
          isOpen={isSalesPOSOpen}
          onClose={() => {
            setIsSalesPOSOpen(false);
            setPreselectedSellPart(null);
          }}
          parts={parts}
          customers={customers}
          currentUser={currentUser}
          onCompleteSale={handleCompleteSale}
          preselectedPart={preselectedSellPart}
          currentLang={currentLang}
        />
      )}

      {quickActionState.isOpen && (
        <QuickMovementModal
          isOpen={quickActionState.isOpen}
          mode={quickActionState.mode}
          parts={parts}
          preselectedPartId={quickActionState.partId}
          currentUser={currentUser}
          onClose={() => setQuickActionState({ isOpen: false, mode: 'RECEIPT' })}
          onSubmit={handleRecordTransaction}
          currentLang={currentLang}
        />
      )}

      {printLabelPart && (
        <PrintLabelModal
          part={printLabelPart}
          onClose={() => setPrintLabelPart(null)}
          currentLang={currentLang}
        />
      )}
    </div>
  );
}
