import React from 'react';
import { Truck, UserCheck, ShoppingCart, RefreshCw, Globe } from 'lucide-react';
import { AppUser } from '../utils/storage';
import { Language, getTranslation } from '../utils/i18n';

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
  currentLang: Language;
  onToggleLang: (lang: Language) => void;
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
  currentLang,
  onToggleLang,
}) => {
  const t = getTranslation(currentLang);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="flex items-center justify-between px-6 py-3.5">
        {/* Zone 1: Single text element wordmark with icon anchor */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Truck className="w-4 h-4" />
        </div>
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('overview');
            }}
            className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors flex items-center gap-2"
          >
            <span>{t.appName}</span>
            <span className="text-[10px] font-mono font-normal text-amber-400/80 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              HeavyEquip
            </span>
          </a>
        </div>
      </div>

      {/* Zone 2: 4-6 clean text navigation links in Amharic */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('overview')}
          className={`transition-colors hover:text-white ${
            activeTab === 'overview' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          {t.navOverview}
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`transition-colors hover:text-white ${
            activeTab === 'inventory' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          {t.navCatalog}
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`transition-colors hover:text-white ${
            activeTab === 'sales' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          {t.navSales}
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`transition-colors hover:text-white ${
            activeTab === 'movements' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          {t.navLedger}
        </button>
        <button
          onClick={() => setActiveTab('purchase-orders')}
          className={`transition-colors hover:text-white ${
            activeTab === 'purchase-orders' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          {t.navPOs}
        </button>
        <button
          onClick={() => setActiveTab('bin-map')}
          className={`transition-colors hover:text-white ${
            activeTab === 'bin-map' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          {t.navBinMap}
        </button>
      </nav>

      {/* Zone 3: Actions + Language Toggle + Operator profile */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded text-xs font-medium">
          <button
            onClick={() => onToggleLang('am')}
            className={`px-2 py-1 rounded transition-colors ${
              currentLang === 'am'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="ቋንቋ ወደ አማርኛ ቀይር"
          >
            አማርኛ
          </button>
          <button
            onClick={() => onToggleLang('en')}
            className={`px-2 py-1 rounded transition-colors ${
              currentLang === 'en'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch language to English"
          >
            EN
          </button>
        </div>

        {/* Primary Sale Action */}
        <button
          onClick={onOpenNewSale}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors whitespace-nowrap shadow-sm"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>{t.btnNewSale}</span>
        </button>

        {/* User Switcher Dropdown */}
        <div className="relative group">
          <button
            className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-900 border border-slate-800 rounded hover:border-slate-700 transition-colors"
            title={t.activeOperator}
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
              <p className="text-[10px] text-slate-400 leading-tight">
                {currentLang === 'am'
                  ? currentUser.role === 'Parts & Store Manager'
                    ? t.roleManager
                    : t.roleSpecialist
                  : currentUser.role}
              </p>
            </div>
            <UserCheck className="w-3 h-3 text-slate-400 ml-1" />
          </button>

          {/* Quick User Selection dropdown */}
          <div className="absolute right-0 mt-1 w-64 py-1.5 bg-slate-900 border border-slate-800 rounded shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-40">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              {t.activeOperator}
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
                  <p className="text-[10px] text-slate-400">
                    {currentLang === 'am'
                      ? u.role === 'Parts & Store Manager'
                        ? t.roleManager
                        : t.roleSpecialist
                      : u.role}
                  </p>
                </div>
              </button>
            ))}
            <div className="pt-1.5 mt-1.5 border-t border-slate-800 px-2">
              <button
                onClick={onResetData}
                className="w-full flex items-center justify-center gap-1.5 px-2 py-1 text-[11px] text-slate-400 hover:text-amber-400 hover:bg-slate-800/50 rounded transition-colors"
                title={t.btnResetData}
              >
                <RefreshCw className="w-3 h-3" />
                <span>{t.btnResetData}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Responsive mobile/tablet horizontal tab bar */}
      <nav className="lg:hidden flex items-center gap-1 px-4 py-2 bg-slate-950/95 border-t border-slate-900 overflow-x-auto text-xs font-medium no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${
            activeTab === 'overview' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.navOverview}
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${
            activeTab === 'inventory' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.navCatalog}
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${
            activeTab === 'sales' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.navSales}
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${
            activeTab === 'movements' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.navLedger}
        </button>
        <button
          onClick={() => setActiveTab('purchase-orders')}
          className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${
            activeTab === 'purchase-orders' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.navPOs}
        </button>
        <button
          onClick={() => setActiveTab('bin-map')}
          className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${
            activeTab === 'bin-map' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.navBinMap}
        </button>
      </nav>
    </header>
  );
};
