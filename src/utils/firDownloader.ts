import { CaseRecord } from '../types';
import { getCaseFIR, FIRDocument } from '../data/caseFIRData';

export const generateFIRDocumentText = (fir: FIRDocument): string => {
  return `================================================================================
                    GOVERNMENT OF KARNATAKA - STATE POLICE DEPARTMENT
                        FIRST INFORMATION REPORT (FIR)
               (Under Section 154 Cr.P.C. / Section 173 BNSS, 2023)
================================================================================
CRIMEX CASE ID   : ${fir.caseId}
FIR NUMBER       : ${fir.firNumber}
POLICE STATION   : ${fir.policeStation}
DISTRICT / STATE : ${fir.district}, ${fir.state}
DATE & TIME FILED: ${fir.date} at ${fir.time}
STATUS           : REGISTERED & VERIFIED ON CENTRAL LAW ENFORCEMENT DATABASE
================================================================================

1. SUBSTANTIVE SECTIONS OF LAW & STATUTORY CHARGES:
${fir.actsAndSections.map((s, idx) => `   (${idx + 1}) ${s}`).join('\n')}

--------------------------------------------------------------------------------
2. OCCURRENCE OF OFFENCE & GENERAL DIARY LOG:
   - Date of Occurrence: ${fir.incidentDetails.dateOfOccurrence}
   - Time of Occurrence: ${fir.incidentDetails.timeOfOccurrence}
   - Place of Occurrence: ${fir.incidentDetails.placeOfOccurrence}
   - Distance & Direction from PS: ${fir.incidentDetails.distanceAndDirectionFromPS}
   - Sector Beat: ${fir.incidentDetails.beatNo}
   - General Diary Reference: ${fir.incidentDetails.generalDiaryReference}

--------------------------------------------------------------------------------
3. COMPLAINANT / INFORMANT PARTICULARS:
   - Full Name: ${fir.complainant.name}
   - Father / Husband Name: ${fir.complainant.fatherOrHusbandName || 'N/A'}
   - Age: ${fir.complainant.age || 'Adult'} | Occupation: ${fir.complainant.occupation || 'N/A'}
   - Contact Phone: ${fir.complainant.phone}
   - Official Address: ${fir.complainant.address}
   - Relationship to Incident: ${fir.complainant.relationshipToVictim || 'Complainant / Aggrieved'}

   Complainant Formal Statement:
   "${fir.complainant.statementSummary}"

--------------------------------------------------------------------------------
4. DETAILED FACTS & OFFENCE NARRATIVE:
${fir.caseDescription}

--------------------------------------------------------------------------------
5. ACCUSED / SUSPECTS NAMED IN DOCKET:
${fir.suspectsNamedInFIR.map((s, idx) => `   (${idx + 1}) ${s}`).join('\n')}

--------------------------------------------------------------------------------
6. INVESTIGATING POLICE ROSTER:
   - Lead Investigating Officer : ${fir.investigatingOfficer.name} (${fir.investigatingOfficer.rank})
   - Officer Badge / Police ID  : ${fir.investigatingOfficer.policeId}
   - Police Station Base        : ${fir.investigatingOfficer.station}
   - Supervisory Endorsement    : DGP Arjun Sharma, Director General of Police, Karnataka Command

================================================================================
        CERTIFIED OFFICIAL STATUTORY COPY — KARNATAKA STATE POLICE COMMAND
================================================================================
Generated via CrimeX Central Intelligence Terminal.
Confidential & restricted to authorized law enforcement officers and judicial courts.
`;
};

export const downloadCaseFIR = async (
  caseOrId: CaseRecord | string,
  format: 'txt' | 'pdf' = 'txt'
): Promise<{ success: boolean; filename: string }> => {
  const caseId = typeof caseOrId === 'string' ? caseOrId : caseOrId.id;
  const fir = getCaseFIR(caseId);
  const cleanFirNo = fir.firNumber.replace(/[^a-zA-Z0-9]/g, '_');

  if (format === 'pdf') {
    const filename = `${caseId}_FIR_${cleanFirNo}.pdf`;
    
    // Download text backup and trigger print dialog for PDF saving
    const textContent = generateFIRDocumentText(fir);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${caseId}_FIR_${cleanFirNo}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Trigger print dialog for PDF format
    setTimeout(() => {
      window.print();
    }, 250);

    return { success: true, filename };
  } else {
    const filename = `${caseId}_FIR_${cleanFirNo}.txt`;
    const textContent = generateFIRDocumentText(fir);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, filename };
  }
};
