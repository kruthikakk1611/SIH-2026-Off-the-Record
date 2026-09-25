import { CaseRecord, SuspectProfile, EvidenceRecord } from '../types';

export interface MissingInfoItem {
  category: 'FIR' | 'Identity' | 'Suspect' | 'Witness' | 'Evidence' | 'CCTV' | 'Location' | 'Timeline' | 'Statements' | 'Related';
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  actionNeeded: string;
  isCompleted: boolean;
}

export interface CaseCompletenessAnalysis {
  caseId: string;
  completenessPercentage: number;
  missingPercentage: number;
  totalCheckpoints: number;
  completedCount: number;
  missingCount: number;
  items: MissingInfoItem[];
  criticalGapsSummary: string;
  recommendedImmediateAction: string;
}

export interface DeadEndFactor {
  title: string;
  description: string;
}

export interface LoopBreakingRecommendation {
  actionTitle: string;
  reasoning: string;
  targetSection: string;
}

export interface DeadEndLoopAnalysis {
  caseId: string;
  loopRisk: 'Low' | 'Moderate' | 'High';
  loopRiskScore: number; // 0-100
  momentumScore: number; // 0-100
  momentumLabel: 'High Velocity' | 'Sustained Momentum' | 'Stalled / Looping' | 'Critical Stagnation';
  momentumStatus: 'Strong Progress' | 'At Risk of Investigation Loop' | 'Investigation Stalled';
  detectedLoopReason: string;
  summaryExplanation: string;
  repetitiveInterrogationPattern: boolean;
  daysSinceNewEvidence: number;
  deadEndFactors: DeadEndFactor[];
  loopBreakingRecommendations: LoopBreakingRecommendation[];
  loopIndicators: {
    indicator: string;
    occurrences: string;
    riskWeight: 'High' | 'Moderate' | 'Low';
  }[];
  aiSuggestions: {
    title: string;
    direction: string;
    suggestiveNote: string;
  }[];
}

export const getCaseCompletenessAnalysis = (
  caseItem: CaseRecord,
  suspects: SuspectProfile[] = [],
  evidenceList: EvidenceRecord[] = []
): CaseCompletenessAnalysis => {
  // Case-specific customized data based on caseId
  if (caseItem.id === 'CASE-0102') {
    const items: MissingInfoItem[] = [
      {
        category: 'FIR',
        title: 'Statutory FIR Documentation',
        description: 'FIR No. 109/2026 registered with complete complainant statement & cyber provisions.',
        impact: 'High',
        actionNeeded: 'None. First Information Report registered and verified.',
        isCompleted: true,
      },
      {
        category: 'Identity',
        title: 'Aadhaar / DigiLocker Verification for Person C',
        description: 'Identity verification pending for intermediate mule handler Person C.',
        impact: 'High',
        actionNeeded: 'Initiate Aadhaar biometrics or DigiLocker verification for Person C.',
        isCompleted: false,
      },
      {
        category: 'Witness',
        title: 'Bank Branch Manager Deposition',
        description: 'Formal Section 161 CrPC / Section 180 BNSS statement from HDFC Branch Manager pending.',
        impact: 'Medium',
        actionNeeded: 'Summon HDFC Bank Nodal Officer for formal sworn deposition regarding KYC bypass.',
        isCompleted: false,
      },
      {
        category: 'CCTV',
        title: 'Route 4 Industrial Sector Surveillance Blind Spot',
        description: '28-minute coverage gap between Location A and Location B toll points.',
        impact: 'High',
        actionNeeded: 'Subpoena private retail warehouse CCTV footage along Old Madras Road corridor.',
        isCompleted: false,
      },
      {
        category: 'Evidence',
        title: 'Primary Handset Forensic Dump',
        description: 'iPhone 15 Pro Max seized; forensic chip-off analysis and Telegram decryptions verified.',
        impact: 'High',
        actionNeeded: 'None. Forensic ledger verification intact.',
        isCompleted: true,
      },
      {
        category: 'Location',
        title: 'Safehouse Location Y Secondary Lease Confirmation',
        description: 'Registered owner of Electronic City Phase 2 flat unverified in municipal records.',
        impact: 'Medium',
        actionNeeded: 'Inspect rental agreement and verify landlord identity via DigiLocker.',
        isCompleted: false,
      },
      {
        category: 'Timeline',
        title: 'Fund Transfer Synchronized Event Log',
        description: 'All 3 RTGS tranches mapped to telecom burst records.',
        impact: 'Medium',
        actionNeeded: 'None. Timeline continuity verified.',
        isCompleted: true,
      },
      {
        category: 'Statements',
        title: 'Complainant Clarification on Trust Mandate',
        description: 'Detailed financial statement and authorization letters on file.',
        impact: 'Low',
        actionNeeded: 'None. Complete documentation filed.',
        isCompleted: true,
      },
    ];

    const completed = items.filter((i) => i.isCompleted).length;
    const completeness = Math.round((completed / items.length) * 100);

    return {
      caseId: caseItem.id,
      completenessPercentage: completeness,
      missingPercentage: 100 - completeness,
      totalCheckpoints: items.length,
      completedCount: completed,
      missingCount: items.length - completed,
      items,
      criticalGapsSummary:
        '3 crucial investigation assets missing: Person C identity verification, Route 4 CCTV blind spot footage, and landlord lease KYC records.',
      recommendedImmediateAction:
        'Verify Person C using Aadhaar/DigiLocker and retrieve private commercial camera footage along Old Madras Road.',
    };
  }

  if (caseItem.id === 'CASE-0078') {
    const items: MissingInfoItem[] = [
      {
        category: 'FIR',
        title: 'FIR No. 088/2026 Documentation',
        description: 'Peenya Crime Branch FIR lodged by Logistics Security Manager.',
        impact: 'High',
        actionNeeded: 'None. FIR verified and filed.',
        isCompleted: true,
      },
      {
        category: 'Witness',
        title: 'Night Security Guard Interrogation',
        description: 'Shift security guard admitted waiving barrier seal inspection under duress.',
        impact: 'High',
        actionNeeded: 'Record magistrate statement under Section 164 CrPC.',
        isCompleted: false,
      },
      {
        category: 'CCTV',
        title: 'Night Power Grid Outage Cameras',
        description: 'Blackout between 02:15 AM - 04:30 AM along Nelamangala bypass.',
        impact: 'High',
        actionNeeded: 'Collect scrap metal yard backup optical footage opposite Gate 4.',
        isCompleted: false,
      },
      {
        category: 'Evidence',
        title: 'Cloned License Plate Metallurgical Analysis',
        description: 'False number plate KA-02-EL-4911 traced to local stamping unit.',
        impact: 'Medium',
        actionNeeded: 'Raid illicit number plate fabrication garage in Shivajinagar.',
        isCompleted: false,
      },
      {
        category: 'Suspect',
        title: 'Fencing Middleman Identification',
        description: 'Buyer of stolen electronic consignments identified as Person A associate.',
        impact: 'High',
        actionNeeded: 'Issue look-out circular and freeze beneficiary bank accounts.',
        isCompleted: false,
      },
    ];

    const completed = items.filter((i) => i.isCompleted).length;
    const completeness = Math.round((completed / items.length) * 100);

    return {
      caseId: caseItem.id,
      completenessPercentage: completeness,
      missingPercentage: 100 - completeness,
      totalCheckpoints: items.length,
      completedCount: completed,
      missingCount: items.length - completed,
      items,
      criticalGapsSummary:
        'Critical gaps in nighttime power blackout surveillance and missing stolen consignment buyer identity.',
      recommendedImmediateAction:
        'Record shift guard Section 164 statement and raid illicit number plate fabrication unit.',
    };
  }

  // Dynamic calculation for other cases
  const defaultItems: MissingInfoItem[] = [
    {
      category: 'FIR',
      title: 'Statutory First Information Report',
      description: 'Formal case docket registration and legal provisions.',
      impact: 'High',
      actionNeeded: 'None. FIR record active.',
      isCompleted: true,
    },
    {
      category: 'Identity',
      title: 'Aadhaar / DigiLocker Verification of Primary Suspect',
      description: 'Demographic and biometric corroboration against population registries.',
      impact: 'High',
      actionNeeded: 'Run simulated Aadhaar/DigiLocker verification in suspect profile.',
      isCompleted: suspects.some((s) => (s as any).isIdentityVerified),
    },
    {
      category: 'CCTV',
      title: 'Perimeter Optical Surveillance Coverage',
      description: 'High-definition timestamped footage of incident perimeter.',
      impact: 'High',
      actionNeeded: 'Cross-reference municipal camera feeds with toll data.',
      isCompleted: evidenceList.some((e) => e.type === 'CCTV' || e.title.includes('CCTV')),
    },
    {
      category: 'Witness',
      title: 'Key Witness & Informant Statements',
      description: 'Corroborating witness testimony from scene of occurrence.',
      impact: 'Medium',
      actionNeeded: 'Record supplementary witness statements under CrPC / BNSS.',
      isCompleted: false,
    },
    {
      category: 'Evidence',
      title: 'Forensic Evidence Chain of Custody',
      description: 'Digital hashes and physical artifact seizure slips.',
      impact: 'High',
      actionNeeded: 'Log pending physical seizures into blockchain evidence vault.',
      isCompleted: true,
    },
    {
      category: 'Location',
      title: 'Transit Corridor Telemetry & Geo-Mapping',
      description: 'Cellular tower pings and route tracking.',
      impact: 'Medium',
      actionNeeded: 'Check for corridor blind spots in Blind Spot Analysis.',
      isCompleted: false,
    },
  ];

  const completed = defaultItems.filter((i) => i.isCompleted).length;
  const completeness = Math.round((completed / defaultItems.length) * 100);

  return {
    caseId: caseItem.id,
    completenessPercentage: completeness,
    missingPercentage: 100 - completeness,
    totalCheckpoints: defaultItems.length,
    completedCount: completed,
    missingCount: defaultItems.length - completed,
    items: defaultItems,
    criticalGapsSummary: `Investigation docket has ${defaultItems.length - completed} missing verification elements.`,
    recommendedImmediateAction: 'Complete identity verification and retrieve corroborating witness statements.',
  };
};

export const getCaseDeadEndAnalysis = (
  caseItem: CaseRecord,
  suspects: SuspectProfile[] = [],
  evidenceList: EvidenceRecord[] = []
): DeadEndLoopAnalysis => {
  if (caseItem.id === 'CASE-0102') {
    return {
      caseId: 'CASE-0102',
      loopRisk: 'Moderate',
      loopRiskScore: 48,
      momentumScore: 68,
      momentumLabel: 'Sustained Momentum',
      momentumStatus: 'At Risk of Investigation Loop',
      detectedLoopReason:
        'Potential investigation loop detected: The investigative team has repeatedly cross-referenced Person A and Person B call detail records (7 redundant queries logged) without querying secondary shell entities.',
      summaryExplanation:
        'Investigative activity has concentrated disproportionately on Person A telecom logs with 7 redundant queries in 72 hours, while 2 critical leads (Route 4 surveillance blind spot and Person C escrow accounts) remain unattended.',
      repetitiveInterrogationPattern: true,
      daysSinceNewEvidence: 3,
      deadEndFactors: [
        {
          title: 'Redundant Wiretap Probing',
          description: '7 consecutive telecom queries on inactive burner Phone X over 72 hours.',
        },
        {
          title: 'Static Location Stakeout',
          description: 'Surveillance van deployed at Location A without fresh movement logged.',
        },
        {
          title: 'Unexamined Intermediate Courier',
          description: 'Transit link Person C identified in financial logs but unverified via DigiLocker.',
        },
      ],
      loopBreakingRecommendations: [
        {
          actionTitle: 'Examine Route 4 Surveillance Blind Spot',
          reasoning: 'Subpoena industrial corridor feeds between 10:14 AM and 10:42 AM to trace physical vehicle stop.',
          targetSection: 'blind-spots',
        },
        {
          actionTitle: 'Verify Person C Identity via DigiLocker',
          reasoning: 'Authenticate intermediate courier identity records to identify real beneficiary shell network.',
          targetSection: 'suspects',
        },
        {
          actionTitle: 'Inspect Digital Financial Thread Escrow',
          reasoning: 'Pivot inquiry from burner phone calls to unverified bank escrow account 9912.',
          targetSection: 'connections',
        },
      ],
      loopIndicators: [
        {
          indicator: 'Repeatedly interrogating the same primary node (Person A)',
          occurrences: '7 surveillance queries in last 72 hours',
          riskWeight: 'Moderate',
        },
        {
          indicator: 'Static location surveillance at Location A',
          occurrences: 'No new vehicle telemetry generated in 48 hours',
          riskWeight: 'Moderate',
        },
        {
          indicator: 'Exhausted telecom wiretap lead on Phone X',
          occurrences: 'SIM deactivated after 12 Aug 2026',
          riskWeight: 'High',
        },
      ],
      aiSuggestions: [
        {
          title: 'Branch into Intermediate Financial Escrow Nodes',
          direction: 'Pivot from Person A phone logs to the unmonitored escrow account 9912.',
          suggestiveNote:
            'Potential alternative lead: Tracing the beneficiary of the ₹1.1 Crore tranche may uncover the offline money mule network faster than continued wiretaps on defunct burner Phone X.',
        },
        {
          title: 'Examine Route 4 Industrial Sector Blind Spot',
          direction: 'Investigate the 28-minute transit deficit along Route 4.',
          suggestiveNote:
            'Consider exploring another angle: Inspect warehouse properties located between 10:14 AM and 10:42 AM checkpoints where Vehicle X likely paused.',
        },
        {
          title: 'Verify Person C and Secondary Courier',
          direction: 'Switch focus to Person C identity verification and delivery couriers.',
          suggestiveNote:
            'Potential alternative lead: Person C matches financial links in CASE-0041 and could bridge the syndicate structure.',
        },
      ],
    };
  }

  if (caseItem.id === 'CASE-0078') {
    return {
      caseId: 'CASE-0078',
      loopRisk: 'High',
      loopRiskScore: 78,
      momentumScore: 42,
      momentumLabel: 'Stalled / Looping',
      momentumStatus: 'Investigation Stalled',
      detectedLoopReason:
        'Potential investigation loop detected: The taskforce has spent 5 consecutive days inspecting warehouse perimeter locks without pursuing the cloned license plate manufacturer.',
      summaryExplanation:
        'Taskforce is cycling between repetitive warehouse door inspections (4 visits) and questioning the same night watchman without introducing external evidence or querying license plate fabrication records.',
      repetitiveInterrogationPattern: true,
      daysSinceNewEvidence: 5,
      deadEndFactors: [
        {
          title: 'Repeated Scene Inspection',
          description: '4 forensic scene visits yielding zero new physical leads.',
        },
        {
          title: 'Single-Witness Reliance',
          description: 'Re-interrogating night guard 3 times without corroborating forensic evidence.',
        },
      ],
      loopBreakingRecommendations: [
        {
          actionTitle: 'Subpoena Plate Embossing Vendor',
          reasoning: 'Check illicit registration plate stampers in Peenya Industrial Area.',
          targetSection: 'evidence',
        },
        {
          actionTitle: 'Cross-Match Vehicle Telemetry with CASE-0102',
          reasoning: 'Compare transit corridor overlap along Outer Ring Road for shared fencing syndicate.',
          targetSection: 'related-cases',
        },
      ],
      loopIndicators: [
        {
          indicator: 'Repeatedly inspecting physical warehouse entry point',
          occurrences: '4 separate forensic scene visits producing no new fingerprints',
          riskWeight: 'High',
        },
        {
          indicator: 'Focusing solely on night guard statement contradictions',
          occurrences: '3 repeated interrogations without fresh evidence',
          riskWeight: 'Moderate',
        },
      ],
      aiSuggestions: [
        {
          title: 'Trace Cloned Registration Plate Fabrication',
          direction: 'Subpoena metal embossing RTO vendor records for plate KA-02-EL-4911.',
          suggestiveNote:
            'Potential alternative lead: Illicit stamping shops in the industrial cluster often maintain unencrypted customer orders.',
        },
        {
          title: 'Cross-reference CASE-0102 Vehicle Overlap',
          direction: 'Vehicle X and Vehicle T share transit corridors along Outer Ring Road.',
          suggestiveNote:
            'Consider exploring another angle: Shared logistics fencing hub detected between CASE-0078 and CASE-0102.',
        },
      ],
    };
  }

  // Dynamic analysis for any other case
  const isHighProgress = caseItem.progress >= 70;
  return {
    caseId: caseItem.id,
    loopRisk: isHighProgress ? 'Low' : 'Moderate',
    loopRiskScore: isHighProgress ? 22 : 54,
    momentumScore: isHighProgress ? 84 : 58,
    momentumLabel: isHighProgress ? 'High Velocity' : 'Sustained Momentum',
    momentumStatus: isHighProgress ? 'Strong Progress' : 'At Risk of Investigation Loop',
    detectedLoopReason: isHighProgress
      ? 'Investigation moving at steady pace with diverse evidence types logged.'
      : 'Potential investigative loop detected: Repeated focus on known suspects without branching into secondary financial or geographical leads.',
    summaryExplanation: isHighProgress
      ? 'Investigation has steady incoming evidence, active leads, and regular timeline progression.'
      : 'Inquiry pacing indicates repetitive focus on known primary suspects without investigating peripheral associations.',
    repetitiveInterrogationPattern: !isHighProgress,
    daysSinceNewEvidence: isHighProgress ? 1 : 4,
    deadEndFactors: [
      {
        title: 'Evidence Inflow Cadence',
        description: isHighProgress ? 'Regular logging of digital and forensic artifacts.' : 'Delayed evidentiary submissions in last 4 days.',
      },
    ],
    loopBreakingRecommendations: [
      {
        actionTitle: 'Explore Secondary Network Links',
        reasoning: 'Examine second-degree connections and shared phone communications.',
        targetSection: 'connections',
      },
      {
        actionTitle: 'Review Surveillance Blind Spots',
        reasoning: 'Inspect unmonitored transit corridors for unaccounted vehicle stops.',
        targetSection: 'blind-spots',
      },
    ],
    loopIndicators: [
      {
        indicator: 'Primary suspect dossier queries',
        occurrences: 'Multiple consecutive searches on primary node',
        riskWeight: isHighProgress ? 'Low' : 'Moderate',
      },
      {
        indicator: 'Corridor surveillance verification',
        occurrences: 'Corridor coverage gaps identified',
        riskWeight: 'Moderate',
      },
    ],
    aiSuggestions: [
      {
        title: 'Explore Secondary Network Links',
        direction: 'Examine second-degree connections and shared phone communications.',
        suggestiveNote:
          'Potential alternative lead: Connecting peripheral nodes may unlock key syndicate hierarchies.',
      },
      {
        title: 'Review Surveillance Blind Spots',
        direction: 'Inspect unmonitored transit corridors for unaccounted vehicle stops.',
        suggestiveNote:
          'Consider exploring another angle: Unmonitored transit zones often conceal physical handoffs.',
      },
      {
        title: 'Verify Suspect Identity via DigiLocker / Aadhaar',
        direction: 'Establish official civic identity records to prevent name aliases.',
        suggestiveNote:
          'Potential investigative direction: Corroborate demographic details against state repositories.',
      },
    ],
  };
};
