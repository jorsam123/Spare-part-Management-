import React from 'react';
import { Truck, UserCheck, Plus, ShoppingCart, RefreshCw } from 'lucide-react';
import { AppUser } from '../utils/storage';

interface HeaderProps {
  currentUser: AppUser;
  onSwitchUser: (user: AppUser) => void;
  users: AppUser[];
  onOpenAddPart: () => void;
  onOpenNewSale: () => void;
  onOpenQuickAction: (mode: 'RECEIPT' | 'ISSUE' | 'ADJUSTMENT') => void;
  onResetData: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  users,
  onOpenAddPart,
  onOpenNewSale,
  onOpenQuickAction,
  onResetData,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Truck className="w-4 h-4" />
        </div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('overview');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors"
        >
          HeavyEquip
        </a>
      </div>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('overview')}
          className={`transition-colors hover:text-white ${
            activeTab === 'overview' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`transition-colors hover:text-white ${
            activeTab === 'inventory' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Parts Catalog
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`transition-colors hover:text-white ${
            activeTab === 'sales' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Store Sales & POS
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`transition-colors hover:text-white ${
            activeTab === 'movements' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Movement Ledger
        </button>
        <button
          onClick={() => setActiveTab('purchase-orders')}
          className={`transition-colors hover:text-white ${
            activeTab === 'purchase-orders' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Restock POs
        </button>
        <button
          onClick={() => setActiveTab('bin-map')}
          className={`transition-colors hover:text-white ${
            activeTab === 'bin-map' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Yard & Bin Map
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        {/* Fast Action: New Customer Sale (POS) */}
        <button
          onClick={onOpenNewSale}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors whitespace-nowrap shadow-sm"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>New Sale (POS)</span>
        </button>

        {/* Quick Add Part */}
        <button
          onClick={onOpenAddPart}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>New Part</span>
        </button>

        {/* User Switcher Dropdown */}
        <div className="relative group">
          <button
            className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-900 border border-slate-800 rounded hover:border-slate-700 transition-colors"
            title="Switch Operator"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-500/30"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-medium text-slate-200 leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{currentUser.role}</p>
            </div>
            <UserCheck className="w-3 h-3 text-slate-400 ml-1" />
          </button>

          {/* Quick User Selection dropdown */}
          <div className="absolute right-0 mt-1 w-56 py-1.5 bg-slate-900 border border-slate-800 rounded shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-40">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              Active Operator
            </div>
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => onSwitchUser(u)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-800 transition-colors ${
                  currentUser.id === u.id ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300'
                }`}
              >
                <img
                  src={u.avatarUrl}
                  alt={u.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-medium">{u.name}</p>
                  <p className="text-[10px] text-slate-400">{u.role}</p>
                </div>
              </button>
            ))}
            <div className="pt-1.5 mt-1.5 border-t border-slate-800 px-2">
              <button
                onClick={onResetData}
                className="w-full flex items-center justify-center gap-1.5 px-2 py-1 text-[11px] text-slate-400 hover:text-amber-400 hover:bg-slate-800/50 rounded transition-colors"
                title="Reset machinery inventory & sales to sample data"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Demo Store</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
