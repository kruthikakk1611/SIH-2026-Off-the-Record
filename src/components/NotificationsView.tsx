import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Shield, Clock } from 'lucide-react';
import { CaseActivityNotification, NavPage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NotificationsViewProps {
  notifications: CaseActivityNotification[];
  onNavigate?: (page: NavPage) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onNavigate,
}) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('Notifications')}</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {t('Priority alert dispatches, intelligence updates, and investigative audit logs.')}
        </p>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
            {t('No active notifications at this time.')}
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors flex items-start gap-3.5"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  notif.type === 'alert'
                    ? 'bg-red-50 text-red-700'
                    : notif.type === 'evidence'
                    ? 'bg-blue-50 text-blue-900'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {notif.type === 'alert' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : notif.type === 'evidence' ? (
                  <Shield className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{t(notif.title)}</h3>
                  <span className="text-xs font-mono text-slate-400 shrink-0">
                    {t(notif.timeAgo || notif.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t(notif.message)}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
                  <span>{t('Case')}: {notif.caseId}</span>
                  <span>•</span>
                  <span>{t('Agent')}: {notif.officer}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
