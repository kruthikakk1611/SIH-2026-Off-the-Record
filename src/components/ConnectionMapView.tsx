import React, { useState } from 'react';
import {
  Users,
  Car,
  MapPin,
  FolderLock,
  FileCheck2,
  Phone,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowRight,
  X,
} from 'lucide-react';
import { NetworkNode, NetworkEdge, NetworkNodeType, SuspectProfile, NavPage } from '../types';
import { NETWORK_NODES, NETWORK_EDGES, DEMO_SUSPECTS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface ConnectionMapViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenSuspectHistory?: (suspect: SuspectProfile) => void;
  preselectedNodeId?: string;
}

export const ConnectionMapView: React.FC<ConnectionMapViewProps> = ({
  onNavigate,
  onOpenSuspectHistory,
  preselectedNodeId,
}) => {
  const { t } = useLanguage();
  // Simple nodes as requested: Person, Vehicle, Location, Case, Evidence, Phone
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(() => {
    if (preselectedNodeId) {
      const found = NETWORK_NODES.find((n) => n.id === preselectedNodeId);
      if (found) return found;
    }
    return NETWORK_NODES[0];
  });

  const [zoom, setZoom] = useState<number>(1);

  const nodeTypes = [
    { id: 'all', label: t('All') },
    { id: 'person', label: t('Person') },
    { id: 'vehicle', label: t('Vehicle') },
    { id: 'location', label: t('Location') },
    { id: 'case', label: t('Case') },
    { id: 'evidence', label: t('Evidence') },
    { id: 'phone', label: t('Phone') },
  ];

  const filteredNodes = NETWORK_NODES.filter(
    (n) => selectedType === 'all' || n.type === selectedType
  );

  const getNodeIcon = (type: NetworkNodeType) => {
    switch (type) {
      case 'person':
        return <Users className="w-3.5 h-3.5 text-white" />;
      case 'vehicle':
        return <Car className="w-3.5 h-3.5 text-white" />;
      case 'location':
        return <MapPin className="w-3.5 h-3.5 text-white" />;
      case 'case':
        return <FolderLock className="w-3.5 h-3.5 text-white" />;
      case 'evidence':
        return <FileCheck2 className="w-3.5 h-3.5 text-white" />;
      case 'phone':
        return <Phone className="w-3.5 h-3.5 text-white" />;
      default:
        return <Users className="w-3.5 h-3.5 text-white" />;
    }
  };

  const getNodeColor = (type: NetworkNodeType, isSelected: boolean) => {
    if (isSelected) return 'bg-blue-900 ring-2 ring-blue-500 ring-offset-2';
    switch (type) {
      case 'person':
        return 'bg-blue-800';
      case 'vehicle':
        return 'bg-amber-600';
      case 'location':
        return 'bg-emerald-700';
      case 'case':
        return 'bg-slate-900';
      case 'evidence':
        return 'bg-indigo-700';
      case 'phone':
        return 'bg-sky-700';
      default:
        return 'bg-slate-700';
    }
  };

  const handleViewProfile = () => {
    if (!selectedNode) return;
    if (selectedNode.type === 'person') {
      const suspect = DEMO_SUSPECTS.find((s) => s.codeName === selectedNode.label);
      if (suspect && onOpenSuspectHistory) {
        onOpenSuspectHistory(suspect);
      } else {
        onNavigate('suspects');
      }
    } else if (selectedNode.type === 'case') {
      onNavigate('cases');
    } else if (selectedNode.type === 'evidence') {
      onNavigate('evidence');
    } else {
      onNavigate('suspects');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-12">
      {/* Title and Small Explanation as specified in Section 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('Connection Map')}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {t('Explore relationships between people, cases, vehicles, locations and evidence.')}
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 0.15, 1.6))}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
            title={t('Zoom In')}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.7))}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
            title={t('Zoom Out')}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
            title={t('Reset')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        {nodeTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setSelectedType(type.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedType === type.id
                ? 'bg-blue-900 text-white font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Main Graph & Small Side Panel Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Interactive Network Graph Canvas */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs h-[520px] relative overflow-hidden flex items-center justify-center select-none">
          {/* SVG Canvas for clean lines and nodes */}
          <svg
            className="w-full h-full"
            viewBox="0 0 800 500"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
          >
            {/* Background grid dots */}
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#cbd5e1" />
              </pattern>
            </defs>
            <rect width="800" height="500" fill="url(#grid)" opacity="0.4" />

            {/* Edges */}
            {NETWORK_EDGES.map((edge) => {
              const source = NETWORK_NODES.find((n) => n.id === edge.source);
              const target = NETWORK_NODES.find((n) => n.id === edge.target);
              if (!source || !target) return null;

              const isConnectedToSelected =
                selectedNode &&
                (selectedNode.id === edge.source || selectedNode.id === edge.target);

              return (
                <g key={edge.id}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={isConnectedToSelected ? '#1e3a8a' : '#94a3b8'}
                    strokeWidth={isConnectedToSelected ? 2 : 1.2}
                    strokeDasharray={edge.connectionType === 'call' ? '4,4' : undefined}
                  />
                  {isConnectedToSelected && (
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2 - 4}
                      fill="#1e3a8a"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="font-mono bg-white"
                    >
                      {t(edge.label)}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 18 : 14}
                    className={
                      isSelected
                        ? 'fill-blue-900 stroke-blue-500 stroke-2'
                        : node.type === 'person'
                        ? 'fill-blue-800'
                        : node.type === 'vehicle'
                        ? 'fill-amber-600'
                        : node.type === 'location'
                        ? 'fill-emerald-700'
                        : node.type === 'phone'
                        ? 'fill-sky-700'
                        : node.type === 'evidence'
                        ? 'fill-indigo-700'
                        : 'fill-slate-800'
                    }
                  />
                  <text
                    x={node.x}
                    y={node.y + (isSelected ? 28 : 24)}
                    textAnchor="middle"
                    fill={isSelected ? '#0f172a' : '#475569'}
                    fontSize={isSelected ? '11' : '10'}
                    fontWeight={isSelected ? '700' : '500'}
                  >
                    {t(node.label)}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick Legend at bottom-left */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs border border-slate-200 px-3 py-2 rounded-lg text-[11px] text-slate-600 space-x-3 hidden sm:flex">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-800" /> {t('Person')}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> {t('Vehicle')}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" /> {t('Location')}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-700" /> {t('Phone')}
            </span>
          </div>
        </div>

        {/* Small Side Panel as specified in Section 8 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {t(selectedNode.type)}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {t(selectedNode.label)}
                  </h3>
                  <p className="text-xs text-slate-500">{t(selectedNode.sublabel)}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                {selectedNode.details.identifier && (
                  <div>
                    <span className="text-slate-400 block">{t('Identifier')}:</span>
                    <span className="font-mono font-semibold">{selectedNode.details.identifier}</span>
                  </div>
                )}

                {selectedNode.details.relatedCases && selectedNode.details.relatedCases.length > 0 && (
                  <div>
                    <span className="text-slate-400 block">{t('Linked Cases')}:</span>
                    <span className="font-mono font-semibold text-blue-900">
                      {selectedNode.details.relatedCases.join(', ')}
                    </span>
                  </div>
                )}

                {selectedNode.details.knownLocations && (
                  <div>
                    <span className="text-slate-400 block">{t('Locations')}:</span>
                    <span>{selectedNode.details.knownLocations.join(', ')}</span>
                  </div>
                )}

                {selectedNode.details.notes && (
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-100 text-slate-600 mt-2">
                    {t(selectedNode.details.notes)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 text-center py-8">
              {t('Click any node in the graph to inspect details.')}
            </div>
          )}

          {selectedNode && (
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                id="btn-graph-view-profile"
                onClick={handleViewProfile}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#0c1527] hover:bg-blue-900 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
              >
                <span>{t('View Profile')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
