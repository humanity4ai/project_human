# Research Expansion Addendum

> Complements: `docs/dev_plan/growth-strategy.md`  
> Focus: Academic research, citability, benchmark creation, research community engagement

---

## 1. Research-Ready Assets (Already Built)

| Asset | Location | Research Value |
|-------|----------|---------------|
| ValueCompass skill mapping (49 values × 9 skills) | `knowledge-core/values-taxonomy.ts` | First implementation of ValueCompass in an operational AI system |
| LLM-human value divergence documentation | `knowledge-core/divergence-map.md` | Primary data for position papers on rule-based vs LLM-based safety |
| EigenBench constitution definitions | `evals/src/eigenbench-adapter.ts` | Ready-to-use evaluation criteria for subjective skills |
| Consistency test harness (11 gates) | `evals/src/consistency-test.ts` | Methodology for deterministic skill verification |
| 120+ evaluation scenarios with value-dilemma cases | `skills/*/scenarios/scenarios.yaml` | Annotated dataset for value alignment research |
| 9 per-skill value profiles | `docs/value-profiles/` | Published alignment documentation |
| Constitution (5 principles) | `knowledge-core/constitution.md` | Grounded in 2,500 years of philosophical ethics |

## 2. Potential Research Papers

### Paper A: Position Paper — "Rule-Based vs. LLM-Based Humane AI: A Value Alignment Perspective"

**Core finding:** LLMs systematically favor "Choose Own Goals" and "Customization" over human-preferred "Prudent," "Truthful," and "Responsible" (ValueCompass 2024-2025). Rule-based skills encode the human-preferred values deterministically.

**Target venues:** AIES (AAAI/ACM Conference on AI, Ethics, and Society), FAccT (ACM Conference on Fairness, Accountability, and Transparency)

**Data sources:** `divergence-map.md`, `values-taxonomy.ts`, `constitution.md`

**Structure:**
1. Introduction — the problem with asking LLMs to be both sword and shield
2. Background — ValueCompass framework, LLM value divergence literature
3. System description — Humanity4AI's 9 rule-based skills
4. Method — mapping skills to ValueCompass dimensions, measuring divergence
5. Results — consistency data, value alignment strengths per skill
6. Discussion — implications for AI safety architecture
7. Conclusion — "Humanity for AI" as a design principle

### Paper B: Systems/Tool Paper — "Project Human: A Deterministic MCP Skill System for Humane AI Agents"

**Core contribution:** The first open-source, production-deployed MCP server that provides 9 humanity skills with zero LLM calls, explicit safety boundaries, and full auditability.

**Target venues:** ACL System Demonstrations, EMNLP Demo Track, AAAI Demo

**Data sources:** `README.md`, `server-factory.ts`, `handlers.ts`, `AGENTS.md`

### Paper C: Benchmark Paper — "Consistency-Aware Value Alignment Benchmark for AI Skills"

**Core contribution:** Adaptation of EigenBench (ICLR 2026) peer-judgment methodology to subjective skills — empathetic reframing, cultural sensitivity, supportive reply. Constitutions defined, scenario dimensions specified, release gates quantified.

**Target venues:** NeurIPS Datasets & Benchmarks Track, ICLR

**Data sources:** `eigenbench-adapter.ts`, `scenarios/*.yaml`

### Paper D: Dataset Paper — "The Humanity4AI Scenario Bank: 120+ Value-Dilemma Scenarios Across 9 Human-Centric Dimensions"

**Core contribution:** 120+ scenarios annotated with ValueCompass dimensions, LLM divergence flags, and expected behaviors — the first scenario bank specifically designed for testing rule-based humane AI skills.

**Target venues:** LREC (Language Resources and Evaluation Conference), ACL Findings

## 3. Academic Communities

| Community | Relevance | Key Venues |
|-----------|-----------|------------|
| **AI Safety & Alignment** | Core — the project's raison d'être | AIES, FAccT, AAAI SafeAI Workshop, NeurIPS SoLaR |
| **Accessibility & Inclusive Design** | WCAG, cognitive, neurodiversity, age-inclusive skills | ASSETS, CHI, W4A, ICCHP |
| **Computational Linguistics** | Content rewriting, cultural sensitivity | ACL, EMNLP, NAACL, *SEM |
| **Mental Health Informatics** | Crisis detection, supportive reply, depression-sensitive content | JMIR Mental Health, CLPsych Workshop |
| **AI & Ethics** | Value alignment, human-AI values, design ethics | AI & Ethics Journal, AI & Society, Nature Machine Intelligence |
| **HCI & UX** | Design skills, interaction patterns | CHI, CSCW, DIS |

## 4. Key Research Questions Worth Pursuing

1. **Are rule-based skills more reliable than LLM-based alternatives for safety-critical behavior?** — Testable via consistency benchmarks
2. **Do users trust deterministic AI skills more than LLM-generated empathy?** — User study opportunity
3. **How well does the ValueCompass taxonomy capture operational humane-AI behavior?** — First validation study of the taxonomy in production
4. **What is the measurable performance gap between rule-based and LLM-based WCAG auditing?** — Comparative study
5. **Can value profiles predict skill performance on real-world scenarios?** — Correlate value alignment strength with scenario pass rates

## 5. Immediate Actions (Week 1-2)

| Action | Deliverable | Effort |
|--------|------------|--------|
| Register on Zenodo for DOI | `CITATION.cff` linked to DOI | 30 min |
| Submit to arXiv as preprint | Paper A outline as LaTeX | 2 hr |
| Create research landing page | `humanity4ai.ascent.partners/research` | 1 hr |
| Package scenario bank as JSON | `data/scenarios.json` with schema | 2 hr |
| Add PAPER.md to repo | Research summary in repo root | 1 hr |
| Reach out to ValueCompass team | Email to Microsoft Research authors | 30 min |
| Apply for GitHub Academic discount | Free GitHub Team for research | 30 min |
