# TrialScreen AI 🧬
### Clinical Trial Patient Eligibility Screener & Site Feasibility Ranking Tool

A web-based platform that automates patient eligibility screening against clinical trial protocol criteria and ranks investigator sites by feasibility score — built to demonstrate core competencies in clinical trial operations.

---

## 🎯 Purpose

This project was built as a capstone to demonstrate understanding of clinical trial recruitment workflows relevant to **Clinical Trial Associate (CTA)** and **Clinical Research Associate (CRA)** roles.

It mirrors two real-world tasks:
1. **Patient eligibility screening** — checking inclusion/exclusion criteria against patient profiles (a core CTA responsibility)
2. **Site feasibility assessment** — scoring and ranking potential investigator sites before trial initiation (a core CRA responsibility)

---

## 🔬 Protocol

The tool screens patients against a simulated **Phase III NSCLC (Non-Small Cell Lung Cancer) trial** with:

**Inclusion Criteria**
- Age 18–75 years
- Histologically confirmed NSCLC Stage IIIB/IV
- ECOG Performance Status 0–2
- eGFR ≥ 50 mL/min (adequate renal function)
- ALT/AST ≤ 2.5× ULN (adequate hepatic function)
- No prior platinum-based chemotherapy
- Life expectancy ≥ 12 weeks

**Exclusion Criteria**
- Prior systemic treatment for advanced NSCLC
- Active untreated CNS metastases
- Pregnancy or breastfeeding
- Active autoimmune disease requiring systemic treatment

---

## ⚙️ Features

### 1. Patient Screener
- Enter patient demographic and clinical data
- Rule-based eligibility engine checks all inclusion/exclusion criteria
- Returns: **Eligible / Not Eligible / Requires Review**
- Generates **dropout risk score** (Low / Moderate / High) based on ECOG status, eGFR, age, and life expectancy
- Full criteria breakdown with pass/fail per criterion
- Clinical recommendation for next steps

### 2. Site Feasibility Ranking
Weighted scoring of 6 international investigator sites across:

| Factor | Weight |
|---|---|
| Historical recruitment rate | 35% |
| Patient pool size | 25% |
| Number of prior trials | 20% |
| IRB approval speed | 10% |
| Distance from patient population | 10% |

Sites include Royal Marsden (UK), Christie Hospital (UK), Hamad Medical (Qatar), Cleveland Clinic Abu Dhabi (UAE), Rigshospitalet (Denmark), and AIIMS (India).

### 3. Recruitment Dashboard
Live metrics tracking:
- Total patients screened
- Eligibility breakdown with visual funnel
- Dropout risk distribution
- Screening log with patient history

---

## 🛠️ Tech Stack

- **React 18** — UI framework
- **Vanilla CSS-in-JS** — no external CSS libraries
- **Rule-based logic engine** — protocol eligibility assessment (no API dependency)

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/trialscreen-ai.git
cd trialscreen-ai

# Install dependencies
npm install

# Run locally
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Sample Test Cases

**Patient 1 — Expected: ELIGIBLE**
| Field | Value |
|---|---|
| Age | 62 |
| Diagnosis | NSCLC Adenocarcinoma |
| Stage | Stage IV |
| ECOG | 1 |
| eGFR | 58 |
| ALT | 1.8× ULN |
| AST | 1.5× ULN |
| Life Expectancy | 20 weeks |
| Prior Chemo | No |
| CNS Metastases | No |

**Patient 2 — Expected: NOT ELIGIBLE (multiple failures)**
| Field | Value |
|---|---|
| Age | 45 |
| Diagnosis | NSCLC Squamous Cell |
| Stage | Stage IIIB |
| ECOG | 3 |
| eGFR | 42 |
| ALT | 3.2× ULN |
| Prior Chemo | Yes |
| CNS Metastases | Yes |
| Autoimmune Disease | Yes |
| Life Expectancy | 8 weeks |

---

## 📚 Clinical Context

This project applies knowledge from:
- **ICH E6 (R3) GCP guidelines** — Good Clinical Practice principles underpinning eligibility and monitoring logic
- **Risk-based monitoring** — dropout risk stratification reflects ICH E6 R3 RBM principles
- **Site feasibility assessment** — standard pre-initiation CRA activity
- **Protocol deviation prevention** — eligibility screening is the first line of defence against protocol deviations

---

## 👤 Author

**Bashik**
MSc Advanced Drug Delivery, University of Strathclyde
GCP ICH E6 (R3) Certified

*Built as a clinical trials portfolio project — targeting CTA/CRA roles in the UK and internationally.*

---

## ⚠️ Disclaimer

This tool uses simulated protocol data for demonstration purposes only. It is not intended for use in real clinical trials. All patient data entered is fictional.
