import { Part, StockTransaction, Customer, SaleInvoice, PurchaseOrder } from '../types/inventory';
import {
  INITIAL_PARTS,
  INITIAL_TRANSACTIONS,
  INITIAL_CUSTOMERS,
  INITIAL_SALES_INVOICES,
  INITIAL_PURCHASE_ORDERS,
} from '../data/initialData';

const STORAGE_KEYS = {
  PARTS: 'he_parts_v2',
  TRANSACTIONS: 'he_transactions_v2',
  CUSTOMERS: 'he_customers_v2',
  SALES_INVOICES: 'he_invoices_v2',
  PURCHASE_ORDERS: 'he_pos_v2',
  CURRENT_USER: 'he_current_user_v2',
};

export interface AppUser {
  id: string;
  name: string;
  role: 'Parts & Store Manager' | 'Fleet Technical Specialist' | 'Counter Sales Specialist';
  avatarUrl: string;
}

export const APP_USERS: AppUser[] = [
  {
    id: 'user-01',
    name: 'Marcus Vance',
    role: 'Parts & Store Manager',
    avatarUrl: '/src/assets/images/avatar_warehouse_mgr_1791185295641.jpg',
  },
  {
    id: 'user-02',
    name: 'Elena Gomez',
    role: 'Fleet Technical Specialist',
    avatarUrl: '/src/assets/images/avatar_maint_tech_1791185307948.jpg',
  },
];

export function getStoredParts(): Part[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PARTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PARTS, JSON.stringify(INITIAL_PARTS));
      return INITIAL_PARTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading parts from localStorage', e);
    return INITIAL_PARTS;
  }
}

export function saveStoredParts(parts: Part[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PARTS, JSON.stringify(parts));
  } catch (e) {
    console.error('Error saving parts to localStorage', e);
  }
}

export function getStoredTransactions(): StockTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading transactions', e);
    return INITIAL_TRANSACTIONS;
  }
}

export function saveStoredTransactions(transactions: StockTransaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error('Error saving transactions', e);
  }
}

export function getStoredCustomers(): Customer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading customers', e);
    return INITIAL_CUSTOMERS;
  }
}

export function saveStoredCustomers(customers: Customer[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  } catch (e) {
    console.error('Error saving customers', e);
  }
}

export function getStoredSalesInvoices(): SaleInvoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SALES_INVOICES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SALES_INVOICES, JSON.stringify(INITIAL_SALES_INVOICES));
      return INITIAL_SALES_INVOICES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading invoices', e);
    return INITIAL_SALES_INVOICES;
  }
}

export function saveStoredSalesInvoices(invoices: SaleInvoice[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SALES_INVOICES, JSON.stringify(invoices));
  } catch (e) {
    console.error('Error saving invoices', e);
  }
}

export function getStoredPurchaseOrders(): PurchaseOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PURCHASE_ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(INITIAL_PURCHASE_ORDERS));
      return INITIAL_PURCHASE_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading POs', e);
    return INITIAL_PURCHASE_ORDERS;
  }
}

export function saveStoredPurchaseOrders(pos: PurchaseOrder[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(pos));
  } catch (e) {
    console.error('Error saving POs', e);
  }
}

export function resetAllToSampleData(): void {
  localStorage.setItem(STORAGE_KEYS.PARTS, JSON.stringify(INITIAL_PARTS));
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
  localStorage.setItem(STORAGE_KEYS.SALES_INVOICES, JSON.stringify(INITIAL_SALES_INVOICES));
  localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(INITIAL_PURCHASE_ORDERS));
}
