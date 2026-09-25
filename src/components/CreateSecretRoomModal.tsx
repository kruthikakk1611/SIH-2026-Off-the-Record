import React, { useState } from 'react';
import { X, Lock, Shield, Sparkles, FolderLock, Key, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { CaseRecord, OfficerProfile, SecretRoom } from '../types';
import { DEFAULT_SECRET_ROOM_PASSWORD } from '../data/simulatedUsers';
import { useLanguage } from '../context/LanguageContext';

interface CreateSecretRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: CaseRecord;
  officer: OfficerProfile;
  onCreateRoom: (room: SecretRoom) => void;
}

export const CreateSecretRoomModal: React.FC<CreateSecretRoomModalProps> = ({
  isOpen,
  onClose,
  caseItem,
  officer,
  onCreateRoom,
}) => {
  const { t } = useLanguage();
  const defaultRoomName = `${caseItem.title.slice(0, 32)} - Investigation Taskroom`;
  const [roomName, setRoomName] = useState(defaultRoomName);
  const [password, setPassword] = useState(DEFAULT_SECRET_ROOM_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [initialNote, setInitialNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      setError('Please provide a name for the Secret Room.');
      return;
    }

    const roomId = `ROOM-${caseItem.id.replace('CASE-', '')}-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const formattedTime = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newRoom: SecretRoom = {
      id: roomId,
      caseId: caseItem.id,
      caseTitle: caseItem.title,
      roomName: roomName.trim(),
      password: password.trim() || DEFAULT_SECRET_ROOM_PASSWORD,
      createdAt: now.toISOString(),
      createdByOfficerId: officer.id || 'DGP-0001',
      createdByOfficerName: officer.name || 'DGP Arjun Sharma',
      members: [
        {
          userId: officer.id || 'DGP-0001',
          name: officer.name || 'DGP Arjun Sharma',
          rank: officer.rank || 'Director General of Police (DGP)',
          department: officer.department || 'State Police Headquarters & Apex Command',
          badge: officer.badge || 'IPS-KA-DGP-001',
          isCreator: true,
          addedAt: now.toISOString(),
        },
      ],
      posts: [
        {
          id: `post-init-${Date.now()}`,
          senderId: officer.id || 'DGP-0001',
          senderName: officer.name || 'DGP Arjun Sharma',
          senderRank: officer.rank || 'Director General of Police (DGP)',
          content:
            initialNote.trim() ||
            `Created private Secret Room for ${caseItem.id}: ${caseItem.title}. Only added members with passcode clearance can collaborate here.`,
          timestamp: formattedTime,
          type: 'note',
        },
      ],
    };

    onCreateRoom(newRoom);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>{t('Create Secret Room')}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase">
                  {t('Private')}
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                {t('Exclusive workspace for case officers and invited specialists')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Associated Case Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <FolderLock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                  {caseItem.id}
                </span>
                <span>{t(caseItem.title)}</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                {t('Priority')}: <span className="font-semibold text-slate-700">{t(caseItem.priority)}</span> • {t('Category')}: <span className="font-semibold text-slate-700">{t(caseItem.category || caseItem.department || '')}</span>
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {t(error)}
            </div>
          )}

          {/* Room Name Field */}
          <div>
            <label
              htmlFor="input-secret-room-name"
              className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between"
            >
              <span>{t('Secret Room Name *')}</span>
              <span className="text-[10px] font-normal text-slate-400">{t('Descriptive identifier')}</span>
            </label>
            <input
              id="input-secret-room-name"
              type="text"
              required
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Operation Nightfall Taskroom"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-900"
            />
          </div>

          {/* Secret Room Password / Passcode */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="input-secret-room-password"
                className="text-xs font-bold text-slate-700 flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('Room Passcode / Password *')}</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                  {t('Default')}: {DEFAULT_SECRET_ROOM_PASSWORD}
                </span>
                {password !== DEFAULT_SECRET_ROOM_PASSWORD && (
                  <button
                    type="button"
                    onClick={() => setPassword(DEFAULT_SECRET_ROOM_PASSWORD)}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5 cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" /> {t('Reset')}
                  </button>
                )}
              </div>
            </div>
            <div className="relative">
              <input
                id="input-secret-room-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('Enter secret room password')}
                className="w-full pl-3.5 pr-10 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title={showPassword ? t('Hide password') : t('Show password')}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {t('Officers accessing this room will be prompted to enter this password. Default is pre-set to')} <span className="font-mono font-semibold text-slate-700">{DEFAULT_SECRET_ROOM_PASSWORD}</span>.
            </p>
          </div>

          {/* Initial Confidential Note */}
          <div>
            <label
              htmlFor="input-initial-note"
              className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between"
            >
              <span>{t('Initial Investigation Note (Optional)')}</span>
              <span className="text-[10px] font-normal text-slate-400">{t('First message in room')}</span>
            </label>
            <textarea
              id="input-initial-note"
              rows={2}
              value={initialNote}
              onChange={(e) => setInitialNote(e.target.value)}
              placeholder="e.g. Confidential channel for intercept analysis and coordination with Cyber Wing..."
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
            />
          </div>

          {/* Security & Access Notice */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-900 text-xs flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px] leading-relaxed">
              <p className="font-bold text-blue-950">{t('Room Privacy & Creator Access')}</p>
              <p className="text-blue-800">
                You (<span className="font-semibold">{officer.name || 'DGP Arjun Sharma'}</span>) will be set as the Room Administrator. You can search and add other verified CrimeX users by their ID once created.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              id="btn-confirm-create-secret-room"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('Create Secret Room & Open')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
