import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Building2,
  Users,
  Shield,
  FileText,
} from 'lucide-react';
import { CaseRecord, CasePriority } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCase: (newCase: CaseRecord) => void;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({
  isOpen,
  onClose,
  onCreateCase,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [crimeCategory, setCrimeCategory] = useState('Organized Financial Crime');
  const [priority, setPriority] = useState<CasePriority>('High');
  const [initialSuspects, setInitialSuspects] = useState('Person A, Person B');
  const [assignedDepartment, setAssignedDepartment] = useState('Cyber Crime Investigation Wing');
  const [leadOfficer, setLeadOfficer] = useState('Inspector R. Kumar (Badge #TX-489)');
  const [initialNotes, setInitialNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomNum = Math.floor(110 + Math.random() * 880);
    const newCaseId = `CASE-0${randomNum}`;
    const code = `CX-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCase: CaseRecord = {
      id: newCaseId,
      title: title || 'New Syndicate Investigation',
      crimeType: crimeCategory,
      priority: priority,
      department: assignedDepartment,
      assignedTeam: 'Special Operations Taskforce',
      leadOfficer: leadOfficer,
      startedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      progress: 25,
      suspectsCount: initialSuspects.split(',').filter(Boolean).length || 2,
      evidenceCount: 1,
      relatedCasesCount: 1,
      accessCode: code,
      isUnlocked: true,
      summary: initialNotes || `Initial intelligence docket filed regarding ${crimeCategory.toLowerCase()}. Initial suspects identified for surveillance inquiry.`,
      aiSummary: 'CrimeX indexing preliminary entity relationships across communication towers and registry databases.',
      investigationSteps: [
        {
          title: 'FIR registered',
          completed: true,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        },
        {
          title: 'Initial suspects identified',
          completed: true,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        },
        { title: 'Evidence collected', completed: false },
        { title: 'Network analysis completed', completed: false },
        { title: 'Final investigation report', completed: false },
      ],
      investigationGaps: [
        'Vehicle movements require ANPR cross-referencing',
        'Bank accounts pending judicial disclosure order',
      ],
      suspectIds: ['SUS-01', 'SUS-02'],
      evidenceIds: ['EV-1027'],
      locations: ['Location A'],
      vehicles: ['Vehicle X'],
      relatedCaseIds: ['CASE-0102'],
    };

    onCreateCase(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#11131a] border-2 border-blue-600 rounded-2xl w-full max-w-xl p-6 sm:p-7 relative shadow-2xl animate-in fade-in zoom-in-95">
        <button
          type="button"
          id="btn-close-create-case-modal"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-800">
          <div className="w-11 h-11 rounded-xl bg-[#181b26] border border-blue-500 flex items-center justify-center text-blue-400">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-blue-300 font-bold uppercase tracking-wider">
              {t('NEW INCIDENT DOSSIER INTAKE')}
            </span>
            <h2 className="text-xl font-bold text-white">{t('Create New Case')}</h2>
          </div>
        </div>

        {/* Form Fields matching Section 16 */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-200 uppercase mb-1">
              {t('Case Title')} *
            </label>
            <input
              type="text"
              required
              id="input-create-case-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('e.g. Cross-Border Luxury Vehicle Smuggling Syndicate')}
              className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700 rounded-lg text-white font-medium placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-200 uppercase mb-1">
                {t('Crime Category')}
              </label>
              <select
                value={crimeCategory}
                onChange={(e) => setCrimeCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Organized Financial Crime">{t('Organized Financial Crime')}</option>
                <option value="Coordinated Theft Network">{t('Coordinated Theft Network')}</option>
                <option value="Cyber Fraud Network">{t('Cyber Fraud Network')}</option>
                <option value="Illegal Arms Logistics">{t('Illegal Arms Logistics')}</option>
                <option value="Narcotics Distribution Network">{t('Narcotics Distribution Network')}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-200 uppercase mb-1">
                {t('Priority')}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CasePriority)}
                className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="Critical">🔴 {t('Critical')}</option>
                <option value="High">🟠 {t('High')}</option>
                <option value="Medium">🟡 {t('Medium')}</option>
                <option value="Completed">🟢 {t('Low')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-200 uppercase mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('Initial Suspects (Comma-separated)')}</span>
            </label>
            <input
              type="text"
              value={initialSuspects}
              onChange={(e) => setInitialSuspects(e.target.value)}
              placeholder={t('e.g. Person A, Person B')}
              className="w-full px-3.5 py-2.5 bg-[#090b10] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-200 uppercase mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('Assigned Department')}</span>
              </label>
              <input
                type="text"
                value={assignedDepartment}
                onChange={(e) => setAssignedDepartment(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#090b10] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 uppercase mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('Lead Officer')}</span>
              </label>
              <input
                type="text"
                value={leadOfficer}
                onChange={(e) => setLeadOfficer(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#090b10] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-200 uppercase mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('Initial Notes & Modus Operandi')}</span>
            </label>
            <textarea
              rows={3}
              value={initialNotes}
              onChange={(e) => setInitialNotes(e.target.value)}
              placeholder={t('Provide preliminary intelligence summary, FIR reference, or informant tips...')}
              className="w-full px-3.5 py-2 bg-[#090b10] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              id="btn-submit-create-case"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              [ {t('CREATE CASE')} ]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
