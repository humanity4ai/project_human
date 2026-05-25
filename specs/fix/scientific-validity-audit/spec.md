# Scientific Validity Audit: Skill Accuracy & Evidence Basis

Status: Draft
Version: 1.0
Last updated: 2026-05-25

## Overview

Comprehensive audit of the scientific validity of all 3 safety-critical Humanity4AI
skills (depression-sensitive-content, grief-loss-support, supportive-conversation).
The audit examines: citations vs implementation, SKILL.md promises vs handler delivery,
parallel implementation divergence (Python scripts vs TypeScript MCP handlers), and
whether claims of efficacy are evidence-supported.

## Executive Summary

**The SKILL.md documentation is well-cited and scientifically grounded, but the MCP
handler implementations are crude keyword-matching engines that diverge significantly
from the documented capabilities. Python scripts referenced in SKILL.md exist but
implement DIFFERENT pattern sets than the TypeScript handlers — these are parallel
divergent implementations of the same skills. The project is fundamentally a content
auditing tool, not a therapeutic intervention, but this distinction is not always clear.**

## Skill-by-Skill Findings

### 1. Depression-Sensitive Content

| Dimension | Finding | Severity |
|-----------|---------|----------|
| **CLAIM**: "Audit content for stigmatizing language, shame language, cognitive load" | SKILL.md describes 4-step process with severity classification | — |
| **SCIENCE**: Person-first language | Strongly evidence-based: APA, DBS Alliance, SPRC guidelines | ✅ Valid |
| **SCIENCE**: Cognitive load reduction for depression | Evidence-based: depression impairs working memory (Rock et al., 2014); simplified content is appropriate | ✅ Valid |
| **SCIENCE**: Stigma reduction via language | Evidence-based: self-stigma is a barrier to help-seeking (Corrigan, 2004; Clement et al., 2015) | ✅ Valid |
| **SCIENCE**: Crisis escalation protocols | Standard clinical practice worldwide | ✅ Valid |
| **IMPLEMENTATION**: Handler does keyword matching | Replaces "you must" → "you can", "you failed" → "let's" — crude regex, no semantic understanding | ❌ Gap |
| **IMPLEMENTATION**: Handler covers different patterns than Python scripts | `handlers.ts` checks shame/urgency/cognitive-load patterns; `audit.py` checks stigmatizing-verb/identity-first/stigmatizing-term/crisis-language/minimizing patterns — **completely divergent** | ❌ Critical |
| **IMPLEMENTATION**: SKILL.md claims 12 Python scripts with sophisticated analysis | Scripts exist but MCP handler never calls them — two parallel implementations exist | ❌ Critical |
| **CLAIM vs REALITY**: SKILL.md examples show nuanced rewriting | Handler does generic regex replacement — "The depressed patient showed poor compliance" would NOT be handled by handler's patterns | ❌ Gap |
| **THERAPEUTIC CLAIM**: "Address concern of depression patient" | SKILL.md is clear this is a content audit tool, NOT therapy. Boundaries are explicit. But skill name and marketing could mislead. | ⚠️ Misleading |

### 2. Grief-Loss Support

| Dimension | Finding | Severity |
|-----------|---------|----------|
| **CLAIM**: "Presence-first, practical, reflection modes" | Three support modes described with distinct response strategies | — |
| **SCIENCE**: Presence-first approach | Evidence-based in grief counseling: presence > problem-solving (Rogers, 1957; Worden, 2018) | ✅ Valid |
| **SCIENCE**: Avoidance of platitudes | Evidence-based: "they're in a better place" is harmful (Kastenbaum, 2012) | ✅ Valid |
| **SCIENCE**: Non-linear grief model | Dual Process Model (Stroebe & Schut, 1999) cited — more accurate than Kubler-Ross stages | ✅ Valid |
| **IMPLEMENTATION**: All replies use static templates | Three modes produce nearly identical text with minor variations — no real adaptation | ❌ Gap |
| **IMPLEMENTATION**: Python scripts exist (10) but handler never calls them | `presence_first.py`, `acknowledge_loss.py`, etc. — divergent parallel implementation | ❌ Critical |
| **IMPLEMENTATION**: Crisis resources now present | Added in repo-best-practices fix: 988, 741741, IASP URL | ✅ Fixed |

### 3. Supportive Conversation

| Dimension | Finding | Severity |
|-----------|---------|----------|
| **CLAIM**: "Generate supportive responses with safety boundaries" | Described as presence-based emotional support | — |
| **SCIENCE**: Active listening / validation | Evidence-based: Rogers' person-centered approach (1957) — validation is therapeutic | ✅ Valid |
| **SCIENCE**: Escalation protocols | Risk-stratified (low/medium/high) with appropriate crisis resources at each level | ✅ Valid |
| **IMPLEMENTATION**: Reply is a single hardcoded template | Only recently fixed to interpolate message — was entirely static before | ⚠️ Fixed |
| **IMPLEMENTATION**: Python scripts exist (11) but handler uses none | `generate_response.py`, `detect_risk.py`, `assess_severity.py` — not called by MCP handler | ❌ Critical |
| **IMPLEMENTATION**: locale param | Now read but only used in assumptions — doesn't actually change reply language | ⚠️ Placeholder |

## Cross-Cutting Issues

### Issue A: Two Parallel Implementations

Every safety-critical skill has TWO implementations that implement DIFFERENT behavior:

| Skill | TypeScript Handler Patterns | Python Script Patterns | Match? |
|-------|---------------------------|----------------------|--------|
| Depression | shame, urgency, cognitive-load, crisis | stigmatizing-verb, identity-first, stigmatizing-term, crisis-language, minimizing, judgmental | ❌ NO |
| Grief | presence/practical/reflection templates | presence_first, acknowledge_loss, detect_crisis, detect_harmful, check_minimizing | ❌ NO |
| Supportive | risk-level template + crisis resources | detect_risk, assess_severity, detect_cues, generate_response, escalate_decide | ❌ NO |

**The MCP server uses the TypeScript handlers. The Python scripts are never invoked by the handler.**
The SKILL.md documents the Python scripts as the implementation. This is misleading — the MCP
handler is a completely separate, divergent implementation.

### Issue B: Scientific Validity of Handler Approach

The TypeScript handler's approach (simple substring matching + regex replacement) has NO
scientific validation as an effective content auditing method. The SKILL.md's citations
(APA, DBS Alliance, SPRC) support the PRINCIPLES (person-first language, stigma reduction)
but do NOT validate the specific IMPLEMENTATION (crude pattern matching).

### Issue C: Therapeutic vs. Content Audit Framing

- SKILL.md boundaries are CLEAR: "Non-clinical guidance only. No diagnosis or treatment."
- BUT: skill names ("depression-sensitive-content", "supportive-conversation", "grief-loss-support")
  and marketing could imply therapeutic capability
- The handler is a content filter, not a support tool — it cannot "support" anyone

### Issue D: Single-Response vs. Conversation

All handlers produce a single response to a single input. They have no conversation state,
no memory, no adaptation. The skills claim to provide "conversation" support but are
actually single-message transformers.

## Acceptance Criteria

### Epic 1: Fix Implementation Divergence [MUST]

#### AC-1.1: Unify pattern sets between handler and scripts [MUST]
Given the TypeScript handler checks for patterns A, B, C
And the Python scripts check for patterns X, Y, Z
When the implementations are reconciled
Then both check for the UNION of all patterns (A ∪ B ∪ C ∪ X ∪ Y ∪ Z)
Or the Python scripts are deprecated and only the handler is documented

#### AC-1.2: Document the actual implementation [MUST]
Given SKILL.md references 12 Python scripts
When a user invokes the MCP tool
Then the SKILL.md must accurately describe what the handler does (not the Python scripts)
Or the handler must call the Python scripts

#### AC-1.3: Remove misleading "how it works" claims [MUST]
Given SKILL.md describes a 4-step analysis process with severity classification
And the handler does simple regex replacement without classification
When the SKILL.md is updated
Then it accurately describes the handler's actual capabilities

### Epic 2: Clarify Therapeutic Boundaries [MUST]

#### AC-2.1: Add explicit disclaimer to all 3 safety-critical skills [MUST]
Given the skills could be mistaken for therapeutic tools
When viewed by a potential user
Then each SKILL.md has a prominent disclaimer:
  "This is a content accessibility tool, NOT a therapeutic intervention.
   It cannot diagnose, treat, or provide mental health support."

#### AC-2.2: Skill name clarity [SHOULD]
Given the skill name "depression-sensitive-content" could imply clinical capability
When considered for accuracy
Then names accurately reflect that these are content audit/filter tools

### Epic 3: Handler Sophistication Gap [SHOULD]

#### AC-3.1: Handler produces output matching SKILL.md example quality [SHOULD]
Given the SKILL.md examples show nuanced rewriting (e.g., preserving context while
  replacing stigmatizing language)
When the handler processes similar input
Then the output quality is at least directionally comparable to the examples

#### AC-3.2: Grief/supportive handlers adapt to input [SHOULD]
Given grief/supportive handlers currently use near-static templates
When user input varies
Then response adapts meaningfully to input content (not just interpolation)

## Out of Scope

- Adding actual therapeutic capability (these remain NON-clinical)
- Implementing full NLP/semantic analysis
- Replacing the handler with LLM-based rewriting
- Adding conversation state/memory to handlers
- Publishing peer-reviewed validation of the approach
