export interface CCTVEvidenceRecord {
  id: string; // e.g. "EV-CCTV-0102-A"
  caseId: string;
  cameraName: string;
  location: string;
  relatedLocation: string;
  date: string;
  time: string;
  duration: string;
  status: 'Verified' | 'Frame Extracted' | 'Archived & Chain Intact' | 'Tamper Check Passed';
  description: string;
  resolution: string;
  frameRate: string;
  cameraModel: string;
  lensType: string;
  fileSize: string;
  sha256Hash: string;
  blockchainBlock: number;
  officerInCharge: string;
  suspectIdentified?: string;
  vehicleIdentified?: string;
  keyTimestampTag: string;
  findings: string;
  storageServer: string;
}

export const CASE_CCTV_RECORDS: Record<string, CCTVEvidenceRecord[]> = {
  'CASE-0102': [
    {
      id: 'EV-CCTV-0102-A',
      caseId: 'CASE-0102',
      cameraName: 'NHAI Electronic City Elevated Toll Plaza - Lane 04 (Inbound ANPR)',
      location: 'NH-44 KM 12.8, Electronic City Toll Plaza, Bengaluru',
      relatedLocation: 'Location A & Location Y Transit Corridor',
      date: '12 Aug 2026',
      time: '02:44:18 AM IST',
      duration: '04 min 32 sec',
      status: 'Verified',
      description:
        'High-resolution infrared optical and ANPR feed capturing Vehicle X (Black SUV, KA-04-XX-1102) passing through high-speed toll booth. Driver face matches Person A dossier characteristics.',
      resolution: '3840 x 2160 (4K UHD) @ 60 FPS',
      frameRate: '60 fps',
      cameraModel: 'Hikvision DarkFighter DS-2CD7A26G0/P-IZHS IR ANPR',
      lensType: '2.8 - 12mm Motorized Varifocal',
      fileSize: '412.8 MB (H.265 Encrypted)',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      blockchainBlock: 142091,
      officerInCharge: 'Inspector Vikram Patil (POL-KA-2026-4811)',
      suspectIdentified: 'Person A (Vikram R.) - Facial match confidence: 91.4%',
      vehicleIdentified: 'Vehicle X (Black SUV, KA-04-XX-1102)',
      keyTimestampTag: '02:44:22 AM - Vehicle slowed at toll boom, driver face illuminated by toll display',
      findings:
        'Suspect Person A confirmed behind the wheel with one unidentified male passenger in front seat. Vehicle proceeded towards Hosur Road corridor.',
      storageServer: 'KA-POLICE-CCTV-SECURE-NODE-03 (Encrypted Storage Pool)',
    },
    {
      id: 'EV-CCTV-0102-B',
      caseId: 'CASE-0102',
      cameraName: 'Outer Ring Road Tech Park South Gate - Overhead PTZ Camera #08',
      location: 'Marathahalli-Sarjapur Outer Ring Road, Near Location A Gate 3',
      relatedLocation: 'Location A (Suspect Safehouse)',
      date: '11 Aug 2026',
      time: '10:14:05 AM IST',
      duration: '08 min 14 sec',
      status: 'Frame Extracted',
      description:
        'Overhead PTZ footage capturing Vehicle X pulling into private office driveway. Person A exited vehicle carrying black leather briefcase and met Person B at perimeter staircase.',
      resolution: '1920 x 1080 (Full HD) @ 30 FPS',
      frameRate: '30 fps',
      cameraModel: 'Axis Q6075-E PTZ Network Camera 40x Zoom',
      lensType: '4.25 - 170mm Optical Zoom',
      fileSize: '286.4 MB',
      sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      blockchainBlock: 142104,
      officerInCharge: 'Sub-Inspector Ananya Rao (POL-KA-2026-5582)',
      suspectIdentified: 'Person A & Person B (Physical Meeting Corroborated)',
      vehicleIdentified: 'Vehicle X',
      keyTimestampTag: '10:16:40 AM - Physical handover of document packet between Person A and Person B',
      findings:
        'Conclusive visual evidence connecting Person A directly with Person B prior to the second fund diversion batch.',
      storageServer: 'KA-POLICE-CCTV-SECURE-NODE-01 (Digital Evidence Vault)',
    },
  ],

  'CASE-0078': [
    {
      id: 'EV-CCTV-0078-A',
      caseId: 'CASE-0078',
      cameraName: 'Peenya Logistics Park Main Gate - Commercial Vehicle Scanner Cam #01',
      location: 'Gate 1 Inbound, Phase 2, Peenya Industrial Complex',
      relatedLocation: 'Warehouse Bay 4B',
      date: '04 Jul 2026',
      time: '02:22:45 AM IST',
      duration: '06 min 10 sec',
      status: 'Tamper Check Passed',
      description:
        'Infrared optical night-vision feed showing Vehicle T (White Delivery Van) using forged gate barcode. Vehicle loaded with 14 electronic cargo cartons.',
      resolution: '2560 x 1440 (2K QHD) @ 30 FPS',
      frameRate: '30 fps',
      cameraModel: 'Dahua IPC-HFW5442E-ZE NightColor IR',
      lensType: '2.7 - 12mm Varifocal',
      fileSize: '195.2 MB',
      sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      blockchainBlock: 139882,
      officerInCharge: 'DSP S. Narayana (POL-KA-2026-3012)',
      suspectIdentified: 'Driver of Vehicle T with concealed baseball cap',
      vehicleIdentified: 'Vehicle T (White Delivery Van with false plates KA-02-EL-4911)',
      keyTimestampTag: '02:24:10 AM - Rear cargo door opened by inside warehouse contact',
      findings:
        'Proves complicity of warehouse night security guard who waived standard physical seal inspection.',
      storageServer: 'KA-POLICE-CCTV-SECURE-NODE-02',
    },
  ],

  'CASE-0041': [
    {
      id: 'EV-CCTV-0041-A',
      caseId: 'CASE-0041',
      cameraName: 'State Bank ATM Vestibule Internal Cam #02',
      location: 'MG Road Metro Station Arcade, Level -1',
      relatedLocation: 'Virtual Phishing Money Trail',
      date: '19 Jun 2026',
      time: '14:22:10 PM IST',
      duration: '03 min 45 sec',
      status: 'Frame Extracted',
      description:
        'Internal ATM camera capturing suspect Person C withdrawing ₹1.2 Lakhs using cloned magnetic stripe card.',
      resolution: '1920 x 1080 @ 30 FPS',
      frameRate: '30 fps',
      cameraModel: 'Wisenet SNV-6084R Vandal Dome',
      lensType: '3 - 8.5mm Varifocal',
      fileSize: '112.5 MB',
      sha256Hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      blockchainBlock: 137450,
      officerInCharge: 'Sub-Inspector Ananya Rao',
      suspectIdentified: 'Person C (Physical resemblance confirmed)',
      keyTimestampTag: '14:23:05 PM - Cash extraction from dispenser using cloned card',
      findings:
        'Cloned debit card serial matches the counterfeit batch uncovered in CASE-0102.',
      storageServer: 'KA-POLICE-CCTV-SECURE-NODE-01',
    },
  ],
};

export const getCaseCCTVEvidence = (caseId: string, caseTitle?: string): CCTVEvidenceRecord[] => {
  if (CASE_CCTV_RECORDS[caseId]) {
    return CASE_CCTV_RECORDS[caseId];
  }

  // Generate realistic case-specific CCTV evidence for any other case
  const safeId = caseId || 'CASE';
  return [
    {
      id: `EV-CCTV-${safeId}-01`,
      caseId,
      cameraName: `Municipal Transit Camera #14 (${safeId} Surveillance Grid)`,
      location: `Primary Junction, Sector 4, Bengaluru`,
      relatedLocation: `Incident Perimeter for ${safeId}`,
      date: '10 Aug 2026',
      time: '11:45:00 AM IST',
      duration: '05 min 15 sec',
      status: 'Verified',
      description: `Surveillance footage capturing suspect movements and vehicular transit relevant to ${caseTitle || safeId}. Video forensics verified and archived.`,
      resolution: '1920 x 1080 (Full HD) @ 30 FPS',
      frameRate: '30 fps',
      cameraModel: 'Hikvision DarkFighter DS-2CD',
      lensType: 'Varifocal Motorized Lens',
      fileSize: '240.5 MB',
      sha256Hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      blockchainBlock: 142095,
      officerInCharge: 'Lead Investigating Officer',
      suspectIdentified: 'Suspect Person monitored in case docket',
      keyTimestampTag: '11:46:12 AM - Suspect movement logged at perimeter intersection',
      findings: `Corroborates chronological timeline and verifies presence at key location.`,
      storageServer: 'KA-POLICE-CCTV-SECURE-NODE-01',
    },
  ];
};
