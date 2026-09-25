export interface FIRDocument {
  caseId: string;
  firNumber: string;
  policeStation: string;
  district: string;
  state: string;
  date: string;
  time: string;
  actsAndSections: string[];
  complainant: {
    name: string;
    fatherOrHusbandName?: string;
    age?: number;
    occupation?: string;
    phone: string;
    address: string;
    relationshipToVictim?: string;
    statementSummary: string;
  };
  incidentDetails: {
    dateOfOccurrence: string;
    timeOfOccurrence: string;
    placeOfOccurrence: string;
    distanceAndDirectionFromPS: string;
    beatNo: string;
    generalDiaryReference: string;
  };
  caseDescription: string;
  investigatingOfficer: {
    name: string;
    rank: string;
    policeId: string;
    station: string;
  };
  suspectsNamedInFIR: string[];
  fullFIRText: string;
}

export const CASE_FIR_DATA: Record<string, FIRDocument> = {
  'CASE-0102': {
    caseId: 'CASE-0102',
    firNumber: 'FIR No. 109/2026 (Cyber Crime PS)',
    policeStation: 'CID Cyber Crime Police Station, Palace Road',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    date: '12 Aug 2026',
    time: '10:30 AM IST',
    actsAndSections: [
      'Section 420 IPC / 318(4) BNS (Cheating & Dishonestly Inducing Delivery of Property)',
      'Section 120B IPC / 61(2) BNS (Criminal Conspiracy)',
      'Section 467/468 IPC / 338 BNS (Forgery of Valuable Security for Purpose of Cheating)',
      'Section 66C IT Act, 2000 (Identity Theft & Fraudulent Account Use)',
      'Section 66D IT Act, 2000 (Cheating by Personation Using Computer Resource)',
    ],
    complainant: {
      name: 'Dr. Sudhir Krishnamurthy',
      fatherOrHusbandName: 'Late K. V. Krishnamurthy',
      age: 58,
      occupation: 'Chief Medical Director & Private Clinic Trustee',
      phone: '+91 98450 11982',
      address: '#412, 14th Main, Indiranagar 2nd Stage, Bengaluru - 560038',
      relationshipToVictim: 'Primary Complainant (Self & Clinic Trust Account)',
      statementSummary:
        'Complainant received multi-stage targeted spoofing communications purporting to represent banking compliance and corporate escrow. Between 08 Aug 2026 and 11 Aug 2026, unauthorized fund diversions totaling ₹2.40 Crores were routed through four sequential mule bank accounts.',
    },
    incidentDetails: {
      dateOfOccurrence: '08 Aug 2026 to 11 Aug 2026',
      timeOfOccurrence: 'Intermittent bursts between 14:15 IST and 18:30 IST',
      placeOfOccurrence: 'Electronic Banking Gateways / Indiranagar Trust Accounts / Outer Ring Rd Server Hub',
      distanceAndDirectionFromPS: 'Approx 7.2 km South-East from CID PS',
      beatNo: 'Cyber Beat-04 (Commercial Central)',
      generalDiaryReference: 'GD Entry No. 044/2026 dated 12 Aug 2026, 09:15 AM IST',
    },
    caseDescription:
      'Organized corporate identity impersonation and multi-layered electronic fund misappropriation. AI telemetry correlates intermediate transaction nodes with physical device pings at Location A (Marathahalli) and Location B (Whitefield Corridor). Multiple conspirators utilized forged corporate identity documents and burner telecommunication modules.',
    investigatingOfficer: {
      name: 'Inspector Rajesh Kumar',
      rank: 'Inspector of Police',
      policeId: 'POL-KA-2026-4491',
      station: 'CID Cyber Crime Police Station, Bengaluru',
    },
    suspectsNamedInFIR: [
      'Person A (Alias Vikram R., Prime Syndicate Coordinator)',
      'Person B (Account Aggregator / Mule Handler)',
      'Unknown Account Holders of HDFC A/C 7821 and ICICI A/C 9912',
    ],
    fullFIRText: `FIRST INFORMATION REPORT
(Under Section 154 Cr.P.C. / Section 173 Bharatiya Nagarik Suraksha Sanhita, 2023)

1. District: Bengaluru Urban | State: Karnataka
   Police Station: CID Cyber Crime Police Station, Palace Road
   FIR No: 109/2026 | Date & Time of FIR: 12 Aug 2026, 10:30 AM IST

2. Acts and Sections:
   - Sections 420, 467, 468, 120B Indian Penal Code (IPC)
   - Sections 318(4), 338, 61(2) Bharatiya Nyaya Sanhita (BNS)
   - Sections 66C & 66D Information Technology Act, 2000

3. Occurrence of Offence:
   - Day & Date: Saturday to Tuesday (08 Aug 2026 - 11 Aug 2026)
   - Time Period: Intermittent fund diversion bursts (14:15 - 18:30 IST)
   - Information received at P.S.: 12 Aug 2026 at 09:15 hrs via Written Complaint
   - General Diary Reference: Entry No. 044/2026

4. Type of Information: Written & Forensically Corroborated Complaint
   Place of Occurrence: Virtual Banking Infrastructure / Outer Ring Road Corridor
   Distance & Direction from P.S.: 7.2 km South-East | Beat No: Cyber Beat-04

5. Complainant / Informant:
   - Name: Dr. Sudhir Krishnamurthy (Age: 58)
   - Father's Name: Late K. V. Krishnamurthy
   - Address: #412, 14th Main, Indiranagar 2nd Stage, Bengaluru - 560038
   - Phone: +91 98450 11982
   - Nationality: Indian

6. Details of Known / Suspected / Unknown Accused with Full Particulars:
   1. Person A @ Vikram R. (Operating from Outer Ring Rd / Location A)
   2. Person B @ Sunil K. (Operating fund mule logistics / Location B)
   3. Unidentified conspirators operating burner terminals & spoofed gateways

7. Brief Facts of the Case:
   The complainant Dr. Sudhir Krishnamurthy lodged a comprehensive written grievance detailing unauthorized electronic debit of ₹2,40,00,000/- (Rupees Two Crores Forty Lakhs only) from clinic trust reserve accounts across three high-value RTGS tranches. Preliminary digital tracing shows rapid layering into four secondary commercial accounts and immediate cryptocurrency / cash withdrawal at monitored transit hubs. Vehicle X (Black SUV) was spotted coordinating physical pickups near Location A.

8. Action Taken:
   Since the above information reveals commission of cognizable cyber offenses under Sections 420/467/468/120B IPC and 66C/66D IT Act, case is formally registered for statutory investigation. Case handed over to Inspector Rajesh Kumar (POL-KA-2026-4491) for investigation.

9. Signatures:
   Complainant: (Dr. Sudhir Krishnamurthy)
   Registered by: Inspector Rajesh Kumar, CID Cyber Crime PS
   Supervisory Review: DGP Arjun Sharma, Director General of Police, Karnataka Command`,
  },

  'CASE-0078': {
    caseId: 'CASE-0078',
    firNumber: 'FIR No. 088/2026 (Crime Branch PS)',
    policeStation: 'Central Crime Branch Police Station, Peenya Division',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    date: '04 Jul 2026',
    time: '08:30 AM IST',
    actsAndSections: [
      'Section 379 IPC / 303(2) BNS (Theft)',
      'Section 411 IPC / 317(2) BNS (Dishonestly Receiving Stolen Property)',
      'Section 465/471 IPC / 336 BNS (Forgery & Using Forged Document as Genuine)',
      'Section 120B IPC / 61(2) BNS (Criminal Conspiracy)',
    ],
    complainant: {
      name: 'Naveen Kumar Shetty',
      fatherOrHusbandName: 'M. S. Shetty',
      age: 44,
      occupation: 'Regional Logistics Security Manager, Apex Trans-Logistics',
      phone: '+91 98452 77014',
      address: 'Plot 18, Phase 2, Peenya Industrial Complex, Bengaluru - 560058',
      relationshipToVictim: 'Corporate Custodian & Security In-Charge',
      statementSummary:
        'Physical break-in and inventory theft at primary consignment warehouse during night transit. Stolen goods comprise high-end computing components and smartphones valued at ₹85 Lakhs.',
    },
    incidentDetails: {
      dateOfOccurrence: '03 Jul 2026 to 04 Jul 2026',
      timeOfOccurrence: '02:15 AM to 04:00 AM IST',
      placeOfOccurrence: 'Warehouse Bay 4B, Peenya Industrial Estate Phase 2',
      distanceAndDirectionFromPS: '3.5 km North from CCB Peenya Outpost',
      beatNo: 'Industrial Beat-02',
      generalDiaryReference: 'GD Entry No. 018/2026 dated 04 Jul 2026, 06:45 AM IST',
    },
    caseDescription:
      'Organized warehouse burglary syndicate utilizing cloned commercial transport license plates (Vehicle T) and RF signal jammers to bypass perimeter sensors. Linkages established with stolen goods redistribution syndicates.',
    investigatingOfficer: {
      name: 'DSP S. Narayana',
      rank: 'Deputy Superintendent of Police',
      policeId: 'POL-KA-2026-3012',
      station: 'Central Crime Branch (CCB), Bengaluru',
    },
    suspectsNamedInFIR: [
      'Driver of Vehicle T (White Delivery Van, plate fake KA-02-EL-4911)',
      'Person A (Syndicate Fencer)',
      'Inside logistics night-shift conspirator',
    ],
    fullFIRText: `FIRST INFORMATION REPORT
(Under Section 154 Cr.P.C. / Section 173 Bharatiya Nagarik Suraksha Sanhita, 2023)

1. District: Bengaluru Urban | State: Karnataka
   Police Station: Central Crime Branch Police Station, Peenya Division
   FIR No: 088/2026 | Date & Time of FIR: 04 Jul 2026, 08:30 AM IST

2. Acts and Sections:
   - Sections 379, 411, 465, 471, 120B IPC
   - Sections 303(2), 317(2), 336, 61(2) BNS

3. Occurrence of Offence:
   - Date: 04 Jul 2026 between 02:15 hrs and 04:00 hrs
   - Information received at P.S.: 04 Jul 2026 at 06:45 hrs
   - General Diary Reference: Entry No. 018/2026

4. Place of Occurrence:
   - Warehouse Bay 4B, Peenya Industrial Complex Phase 2
   - Distance: 3.5 km North | Beat No: Industrial Beat-02

5. Complainant:
   - Naveen Kumar Shetty (Logistics Security Manager)
   - Apex Trans-Logistics Pvt. Ltd. | Phone: +91 98452 77014

6. Brief Facts:
   Complainant reported forced lock tampering at Bay 4B and theft of 14 sealed crates containing electronics valued at ₹85 Lakhs. Surveillance feeds show Vehicle T entered using cloned RFID passes at 02:22 AM and departed at 03:48 AM towards Tumkur Highway.

7. Action Taken:
   FIR registered under Sections 379/411/120B IPC. Investigation taken up by DSP S. Narayana (POL-KA-2026-3012).`,
  },

  'CASE-0041': {
    caseId: 'CASE-0041',
    firNumber: 'FIR No. 054/2026 (Economic Offences PS)',
    policeStation: 'Economic Offences Wing, Infantry Road',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    date: '19 Jun 2026',
    time: '11:15 AM IST',
    actsAndSections: [
      'Section 419/420 IPC (Cheating by Personation & Fraud)',
      'Section 66D IT Act, 2000',
      'Section 120B IPC (Conspiracy)',
    ],
    complainant: {
      name: 'Smt. Malini Deshmukh',
      fatherOrHusbandName: 'Girish Deshmukh',
      age: 52,
      occupation: 'Senior Research Analyst',
      phone: '+91 98453 22910',
      address: '#89, 7th Cross, Koramangala 4th Block, Bengaluru',
      statementSummary:
        'Victim lured into high-yield trading syndicate application. Total extorted amount: ₹42 Lakhs wired across multiple digital wallets.',
    },
    incidentDetails: {
      dateOfOccurrence: '10 Jun 2026 to 18 Jun 2026',
      timeOfOccurrence: 'Continuous digital communications',
      placeOfOccurrence: 'Virtual phishing portal / Koramangala residency',
      distanceAndDirectionFromPS: '4.8 km South from EOW PS',
      beatNo: 'Beat-07 Koramangala',
      generalDiaryReference: 'GD Entry No. 062/2026 dated 19 Jun 2026',
    },
    caseDescription:
      'Impersonation racket targeting banking customers via fraudulent OTP interception and simulated investment schemes. Common mule bank accounts identified linking back to digital footprints in CASE-0102.',
    investigatingOfficer: {
      name: 'Sub-Inspector Ananya Rao',
      rank: 'Sub-Inspector of Police',
      policeId: 'POL-KA-2026-5582',
      station: 'Economic Offences Wing, Bengaluru',
    },
    suspectsNamedInFIR: ['Person A', 'Person C', 'Account holder of Axis Bank A/C 4401'],
    fullFIRText: `FIRST INFORMATION REPORT
(Under Section 154 Cr.P.C.)
District: Bengaluru Urban | PS: Economic Offences Wing
FIR No: 054/2026 | Date: 19 Jun 2026, 11:15 AM
Sections: 419, 420, 120B IPC & Section 66D IT Act
Complainant: Smt. Malini Deshmukh (Age: 52)
Brief Facts: Digital investment fraud inducing victim to wire ₹42 Lakhs into fraudulent layered accounts. Investigating Officer: Sub-Inspector Ananya Rao.`,
  },
};

export const getCaseFIR = (caseId: string, caseTitle?: string, department?: string): FIRDocument => {
  if (CASE_FIR_DATA[caseId]) {
    return CASE_FIR_DATA[caseId];
  }

  // Generate a realistic, formatted FIR document for any case
  const safeTitle = caseTitle || `Investigation ${caseId}`;
  const num = caseId.replace(/[^0-9]/g, '') || '102';
  const firNum = `FIR No. ${num}/2026 (${department || 'Crime PS'})`;

  return {
    caseId,
    firNumber: firNum,
    policeStation: `${department || 'Central Crime'} Police Station, Bengaluru`,
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    date: '10 Aug 2026',
    time: '11:00 AM IST',
    actsAndSections: [
      'Section 420 IPC / 318(4) BNS (Cheating & Dishonest Inducement)',
      'Section 120B IPC / 61(2) BNS (Criminal Conspiracy)',
      'Section 66 IT Act (Computer Related Offences)',
    ],
    complainant: {
      name: 'State on Complaint / Vigilance Cell',
      phone: '+91 94808 00100',
      address: 'Police Headquarters, Palace Road, Bengaluru',
      relationshipToVictim: 'Official State Complaint',
      statementSummary: `Cognizable offence reported involving ${safeTitle}. Investigation initiated upon credible source intelligence and official docket review.`,
    },
    incidentDetails: {
      dateOfOccurrence: '05 Aug 2026 to 09 Aug 2026',
      timeOfOccurrence: 'Between 10:00 AM and 22:00 PM IST',
      placeOfOccurrence: 'Bengaluru Metropolitan Jurisdiction',
      distanceAndDirectionFromPS: '4.5 km within territorial limits',
      beatNo: 'Sector Beat-01',
      generalDiaryReference: `GD Entry No. ${num}/2026 dated 10 Aug 2026`,
    },
    caseDescription: `Official statutory FIR for ${safeTitle}. The docket has been approved by the supervisory authority for comprehensive forensic collection, witness statements, and suspect verification.`,
    investigatingOfficer: {
      name: 'Inspector In-Charge',
      rank: 'Inspector of Police',
      policeId: 'POL-KA-2026-4491',
      station: `${department || 'Crime'} Police Station`,
    },
    suspectsNamedInFIR: ['Suspect Persons Identified in Docket', 'Co-conspirators under surveillance'],
    fullFIRText: `FIRST INFORMATION REPORT
(Under Section 154 Cr.P.C. / Section 173 Bharatiya Nagarik Suraksha Sanhita, 2023)

1. District: Bengaluru Urban | State: Karnataka
   Police Station: ${department || 'Central Crime'} Police Station
   FIR No: ${firNum} | Date: 10 Aug 2026, 11:00 AM IST

2. Acts and Sections:
   - Sections 420, 120B IPC / Sections 318(4), 61(2) BNS
   - Section 66 IT Act

3. Occurrence of Offence:
   - Pertains to: ${safeTitle}
   - GD Reference: Entry No. ${num}/2026

4. Place of Occurrence: Bengaluru Metropolitan Limits

5. Complainant: State on Complaint / Vigilance Intelligence Cell

6. Brief Facts:
   Case registered based on verified preliminary inquiry regarding ${safeTitle}. Initial forensic artifacts and suspect communications collected for statutory trial preparation.

7. Action Taken: Case registered and assigned for prompt investigation.
   Supervisory Review: DGP Arjun Sharma, Director General of Police.`,
  };
};
