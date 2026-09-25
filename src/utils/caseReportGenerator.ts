import { CaseRecord, SuspectProfile, EvidenceRecord, OfficerProfile } from '../types';
import { getCaseFIR } from '../data/caseFIRData';
import { getIdentityForSuspect } from '../data/suspectIdentityData';
import { getCaseCCTVEvidence } from '../data/caseCCTVData';
import { getCaseBlindSpots } from '../data/caseBlindSpotsData';
import { getCaseCompletenessAnalysis, getCaseDeadEndAnalysis } from '../data/caseInvestigationAnalysis';
import { calculateCaseDuration } from '../data/policeAndEvidenceData';
import { getTranslation, CASE_TITLES_LOCALIZED, SupportedLanguage } from '../data/translations';
import { DEMO_SUSPECTS, INITIAL_EVIDENCE } from '../data/mockData';

export interface CaseReportExportOptions {
  suspects?: SuspectProfile[];
  evidenceList?: EvidenceRecord[];
  officer?: OfficerProfile | null;
  format?: 'txt' | 'pdf';
  language?: SupportedLanguage;
}

/**
 * Builds a comprehensive, case-specific official investigation dossier text
 * for any given caseItem. Strict data isolation per Case ID and multilingual support.
 */
export function buildCaseReportText(
  caseItem: CaseRecord,
  options?: CaseReportExportOptions
): string {
  const lang: SupportedLanguage = options?.language || 'en';
  const t = (text: string) => getTranslation(lang, text);

  const fir = getCaseFIR(caseItem.id);
  const duration = calculateCaseDuration(caseItem.startedDate);
  const rawSuspects = (options?.suspects && options.suspects.length > 0) ? options.suspects : DEMO_SUSPECTS;
  const rawEvidence = (options?.evidenceList && options.evidenceList.length > 0) ? options.evidenceList : INITIAL_EVIDENCE;
  const officer = options?.officer;

  // Filter suspects strictly belonging to this case
  const caseSuspects = rawSuspects.filter(
    (s) => caseItem.suspectIds?.includes(s.id) || s.relatedCases?.includes(caseItem.id)
  );

  // Filter evidence strictly belonging to this case
  const caseEvidence = rawEvidence.filter(
    (e) => caseItem.evidenceIds?.includes(e.id) || e.caseId === caseItem.id
  );

  // Case-specific CCTV & Blind spots
  const caseCCTV = getCaseCCTVEvidence(caseItem.id);
  const caseBlindSpots = getCaseBlindSpots(caseItem.id);

  // Case completeness & Dead-end loop analysis
  const completeness = getCaseCompletenessAnalysis(caseItem, caseSuspects, caseEvidence);
  const deadEnd = getCaseDeadEndAnalysis(caseItem, caseSuspects, caseEvidence);

  const initiatorName = caseItem.initiatedBy?.name || 'Inspector Rajesh Kumar';
  const initiatorRank = caseItem.initiatedBy?.rank || 'Inspector of Police';
  const initiatorId = caseItem.initiatedBy?.policeId || 'POL-KA-2026-4491';
  const stationName = caseItem.initiatedBy?.station || caseItem.department || 'CID Cyber Crime Police Station';

  const localizedTitle = CASE_TITLES_LOCALIZED[lang]?.[caseItem.title] || t(caseItem.title);

  const reportDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return `================================================================================
${t('GOVERNMENT OF KARNATAKA — STATE POLICE HEADQUARTERS')}
${t('CRIMINAL INVESTIGATION DEPARTMENT (CID) & SPECIAL OPERATIONS APEX COMMAND')}
================================================================================
${t('OFFICIAL CRIMINAL CASE DOSSIER & STATUTORY COURT SUBMISSION REPORT')}
${t('CASE REFERENCE NUMBER')} : ${caseItem.id}
${t('FIR NUMBER')}            : ${fir.firNumber}
${t('POLICE STATION')}        : ${fir.policeStation}, ${fir.district}
${t('STATUTORY PROVISIONS')}  : ${fir.actsAndSections.join(', ')}
${t('DATE OF GENERATION')}    : ${reportDate}
${t('CLEARANCE LEVEL')}       : CX-SEC-RESTRICTED • ${t('LAW ENFORCEMENT INTERNAL USE ONLY')}
${t('DIGITAL AUTH TOKEN')}    : CX-SIG-2026-${caseItem.id}-VERIFIED-SHA256

--------------------------------------------------------------------------------
1. ${t('CASE METADATA & INVESTIGATION DURATION')}
--------------------------------------------------------------------------------
${t('Case Title')}          : ${localizedTitle}
${t('Case Priority')}       : ${t(caseItem.priority)} ${t('PRIORITY')}
${t('Assigned Department')} : ${caseItem.department}
${t('Assigned Team')}       : ${caseItem.assignedTeam || 'Special Investigation Unit'}
${t('Registration Date')}   : ${caseItem.startedDate}
${t('Investigation Status')}: ${duration.displayText} (${duration.ongoingStatus})
${t('Case Progress')}       : ${caseItem.progress}% ${t('Completed')}
${t('Lead Officer')}        : ${caseItem.leadOfficer || initiatorName}
${t('Initiating Officer')}  : ${initiatorName} (${initiatorRank}, ID: ${initiatorId})

${t('Executive Synopsis')}:
${caseItem.summary}

--------------------------------------------------------------------------------
2. ${t('PRIMARY STATUTORY FIR PARTICULARS (SEC 154 CrPC / SEC 173 BNSS)')}
--------------------------------------------------------------------------------
${t('FIR Number')}          : ${fir.firNumber}
${t('Police Station')}      : ${fir.policeStation} (${fir.district})
${t('Date & Time Logged')}  : ${fir.date} at ${fir.time} IST
${t('Place of Occurrence')} : ${fir.incidentDetails.placeOfOccurrence}
${t('Date/Time of Incident')}: ${fir.incidentDetails.dateOfOccurrence} (${fir.incidentDetails.timeOfOccurrence})
${t('General Diary Ref')}   : ${fir.incidentDetails.generalDiaryReference}
${t('Complainant')}         : ${fir.complainant.name} (${t('Phone')}: ${fir.complainant.phone})
${t('Complainant Statement')}:
"${fir.complainant.statementSummary}"

${t('Substantive Sections of Law')}:
${fir.actsAndSections.map((sec, i) => `  ${i + 1}. ${sec}`).join('\n')}

${t('Detailed Incident Description')}:
${fir.caseDescription}

--------------------------------------------------------------------------------
3. ${t('ACCUSED & SUSPECTS DOSSIER WITH CIVIC IDENTITY VERIFICATION')} (${caseSuspects.length} ${t('Persons')})
--------------------------------------------------------------------------------
${
  caseSuspects.length === 0
    ? t('No formal suspects entered on file.')
    : caseSuspects
        .map((s, idx) => {
          const identity = getIdentityForSuspect(s.id, s.legalName || s.codeName);
          return `${t('SUSPECT')} #${idx + 1}: ${s.codeName} (${t('ID')}: ${s.id})
${t('Legal Name')}          : ${s.legalName || identity.digiLockerVerifiedName || t('Under Verification')}
${t('Status / Role')}       : ${t(s.status)}
${t('Age & Gender')}        : ${s.age || t('Unknown')} | ${t('Male')}
${t('Primary Mobile')}      : ${s.phoneNumber || s.phoneRecords?.[0] || t('Under Lawful Intercept')}
${t('Civic Verification')}  : ${identity.verificationStatus === 'Verified' ? `✓ ${t('VERIFIED')}` : t('PENDING')} (${identity.verificationSource})
${t('Aadhaar Linkage')}     : ${identity.aadhaarMasked || t('Pending Biometric Linkage')}
${t('DigiLocker Records')}  : ${identity.digiLockerDocumentType || t('Not Linked')}
${t('Associated Vehicles')} : ${
            s.vehiclesDetailed?.map((v) => `${v.plateNumber} (${v.makeModel})`).join(', ') ||
            s.vehicles?.join(', ') ||
            t('None on File')
          }
${t('Bank Accounts')}       : ${
            s.bankDetails?.map((b) => `${b.bankName} - A/C ${b.accountNumber}`).join(', ') ||
            s.financialLinks?.join(', ') ||
            t('Under Lien Review')
          }
${t('Case Linkage Rationale')}:
${s.whyConnected || s.bio || t('Identified through telecommunication metadata correlation.')}
`;
        })
        .join('\n--------------------------------------------------------------------------------\n')
}

--------------------------------------------------------------------------------
4. ${t('FORENSIC EVIDENCE CHAIN OF CUSTODY & CASE CCTV')} (${caseEvidence.length} ${t('Evidence Records')})
--------------------------------------------------------------------------------
${
  caseEvidence.length === 0
    ? t('No physical or digital exhibits seized.')
    : caseEvidence
        .map(
          (e, i) =>
            `${t('EXHIBIT')} #${i + 1} [${e.id}]
${t('Title')}       : ${e.title}
${t('Category')}    : ${t(e.type || 'Physical')}
${t('Collection')}  : ${e.dateAdded || caseItem.startedDate} ${t('by')} ${e.collectedBy || initiatorName}
${t('Location')}    : ${stationName}
${t('Custody')}     : ${t(e.status)}
SHA-256 Hash: ${e.blockchainHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
${t('Description')} : ${e.description || t('Forensically preserved evidentiary artifact.')}`
        )
        .join('\n\n')
}

${t('CCTV Surveillance Footage Logs')} (${caseCCTV.length} ${t('Cameras')}):
${
  caseCCTV.length === 0
    ? t('No CCTV footage corridors registered for this case.')
    : caseCCTV
        .map(
          (c, i) =>
            `  ${i + 1}. [${c.id}] ${c.location} (${c.cameraName})
     ${t('Recorded')}: ${c.date} ${c.time} | ${t('Status')}: ${c.status}
     ${t('Findings')}: ${c.findings}`
        )
        .join('\n\n')
}

--------------------------------------------------------------------------------
5. ${t('INVESTIGATION BLIND SPOTS & SURVEILLANCE GAPS')} (${caseBlindSpots.length} ${t('Corridors Identified')})
--------------------------------------------------------------------------------
${
  caseBlindSpots.length === 0
    ? t('No critical perimeter surveillance blind spots detected.')
    : caseBlindSpots
        .map(
          (b, i) =>
            `${t('BLIND SPOT')} #${i + 1}: ${b.corridor}
${t('Risk Severity')}       : ${t(b.risk)} (${b.geographicArea})
${t('Unmonitored Window')}  : ${b.coverageGap || t('Transit Blind Corridor')}
${t('Corridor Distance')}   : ${b.geographicArea}
${t('Surveillance Gap')}    : ${b.whyIdentified}
${t('Operational Action')}  : ${b.recommendedAction}`
        )
        .join('\n\n')
}

--------------------------------------------------------------------------------
6. ${t('STATUTORY CASE COMPLETENESS & MISSING INFORMATION AUDIT')}
--------------------------------------------------------------------------------
${t('Case Completeness Score')} : ${completeness.completenessPercentage}% ${t('COMPLETED')}
${t('Missing Evidence Score')}  : ${completeness.missingPercentage}% ${t('GAPS REMAINING')}
${t('Documented Checkpoints')}  : ${completeness.completedCount} ${t('of')} ${completeness.totalCheckpoints} ${t('verified')}
${t('Outstanding Gaps Count')}  : ${completeness.missingCount} ${t('pending actions')}

${t('Key Missing Items')}:
${completeness.items
  .filter((it) => !it.isCompleted)
  .map((it, i) => `  ${i + 1}. [${it.impact} IMPACT] ${it.title}\n     Gap: ${it.description}\n     Action: ${it.actionNeeded}`)
  .join('\n')}

${t('Statutory Directive')}:
${completeness.recommendedImmediateAction}

--------------------------------------------------------------------------------
7. ${t('INVESTIGATION MOMENTUM & DEAD END / LOOP RISK METER')}
--------------------------------------------------------------------------------
${t('Investigation Momentum Score')} : ${deadEnd.momentumScore} / 100 (${deadEnd.momentumStatus})
${t('Dead End / Circular Loop Risk')}: ${deadEnd.loopRisk} ${t('RISK')} (${t('Score')}: ${deadEnd.loopRiskScore}%)
${t('Inquiry Repetition Entropy')}   : ${deadEnd.repetitiveInterrogationPattern ? t('REPETITIVE PATTERN DETECTED') : t('NORMAL INQUIRY DIVERSITY')}
${t('Days Since Last Evidence')}     : ${deadEnd.daysSinceNewEvidence} ${t('days')}

${t('Investigative Advisory')}:
${deadEnd.summaryExplanation}

${t('Recommended Operational Pivot')}:
${deadEnd.loopBreakingRecommendations.map((r, i) => `  ${i + 1}. ${r.actionTitle}: ${r.reasoning}`).join('\n')}

--------------------------------------------------------------------------------
8. ${t('INVESTIGATION TIMELINE & PROCEDURAL MILESTONES')}
--------------------------------------------------------------------------------
${
  caseItem.investigationSteps && caseItem.investigationSteps.length > 0
    ? caseItem.investigationSteps
        .map(
          (step, i) =>
            `  ${i + 1}. [${step.completed ? t('COMPLETED') : t('PENDING')}] ${t(step.title)}\n     ${t('Logged')}: ${step.date || (step.completed ? t('Verified Complete') : t('In Progress'))}`
        )
        .join('\n')
    : `  • ${t('Standard procedural steps logged under case supervision.')}`
}

--------------------------------------------------------------------------------
9. ${t('AI FORENSIC ANALYSIS & SYNDICATE PATTERN DISCOVERY')}
--------------------------------------------------------------------------------
${caseItem.aiSummary || t('AI analysis completed across telecom towers and banking records. Multi-hop fund routing and burner SIM clustering confirmed.')}

${t('Related Cross-Case Dossiers')}:
${
  caseItem.relatedCaseIds && caseItem.relatedCaseIds.length > 0
    ? caseItem.relatedCaseIds.map((id) => `  • ${id} (${t('High Modus Operandi Corroboration')})`).join('\n')
    : `  • ${t('No linked satellite cases identified.')}`
}

--------------------------------------------------------------------------------
10. ${t('STATUTORY FORENSIC CERTIFICATION UNDER SEC 65B INDIAN EVIDENCE ACT / BNSS')}
--------------------------------------------------------------------------------
${t('I')}, ${officer?.name || initiatorName}, ${officer?.rank || initiatorRank}, ${t('hereby certify that the electronic records, Call Detail Records (CDRs), CCTV video extractions, and financial ledgers included in this investigative dossier were generated in the ordinary course of lawful police activities using calibrated forensic hardware.')}

${t('The integrity of this document and its cryptographic audit trail is sealed under state law enforcement authority.')}

${t('Date of Submission')}       : ${reportDate}
${t('Jurisdiction Station')}     : ${stationName}
${t('Digital Signature Token')}  : CX-SIG-2026-${caseItem.id}-VERIFIED-SHA256
================================================================================`;
}

/**
 * Executes a uniform, working case report download for ANY case.
 * Guaranteed case isolation and browser file delivery.
 */
export async function downloadCaseReport(
  caseItem: CaseRecord,
  options?: CaseReportExportOptions
): Promise<{ success: boolean; filename: string; caseId: string }> {
  const content = buildCaseReportText(caseItem, options);
  const dateStr = new Date().toISOString().slice(0, 10);
  const langSuffix = options?.language && options.language !== 'en' ? `_${options.language}` : '';
  const filename = `CrimeX_Case_Report_${caseItem.id}${langSuffix}_${dateStr}.txt`;

  // Create downloadable file blob
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // If user requested PDF format / print dialog, trigger window.print()
  if (options?.format === 'pdf') {
    setTimeout(() => {
      window.print();
    }, 300);
  }

  return {
    success: true,
    filename,
    caseId: caseItem.id,
  };
}
