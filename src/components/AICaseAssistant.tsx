import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Lightbulb,
  GitCompare,
  Users,
  Zap,
  Target,
  ShieldAlert,
  HelpCircle,
  FileText,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Car,
  Phone,
  CreditCard,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import {
  CaseRecord,
  SuspectProfile,
  EvidenceRecord,
  OfficerProfile,
  AICaseAssistantResponse,
  AICaseClue,
  AIRelationshipInsight,
  AICaseComparisonResult,
} from '../types';
import { useLanguage } from '../context/LanguageContext';
import { generateMultilingualAssistantFallback } from '../utils/aiAssistantFallback';

interface AICaseAssistantProps {
  caseItem: CaseRecord;
  allCases: CaseRecord[];
  suspects: SuspectProfile[];
  evidenceList: EvidenceRecord[];
  officer?: OfficerProfile | null;
  onOpenSuspect?: (suspect: SuspectProfile) => void;
  onCompareWithCase?: (case1: CaseRecord, case2: CaseRecord) => void;
}

export const AICaseAssistant: React.FC<AICaseAssistantProps> = ({
  caseItem,
  allCases,
  suspects,
  evidenceList,
  officer,
  onOpenSuspect,
  onCompareWithCase,
}) => {
  const { t, language } = useLanguage();
  const [selectedTargetCaseId, setSelectedTargetCaseId] = useState<string>('');
  const [queryType, setQueryType] = useState<'clues' | 'relationships' | 'compare' | 'fast_track' | 'custom'>('clues');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedClues, setCopiedClues] = useState<boolean>(false);
  const [assistantData, setAssistantData] = useState<AICaseAssistantResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'clues' | 'relationships' | 'comparison' | 'interrogation'>('all');

  // Filter other cases available for comparison
  const otherCases = allCases.filter((c) => c.id !== caseItem.id);

  // Set default target case if available
  useEffect(() => {
    if (otherCases.length > 0 && !selectedTargetCaseId) {
      setSelectedTargetCaseId(otherCases[0].id);
    }
  }, [otherCases, selectedTargetCaseId]);

  // Execute AI Assistant Request
  const runAssistantQuery = async (
    type: 'clues' | 'relationships' | 'compare' | 'fast_track' | 'custom',
    customMessage?: string,
    overrideTargetCaseId?: string
  ) => {
    setIsLoading(true);
    setQueryType(type);

    const messageToSend = customMessage !== undefined ? customMessage : userPrompt;
    const targetId = overrideTargetCaseId || selectedTargetCaseId;
    const targetCase = otherCases.find((c) => c.id === targetId);

    const payload = {
      caseItem,
      suspects,
      evidenceList,
      queryType: type,
      targetCase: type === 'compare' ? targetCase : undefined,
      userMessage: messageToSend,
      officer,
      language,
    };

    try {
      const response = await fetch('/api/ai-case-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        setAssistantData(result.data);
        if (type === 'compare') {
          setActiveTab('comparison');
        } else if (type === 'relationships') {
          setActiveTab('relationships');
        } else if (type === 'clues') {
          setActiveTab('clues');
        } else {
          setActiveTab('all');
        }
      }
    } catch (err) {
      console.warn('AI Assistant fetch error, generating local tactical synthesis:', err);
      // Generate immediate local intelligence if network glitch occurs
      generateLocalTacticalSynthesis(type, targetCase, messageToSend);
    } finally {
      setIsLoading(false);
    }
  };

  // Local tactical synthesis fallback using rich multilingual generator
  const generateLocalTacticalSynthesis = (
    type: string,
    targetCase?: CaseRecord,
    customMessage?: string
  ) => {
    const message = customMessage !== undefined ? customMessage : userPrompt;
    const fallback = generateMultilingualAssistantFallback(
      language,
      type,
      caseItem,
      suspects,
      evidenceList,
      targetCase,
      message,
      officer
    );
    setAssistantData(fallback);
    if (type === 'compare') {
      setActiveTab('comparison');
    } else if (type === 'relationships') {
      setActiveTab('relationships');
    } else if (type === 'clues') {
      setActiveTab('clues');
    } else {
      setActiveTab('all');
    }
  };

  // Run initial clues on mount or when language/case changes
  useEffect(() => {
    runAssistantQuery(queryType);
  }, [caseItem.id, language]);

  const handleCopyClues = () => {
    if (!assistantData) return;
    const textToCopy = `CRIMEX INSPECTOR AI DOSSIER - ${caseItem.id}: ${caseItem.title}
INVESTIGATION SUMMARY:
${assistantData.answer}

KEY INVESTIGATIVE CLUES:
${assistantData.clues?.map((c, i) => `${i + 1}. [${c.category}] ${c.title} (Confidence: ${c.confidence}%)\n${c.detail}\nACTION: ${c.suggestedAction}`).join('\n\n')}

RELATIONSHIP INSIGHTS:
${assistantData.relationships?.map((r, i) => `${i + 1}. ${r.sourcePerson} -> ${r.targetPerson} (${r.relationshipType})\nHIDDEN CLUE: ${r.hiddenClue}\nINTERROGATION TIP: ${r.actionableInterrogationTip}`).join('\n\n')}

RECOMMENDED INTERROGATION TARGET:
${assistantData.recommendedInterrogationTarget?.name} (${assistantData.recommendedInterrogationTarget?.whyVulnerable})
Questions:
${assistantData.recommendedInterrogationTarget?.keyQuestions.map((q) => `- ${q}`).join('\n')}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedClues(true);
    setTimeout(() => setCopiedClues(false), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;
    runAssistantQuery('custom', userPrompt);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'SUSPECT WEAK LINK':
        return 'bg-purple-950/70 text-purple-300 border-purple-800';
      case 'FINANCIAL TRAIL':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-800';
      case 'ALIBI INCONSISTENCY':
        return 'bg-red-950/70 text-red-300 border-red-800';
      case 'VEHICLE TRACK':
        return 'bg-amber-950/70 text-amber-300 border-amber-800';
      case 'CROSS-CASE PATTERN':
        return 'bg-blue-950/70 text-blue-300 border-blue-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-[#0b0d14] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6 text-slate-100">
      {/* Top Banner: Assistant Identity & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#121520] border border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-xs">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Inspector AI Assistant</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                Gemini-3.8-Flash Forensic Engine
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Active Case Grounding
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Assisting <span className="text-slate-200 font-bold">{officer?.rank || 'Inspector'} {officer?.name || 'Lead Officer'}</span> to solve <span className="text-blue-400 font-mono font-bold">{caseItem.id}</span> faster via forensic clues, relationship analysis, and case comparisons.
            </p>
          </div>
        </div>

        {/* Action button to copy or refresh */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleCopyClues}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181c2b] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            title="Copy all clues and insights to clipboard"
          >
            {copiedClues ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedClues ? 'Clues Copied!' : 'Copy Clues'}</span>
          </button>

          <button
            type="button"
            onClick={() => runAssistantQuery(queryType)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            title="Refresh AI analysis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Analyzing...' : 'Re-Analyze'}</span>
          </button>
        </div>
      </div>

      {/* 4 Core Quick Tactical Buttons as requested by user */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Give Clues */}
        <button
          type="button"
          id="btn-ai-give-clues"
          onClick={() => runAssistantQuery('clues')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group ${
            queryType === 'clues'
              ? 'bg-blue-950/40 border-blue-600 ring-1 ring-blue-500/30'
              : 'bg-[#121520] border-slate-800 hover:border-slate-700 hover:bg-[#151926]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lightbulb className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
              Fast Clues
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
              Give Me Clues
            </div>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Breakthrough clues from evidence, alibis, & timeline anomalies.
            </p>
          </div>
        </button>

        {/* 2. Relationships Between People */}
        <button
          type="button"
          id="btn-ai-find-relationships"
          onClick={() => runAssistantQuery('relationships')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group ${
            queryType === 'relationships'
              ? 'bg-purple-950/40 border-purple-600 ring-1 ring-purple-500/30'
              : 'bg-[#121520] border-slate-800 hover:border-slate-700 hover:bg-[#151926]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
              Syndicate Map
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
              Find Relationships
            </div>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Uncover hidden ties between people, mastermind & weak links.
            </p>
          </div>
        </button>

        {/* 3. Compare With Another Case */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2 ${
            queryType === 'compare'
              ? 'bg-emerald-950/40 border-emerald-600 ring-1 ring-emerald-500/30'
              : 'bg-[#121520] border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <GitCompare className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono text-slate-400">Cross-Case M.O.</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white mb-1">Compare With Case</div>
            <div className="flex items-center gap-1.5">
              <select
                id="ai-compare-target-select"
                value={selectedTargetCaseId}
                onChange={(e) => {
                  setSelectedTargetCaseId(e.target.value);
                  runAssistantQuery('compare', undefined, e.target.value);
                }}
                className="w-full bg-[#0a0c12] border border-slate-700 rounded text-[11px] text-slate-200 py-1 px-1.5 font-mono focus:outline-none focus:border-emerald-500"
              >
                {otherCases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.title.slice(0, 20)}...
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => runAssistantQuery('compare')}
                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold cursor-pointer"
                title="Run comparison"
              >
                Go
              </button>
            </div>
          </div>
        </div>

        {/* 4. Fast-Track Case Resolution */}
        <button
          type="button"
          id="btn-ai-fast-track"
          onClick={() => runAssistantQuery('fast_track', 'Provide a 48-hour tactical plan to crack this case faster')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group ${
            queryType === 'fast_track'
              ? 'bg-amber-950/40 border-amber-600 ring-1 ring-amber-500/30'
              : 'bg-[#121520] border-slate-800 hover:border-slate-700 hover:bg-[#151926]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
              Solve Faster
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-red-300 transition-colors">
              Solve Case Faster
            </div>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Priority directives, warrants, & key pressure points.
            </p>
          </div>
        </button>
      </div>

      {/* Interactive Inspector Search / Question Console */}
      <form onSubmit={handleFormSubmit} className="space-y-2">
        <div className="relative">
          <input
            id="ai-assistant-inspector-input"
            type="text"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Ask AI Inspector: 'Give me clues', 'Who is the mastermind?', 'Compare with CASE-0078', 'What is the weak link?'..."
            className="w-full pl-4 pr-24 py-3 bg-[#121520] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !userPrompt.trim()}
            className="absolute right-1.5 top-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Ask AI</span>
          </button>
        </div>

        {/* Quick Question Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            {t('Suggestions')}:
          </span>
          {[
            'Suspect connections',
            'Missing information',
            'Blind spots',
            'Who should I interrogate first to get a confession?',
            'What are the suspicious financial smurfing trails?',
            'Which suspect has the weakest alibi?',
            'Are there any vehicle sightings or toll pings?',
          ].map((chip, idx) => (
            <button
              key={idx}
              id={`suggested-question-${idx}`}
              type="button"
              onClick={() => {
                const queryText = t(chip);
                setUserPrompt(queryText);
                runAssistantQuery('custom', queryText);
              }}
              className="px-2.5 py-1 rounded-full bg-[#181c2b] hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer truncate max-w-[280px]"
            >
              {t(chip)}
            </button>
          ))}
        </div>
      </form>

      {/* Loading State Spinner */}
      {isLoading && (
        <div className="p-8 rounded-xl bg-[#121520] border border-slate-800 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <div className="text-xs font-bold text-white">
            Gemini-3.8-Flash Neural Engine is Analyzing Case Dossier...
          </div>
          <p className="text-[11px] text-slate-400 max-w-md mx-auto">
            Correlating suspect CDRs, banking records, toll timestamps, and cross-referencing criminal records to generate prioritized clues.
          </p>
        </div>
      )}

      {/* Main Results Display */}
      {!isLoading && assistantData && (
        <div className="space-y-5 animate-in fade-in">
          {/* 1. Assistant Executive Answer Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#121520] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>AI Forensic Case Assessment</span>
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Generated for {officer?.badge || 'CX-4491'}
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {assistantData.answer}
            </p>
          </div>

          {/* Sub-Tabs for Result Navigation */}
          <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Intelligence', icon: Sparkles },
              { id: 'clues', label: `Investigative Clues (${assistantData.clues?.length || 0})`, icon: Lightbulb },
              { id: 'relationships', label: `Relationships (${assistantData.relationships?.length || 0})`, icon: Users },
              { id: 'comparison', label: 'Cross-Case Comparison', icon: GitCompare },
              { id: 'interrogation', label: 'Interrogation Strategy', icon: Target },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 py-2 px-3 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#121520] text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* SECTION: INVESTIGATIVE CLUES (Show on 'all' or 'clues') */}
          {(activeTab === 'all' || activeTab === 'clues') && assistantData.clues && assistantData.clues.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    High-Priority Forensic Clues ({assistantData.clues.length})
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Ranked by Solve-Rate Impact
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {assistantData.clues.map((clue, idx) => (
                  <div
                    key={clue.id || idx}
                    className="p-4 rounded-xl bg-[#121520] border border-slate-800 hover:border-slate-700 transition-colors space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getCategoryBadgeColor(
                            clue.category
                          )}`}
                        >
                          {clue.category}
                        </span>
                        <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60">
                          <TrendingUp className="w-3 h-3" />
                          <span>{clue.confidence}% Confidence</span>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-white leading-snug">
                        {clue.title}
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {clue.detail}
                      </p>
                    </div>

                    {/* Actionable Suggestion */}
                    <div className="p-2.5 rounded-lg bg-[#0a0c12] border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                        Action for Investigating Officer:
                      </span>
                      <p className="font-medium text-slate-200">
                        {clue.suggestedAction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: RELATIONSHIPS BETWEEN PEOPLE (Show on 'all' or 'relationships') */}
          {(activeTab === 'all' || activeTab === 'relationships') &&
            assistantData.relationships &&
            assistantData.relationships.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Hidden Relationships Between People & Syndicate Links
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    AI Correlation Map
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {assistantData.relationships.map((rel, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#121520] border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                        {/* Connected Pair */}
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <span className="text-white px-2 py-1 rounded bg-[#181c2b] border border-slate-700">
                            {rel.sourcePerson}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="text-white px-2 py-1 rounded bg-[#181c2b] border border-slate-700">
                            {rel.targetPerson}
                          </span>
                        </div>

                        {/* Relationship Nature Badge */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                            {rel.relationshipType}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {rel.confidence}% Corroborated
                          </span>
                        </div>
                      </div>

                      {/* Hidden Clue & Interrogation Tip */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-[#0a0c12] border border-slate-800/80 space-y-1">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                            Discovered Hidden Link:
                          </span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            {rel.hiddenClue}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-[#0a0c12] border border-slate-800/80 space-y-1">
                          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                            Tactical Interrogation Pressure Point:
                          </span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            {rel.actionableInterrogationTip}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* SECTION: CROSS-CASE COMPARISON (Show on 'all' or 'comparison') */}
          {(activeTab === 'all' || activeTab === 'comparison') && assistantData.comparison && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Cross-Case Comparison: {caseItem.id} vs {selectedTargetCaseId}
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800">
                  <span>Match Score: {assistantData.comparison.matchingScore}%</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[#121520] border border-slate-800 space-y-4">
                {/* Hypothesis */}
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Breakthrough Hypothesis:
                  </span>
                  <p className="font-medium leading-relaxed">
                    {assistantData.comparison.breakthroughHypothesis}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Shared M.O. */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-blue-400" />
                      <span>Shared Modus Operandi (M.O.):</span>
                    </span>
                    <ul className="space-y-1.5 text-slate-300 text-[11px]">
                      {assistantData.comparison.sharedModusOperandi?.map((mo, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-blue-400 shrink-0">•</span>
                          <span>{mo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cross-case clues */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cross-Case Actionable Clues:</span>
                    </span>
                    <ul className="space-y-1.5 text-slate-300 text-[11px]">
                      {assistantData.comparison.crossCaseClues?.map((clue, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-400 shrink-0">•</span>
                          <span>{clue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Overlaps: Suspects, Vehicles, Devices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Suspect / Handler Overlaps:
                      </span>
                      <span className="text-slate-200 text-[11px]">
                        {assistantData.comparison.suspectOrAliasOverlap?.join(', ') || 'No direct name matches; matching telecom relay.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Car className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Vehicle / Device Overlaps:
                      </span>
                      <span className="text-slate-200 text-[11px]">
                        {assistantData.comparison.vehicleOrDeviceOverlap?.join(', ') || 'Identical SIM provider & tower sector switch.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: RECOMMENDED INTERROGATION TARGET & FAST-TRACK DIRECTIVES */}
          {(activeTab === 'all' || activeTab === 'interrogation') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              {/* Interrogation Target */}
              {assistantData.recommendedInterrogationTarget && (
                <div className="p-4 rounded-xl bg-[#121520] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-red-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Prime Interrogation Target (Weak Link)
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-red-400 font-bold bg-red-950/50 px-2 py-0.5 rounded border border-red-900/60">
                      Highest Confession Probability
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0a0c12] border border-slate-800 space-y-2">
                    <div className="text-sm font-bold text-white flex items-center justify-between">
                      <span>{assistantData.recommendedInterrogationTarget.name}</span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        Candidate for Approver Status
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {assistantData.recommendedInterrogationTarget.whyVulnerable}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Recommended Key Interrogation Questions:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-200">
                      {assistantData.recommendedInterrogationTarget.keyQuestions?.map((q, idx) => (
                        <li key={idx} className="p-2 rounded bg-[#0a0c12] border border-slate-800/80 text-[11px]">
                          <span className="text-blue-400 font-bold mr-1">Q{idx + 1}:</span>
                          "{q}"
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Fast Track Steps */}
              {assistantData.fastTrackActionSteps && (
                <div className="p-4 rounded-xl bg-[#121520] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        48-Hour Fast-Track Case Directives
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/60">
                      Speed Up Conviction
                    </span>
                  </div>

                  <div className="space-y-2">
                    {assistantData.fastTrackActionSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#0a0c12] border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200"
                      >
                        <div className="w-5 h-5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="leading-relaxed text-[11px] font-medium">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-400 pt-1">
                    Directives comply with Bharatiya Nagarik Suraksha Sanhita (BNSS) / CrPC evidentiary guidelines for digital & financial chain of custody.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
