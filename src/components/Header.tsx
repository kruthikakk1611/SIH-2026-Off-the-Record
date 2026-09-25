import React, { useState } from 'react';
import { Search, Bell, Menu, Sparkles, X } from 'lucide-react';
import { OfficerProfile, CaseActivityNotification, NavPage, CaseRecord } from '../types';
import { PoliceEmblem } from './PoliceEmblem';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  officer: OfficerProfile;
  selectedCase?: CaseRecord;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  notifications: CaseActivityNotification[];
  onNavigate: (page: NavPage) => void;
  onOpenDemoFlowModal: () => void;
  currentDemoStep?: number;
}

export const Header: React.FC<HeaderProps> = ({
  officer,
  selectedCase,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  notifications,
  onNavigate,
  onOpenDemoFlowModal,
  currentDemoStep,
}) => {
  const { language, t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(notifications.length);

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchQuery);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setUnreadCount(0);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
      {/* Top Demo Bar - Black, White, and Blue with Tactical Red Live Pulse */}
      <div className="bg-black px-4 sm:px-6 lg:px-8 py-1.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
          </span>
          <span className="font-extrabold text-white tracking-wider">{t('POLICE INTELLIGENCE TERMINAL')}</span>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span className="text-blue-400 hidden md:inline font-semibold">{t('Central Law-Enforcement Network')}</span>
        </div>

        {/* Top Actions: Presentation Mode */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-open-presentation-flow"
            onClick={onOpenDemoFlowModal}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>{t('Guided Case Story')}</span>
            <span className="bg-black text-white px-1.5 rounded text-[10px] font-mono font-bold">
              {currentDemoStep || 1}/19
            </span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Mobile menu button & Officer Status */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-800 hover:text-black hover:bg-slate-100 border border-slate-200 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-base font-extrabold text-black tracking-tight flex items-center gap-2">
              <span>{officer.name}</span>
              <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-blue-600 text-white font-bold">
                {t(officer.rank || 'Inspector')}
              </span>
            </h2>
            <p className="text-xs text-slate-500 hidden sm:block font-medium">
              {officer.district ? `${officer.district}, ` : ''}{officer.state || 'Karnataka'} • <span className="text-blue-700 font-semibold">{t(officer.department)}</span>
            </p>
          </div>
        </div>

        {/* Clean Global Search Bar */}
        <div className="flex-1 max-w-md mx-2 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              placeholder={t('Search Case ID, Person, Vehicle...')}
              className="w-full pl-9 pr-20 py-1.5 bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-lg text-xs sm:text-sm text-black placeholder-slate-400 focus:bg-white focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => onSearchSubmit(searchQuery)}
              className="absolute right-1 top-1 px-3 py-1 bg-black hover:bg-blue-600 text-white rounded text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              {t('Search')}
            </button>
          </div>
        </div>

        {/* Actions: Language Selector, Notifications, and Police Logo (Top-Right) */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          {/* Multi-Language Selector */}
          <LanguageSelector />

          <div className="relative">
            <button
              type="button"
              id="btn-notifications-toggle"
              onClick={handleNotificationClick}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-colors relative cursor-pointer"
              title={t('Recent Case Updates & Alerts')}
            >
              <Bell className="w-4 h-4 text-black" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-extrabold text-black uppercase tracking-wider">
                      {t('Recent Activity')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-black cursor-pointer text-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-xs transition-colors cursor-pointer"
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate('cases');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-black">{t(n.title)}</span>
                        <span className="text-[10px] font-mono text-slate-400">{n.timeAgo}</span>
                      </div>
                      <p className="text-slate-600 mt-1 line-clamp-2">{t(n.message)}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 mt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('notifications');
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    {t('View All Activity Logs →')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Official Police Logo / Emblem in Top-Right Corner */}
          <PoliceEmblem size="md" />
        </div>
      </div>
    </header>
  );
};
