export interface CaseBlindSpotItem {
  id: string;
  caseId: string;
  corridor: string;
  geographicArea: string;
  surveillanceCoverage: 'None' | 'Partial' | 'Intermittent' | 'Offline';
  cctvAvailability: string;
  coverageGap: string;
  relevantSuspectMovement: string;
  vehicleInvolved?: string;
  whyIdentified: string;
  investigationRelevance: string;
  risk: 'Critical' | 'Moderate' | 'Low';
  recommendedAction: string;
  lastKnownPing?: string;
  nextConfirmedPing?: string;
}

export const CASE_SPECIFIC_BLIND_SPOTS: Record<string, CaseBlindSpotItem[]> = {
  'CASE-0102': [
    {
      id: 'BS-0102-01',
      caseId: 'CASE-0102',
      corridor: 'Route 4 Industrial Sector (Between Location A & Location B)',
      geographicArea: 'Marathahalli to Outer Ring Road Tech Enclave',
      surveillanceCoverage: 'Partial',
      cctvAvailability: 'Public ANPR at entrance toll only; zero internal feeder cameras',
      coverageGap: '28 minutes unrecorded interval (10:14 AM - 10:42 AM)',
      relevantSuspectMovement:
        'Vehicle X (Black SUV, KA-04-XX-1102) entered corridor at 10:14 AM and re-emerged 28 minutes later at Location B. Nominal travel time is only 11 minutes.',
      vehicleInvolved: 'Vehicle X (Black SUV, KA-04-XX-1102)',
      whyIdentified:
        'High 17-minute telemetry deficit along an unmonitored warehouse access lane indicates an unscheduled stop, cash handover, or physical meeting between Person A and Person B.',
      investigationRelevance:
        'Critical transfer point. Suspects likely transferred encrypted burner devices or cash envelopes before banking cutoff hours.',
      risk: 'Critical',
      recommendedAction:
        'Subpoena private retail and warehouse CCTV feeds along Old Madras Rd feeder junction.',
      lastKnownPing: 'Location A Camera #12 (10:14 AM)',
      nextConfirmedPing: 'Location B Toll Point #4 (10:42 AM)',
    },
    {
      id: 'BS-0102-02',
      caseId: 'CASE-0102',
      corridor: 'Outer Ring Road Sub-Corridor (Koramangala to Domlur)',
      geographicArea: 'Domlur Flyover Underpass & Army Golf Course Boundary',
      surveillanceCoverage: 'None',
      cctvAvailability: 'No municipal camera installation along 2.4 km perimeter fence',
      coverageGap: '15 minutes unrecorded transit',
      relevantSuspectMovement:
        'Vehicle Z (White Delivery Van) turned off headlights and deviated onto unpaved service lane at 23:10 PM.',
      vehicleInvolved: 'Vehicle Z (White Delivery Van, KA-51-M-8890)',
      whyIdentified:
        'Blind spot caused by ongoing municipal metro flyover construction. Municipal optical lines severed since June 2026.',
      investigationRelevance:
        'Permitted Vehicle Z to offload hardware parcels without optical surveillance coverage.',
      risk: 'Moderate',
      recommendedAction:
        'Deploy temporary pole-mounted cellular surveillance cams and request private petrol pump CCTV footage.',
      lastKnownPing: 'Intermediate Flyover South (23:10 PM)',
      nextConfirmedPing: 'Inner Sector Checkpoint (23:25 PM)',
    },
  ],

  'CASE-0078': [
    {
      id: 'BS-0078-01',
      caseId: 'CASE-0078',
      corridor: 'Peenya Industrial Estate Phase 2 Outer Perimeter',
      geographicArea: 'Peenya 4th Cross to Nelamangala Toll Bypass Service Road',
      surveillanceCoverage: 'Offline',
      cctvAvailability: '3 municipal cameras powered down during night grid maintenance (01:30 - 05:00 AM)',
      coverageGap: '2 hours 15 minutes complete blackout (02:15 AM - 04:30 AM)',
      relevantSuspectMovement:
        'Vehicle T (White Delivery Van) left Warehouse Bay 4B at 02:45 AM and avoided main tollway by navigating through unlit industrial service track.',
      vehicleInvolved: 'Vehicle T (Cloned Plate KA-02-EL-4911)',
      whyIdentified:
        'Pre-planned power outage exploited by perpetrators. Camera power supplies lacked secondary UPS backups.',
      investigationRelevance:
        'Allows the warehouse burglary team to load 14 stolen crates without timestamped optical records.',
      risk: 'Critical',
      recommendedAction:
        'Obtain backup security logs from private scrap metal yard opposite Gate 4 and track cell tower triangulation on Nelamangala road.',
      lastKnownPing: 'Warehouse Bay 4 Gate (02:15 AM)',
      nextConfirmedPing: 'Nelamangala Highway Toll Junction (04:42 AM)',
    },
    {
      id: 'BS-0078-02',
      caseId: 'CASE-0078',
      corridor: 'Tumkur Road Service Road Diversion Point',
      geographicArea: '8th Mile Flyover Underpass',
      surveillanceCoverage: 'Partial',
      cctvAvailability: 'Only high-angle traffic camera present; low-light resolution insufficient for license plates',
      coverageGap: 'Low resolution optical zone for 800 meters',
      relevantSuspectMovement:
        'Suspect convoy split into two diverging directions under the flyover shadow at 04:12 AM.',
      vehicleInvolved: 'Accomplice Two-Wheeler (Black Pulsar)',
      whyIdentified:
        'Sodium-vapor street lamps burned out; infrared illumination range inadequate for plate recognition.',
      investigationRelevance:
        'Indicates handover point between warehouse looters and local fencing middlemen.',
      risk: 'Moderate',
      recommendedAction:
        'Collect private ATM vestibule cameras facing North toward the service road ramp.',
      lastKnownPing: '8th Mile Signal (04:08 AM)',
      nextConfirmedPing: 'Dasanapura Checkpost (04:35 AM)',
    },
  ],

  'CASE-0041': [
    {
      id: 'BS-0041-01',
      caseId: 'CASE-0041',
      corridor: 'MG Road Commercial Banking Complex Basement Arcades',
      geographicArea: 'MG Road Metro Station Rear Concourse & Alley',
      surveillanceCoverage: 'None',
      cctvAvailability: 'Basement ATM cash drop lane cameras decommissioned during renovation',
      coverageGap: 'Zero CCTV coverage in basement parking arcade',
      relevantSuspectMovement:
        'Suspect Person C visited ATM terminal with disguised headgear to withdraw layered extortion cash.',
      vehicleInvolved: 'Unregistered Electric Scooter',
      whyIdentified:
        'Dead angle between building boundary wall and metro structural pillars.',
      investigationRelevance:
        'Allowed multiple cash withdrawals using cloned debit cards without facial capture.',
      risk: 'Critical',
      recommendedAction:
        'Cross-reference metro entry/exit smart card tap timestamps against cash dispenser log.',
      lastKnownPing: 'MG Road Metro Gate 2 (14:10 PM)',
      nextConfirmedPing: 'Church Street Junction Cam #3 (14:45 PM)',
    },
  ],
};

export const getCaseBlindSpots = (caseId: string, caseTitle?: string): CaseBlindSpotItem[] => {
  if (CASE_SPECIFIC_BLIND_SPOTS[caseId]) {
    return CASE_SPECIFIC_BLIND_SPOTS[caseId];
  }

  // Generate tailored case-specific blind spots for any other case
  const safeId = caseId || 'CASE';
  return [
    {
      id: `BS-${safeId}-01`,
      caseId,
      corridor: `Primary Transit Corridor for ${safeId}`,
      geographicArea: 'Transit Sector North-East Boundary',
      surveillanceCoverage: 'Partial',
      cctvAvailability: 'Municipal camera coverage limited to major intersections',
      coverageGap: '22 minutes unrecorded gap during peak movement window',
      relevantSuspectMovement:
        'Suspect vehicle entered unmonitored arterial road without passing secondary verification points.',
      vehicleInvolved: 'Suspect Transit Vehicle',
      whyIdentified:
        'Surveillance blind zone identified between primary junction and secondary exit road.',
      investigationRelevance:
        'Potential meeting point or diversion route during critical investigation timeline.',
      risk: 'Critical',
      recommendedAction:
        'Request private security camera recordings from commercial establishments along the sector.',
      lastKnownPing: 'Main Sector Junction (11:20 AM)',
      nextConfirmedPing: 'Outer Bypass Checkpoint (11:58 AM)',
    },
    {
      id: `BS-${safeId}-02`,
      caseId,
      corridor: 'Secondary Perimeter Service Road',
      geographicArea: 'South-West Industrial Access Lane',
      surveillanceCoverage: 'Intermittent',
      cctvAvailability: 'Low-light CCTV footage with intermittent frame drops',
      coverageGap: '12 minutes unverified window',
      relevantSuspectMovement: 'Unidentified accomplice vehicle tracked on peripheral road.',
      vehicleInvolved: 'Support Vehicle',
      whyIdentified: 'Camera angle obscured by roadside foliage and construction scaffolding.',
      investigationRelevance: 'Secondary transit corridor used for logistical staging.',
      risk: 'Moderate',
      recommendedAction: 'Trim foliage obstruction and retrieve dashcam footage from transit buses.',
      lastKnownPing: 'Industrial Gate 1 (15:30 PM)',
      nextConfirmedPing: 'Ring Road Exit (15:52 PM)',
    },
  ];
};
