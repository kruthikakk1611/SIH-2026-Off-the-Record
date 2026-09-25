import React from 'react';
import {
  LayoutDashboard,
  FolderLock,
  Users,
  Network,
  GitCompare,
  Bot,
  Bell,
  User,
  Settings,
  LogOut,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { NavPage, OfficerProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  officer: OfficerProfile;
  onLogout: () => void;
  unreadNotificationsCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  hasSecretRoomAccess?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  officer,
  onLogout,
  unreadNotificationsCount = 4,
  isMobileOpen = false,
  onCloseMobile,
  isExpanded = true,
  onToggleExpand,
}) => {
  const { t } = useLanguage();

  // Primary application navigation.
  // Note: Secret Room and Reports are strictly case-specific per architecture mandates,
  // and are accessed directly from within authorized Case Details.
  const mainNavItems: {
    id: NavPage;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string | number;
    isCriticalBadge?: boolean;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Cases', icon: FolderLock, badge: 12 },
    { id: 'suspects', label: 'Suspects', icon: Users, badge: 8 },
    { id: 'network', label: 'Connection Map', icon: Network },
    { id: 'compare', label: 'Compare Cases', icon: GitCompare },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
  ];

  const bottomNavItems: {
    id: NavPage;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string | number;
    isCriticalBadge?: boolean;
  }[] = [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      isCriticalBadge: unreadNotificationsCount > 0,
    },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (id: NavPage) => {
    onNavigate(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Law Enforcement Sidebar: Collapsible w-64 or w-20 */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 ${
          isExpanded ? 'w-64' : 'w-20'
        } bg-black text-slate-100 border-r border-slate-800 flex flex-col transition-all duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* CrimeX Logo Header & Minimize/Expand Toggle */}
        <div className="h-16 px-3.5 flex items-center justify-between border-b border-slate-800 bg-black">
          {isExpanded ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-blue-950/80 border border-blue-500/60 flex items-center justify-center shrink-0 shadow-xs">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div className="min-w-0 truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg text-white tracking-tight">
                      Crime<span className="text-blue-500">X</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white border border-slate-700 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      {t('OFFICIAL')}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    {t('Central Law-Enforcement Network')}
                  </p>
                </div>
              </div>

              {/* Collapse Button */}
              {onToggleExpand && (
                <button
                  type="button"
                  id="btn-collapse-sidebar"
                  onClick={onToggleExpand}
                  title={t('Collapse Menu')}
                  aria-label={t('Collapse Menu')}
                  className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-1"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              {onToggleExpand ? (
                <button
                  type="button"
                  id="btn-expand-sidebar"
                  onClick={onToggleExpand}
                  title={t('Expand Menu')}
                  aria-label={t('Expand Menu')}
                  className="w-10 h-10 rounded-lg bg-blue-950/60 hover:bg-blue-900 border border-blue-500/50 flex items-center justify-center text-blue-400 hover:text-white transition-colors cursor-pointer shadow-xs group"
                >
                  <PanelLeftOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              ) : (
                <div className="w-9 h-9 rounded-lg bg-blue-950/80 border border-blue-500/60 flex items-center justify-center shrink-0 shadow-xs">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Primary Navigation */}
        <nav className={`flex-1 ${isExpanded ? 'px-3 py-3 space-y-1' : 'px-2 py-3 space-y-2'} overflow-y-auto overflow-x-hidden`}>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.id || (item.id === 'cases' && currentPage === 'full-case');

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNav(item.id)}
                title={t(item.label)}
                className={`w-full flex items-center rounded-lg text-sm font-medium transition-colors cursor-pointer text-left relative group ${
                  isExpanded
                    ? 'justify-between px-3 py-2.5'
                    : 'justify-center p-2.5'
                } ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-950'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className={`flex items-center ${isExpanded ? 'gap-3' : 'justify-center'} min-w-0`}>
                  <div className="relative flex items-center justify-center">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    {!isExpanded && item.badge !== undefined && (
                      <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full text-[9px] font-mono font-bold bg-blue-500 text-white flex items-center justify-center border border-black shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {isExpanded && <span className="truncate">{t(item.label)}</span>}
                </div>

                {isExpanded && item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono shrink-0 ml-2 ${
                      item.isCriticalBadge
                        ? 'bg-red-600 text-white font-bold shadow-xs'
                        : isActive
                        ? 'bg-black text-white font-bold border border-blue-400'
                        : 'bg-slate-900 text-white border border-slate-700 font-semibold'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section: Notifications, Profile, Settings, Logout */}
        <div className={`border-t border-slate-800 bg-black ${isExpanded ? 'p-3 space-y-1' : 'p-2 space-y-2'}`}>
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNav(item.id)}
                title={t(item.label)}
                className={`w-full flex items-center rounded-lg text-sm font-medium transition-colors cursor-pointer text-left relative group ${
                  isExpanded
                    ? 'justify-between px-3 py-2'
                    : 'justify-center p-2.5'
                } ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className={`flex items-center ${isExpanded ? 'gap-3' : 'justify-center'}`}>
                  <div className="relative flex items-center justify-center">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    {!isExpanded && item.badge !== undefined && (
                      <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full text-[9px] font-mono font-bold bg-red-600 text-white flex items-center justify-center border border-black shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {isExpanded && <span className="truncate">{t(item.label)}</span>}
                </div>

                {isExpanded && item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono font-bold shrink-0 ml-2 ${
                      item.isCriticalBadge
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-800 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            id="sidebar-btn-logout"
            onClick={onLogout}
            title={t('Logout')}
            className={`w-full flex items-center rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-red-600/20 transition-colors cursor-pointer text-left ${
              isExpanded ? 'gap-3 px-3 py-2' : 'justify-center p-2.5'
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0 text-slate-400" />
            {isExpanded && <span>{t('Logout')}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
