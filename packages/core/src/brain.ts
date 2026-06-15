/**
 * Family Brain self-maintenance (SPEC §6.1③ / AC-P20). When a known fact changes
 * in the world, the Brain updates it WITH a recorded source/trace, flags only
 * genuinely ambiguous changes for confirmation, and never silently overwrites a
 * fact without leaving a change-log entry.
 */
export interface Fact {
  key: string; // e.g. "leo.swim.day"
  value: string;
  source: string;
  updatedAt: number;
  confidence: number;
}

export interface FactChange {
  key: string;
  from: string;
  to: string;
  source: string;
  at: number;
}

export type ObservationResult =
  | { action: "created"; fact: Fact }
  | { action: "unchanged"; fact: Fact }
  | { action: "updated"; fact: Fact; change: FactChange }
  | { action: "flagged"; existing: Fact; proposed: { value: string; source: string; confidence: number }; reason: string };

/** A differing observation at/above this confidence updates; below it, we flag. */
export const CONFIDENT_THRESHOLD = 0.8;

export function applyObservation(
  facts: Map<string, Fact>,
  changelog: FactChange[],
  obs: { key: string; value: string; source: string; confidence: number; at?: number },
): ObservationResult {
  const at = obs.at ?? Date.now();
  const existing = facts.get(obs.key);

  if (!existing) {
    const fact: Fact = { key: obs.key, value: obs.value, source: obs.source, updatedAt: at, confidence: obs.confidence };
    facts.set(obs.key, fact);
    return { action: "created", fact };
  }

  if (existing.value === obs.value) {
    existing.updatedAt = at; // refresh recency; value unchanged
    return { action: "unchanged", fact: existing };
  }

  // The value differs. Only a confident observation may overwrite — and only with a trace.
  if (obs.confidence < CONFIDENT_THRESHOLD) {
    return {
      action: "flagged",
      existing,
      proposed: { value: obs.value, source: obs.source, confidence: obs.confidence },
      reason: "ambiguous change (low confidence) — confirm before overwriting",
    };
  }

  const change: FactChange = { key: obs.key, from: existing.value, to: obs.value, source: obs.source, at };
  changelog.push(change);
  existing.value = obs.value;
  existing.source = obs.source;
  existing.updatedAt = at;
  existing.confidence = obs.confidence;
  return { action: "updated", fact: existing, change };
}
