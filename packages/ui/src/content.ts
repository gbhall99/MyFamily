/**
 * Content & tone lint (DESIGN_SPEC §9 / AC-DA13). Agent-facing copy must be calm
 * and plain: no guilt/urgency language, and a proactive message offers a single
 * clear next step. Mechanises the writing half of "calm software".
 */
const BANNED = [/\bALERT\b/, /!!+/, /\burgent\b/i, /\byou forgot\b/i, /\bfailed to\b/i, /\bASAP\b/, /\bwarning\b/i, /\bmust\b/i];

export interface CopyIssue {
  text: string;
  reason: string;
}

/** Lint a piece of agent copy. Empty array = clean. */
export function lintCopy(text: string): CopyIssue[] {
  const issues: CopyIssue[] = [];
  for (const re of BANNED) {
    if (re.test(text)) issues.push({ text, reason: `guilt/urgency language: ${re}` });
  }
  return issues;
}

/** A proactive prompt should end with one clear question/choice (single next step). */
export function hasSingleClearAction(text: string): boolean {
  const questionMarks = (text.match(/\?/g) ?? []).length;
  return questionMarks === 1;
}
