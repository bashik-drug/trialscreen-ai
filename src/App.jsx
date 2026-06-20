import { useState } from "react";

// ─── Protocols ─────────────────────────────────────────────────────────────
const PROTOCOLS = {
  advanced: {
    id: "advanced",
    label: "Phase III — NSCLC Stage IIIB/IV",
    title: "Phase III Oncology Trial — Advanced Non-Small Cell Lung Cancer (NSCLC)",
    phase: "Phase III",
    indication: "Advanced NSCLC (Stage IIIB/IV)",
    color: "#A259FF",
    inclusionSummary: [
      "Age 18–75 years",
      "NSCLC Stage IIIB or IV confirmed",
      "ECOG Performance Status 0–2",
      "eGFR ≥ 50 mL/min",
      "ALT/AST ≤ 2.5× ULN",
      "No prior platinum-based chemotherapy",
      "Life expectancy ≥ 12 weeks",
    ],
    exclusionSummary: [
      "Prior systemic treatment for advanced NSCLC",
      "Active untreated CNS metastases",
      "Pregnancy or breastfeeding",
      "Active autoimmune disease",
    ],
    sites: [
      { name: "Royal Marsden, London",        country: "UK",      recruitmentRate: 88, patientPool: 920,  priorTrials: 34, irbSpeed: 6,  distance: 12 },
      { name: "Christie Hospital, Manchester", country: "UK",      recruitmentRate: 81, patientPool: 710,  priorTrials: 28, irbSpeed: 8,  distance: 18 },
      { name: "Hamad Medical, Doha",           country: "Qatar",   recruitmentRate: 76, patientPool: 640,  priorTrials: 19, irbSpeed: 10, distance: 8  },
      { name: "Cleveland Clinic, Abu Dhabi",   country: "UAE",     recruitmentRate: 79, patientPool: 780,  priorTrials: 22, irbSpeed: 9,  distance: 10 },
      { name: "Rigshospitalet, Copenhagen",    country: "Denmark", recruitmentRate: 85, patientPool: 830,  priorTrials: 31, irbSpeed: 7,  distance: 15 },
      { name: "AIIMS, New Delhi",              country: "India",   recruitmentRate: 70, patientPool: 1200, priorTrials: 15, irbSpeed: 14, distance: 22 },
    ],
  },
  early: {
    id: "early",
    label: "Phase II — NSCLC Stage I/II",
    title: "Phase II Oncology Trial — Early Stage Non-Small Cell Lung Cancer (NSCLC)",
    phase: "Phase II",
    indication: "Early Stage NSCLC (Stage I/II)",
    color: "#00C48C",
    inclusionSummary: [
      "Age 18–70 years",
      "NSCLC Stage I or II confirmed",
      "ECOG Performance Status 0–1",
      "eGFR ≥ 60 mL/min",
      "ALT/AST ≤ 2.0× ULN",
      "No prior chemotherapy or radiotherapy",
      "Life expectancy ≥ 24 weeks",
      "Surgically resectable disease",
    ],
    exclusionSummary: [
      "Prior systemic anticancer therapy",
      "Active CNS involvement",
      "Pregnancy or breastfeeding",
      "Active autoimmune disease",
      "Uncontrolled cardiovascular disease",
    ],
    sites: [
      { name: "University College London Hospital", country: "UK",          recruitmentRate: 83, patientPool: 620,  priorTrials: 26, irbSpeed: 7,  distance: 10 },
      { name: "Edinburgh Cancer Centre",            country: "UK",          recruitmentRate: 78, patientPool: 480,  priorTrials: 21, irbSpeed: 9,  distance: 14 },
      { name: "Antoni van Leeuwenhoek, Amsterdam",  country: "Netherlands", recruitmentRate: 87, patientPool: 740,  priorTrials: 33, irbSpeed: 6,  distance: 11 },
      { name: "Karolinska University, Stockholm",   country: "Sweden",      recruitmentRate: 82, patientPool: 590,  priorTrials: 29, irbSpeed: 7,  distance: 13 },
      { name: "Mayo Clinic, Rochester",             country: "USA",         recruitmentRate: 91, patientPool: 980,  priorTrials: 45, irbSpeed: 8,  distance: 20 },
      { name: "Toronto General Hospital",           country: "Canada",      recruitmentRate: 80, patientPool: 660,  priorTrials: 24, irbSpeed: 9,  distance: 16 },
    ],
  },
};

// ─── Site Scoring ──────────────────────────────────────────────────────────
function scoreSites(sites) {
  const w = { recruitmentRate: 0.35, patientPool: 0.25, priorTrials: 0.20, irbSpeed: 0.10, distance: 0.10 };
  const maxPool   = Math.max(...sites.map(s => s.patientPool));
  const maxTrials = Math.max(...sites.map(s => s.priorTrials));
  const minIrb    = Math.min(...sites.map(s => s.irbSpeed));
  const minDist   = Math.min(...sites.map(s => s.distance));
  return sites.map(s => ({
    ...s,
    score: Math.round(
      s.recruitmentRate * w.recruitmentRate +
      (s.patientPool / maxPool)   * 100 * w.patientPool +
      (s.priorTrials / maxTrials) * 100 * w.priorTrials +
      (minIrb / s.irbSpeed)       * 100 * w.irbSpeed +
      (minDist / s.distance)      * 100 * w.distance
    ),
  })).sort((a, b) => b.score - a.score);
}

// ─── Eligibility Engines ───────────────────────────────────────────────────
function screenAdvanced(p) {
  const age = Number(p.age), ecog = Number(p.ecog), egfr = Number(p.egfr);
  const alt = Number(p.alt), ast = Number(p.ast), lifeExp = Number(p.lifeExpectancy);
  const stage = p.stage.toLowerCase(), diagnosis = p.diagnosis.toLowerCase();
  const met = [], failed = [];

  if (age >= 18 && age <= 75)    met.push("Age within range (18–75)"); else failed.push(`Age ${age} outside range (18–75)`);
  const validStage = stage.includes("iiib") || stage.includes("3b") || stage.includes("iv") || stage.includes("4");
  if (validStage)                 met.push("NSCLC Stage IIIB/IV confirmed"); else failed.push("Stage does not meet IIIB/IV requirement");
  const validDx = diagnosis.includes("nsclc") || diagnosis.includes("non-small") || diagnosis.includes("lung");
  if (validDx)                    met.push("NSCLC diagnosis confirmed"); else failed.push("Diagnosis does not confirm NSCLC");
  if (ecog >= 0 && ecog <= 2)    met.push(`ECOG PS ${ecog} within range (0–2)`); else failed.push(`ECOG PS ${ecog} exceeds maximum of 2`);
  if (egfr >= 50)                 met.push(`eGFR ${egfr} mL/min adequate`); else failed.push(`eGFR ${egfr} below minimum (50 mL/min)`);
  if (alt <= 2.5)                 met.push(`ALT ${alt}× ULN within limits`); else failed.push(`ALT ${alt}× ULN exceeds 2.5× ULN`);
  if (ast <= 2.5)                 met.push(`AST ${ast}× ULN within limits`); else failed.push(`AST ${ast}× ULN exceeds 2.5× ULN`);
  if (lifeExp >= 12)              met.push(`Life expectancy ${lifeExp} weeks meets minimum`); else failed.push(`Life expectancy ${lifeExp} weeks below 12 weeks`);
  if (p.priorChemo === "Yes")     failed.push("Prior platinum-based chemotherapy — exclusion"); else met.push("No prior platinum-based chemotherapy");
  if (p.cnsMetastases === "Yes")  failed.push("Active CNS metastases — exclusion"); else met.push("No active CNS metastases");
  if (p.pregnant === "Yes")       failed.push("Pregnant or breastfeeding — exclusion"); else met.push("Not pregnant or breastfeeding");
  if (p.autoimmune === "Yes")     failed.push("Active autoimmune disease — exclusion"); else met.push("No active autoimmune disease");

  let verdict = failed.length === 0 ? "ELIGIBLE" : failed.length <= 2 && failed.every(f => !f.includes("exclusion")) ? "REQUIRES REVIEW" : "NOT ELIGIBLE";
  let riskScore = 0;
  if (ecog === 2) riskScore += 2; if (ecog > 2) riskScore += 4;
  if (lifeExp < 20) riskScore += 2; if (age > 65) riskScore += 1; if (egfr < 60) riskScore += 1;
  const dropoutRisk = riskScore >= 4 ? "HIGH" : riskScore >= 2 ? "MODERATE" : "LOW";
  const dropoutRiskReason = riskScore >= 4 ? "Multiple clinical risk factors suggest elevated likelihood of early withdrawal."
    : riskScore >= 2 ? "Moderate concerns warrant closer monitoring for dropout."
    : "Patient profile indicates good tolerance and compliance likelihood.";
  const recommendation = verdict === "ELIGIBLE"
    ? "Patient meets all criteria. Proceed to informed consent and baseline assessments."
    : verdict === "REQUIRES REVIEW"
    ? `Patient narrowly misses ${failed.length} criterion. Recommend medical monitor review before proceeding.`
    : `Patient fails ${failed.length} criteria and is not eligible. Document screen failure in the screening log.`;

  return { verdict, dropoutRisk, dropoutRiskReason, metCriteria: met, failedCriteria: failed, recommendation };
}

function screenEarly(p) {
  const age = Number(p.age), ecog = Number(p.ecog), egfr = Number(p.egfr);
  const alt = Number(p.alt), ast = Number(p.ast), lifeExp = Number(p.lifeExpectancy);
  const stage = p.stage.toLowerCase(), diagnosis = p.diagnosis.toLowerCase();
  const met = [], failed = [];

  if (age >= 18 && age <= 70)    met.push("Age within range (18–70)"); else failed.push(`Age ${age} outside range (18–70)`);
  const validStage = stage.includes("stage i") || stage.includes("stage 1") || stage.includes("stage ii") || stage.includes("stage 2") || stage === "i" || stage === "ii" || stage === "1" || stage === "2";
  if (validStage)                 met.push("NSCLC Stage I/II confirmed"); else failed.push("Stage does not meet Stage I/II requirement");
  const validDx = diagnosis.includes("nsclc") || diagnosis.includes("non-small") || diagnosis.includes("lung");
  if (validDx)                    met.push("NSCLC diagnosis confirmed"); else failed.push("Diagnosis does not confirm NSCLC");
  if (ecog >= 0 && ecog <= 1)    met.push(`ECOG PS ${ecog} within range (0–1)`); else failed.push(`ECOG PS ${ecog} exceeds maximum of 1 for early stage trial`);
  if (egfr >= 60)                 met.push(`eGFR ${egfr} mL/min adequate`); else failed.push(`eGFR ${egfr} below minimum (60 mL/min)`);
  if (alt <= 2.0)                 met.push(`ALT ${alt}× ULN within limits`); else failed.push(`ALT ${alt}× ULN exceeds 2.0× ULN`);
  if (ast <= 2.0)                 met.push(`AST ${ast}× ULN within limits`); else failed.push(`AST ${ast}× ULN exceeds 2.0× ULN`);
  if (lifeExp >= 24)              met.push(`Life expectancy ${lifeExp} weeks meets minimum`); else failed.push(`Life expectancy ${lifeExp} weeks below 24 weeks`);
  if (p.priorChemo === "Yes")     failed.push("Prior chemotherapy or radiotherapy — exclusion"); else met.push("No prior chemotherapy or radiotherapy");
  if (p.cnsMetastases === "Yes")  failed.push("Active CNS involvement — exclusion"); else met.push("No CNS involvement");
  if (p.pregnant === "Yes")       failed.push("Pregnant or breastfeeding — exclusion"); else met.push("Not pregnant or breastfeeding");
  if (p.autoimmune === "Yes")     failed.push("Active autoimmune disease — exclusion"); else met.push("No active autoimmune disease");

  let verdict = failed.length === 0 ? "ELIGIBLE" : failed.length <= 2 && failed.every(f => !f.includes("exclusion")) ? "REQUIRES REVIEW" : "NOT ELIGIBLE";
  let riskScore = 0;
  if (ecog === 1) riskScore += 1; if (ecog > 1) riskScore += 4;
  if (lifeExp < 30) riskScore += 1; if (age > 60) riskScore += 1; if (egfr < 70) riskScore += 1;
  const dropoutRisk = riskScore >= 4 ? "HIGH" : riskScore >= 2 ? "MODERATE" : "LOW";
  const dropoutRiskReason = riskScore >= 4 ? "Performance status or organ function concerns suggest high dropout risk."
    : riskScore >= 2 ? "Moderate risk — patient may need additional support for protocol compliance."
    : "Patient profile suggests strong compliance potential for early stage trial.";
  const recommendation = verdict === "ELIGIBLE"
    ? "Patient meets all early stage criteria. Proceed to surgical resectability assessment and consent."
    : verdict === "REQUIRES REVIEW"
    ? `Patient narrowly misses ${failed.length} criterion. Refer to principal investigator for final decision.`
    : `Patient fails ${failed.length} criteria. Not eligible for early stage trial. Consider advanced stage protocol if applicable.`;

  return { verdict, dropoutRisk, dropoutRiskReason, metCriteria: met, failedCriteria: failed, recommendation };
}

// ─── Colour Helpers ────────────────────────────────────────────────────────
const verdictColor = v => ({ ELIGIBLE: "#00C48C", "NOT ELIGIBLE": "#FF4D6D", "REQUIRES REVIEW": "#FFB347" }[v] ?? "#888");
const riskColor    = r => ({ LOW: "#00C48C", MODERATE: "#FFB347", HIGH: "#FF4D6D" }[r] ?? "#888");
const EMPTY = { id:"", age:"", diagnosis:"", stage:"", ecog:"", egfr:"", alt:"", ast:"", priorChemo:"No", cnsMetastases:"No", pregnant:"No", autoimmune:"No", lifeExpectancy:"" };

// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab,        setTab]        = useState("screener");
  const [protocolId, setProtocolId] = useState("advanced");
  const [patient,    setPatient]    = useState(EMPTY);
  const [result,     setResult]     = useState(null);
  const [history,    setHistory]    = useState([]);

  const protocol    = PROTOCOLS[protocolId];
  const scoredSites = scoreSites(protocol.sites);

  const handleProtocolChange = (id) => {
    setProtocolId(id);
    setResult(null);
    setPatient(EMPTY);
    setHistory([]);
  };

  const handleChange = e => { setPatient({ ...patient, [e.target.name]: e.target.value }); setResult(null); };

  const handleScreen = () => {
    const res   = protocolId === "advanced" ? screenAdvanced(patient) : screenEarly(patient);
    const entry = { ...res, patientId: patient.id || "PT-" + Date.now().toString().slice(-4), age: patient.age, diagnosis: patient.diagnosis, protocol: protocolId };
    setResult(entry);
    setHistory(prev => [entry, ...prev].slice(0, 20));
  };

  const eligible    = history.filter(h => h.verdict === "ELIGIBLE").length;
  const notEligible = history.filter(h => h.verdict === "NOT ELIGIBLE").length;
  const review      = history.filter(h => h.verdict === "REQUIRES REVIEW").length;
  const highRisk    = history.filter(h => h.dropoutRisk === "HIGH").length;

  const inputStyle = { width:"100%", background:"#0B0F1A", border:"1px solid #1E2535", borderRadius:6, padding:"8px 12px", color:"#E8EAF0", fontSize:13, outline:"none", boxSizing:"border-box" };
  const labelStyle = { fontSize:11, color:"#5A6480", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" };

  return (
    <div style={{ minHeight:"100vh", background:"#0B0F1A", fontFamily:"'Inter', sans-serif", color:"#E8EAF0" }}>

      {/* Header */}
      <div style={{ borderBottom:"1px solid #1E2535", padding:"18px 32px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:8, height:32, background:"linear-gradient(180deg,#4F8EF7 0%,#A259FF 100%)", borderRadius:4 }} />
          <div>
            <div style={{ fontSize:15, fontWeight:700, letterSpacing:"0.04em" }}>TrialScreen AI</div>
            <div style={{ fontSize:11, color:"#5A6480", letterSpacing:"0.08em", textTransform:"uppercase" }}>Clinical Trial Recruitment Platform</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {["screener","sites","dashboard"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:"7px 18px", borderRadius:6, border:"none", cursor:"pointer", fontSize:13, fontWeight:600,
              background: tab===t ? "#1A2240" : "transparent",
              color:      tab===t ? "#4F8EF7" : "#5A6480",
              borderBottom: tab===t ? "2px solid #4F8EF7" : "2px solid transparent",
            }}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* Protocol Selector */}
      <div style={{ background:"#111827", borderBottom:"1px solid #1E2535", padding:"12px 32px", display:"flex", alignItems:"center", gap:16 }}>
        <span style={{ fontSize:11, color:"#5A6480", textTransform:"uppercase", letterSpacing:"0.08em", flexShrink:0 }}>Protocol</span>
        <div style={{ display:"flex", gap:8 }}>
          {Object.values(PROTOCOLS).map(p => (
            <button key={p.id} onClick={() => handleProtocolChange(p.id)} style={{
              padding:"6px 16px", borderRadius:20, border:`1px solid ${protocolId===p.id ? p.color : "#1E2535"}`,
              background: protocolId===p.id ? p.color+"22" : "transparent",
              color: protocolId===p.id ? p.color : "#5A6480",
              fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.15s",
            }}>{p.label}</button>
          ))}
        </div>
        <span style={{ marginLeft:"auto", fontSize:12, background:"#1E2535", padding:"3px 10px", borderRadius:20, color: protocol.color }}>{protocol.indication}</span>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 24px" }}>

        {/* SCREENER TAB */}
        {tab==="screener" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            <div style={{ background:"#111827", borderRadius:12, padding:24, border:"1px solid #1E2535" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#8892A4", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:20 }}>Patient Profile</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {[
                  { label:"Patient ID",             name:"id",             placeholder:"PT-001" },
                  { label:"Age (years)",             name:"age",            placeholder: protocolId==="advanced" ? "18–75" : "18–70", type:"number" },
                  { label:"Diagnosis",               name:"diagnosis",      placeholder:"NSCLC Adenocarcinoma" },
                  { label:"Stage",                   name:"stage",          placeholder: protocolId==="advanced" ? "Stage IIIB or IV" : "Stage I or II" },
                  { label:"ECOG Status",             name:"ecog",           placeholder: protocolId==="advanced" ? "0–2" : "0–1", type:"number" },
                  { label:"eGFR (mL/min)",           name:"egfr",           placeholder: protocolId==="advanced" ? "≥50" : "≥60", type:"number" },
                  { label:"ALT (× ULN)",             name:"alt",            placeholder: protocolId==="advanced" ? "≤2.5" : "≤2.0" },
                  { label:"AST (× ULN)",             name:"ast",            placeholder: protocolId==="advanced" ? "≤2.5" : "≤2.0" },
                  { label:"Life Expectancy (weeks)", name:"lifeExpectancy", placeholder: protocolId==="advanced" ? "≥12" : "≥24", type:"number" },
                ].map(f => (
                  <div key={f.name} style={{ gridColumn:["diagnosis","lifeExpectancy"].includes(f.name) ? "span 2" : "span 1" }}>
                    <label style={labelStyle}>{f.label}</label>
                    <input name={f.name} value={patient[f.name]} onChange={handleChange} placeholder={f.placeholder} type={f.type||"text"} style={inputStyle} />
                  </div>
                ))}
                {[
                  { label:"Prior Chemo / Radiotherapy?", name:"priorChemo" },
                  { label:"Active CNS Involvement?",     name:"cnsMetastases" },
                  { label:"Pregnant / Breastfeeding?",   name:"pregnant" },
                  { label:"Active Autoimmune Disease?",  name:"autoimmune" },
                ].map(f => (
                  <div key={f.name}>
                    <label style={labelStyle}>{f.label}</label>
                    <select name={f.name} value={patient[f.name]} onChange={handleChange} style={inputStyle}>
                      <option>No</option><option>Yes</option>
                    </select>
                  </div>
                ))}
              </div>

              {/* Criteria reminder */}
              <div style={{ marginTop:16, background:"#0B0F1A", borderRadius:8, padding:"10px 14px", borderLeft:`3px solid ${protocol.color}` }}>
                <div style={{ fontSize:10, color:protocol.color, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>Key Thresholds — {protocol.phase}</div>
                <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                  {[
                    { label:"Age",  value: protocolId==="advanced" ? "18–75" : "18–70" },
                    { label:"ECOG", value: protocolId==="advanced" ? "0–2"   : "0–1"   },
                    { label:"eGFR", value: protocolId==="advanced" ? "≥50"   : "≥60"   },
                    { label:"ALT/AST", value: protocolId==="advanced" ? "≤2.5×" : "≤2.0×" },
                    { label:"Life Exp", value: protocolId==="advanced" ? "≥12w" : "≥24w" },
                  ].map(t => (
                    <div key={t.label} style={{ textAlign:"center" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"#E8EAF0" }}>{t.value}</div>
                      <div style={{ fontSize:10, color:"#5A6480" }}>{t.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleScreen} disabled={!patient.age||!patient.diagnosis||!patient.stage||!patient.ecog||!patient.egfr}
                style={{
                  marginTop:16, width:"100%", padding:12, borderRadius:8, border:"none",
                  cursor:(!patient.age||!patient.diagnosis) ? "not-allowed" : "pointer",
                  fontWeight:700, fontSize:14,
                  background:(!patient.age||!patient.diagnosis) ? "#1E2535" : `linear-gradient(135deg, #4F8EF7, ${protocol.color})`,
                  color:(!patient.age||!patient.diagnosis) ? "#5A6480" : "#fff",
                }}>Screen Patient →</button>
            </div>

            {/* Result */}
            <div style={{ background:"#111827", borderRadius:12, padding:24, border:"1px solid #1E2535", display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#8892A4", letterSpacing:"0.08em", textTransform:"uppercase" }}>Screening Result</div>
              {!result ? (
                <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#2A3350", textAlign:"center", gap:8 }}>
                  <div style={{ fontSize:40 }}>⬡</div>
                  <div style={{ fontSize:13 }}>Enter patient details and run screening</div>
                </div>
              ) : (
                <>
                  <div style={{ display:"flex", gap:12 }}>
                    {[
                      { label:"Verdict",      value:result.verdict,     color:verdictColor(result.verdict) },
                      { label:"Dropout Risk", value:result.dropoutRisk, color:riskColor(result.dropoutRisk) },
                    ].map(m => (
                      <div key={m.label} style={{ flex:1, background:"#0B0F1A", borderRadius:8, padding:"14px 16px", borderLeft:`3px solid ${m.color}` }}>
                        <div style={{ fontSize:11, color:"#5A6480", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{m.label}</div>
                        <div style={{ fontSize:15, fontWeight:800, color:m.color }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize:12, color:"#8892A4", background:"#0B0F1A", borderRadius:6, padding:"10px 14px" }}>
                    <span style={{ color:"#5A6480" }}>Risk note: </span>{result.dropoutRiskReason}
                  </div>
                  {result.metCriteria.length > 0 && (
                    <div>
                      <div style={{ fontSize:11, color:"#00C48C", fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>Criteria Met</div>
                      {result.metCriteria.map((c,i) => <div key={i} style={{ fontSize:12, color:"#8892A4", padding:"3px 0", display:"flex", gap:8 }}><span style={{ color:"#00C48C" }}>✓</span>{c}</div>)}
                    </div>
                  )}
                  {result.failedCriteria.length > 0 && (
                    <div>
                      <div style={{ fontSize:11, color:"#FF4D6D", fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>Failed / Flagged</div>
                      {result.failedCriteria.map((c,i) => <div key={i} style={{ fontSize:12, color:"#8892A4", padding:"3px 0", display:"flex", gap:8 }}><span style={{ color:"#FF4D6D" }}>✗</span>{c}</div>)}
                    </div>
                  )}
                  <div style={{ background:"#0B0F1A", borderRadius:8, padding:"12px 14px", borderLeft:"3px solid #4F8EF7" }}>
                    <div style={{ fontSize:11, color:"#4F8EF7", fontWeight:700, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Recommendation</div>
                    <div style={{ fontSize:12, color:"#8892A4", lineHeight:1.6 }}>{result.recommendation}</div>
                  </div>
                </>
              )}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div style={{ gridColumn:"span 2", background:"#111827", borderRadius:12, padding:24, border:"1px solid #1E2535" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#8892A4", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:16 }}>Screening Log</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px,1fr))", gap:10 }}>
                  {history.map((h,i) => (
                    <div key={i} style={{ background:"#0B0F1A", borderRadius:8, padding:"10px 14px", borderLeft:`3px solid ${verdictColor(h.verdict)}` }}>
                      <div style={{ fontSize:12, fontWeight:700, color:"#E8EAF0" }}>{h.patientId}</div>
                      <div style={{ fontSize:11, color:"#5A6480", marginBottom:6 }}>{h.age}y · {h.diagnosis?.slice(0,22)}</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        <span style={{ fontSize:10, padding:"2px 8px", borderRadius:12, background:verdictColor(h.verdict)+"22", color:verdictColor(h.verdict), fontWeight:700 }}>{h.verdict}</span>
                        <span style={{ fontSize:10, padding:"2px 8px", borderRadius:12, background:riskColor(h.dropoutRisk)+"22", color:riskColor(h.dropoutRisk), fontWeight:700 }}>{h.dropoutRisk} RISK</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SITES TAB */}
        {tab==="sites" && (
          <div style={{ background:"#111827", borderRadius:12, padding:24, border:"1px solid #1E2535" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#8892A4", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>Site Feasibility Ranking — {protocol.phase}</div>
            <div style={{ fontSize:12, color:"#5A6480", marginBottom:24 }}>Weighted scoring: Recruitment Rate (35%) · Patient Pool (25%) · Prior Trials (20%) · IRB Speed (10%) · Distance (10%)</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {scoredSites.map((site,i) => (
                <div key={site.name} style={{ background:"#0B0F1A", borderRadius:10, padding:"16px 20px", border:i===0?`1px solid ${protocol.color}`:"1px solid #1E2535", position:"relative" }}>
                  {i===0 && <div style={{ position:"absolute", top:-1, right:16, background:protocol.color, color:"#fff", fontSize:10, fontWeight:800, padding:"2px 10px", borderRadius:"0 0 6px 6px" }}>TOP SITE</div>}
                  <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                    <div style={{ width:36, height:36, borderRadius:8, background:i===0?`linear-gradient(135deg,#4F8EF7,${protocol.color})`:"#1E2535", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, color:"#fff", flexShrink:0 }}>{i+1}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:"#E8EAF0" }}>{site.name}</div>
                      <div style={{ fontSize:11, color:"#5A6480" }}>{site.country}</div>
                    </div>
                    <div style={{ display:"flex", gap:20, alignItems:"center" }}>
                      {[
                        { label:"Recruitment", value:site.recruitmentRate+"%" },
                        { label:"Patient Pool", value:site.patientPool },
                        { label:"Prior Trials", value:site.priorTrials },
                        { label:"IRB (wks)",    value:site.irbSpeed },
                      ].map(m => (
                        <div key={m.label} style={{ textAlign:"center" }}>
                          <div style={{ fontSize:14, fontWeight:700, color:"#E8EAF0" }}>{m.value}</div>
                          <div style={{ fontSize:10, color:"#5A6480", textTransform:"uppercase", letterSpacing:"0.06em" }}>{m.label}</div>
                        </div>
                      ))}
                      <div style={{ textAlign:"center", minWidth:60 }}>
                        <div style={{ fontSize:22, fontWeight:800, color:i===0?protocol.color:"#8892A4" }}>{site.score}</div>
                        <div style={{ fontSize:10, color:"#5A6480", textTransform:"uppercase", letterSpacing:"0.06em" }}>Score</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop:12, background:"#1E2535", borderRadius:4, height:4 }}>
                    <div style={{ height:4, borderRadius:4, background:i===0?`linear-gradient(90deg,#4F8EF7,${protocol.color})`:"#2A3350", width:site.score+"%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {tab==="dashboard" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:16 }}>
            {[
              { label:"Screened",          value:history.length, color:"#4F8EF7" },
              { label:"Eligible",          value:eligible,       color:"#00C48C" },
              { label:"Screen Failed",     value:notEligible,    color:"#FF4D6D" },
              { label:"High Dropout Risk", value:highRisk,       color:"#FFB347" },
            ].map(m => (
              <div key={m.label} style={{ background:"#111827", borderRadius:12, padding:24, border:"1px solid #1E2535", borderTop:`3px solid ${m.color}` }}>
                <div style={{ fontSize:32, fontWeight:800, color:m.color }}>{m.value}</div>
                <div style={{ fontSize:12, color:"#5A6480", marginTop:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{m.label}</div>
              </div>
            ))}
            {[
              { title:"Eligibility Breakdown", items:[
                { label:"Eligible",        count:eligible,    color:"#00C48C" },
                { label:"Not Eligible",    count:notEligible, color:"#FF4D6D" },
                { label:"Requires Review", count:review,      color:"#FFB347" },
              ]},
              { title:"Dropout Risk Distribution", items:[
                { label:"Low",      count:history.filter(h=>h.dropoutRisk==="LOW").length,      color:"#00C48C" },
                { label:"Moderate", count:history.filter(h=>h.dropoutRisk==="MODERATE").length, color:"#FFB347" },
                { label:"High",     count:history.filter(h=>h.dropoutRisk==="HIGH").length,     color:"#FF4D6D" },
              ]},
            ].map(panel => (
              <div key={panel.title} style={{ gridColumn:"span 2", background:"#111827", borderRadius:12, padding:24, border:"1px solid #1E2535" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#8892A4", marginBottom:16, textTransform:"uppercase", letterSpacing:"0.08em" }}>{panel.title}</div>
                {history.length===0
                  ? <div style={{ color:"#2A3350", fontSize:13, textAlign:"center", padding:"30px 0" }}>No patients screened yet</div>
                  : panel.items.map(b => (
                    <div key={b.label} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#8892A4", marginBottom:4 }}>
                        <span>{b.label}</span><span style={{ color:b.color, fontWeight:700 }}>{b.count}</span>
                      </div>
                      <div style={{ background:"#1E2535", borderRadius:4, height:6 }}>
                        <div style={{ height:6, borderRadius:4, background:b.color, width:history.length?(b.count/history.length*100)+"%":"0%" }} />
                      </div>
                    </div>
                  ))
                }
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`* { box-sizing:border-box; } input:focus, select:focus { border-color:#4F8EF7 !important; }`}</style>
    </div>
  );
}
