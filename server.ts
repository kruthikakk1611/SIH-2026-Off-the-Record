import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";
import { generateMultilingualAssistantFallback } from "./src/utils/aiAssistantFallback";
import { CASE_SPECIFIC_BLIND_SPOTS } from "./src/data/caseBlindSpotsData";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialization of Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Generate an AI-formulated unique transmission passkey & encryption hash
function generateFallbackKey(caseId: string): string {
  const salt = crypto.randomBytes(4).toString("hex").toUpperCase();
  const hashPart = crypto.createHash("sha256").update(`${caseId}-${Date.now()}`).digest("hex").slice(0, 6).toUpperCase();
  return `SEC-${salt.slice(0, 4)}-${hashPart}`;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    system: "Aegis AI Criminal Analysis Terminal",
    timestamp: new Date().toISOString(),
    aiEngine: process.env.GEMINI_API_KEY ? "Gemini-3.8-Flash (Active)" : "Offline Heuristic Mode",
  });
});

// AI Generate Unique Transmission Key & Security Descriptor
app.post("/api/generate-case-key", async (req, res) => {
  try {
    const { caseId, threatLevel, category } = req.body;
    const ai = getGenAI();

    let securityCode = "";
    let encryptionStandard = "AES-GCM-256 / Quantum Transmission Handshake";
    let entropyScore = 98.4;
    let clearanceNotice = "STRICT LAW ENFORCEMENT TRANSMISSION ONLY. UNAUTHORIZED INTERCEPTION PROHIBITED.";

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: `You are the cryptographic subsystem for Aegis Police Intelligence Terminal.
Generate a military-grade unique encrypted access key code for criminal case ${caseId || "CASE-UNKNOWN"} with threat level ${threatLevel || "CRITICAL"} and category ${category || "General"}.
The code MUST be formatted strictly like: "SEC-[4 letters/digits]-[4 letters/digits]-[4 letters/digits]" (e.g., SEC-9X7P-44BQ-01MA).
Provide ONLY JSON output matching this schema:
{
  "code": "SEC-XXXX-XXXX-XXXX",
  "encryptionStandard": "AES-256-GCM / Ephemeral Key Exchange",
  "entropyScore": 99.2,
  "clearanceNotice": "One sentence law enforcement cryptographic security advisory"
}`,
          config: {
            responseMimeType: "application/json",
          },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text.trim());
          if (parsed.code) {
            securityCode = parsed.code;
            if (parsed.encryptionStandard) encryptionStandard = parsed.encryptionStandard;
            if (parsed.entropyScore) entropyScore = parsed.entropyScore;
            if (parsed.clearanceNotice) clearanceNotice = parsed.clearanceNotice;
          }
        }
      } catch (err) {
        console.warn("Gemini API key generation fallback:", err);
      }
    }

    if (!securityCode) {
      securityCode = generateFallbackKey(caseId || "CASE");
    }

    const transmissionHash = crypto.createHash("sha256").update(`${securityCode}-${caseId}`).digest("hex");

    res.json({
      success: true,
      securityCode,
      transmissionHash,
      encryptionStandard,
      entropyScore,
      issuedAt: new Date().toISOString(),
      expiresInMinutes: 30,
      clearanceNotice,
    });
  } catch (error: any) {
    console.error("Error generating key:", error);
    res.status(500).json({ error: error.message || "Failed to generate security code" });
  }
});

// AI Analyze Case Evidence in High-Contrast Terminal Format
app.post("/api/ai-analyze-case", async (req, res) => {
  try {
    const { caseTitle, category, district, state, evidenceLogs, suspectNotes, threatLevel } = req.body;
    const ai = getGenAI();

    if (ai) {
      try {
        const prompt = `You are Aegis-9 Neural Crime Intelligence Terminal, an advanced forensic crime analysis AI.
Analyze the following active criminal file:
Title: ${caseTitle}
Category: ${category}
Jurisdiction: ${district}, ${state}
Threat Level: ${threatLevel}
Initial Evidence: ${JSON.stringify(evidenceLogs || [])}
Suspect Intelligence: ${suspectNotes || "Multiple unidentified persons of interest."}

Synthesize a comprehensive, high-contrast forensic criminal analysis. Return strictly valid JSON:
{
  "threatScore": 88,
  "modusOperandi": "Concise forensic breakdown of criminal M.O.",
  "flightRisk": "HIGH" | "CRITICAL" | "MODERATE",
  "criticalEvidenceSummaries": [
    "High-contrast bullet 1 analyzing physical / ballistics / forensic link",
    "High-contrast bullet 2 analyzing digital intercepts / cell tower triangulation",
    "High-contrast bullet 3 analyzing financial laundering / syndicate trail",
    "High-contrast bullet 4 analyzing timeline inconsistency / alibi invalidation"
  ],
  "forensicHypothesis": "Synthesized AI deduction on motive and next probable move",
  "tacticalDirectives": [
    "Directive 1 for tactical unit",
    "Directive 2 for forensic search",
    "Directive 3 for digital wiretap surveillance"
  ]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text.trim());
          return res.json({ success: true, analysis: parsed });
        }
      } catch (err) {
        console.warn("Gemini AI case analysis fallback:", err);
      }
    }

    // High quality deterministic fallback
    res.json({
      success: true,
      analysis: {
        threatScore: threatLevel === "CRITICAL" ? 94 : threatLevel === "HIGH" ? 82 : 68,
        modusOperandi: `Sophisticated execution with counter-surveillance techniques in ${district}. Electronic signatures masked via multi-hop burner proxies.`,
        flightRisk: threatLevel === "CRITICAL" ? "CRITICAL" : "HIGH",
        criticalEvidenceSummaries: [
          `[BALLISTICS & FORENSICS] Microscopic toolmarks match unregistered weapon series recovered in ${district} sector 4.`,
          `[DIGITAL TELEMETRY] Encrypted SIM handshakes recorded on cell tower #409-TX at 02:44:11Z. Signal spoofed through VPN relay.`,
          `[SYNTHETIC SURVEILLANCE] Facial recognition match (92.4% confidence) against state biometric blacklist at regional transit terminal.`,
          `[FINANCIAL TRACE] 4 micro-transactions split across decentralized cold-wallets within 8 minutes of the incident.`,
        ],
        forensicHypothesis: `Cross-referencing pattern database indicates pre-planned syndicate operation. Subject is likely operating from safehouse within 15km perimeter of ${district}.`,
        tacticalDirectives: [
          `Authorize emergency geofence warrant for sector ${district} cellular relays.`,
          `Deploy forensic ballistics units to match shell casing striations against national registry.`,
          `Place all international transit checkpoints on Class-1 biometrics watch.`,
        ],
      },
    });
  } catch (error: any) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze case" });
  }
});

// AI Generate New Case with Automatic Security Transmission Passkey
app.post("/api/ai-generate-case", async (req, res) => {
  try {
    const { title, category, district, state, description, officerDesignation } = req.body;
    const ai = getGenAI();

    let autoKey = generateFallbackKey("NEW");
    let aiSynthesis = null;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: `You are Aegis Police Intelligence Terminal.
A new incident report is being logged:
Title: ${title}
Category: ${category}
Location: ${district}, ${state}
Reporting Officer: ${officerDesignation}
Description: ${description}

Generate realistic criminal file details, including an AI-generated unique security code for encrypted transmission, threat evaluation, suspect profile, and 4 critical evidence bullet points formatted for a terminal interface.
Format response as strictly JSON:
{
  "caseNumber": "CR-2026-XXXX",
  "securityCode": "SEC-XXXX-XXXX-XXXX",
  "threatLevel": "CRITICAL" | "HIGH" | "ELEVATED",
  "suspectAlias": "Suspect alias or unidentified moniker",
  "modusOperandi": "2 sentence summary of execution pattern",
  "criticalEvidence": [
    "[PHYSICAL] ...",
    "[CYBER/INTERCEPT] ...",
    "[WITNESS/BIOMETRIC] ...",
    "[FORENSIC] ..."
  ],
  "primaryLead": "Investigative lead description"
}`,
          config: {
            responseMimeType: "application/json",
          },
        });

        const text = response.text;
        if (text) {
          aiSynthesis = JSON.parse(text.trim());
          if (aiSynthesis.securityCode) {
            autoKey = aiSynthesis.securityCode;
          }
        }
      } catch (err) {
        console.warn("Case creation AI synthesis fallback:", err);
      }
    }

    if (!aiSynthesis) {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      aiSynthesis = {
        caseNumber: `CR-2026-${randNum}`,
        securityCode: autoKey,
        threatLevel: "HIGH",
        suspectAlias: "Subject Raven / Syndicate Cell 3",
        modusOperandi: `Targeted coordinated infiltration exploiting low-light camera blindspots across ${district}.`,
        criticalEvidence: [
          `[FORENSIC] Trace nitrocellulose residue detected at point of entry.`,
          `[CYBER/INTERCEPT] Jamming frequency 433.92 MHz detected by perimeter RF sensors.`,
          `[BIOMETRIC] Partial latent footprint corresponds to tactical combat footwear size 11.5.`,
          `[SURVEILLANCE] Black sedan without registration plates captured on traffic cameras at 03:19 AM.`,
        ],
        primaryLead: `Locate surveillance footage from adjacent industrial gas depot on highway arterial.`,
      };
    }

    res.json({
      success: true,
      caseData: {
        id: aiSynthesis.caseNumber || `CR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: title || "Unclassified Incident Report",
        category: category || "Organized Crime",
        state: state || "State Central",
        district: district || "Metropolitan Zone",
        threatLevel: aiSynthesis.threatLevel || "HIGH",
        status: "ACTIVE",
        suspect: aiSynthesis.suspectAlias || "Unidentified Suspect",
        securityCode: aiSynthesis.securityCode || autoKey,
        encryptionHash: crypto.createHash("sha256").update(aiSynthesis.securityCode || autoKey).digest("hex"),
        openedDate: new Date().toISOString(),
        criticalEvidence: aiSynthesis.criticalEvidence,
        modusOperandi: aiSynthesis.modusOperandi,
        primaryLead: aiSynthesis.primaryLead,
        reportingOfficer: officerDesignation || "Investigating Officer",
      },
    });
  } catch (error: any) {
    console.error("Create case error:", error);
    res.status(500).json({ error: error.message || "Failed to create case" });
  }
});

// AI Case Detective Assistant Endpoint (Investigative Clues, Cross-Case Comparison, Relationship Insights)
app.post("/api/ai-case-assistant", async (req, res) => {
  try {
    const {
      caseItem,
      suspects = [],
      evidenceList = [],
      queryType = "clues",
      targetCase,
      userMessage = "",
      officer,
      language = "en",
    } = req.body;

    if (!caseItem) {
      return res.status(400).json({ error: "caseItem is required" });
    }

    const langMap: Record<string, string> = {
      en: "English",
      hi: "Hindi (हिंदी)",
      kn: "Kannada (ಕನ್ನಡ)",
      ta: "Tamil (தமிழ்)",
      te: "Telugu (తెలుగు)",
      ml: "Malayalam (മലയാളം)",
      mr: "Marathi (मराठी)",
    };
    const targetLang = langMap[language] || "English";

    const ai = getGenAI();
    let assistantResult: any = null;

    // Ground strictly on the active case
    const caseBlindSpots = CASE_SPECIFIC_BLIND_SPOTS[caseItem.id] || [];
    const investigationGaps = caseItem.investigationGaps || [];
    const mappedSuspects = suspects.map((s: any) => ({
      id: s.id,
      name: s.legalName || s.name || s.codeName || s.id,
      codeName: s.codeName,
      alias: s.alias,
      role: s.role,
      status: s.status,
      riskLevel: s.riskLevel,
      connections: s.connections,
      whyConnected: s.whyConnected,
      phone: s.phone,
      bankDetails: s.bankDetails
        ? { bank: s.bankDetails.bankName, balance: s.bankDetails.currentBalance }
        : undefined,
      vehicles: s.vehicles ? s.vehicles.map((v: any) => v.plateNumber) : undefined,
    }));

    if (ai) {
      try {
        const prompt = `You are CrimeX Inspector AI Assistant, a forensic detective intelligence system helping police inspectors and CID detectives solve active cases faster.

CRITICAL INSTRUCTION - SPECIFIC QUESTION FOCUS:
The inquiring officer has asked: "${userMessage || "Provide strategic investigative clues and relationships to solve this case faster"}".
You MUST generate an analysis and answer specifically and directly addressing this question for active Case ${caseItem.id} ("${caseItem.title}").
- Do NOT output a generic summary. Address the specific focus of the officer's question:
  * If the question asks about "Suspect connections" (or suspect links, hierarchy, network, relationships): Analyze the specific connections between suspects in ${caseItem.id} (${mappedSuspects.map(s => s.name).join(', ')}), command hierarchy, who pays or assists whom, phone/burner links, and identify the most vulnerable link to break the syndicate.
  * If the question asks about "Missing information" (or investigation gaps, incomplete evidence, pending depositions, unverified identities): Specifically analyze what critical evidence, witness statements, bank records, and forensic verifications are missing in ${caseItem.id}, and specify actionable steps to complete them.
  * If the question asks about "Blind spots" (or surveillance gaps, unmonitored transit routes, camera downtime, timing discrepancies): Specifically analyze the surveillance blind spots, camera blackout intervals, unmonitored road corridors, and vehicle transit discrepancies for ${caseItem.id}.
  * If the question asks about interrogation targets, financial smurfing, weak alibis, vehicle movements, or another specific query: Directly address that exact inquiry using the data of active case ${caseItem.id}.

STRICT ISOLATION MANDATE:
- The AI must use the current Case ID (${caseItem.id}) and must NEVER mix data, suspects, evidence, or incidents from other cases.

Active Case Dossier (CASE ID: ${caseItem.id}):
- ID: ${caseItem.id}
- Title: ${caseItem.title}
- Summary: ${caseItem.summary}
- Department: ${caseItem.department}
- Priority: ${caseItem.priority}
- Registered Date: ${caseItem.startedDate}
- Known Vehicles: ${JSON.stringify(caseItem.vehicles || [])}
- Known Locations: ${JSON.stringify(caseItem.locations || [])}
- Documented Investigation Gaps: ${JSON.stringify(investigationGaps)}
- Known Route Surveillance Blind Spots: ${JSON.stringify(caseBlindSpots)}

Suspects in Case ${caseItem.id} (${mappedSuspects.length}):
${JSON.stringify(mappedSuspects)}

Evidence Logs in Case ${caseItem.id} (${evidenceList.length}):
${JSON.stringify(
  evidenceList.map((e: any) => ({
    id: e.id,
    title: e.title,
    type: e.type,
    status: e.status,
    location: e.location,
    description: e.description,
  }))
)}

${
  targetCase
    ? `Target Case for Comparative Analysis:
- ID: ${targetCase.id}
- Title: ${targetCase.title}
- Summary: ${targetCase.summary}
- Department: ${targetCase.department}
- Priority: ${targetCase.priority}
- Vehicles: ${JSON.stringify(targetCase.vehicles || [])}
- Locations: ${JSON.stringify(targetCase.locations || [])}
`
    : ""
}

Inquiring Officer: ${officer?.rank || "Inspector"} ${officer?.name || "Investigating Officer"}
Query Intent / Type: ${queryType}
Officer Prompt / Question: "${userMessage || "Provide strategic investigative clues and relationships to solve this case faster"}"
Selected Interface Language: ${targetLang}

CRITICAL MULTILINGUAL MANDATE:
The user interface language is ${targetLang}.
You MUST generate ALL narrative sentences, answer text, clue titles, clue details, suggestedActions, relationship descriptions, interrogation tips, fast-track steps, vulnerability reasons, and questions strictly in ${targetLang}.
Do NOT output in English if ${targetLang} is not English. Keep technical IDs (like ${caseItem.id}) and suspect names in readable Latin characters for standard police indexing, but all explanations MUST be in ${targetLang}.

Respond with strictly valid JSON conforming to this schema:
{
  "answer": "A thorough, professional, tactical forensic answer addressing the officer's exact question in ${targetLang}. Cite specific suspect names, evidence items, corridors, or gaps from case ${caseItem.id}.",
  "clues": [
    {
      "id": "clue-1",
      "category": "SUSPECT WEAK LINK" | "FINANCIAL TRAIL" | "ALIBI INCONSISTENCY" | "VEHICLE TRACK" | "CROSS-CASE PATTERN" | "TIMELINE GAP" | "SURVEILLANCE BLIND SPOT" | "MISSING EVIDENCE",
      "title": "Short punchy clue headline in ${targetLang}",
      "detail": "Actionable explanation of the clue in ${targetLang}",
      "confidence": 94,
      "priority": "CRITICAL" | "HIGH" | "MEDIUM",
      "suggestedAction": "Concrete immediate step for the investigation team in ${targetLang}"
    }
  ],
  "relationships": [
    {
      "sourcePerson": "Suspect Name 1",
      "targetPerson": "Suspect Name 2",
      "relationshipType": "e.g. Financier to Ground Enforcer in ${targetLang}",
      "nature": "Financial Dependency" | "Command Hierarchy" | "Logistical Mule" | "Direct Conspiracy" | "Alibi Cover",
      "confidence": 91,
      "hiddenClue": "Specific phone or bank anomaly linking them in ${targetLang}",
      "actionableInterrogationTip": "Exact question or pressure point to break their story in ${targetLang}"
    }
  ],
  "comparison": ${
    targetCase
      ? `{
    "matchingScore": 86,
    "sharedModusOperandi": ["Shared tactic 1 in ${targetLang}", "Shared tactic 2 in ${targetLang}"],
    "suspectOrAliasOverlap": ["Suspect or courier overlap in ${targetLang}"],
    "vehicleOrDeviceOverlap": ["Overlapping vehicle model/plate or IMEI prefix in ${targetLang}"],
    "crossCaseClues": ["Specific clue from Target Case in ${targetLang}"],
    "breakthroughHypothesis": "Synthesized hypothesis explaining the syndicate connection in ${targetLang}"
  }`
      : "null"
  },
  "fastTrackActionSteps": [
    "Step 1: Priority tactical directive in ${targetLang}",
    "Step 2: Key forensic or digital intercept warrant in ${targetLang}",
    "Step 3: Interrogation strategy in ${targetLang}"
  ],
  "recommendedInterrogationTarget": {
    "name": "Name of suspect most vulnerable to questioning",
    "whyVulnerable": "Reason why they are the weak link in ${targetLang}",
    "keyQuestions": [
      "Question 1 in ${targetLang}",
      "Question 2 in ${targetLang}"
    ]
  }
}`;

        // Attempt primary text model, with fast fallback model on high demand / transient error
        const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
        for (const modelName of modelsToTry) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                responseMimeType: "application/json",
              },
            });

            const text = response.text;
            if (text) {
              assistantResult = JSON.parse(text.trim());
              if (assistantResult && assistantResult.answer) {
                break;
              }
            }
          } catch (modelErr) {
            console.warn(`Gemini model ${modelName} error, attempting fallback if available:`, modelErr);
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini AI case assistant fallback engaged:", geminiErr);
      }
    }

    // High-quality deterministic multilingual response if Gemini is offline or fallback is needed
    if (!assistantResult) {
      assistantResult = generateMultilingualAssistantFallback(
        language,
        queryType,
        caseItem,
        suspects,
        evidenceList,
        targetCase,
        userMessage,
        officer
      );
    }

    res.json({
      success: true,
      data: assistantResult,
    });
  } catch (error: any) {
    console.error("AI Assistant error:", error);
    res.status(500).json({ error: error.message || "Failed to process AI assistant request" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aegis Crime Intelligence Terminal running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
