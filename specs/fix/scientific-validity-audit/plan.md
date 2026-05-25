# Technical Plan: Scientific Validity Fixes

## Spec Reference
Implements: `specs/fix/scientific-validity-audit/spec.md`

## Architecture Overview

The core problem is structural: each skill maintains TWO divergent implementations —
TypeScript MCP handlers and Python scripts. The SKILL.md documents the Python scripts
as the implementation, but the MCP server uses the TypeScript handlers. Neither
implementation is scientifically validated as an intervention (they are content
auditing tools, not therapeutic interventions).

The fix has two parallel tracks:
1. **Unify pattern sets** between TypeScript handlers and Python scripts
2. **Fix documentation** to accurately describe what the handler actually does

## Strategy

### Track A: Pattern Unification

1. Audit ALL patterns in both TypeScript handlers AND Python scripts
2. Create a single unified pattern source in `patterns.ts` that covers ALL patterns
   from both implementations
3. Update handlers to use the unified patterns
4. Mark Python scripts as deprecated in SKILL.md (or document them as reference tools,
   not the MCP implementation)

### Track B: Documentation Accuracy

1. Update SKILL.md to accurately describe the MCP handler's actual behavior
2. Add prominent NON-THERAPEUTIC disclaimers
3. Remove claims that the handler performs "severity classification" (it doesn't)
4. Document that the Python scripts are reference/educational tools, not the MCP
   implementation

## Changes

### Files to Modify

| File | Change |
|------|--------|
| `mcp-servers/src/patterns.ts` | Add missing patterns from Python scripts (stigmatizing verbs, minimizing, judgmental) |
| `mcp-servers/src/handlers.ts` | Use expanded patterns in depression handler |
| `skills/depression-sensitive-content/SKILL.md` | Add therapeutic disclaimer, document MCP handler behavior, note Python scripts as reference |
| `skills/grief-loss-support/SKILL.md` | Add therapeutic disclaimer, document template-based approach |
| `skills/supportive-conversation/SKILL.md` | Add therapeutic disclaimer, document template-based approach |
| `skills/depression-sensitive-content/references/standards.md` | Add note that MCP handler uses simplified keyword matching |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Expanded patterns introduce false positives | Medium | Medium | Add pattern_count thresholds; don't flag single matches |
| Disclaimers reduce skill appeal | Low | Low | Skills remain useful for their actual purpose (content audit) |
| Python script deprecation conflicts with existing users | Low | Low | Mark as reference/educational, not removed |

## Out of Scope

- Full NLP implementation
- LLM-based rewriting
- Therapeutic validation studies
- Python script removal (keep as reference)
